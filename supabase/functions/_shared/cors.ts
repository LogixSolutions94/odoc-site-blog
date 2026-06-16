// CORS partagé entre toutes les Edge Functions du site marketing.
// Restreint aux origines OdocPilot — fini le "*" qui permettait à
// n'importe quel site d'invoquer nos EF au nom du visiteur.

const ALLOWED_ORIGINS = new Set([
  "https://odocpilot.com",
  "https://www.odocpilot.com",
  "https://app.odocpilot.com",
  // Dev local (toléré uniquement quand origin est explicitement présent)
  "http://localhost:5173",
  "http://localhost:8080",
]);

/** Headers CORS à renvoyer pour un request donné. */
export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://odocpilot.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-webhook-secret",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

/** Réponse OPTIONS standard pour le preflight. */
export function preflight(req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

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
