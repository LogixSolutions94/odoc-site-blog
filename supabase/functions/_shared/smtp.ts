// Minimal SMTP client pour le relais Stalwart auto-hébergé (souveraineté : tout part du VPS).
// Copié à l'identique du repo odoc-pulse (même instance Supabase api.odocpilot.com → même
// conteneur EF → même réseau interne 10.0.1.1, mêmes variables STALWART_*).
//
// Supporte AUTH LOGIN (Stalwart exige l'auth depuis le hardening 19/05) et un STARTTLS optionnel.
// Connexion en clair par défaut (réseau Docker interne) ; poser STALWART_STARTTLS=true si imposé.
//
// ⚠️ À TESTER UNE FOIS EN LIVE :
//   - « 530 Must issue a STARTTLS command first » → STALWART_STARTTLS=true
//   - « 535 authentication failed » → vérifier STALWART_USER / STALWART_PASS

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

/** Lit la config Stalwart depuis l'environnement (valeurs par défaut = réseau Docker interne). */
export function stalwartEnv() {
  const env = (k: string) => (globalThis as { Deno?: { env: { get(k: string): string | undefined } } }).Deno?.env.get(k);
  return {
    host: env("STALWART_HOST") || "10.0.1.1",
    port: Number(env("STALWART_SMTP_PORT")) || 587,
    user: env("STALWART_USER") || env("STALWART_SMTP_USER"),
    pass: env("STALWART_PASS") || env("STALWART_SMTP_PASS"),
    startTls: (env("STALWART_STARTTLS") || "").toLowerCase() === "true",
  };
}

export async function smtpSend(o: SmtpSendOpts): Promise<void> {
  const D = (globalThis as { Deno: typeof Deno }).Deno;
  let conn: Deno.Conn = await D.connect({ hostname: o.host, port: o.port });
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const read = async (): Promise<string> => {
    const buf = new Uint8Array(8192);
    const n = await conn.read(buf);
    return dec.decode(buf.subarray(0, n ?? 0));
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

    await write(`MAIL FROM:<${noCrlf(o.fromEmail)}>`);
    await expect("250", "MAIL FROM");
    await write(`RCPT TO:<${noCrlf(o.to)}>`);
    await expect("250", "RCPT TO");
    await write("DATA");
    await expect("354", "DATA");

    const fromHeader = o.fromName ? `${noCrlf(o.fromName)} <${noCrlf(o.fromEmail)}>` : noCrlf(o.fromEmail);
    const headers = [
      `From: ${fromHeader}`,
      `To: ${noCrlf(o.to)}`,
      o.replyTo ? `Reply-To: ${noCrlf(o.replyTo)}` : null,
      `Subject: ${noCrlf(o.subject)}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
    ].filter(Boolean).join("\r\n");
    const safeBody = o.html.replace(/\r?\n/g, "\r\n").replace(/\r\n\./g, "\r\n..");
    await write(`${headers}\r\n\r\n${safeBody}\r\n.`);
    await expect("250", "message body");
    await write("QUIT");
  } finally {
    try { conn.close(); } catch (_) { /* ignore */ }
  }
}
