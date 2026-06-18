import {
  corsHeaders,
  preflight,
  escapeHtml,
  stripCrlf,
  rateLimit,
  clientIp,
  isValidEmail,
} from "../_shared/cors.ts";
import { smtpSend, stalwartEnv } from "../_shared/smtp.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  const cors = corsHeaders(req);
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  // Rate-limit : 5 messages / minute / IP (audit sécu 2026-06-16, finding H2).
  // Best-effort en mémoire — pour du prod-grade ajouter Turnstile.
  const ip = clientIp(req);
  if (!rateLimit(`contact:${ip}`, 5)) {
    return json(429, { success: false, error: "Trop de requêtes, réessayez dans une minute." });
  }

  try {
    // Envoi 100% Stalwart (souverain). Mêmes identifiants que les EF du SaaS (même conteneur).
    const st = stalwartEnv();
    if (!st.user || !st.pass) {
      console.error("[send-contact-email] STALWART_USER/PASS manquants");
      return json(500, { success: false, error: "L'envoi est temporairement indisponible." });
    }

    let payload: { name?: string; email?: string; company?: string; message?: string };
    try {
      payload = await req.json();
    } catch {
      return json(400, { success: false, error: "Requête invalide." });
    }

    // Validation serveur (ne JAMAIS faire confiance au front).
    const name = stripCrlf(payload.name).slice(0, 100);
    const email = stripCrlf(payload.email).toLowerCase().slice(0, 254);
    const company = stripCrlf(payload.company).slice(0, 100);
    const message = String(payload.message ?? "").slice(0, 2000);

    if (!name || !email || !message) {
      return json(400, { success: false, error: "Champs obligatoires manquants." });
    }
    if (!isValidEmail(email)) {
      return json(400, { success: false, error: "Email invalide." });
    }

    // Construction du HTML : TOUT escapé (anti XSS dans le client mail du destinataire).
    const html = `
      <h2>Nouveau message depuis le site OdocPilot</h2>
      <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(email)}</p>
      <p><strong>Société :</strong> ${escapeHtml(company || "Non renseigné")}</p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    // Destinataire / expéditeur configurables (adresses hébergées Stalwart, domaine odocpilot.com).
    const to = Deno.env.get("CONTACT_TO") || "contact@odocpilot.com";
    const fromEmail = Deno.env.get("CONTACT_FROM") || "noreply@odocpilot.com";

    try {
      await smtpSend({
        ...st,
        fromEmail,
        fromName: "OdocPilot — formulaire de contact",
        to,
        // stripCrlf garantit pas de CRLF dans le subject (anti header-injection).
        subject: `[OdocPilot] Nouveau message de ${name}`.slice(0, 200),
        // reply_to = l'email du visiteur → répondre lui revient directement.
        replyTo: email,
        html,
      });
    } catch (err) {
      console.error("[send-contact-email] SMTP:", err);
      return json(502, { success: false, error: "L'envoi a échoué, réessayez plus tard." });
    }

    return json(200, { success: true });
  } catch (error: unknown) {
    // Erreur générique côté client — détail uniquement dans les logs serveur.
    console.error("[send-contact-email] uncaught:", error);
    return json(500, { success: false, error: "Une erreur est survenue, réessayez plus tard." });
  }
});
