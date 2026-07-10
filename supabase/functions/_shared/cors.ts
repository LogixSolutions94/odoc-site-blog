// CORS + helpers sécurité PARTAGÉS entre TOUTES les Edge Functions (SaaS + landing).
//
// ⚠️ FICHIER MIROIR — existe à l'identique dans DEUX repos :
//   - odoc-pulse/supabase/functions/_shared/cors.ts        (SaaS — déployé par deploy-vps.yml en SYNC COMPLET)
//   - odoc-insights-hub/supabase/functions/_shared/cors.ts (landing — déployé par scp manuel)
// Le conteneur edge-functions du VPS est UNIQUE : le sync complet de deploy-vps écrase ce
// fichier pour tout le monde. Toute modification doit donc rester un SUPERSET des deux
// usages et être recopiée dans l'autre repo. (Incident 10/07/2026 : le sync a déployé une
// version sans clientIp/rateLimit → toutes les EF de la landing en InvalidWorkerCreation.)

const ALLOWED_ORIGINS = new Set<string>([
  "https://app.odocpilot.com",
  "https://odocpilot.com",
  "https://www.odocpilot.com",
  // Dev local
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  "http://localhost:8080",
]);

const ALLOW_HEADERS =
  "authorization, x-client-info, apikey, content-type, stripe-signature, x-webhook-secret";
const ALLOW_METHODS = "GET, POST, OPTIONS";

function pickOrigin(req: Request): string {
  const origin = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.has(origin)) return origin;
  // Callers serveur→serveur (webhooks Stripe, curl…) : origin absent — on n'expose
  // pas l'origine credentialed de l'app dans ce cas.
  return "https://app.odocpilot.com";
}

export function corsHeaders(req: Request): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": pickOrigin(req),
    "Access-Control-Allow-Methods": ALLOW_METHODS,
    "Access-Control-Allow-Headers": ALLOW_HEADERS,
    "Vary": "Origin",
  };
}

/** Réponse OPTIONS standard — pattern landing : `if (req.method === "OPTIONS") return preflight(req);` */
export function preflight(req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

/** Pattern SaaS : `const pf = handlePreflight(req); if (pf) return pf;` */
export function handlePreflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  return new Response("ok", { headers: corsHeaders(req) });
}

/**
 * Webhooks publics (Stripe, Dropbox, SuperDPD) — pas de souci CORS navigateur,
 * mais on garde un allow minimal pour le tooling type curl.
 */
export const webhookCorsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, stripe-signature",
};

/** Comparaison constant-time de deux chaînes (anti timing attack). */
export function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

/** Échappe une chaîne pour interpolation HTML (XSS prevention). */
export function escapeHtml(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]!));
}

/** Retire les CRLF (anti header-injection dans subjects email, etc.). */
export function stripCrlf(s: unknown): string {
  return String(s ?? "").replace(/[\r\n]+/g, " ").trim();
}

/** Rate-limit en mémoire (par origin de cold start) — best-effort.
 *  Pour du prod-grade : passer à Deno KV ou Cloudflare Turnstile. */
const buckets = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (b.count >= maxPerMinute) return false;
  b.count++;
  return true;
}

/** IP du client (best-effort derrière Kong/CF). */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Validation email basique (RFC 5322 simplifiée). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(s: string): boolean {
  return s.length <= 254 && EMAIL_RE.test(s);
}
