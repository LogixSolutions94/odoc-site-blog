// ⚠️ FICHIER PARTAGÉ AU DÉPLOIEMENT — LES DEUX REPOS DOIVENT RESTER SYNCHRONISÉS.
// odoc-pulse et odoc-insights-hub déploient leurs Edge Functions dans le MÊME conteneur,
// au MÊME chemin : …/volumes/functions/_shared/smtp.ts. Le dernier déploiement écrase
// l'autre. Toute modification doit donc être répercutée **à l'identique (byte-for-byte)** dans :
//   - odoc-pulse/supabase/functions/_shared/smtp.ts
//   - odoc-insights-hub/supabase/functions/_shared/smtp.ts
// Vérifier avant tout déploiement EF : les deux fichiers ont le même hash.
//
// Minimal SMTP client for the self-hosted Stalwart relay (souveraineté : tout part du VPS).
//
// Pourquoi maison plutôt qu'un SDK : on n'envoie que du transactionnel simple (1 destinataire,
// HTML), et on veut zéro dépendance externe (choix « tout sur Stalwart »).
//
// Supporte AUTH LOGIN (Stalwart exige l'auth depuis le hardening 19/05 — c'est l'absence d'AUTH
// qui faisait planter le welcome en « 503 5.5.1 You must authenticate first ») et un STARTTLS
// optionnel. Connexion en clair par défaut (réseau Docker interne 10.0.1.1) ; poser
// STALWART_STARTTLS=true si le relais l'impose.
//
// Prouvé en live le 07/08/2026 sur le relais OVH (ssl0.ovh.net:587, STARTTLS + AUTH LOGIN).
// Diagnostic si ça casse à nouveau :
//   - « 530 Must issue a STARTTLS command first » → poser STALWART_STARTTLS=true
//   - « 535 authentication failed » → vérifier STALWART_USER / STALWART_PASS
//   - « rejected: 250-... » → une réponse multiligne est mal consommée (cf. read() ci-dessous)

