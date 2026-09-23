import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import { STATIC_ROUTES } from "./site-routes";

// Load .env without dependencies
try {
  const env = readFileSync(".env", "utf-8");
  for (const line of env.split("\n")) {
    const eq = line.indexOf("=");
    if (eq === -1 || line.startsWith("#")) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
  }
} catch {}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "https://api.odocpilot.com";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";
const BASE_URL = "https://odocpilot.com";

async function run() {
  // Résilience build (audit 2026-06-16) : sans clé Supabase (CI/Docker sans .env),
  // on génère quand même le sitemap avec uniquement les routes statiques. Le build
  // doit JAMAIS être bloqué par l'absence de clé — le sitemap dynamique sera
  // rafraîchi par l'EF sitemap-refresh à chaque publication d'article.
  let posts: { slug: string; updated_at: string }[] = [];

  if (!SUPABASE_KEY) {
    console.warn("[sitemap] VITE_SUPABASE_PUBLISHABLE_KEY absente — sitemap = routes statiques uniquement.");
  } else {
    console.log("[sitemap] Fetching published posts from Supabase…");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at&status=eq.published&order=published_at.desc`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" } }
      );
      if (!res.ok) {
        console.warn(`[sitemap] Supabase REST ${res.status} (${(await res.text()).slice(0, 120)}) — sitemap statique seulement.`);
      } else {
        posts = await res.json();
      }
    } catch (e) {
      console.warn("[sitemap] fetch KO — sitemap statique seulement :", e instanceof Error ? e.message : e);
    }
  }

  const staticUrls = STATIC_ROUTES
    .map(
      (p) =>
        `  <url>\n    <loc>${BASE_URL}${p.loc}</loc>\n    <priority>${p.priority}</priority>\n    <changefreq>${p.changefreq}</changefreq>\n  </url>`
    )
    .join("\n");

  const dynamicUrls = posts
    .map(
      (p) =>
        `  <url>\n    <loc>${BASE_URL}/blog/${p.slug}</loc>\n    <lastmod>${new Date(p.updated_at).toISOString().split("T")[0]}</lastmod>\n    <priority>0.7</priority>\n    <changefreq>monthly</changefreq>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${dynamicUrls}
</urlset>`;

  const out = resolve("public/sitemap.xml");
  writeFileSync(out, xml, "utf-8");
  console.log(`[sitemap] ✓ ${posts.length} article(s) → ${out}`);
}

run().catch((e) => { console.error("[sitemap] ✗", e.message); process.exit(1); });
