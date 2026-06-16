// EF subscribe-newsletter — remplace les INSERT direct depuis le frontend.
// Audit sécu 2026-06-16, finding H1.
//
// Garanties :
//   - validation email côté serveur (jamais confiance au front)
//   - rate-limit 10 souscriptions / min / IP
//   - honeypot field (champ "website" — un vrai user ne le remplit pas)
//   - génère un unsubscribe_token HMAC(email) pour le droit à l'oubli RGPD
//   - INSERT via service_role → respecte le check policy (regex email)
//   - idempotent : si email déjà inscrit, retourne success (UX-friendly)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  preflight,
  rateLimit,
  clientIp,
  isValidEmail,
  stripCrlf,
} from "../_shared/cors.ts";

async function hmac(email: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(email));
  // base64url sans padding pour URLs.
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  const cors = corsHeaders(req);
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  if (req.method !== "POST") return json(405, { success: false, error: "method not allowed" });

  const ip = clientIp(req);
  if (!rateLimit(`newsletter:${ip}`, 10)) {
    return json(429, { success: false, error: "Trop de requêtes, réessayez dans une minute." });
  }

  let payload: { email?: string; source?: string; website?: string };
  try {
    payload = await req.json();
  } catch {
    return json(400, { success: false, error: "Requête invalide." });
  }

  // Honeypot : un vrai utilisateur ne remplit jamais ce champ.
  if (payload.website && payload.website.trim() !== "") {
    return json(200, { success: true }); // silencieux (UX bot)
  }

  const email = stripCrlf(payload.email).toLowerCase().slice(0, 254);
  const source = stripCrlf(payload.source).slice(0, 50) || "landing";

  if (!isValidEmail(email)) {
    return json(400, { success: false, error: "Email invalide." });
  }

  const SECRET = Deno.env.get("NEWSLETTER_TOKEN_SECRET");
  if (!SECRET) {
    console.error("[subscribe-newsletter] NEWSLETTER_TOKEN_SECRET missing");
    return json(500, { success: false, error: "Service indisponible." });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const token = await hmac(email, SECRET);

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email, source, unsubscribe_token: token },
      { onConflict: "email", ignoreDuplicates: false }
    );

  if (error) {
    console.error("[subscribe-newsletter] db error:", error);
    return json(500, { success: false, error: "Inscription momentanément indisponible." });
  }

  return json(200, { success: true });
});