export interface SmtpSendOpts {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  startTls?: boolean;
  fromEmail: string;
  fromName?: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

const noCrlf = (s: string) => s.replace(/[\r\n]+/g, " ");

/**
 * Encode une valeur d'en-tête en « encoded-words » RFC 2047 (base64 UTF-8).
 *
 * Les en-têtes SMTP sont **ASCII-only** : tout octet non-ASCII écrit brut est réaffiché en
 * mojibake par le client mail. Constaté en prod le 07/08/2026 sur le formulaire de contact —
 * `From: OdocPilot â€" formulaire de contact` (le tiret cadratin) — et le même bug frappe le
 * `Subject`, construit à partir d'une saisie visiteur : « Benoît Dupont » → « BenoÃ®t Dupont ».
 *
 * No-op si la chaîne est déjà en ASCII imprimable (cas ultra-majoritaire) : on n'encode que
 * ce qui en a besoin, les en-têtes restent lisibles en clair.
 *
 * Découpage : un encoded-word fait au plus 75 octets (RFC 2047 §2). L'enveloppe
 * `=?UTF-8?B?` + `?=` coûte 12 octets ⇒ 63 octets de base64 ⇒ **45 octets source**
 * (multiple de 3 : pas de padding intermédiaire). Les mots sont repliés par CRLF+espace
 * (folding RFC 5322), ce qui garde chaque ligne très loin de la limite de 998 octets.
 * La coupe respecte les frontières de caractères UTF-8 (jamais au milieu d'un « é »).
 */
export function encodeHeaderWord(s: string): string {
  if (/^[\x20-\x7E]*$/.test(s)) return s; // ASCII imprimable → tel quel
  const bytes = new TextEncoder().encode(s);
  const MAX_SRC = 45;
  const words: string[] = [];
  for (let i = 0; i < bytes.length; ) {
    let end = Math.min(i + MAX_SRC, bytes.length);
    // Reculer tant qu'on tomberait sur un octet de continuation UTF-8 (10xxxxxx).
    while (end > i + 1 && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    let bin = "";
    for (const b of bytes.subarray(i, end)) bin += String.fromCharCode(b);
    words.push(`=?UTF-8?B?${btoa(bin)}?=`);
    i = end;
  }
  return words.join("\r\n ");
}

/**
 * Prépare un display-name pour un en-tête d'adresse (`From`).
 * Non-ASCII → encoded-word (jamais entre guillemets : RFC 2047 l'interdit).
 * ASCII contenant un « special » RFC 5322 (`,` `<` `:` `;` …) → quoted-string, sinon
 * le nom casserait le parsing de l'adresse.
 */
function displayName(s: string): string {
  const enc = encodeHeaderWord(s);
  if (enc !== s) return enc; // encoded-word : déjà sûr, ne pas quoter
  return /[()<>[\]:;@\\,."]/.test(s) ? `"${s.replace(/(["\\])/g, "\\$1")}"` : s;
}

/**
 * Config du relais SMTP pour les emails transactionnels.
 * Chemin 1 : Stalwart (souverain) si `STALWART_USER`/`STALWART_PASS` sont posés.
 * Chemin 2 (fallback) : relais **OVH** via les `SMTP_*` (mêmes identifiants que GoTrue,
 *   déjà en prod et prouvés). Indispensable : sans ce fallback, Stalwart n'ayant pas
 *   d'identifiants configurés rejetait TOUT (« 503 5.5.1 You must authenticate first »)
 *   → welcome, invitations d'équipe et relances de factures étaient tous cassés.
 *   OVH submission 587 exige STARTTLS → activé.
 */
export function stalwartEnv() {
  const env = (k: string) => (globalThis as { Deno?: { env: { get(k: string): string | undefined } } }).Deno?.env.get(k);
  const sUser = env("STALWART_USER") || env("STALWART_SMTP_USER");
  const sPass = env("STALWART_PASS") || env("STALWART_SMTP_PASS");
  if (sUser && sPass) {
    return {
      host: env("STALWART_HOST") || "10.0.1.1",
      port: Number(env("STALWART_SMTP_PORT")) || 587,
      user: sUser,
      pass: sPass,
      startTls: (env("STALWART_STARTTLS") || "").toLowerCase() === "true",
    };
  }
  return {
    host: env("SMTP_HOST") || "ssl0.ovh.net",
    port: Number(env("SMTP_PORT")) || 587,
    user: env("SMTP_USER"),
    pass: env("SMTP_PASS"),
    startTls: true,
  };
}

export async function smtpSend(o: SmtpSendOpts): Promise<void> {
  const D = (globalThis as { Deno: typeof Deno }).Deno;
  let conn: Deno.Conn = await D.connect({ hostname: o.host, port: o.port });
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  // Lit une réponse SMTP **complète**. Une réponse peut être multiligne
  // (« 250-STARTTLS » … « 250 HELP ») et/ou arriver en plusieurs paquets TCP :
  // on accumule jusqu'à la ligne finale « NNN <texte> » (espace après le code, pas tiret).
  // Sans cette boucle, le reliquat de l'EHLO était lu comme réponse de la commande
  // suivante → « SMTP STARTTLS rejected: 250-STARTTLS » et AUCUN email transactionnel
  // ne partait via OVH (constaté en prod le 07/08/2026 sur le formulaire de contact).
  const read = async (): Promise<string> => {
    let data = "";
    for (;;) {
      const buf = new Uint8Array(8192);
      const n = await conn.read(buf);
      if (n === null) break;                        // connexion fermée
      data += dec.decode(buf.subarray(0, n));
      // Réponse complète = se termine par CRLF et la dernière ligne est « NNN texte ».
      const lines = data.split("\r\n");
      const last = lines[lines.length - 1] === "" ? lines[lines.length - 2] : undefined;
      if (last && /^\d{3} /.test(last)) break;
    }
    return data;
  };
  const write = async (line: string) => { await conn.write(enc.encode(line + "\r\n")); };
  const expect = async (code: string, ctx: string): Promise<string> => {
    const r = await read();
    if (!r.startsWith(code)) throw new Error(`SMTP ${ctx} rejected: ${r.trim()}`);
    return r;
  };
  const b64 = (s: string) => btoa(unescape(encodeURIComponent(s)));

  try {
    await read();                       // greeting 220
    await write("EHLO odocpilot.com");
    await read();                       // 250 (multiline)

    if (o.startTls) {
      await write("STARTTLS");
      await expect("220", "STARTTLS");
      conn = await D.startTls(conn, { hostname: o.host });
      await write("EHLO odocpilot.com"); // re-EHLO après TLS
      await read();
    }

    if (o.user && o.pass) {
      await write("AUTH LOGIN");
      await expect("334", "AUTH LOGIN");
      await write(b64(o.user));
      await expect("334", "AUTH user");
      await write(b64(o.pass));
      await expect("235", "AUTH");
    }

    // OVH/Stalwart (submission authentifiée) imposent l'expéditeur = boîte authentifiée.
    // On force donc le From (enveloppe + en-tête) sur o.user quand une auth est présente,
    // sinon OVH rejette (« sender not allowed ») ou l'email part en spam.
    const fromAddr = o.user && o.user.includes("@") ? o.user : o.fromEmail;
    await write(`MAIL FROM:<${noCrlf(fromAddr)}>`);
    await expect("250", "MAIL FROM");
    await write(`RCPT TO:<${noCrlf(o.to)}>`);
    await expect("250", "RCPT TO");
    await write("DATA");
    await expect("354", "DATA");

    // RFC 2047 : on encode le display-name du From et le Subject (construits à partir de
    // texte français / de saisies visiteur). Les adresses nues (`<addr>`, To, Reply-To) sont
    // ASCII par construction et restent intactes — les encoder les rendrait inutilisables.
    const fromHeader = o.fromName
      ? `${displayName(noCrlf(o.fromName))} <${noCrlf(fromAddr)}>`
      : noCrlf(fromAddr);
    const headers = [
      `From: ${fromHeader}`,
      `To: ${noCrlf(o.to)}`,
      o.replyTo ? `Reply-To: ${noCrlf(o.replyTo)}` : null,
      `Subject: ${encodeHeaderWord(noCrlf(o.subject))}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
    ].filter(Boolean).join("\r\n");
    // Normalise les fins de ligne + dot-stuffing (une ligne « . » terminerait le message).
    const safeBody = o.html.replace(/\r?\n/g, "\r\n").replace(/\r\n\./g, "\r\n..");
    await write(`${headers}\r\n\r\n${safeBody}\r\n.`);
    await expect("250", "message body");
    await write("QUIT");
  } finally {
    try { conn.close(); } catch (_) { /* ignore */ }
  }
}
