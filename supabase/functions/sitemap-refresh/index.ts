import { corsHeaders, preflight, timingSafeEqual } from "../_shared/cors.ts";

const SITEMAP_URL = "https://odocpilot.com/sitemap.xml";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight(req);

  // Auth : secret partagé entre le trigger Postgres et cette EF.
  // (audit sécu 2026-06-16, finding C3 — endpoint était ouvert sur Internet)
  const secret = Deno.env.get("SITEMAP_WEBHOOK_SECRET");
  if (!secret) {
    console.error("[sitemap-refresh] SITEMAP_WEBHOOK_SECRET not configured");
    return new Response("server misconfiguration", { status: 500 });
  }
  const provided = req.headers.get("x-webhook-secret") ?? "";
  if (!timingSafeEqual(provided, secret)) {
    return new Response("unauthorized", { status: 401 });
  }

  let body: { type?: string; record?: { status?: string; slug?: string } };
  try {
    body = await req.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  if (!["INSERT", "UPDATE"].includes(body.type ?? "")) {
    return new Response("skip: wrong event type", { status: 200 });
  }
  if (body.record?.status !== "published") {
    return new Response("skip: not published", { status: 200 });
  }

  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  try {
    const pingRes = await fetch(pingUrl);
    console.log(`[sitemap-refresh] Google ping → ${pingRes.status} for slug="${body.record.slug}"`);
  } catch (e) {
    console.error("[sitemap-refresh] Google ping failed:", e);
  }

  return new Response(
    JSON.stringify({ ok: true, slug: body.record?.slug, pinged: SITEMAP_URL }),
    { headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
  );
});
