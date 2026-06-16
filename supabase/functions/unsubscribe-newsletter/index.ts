// EF unsubscribe-newsletter — droit à l'oubli RGPD.
// Audit sécu 2026-06-16, finding M5/M7.
//
// Flux : la page /unsubscribe?email=<x>&token=<hmac> appelle cette EF.
// On vérifie HMAC(email) == token (constant-time) puis on supprime.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  preflight,
  isValidEmail,
  stripCrlf,
  timingSafeEqual,
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

  let payload: { email?: string; token?: string };
  try {
    payload = await req.json();
  } catch {
    return json(400, { success: false, error: "Requête invalide." });
  }

  const email = stripCrlf(payload.email).toLowerCase().slice(0, 254);
  const providedToken = stripCrlf(payload.token).slice(0, 100);
  if (!isValidEmail(email) || !providedToken) {
    return json(400, { success: false, error: "Lien invalide." });
  }

  const SECRET = Deno.env.get("NEWSLETTER_TOKEN_SECRET");
  if (!SECRET) {
    console.error("[unsubscribe-newsletter] NEWSLETTER_TOKEN_SECRET missing");
    return json(500, { success: false, error: "Service indisponible." });
  }

  const expected = await hmac(email, SECRET);
  if (!timingSafeEqual(providedToken, expected)) {
    return json(403, { success: false, error: "Lien invalide ou expiré." });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("email", email);

  if (error) {
    console.error("[unsubscribe-newsletter] db error:", error);
    return json(500, { success: false, error: "Désinscription momentanément indisponible." });
  }

  // 200 même si l'email n'existait pas (anti enum d'emails inscrits).
  return json(200, { success: true });
});
