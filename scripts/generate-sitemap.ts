import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import { STATIC_ROUTES } from "./site-routes";
import { loadRedirects } from "./lib/blog-redirects";

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
// Image Docker (STRICT_SEO_BUILD=1) : sans les articles, on n'expédie pas un sitemap
// amputé — le build échoue et le déploiement garde l'ancien conteneur.
const STRICT = process.env.STRICT_SEO_BUILD === "1";

function degrade(reason: string): void {
  if (STRICT) throw new Error(`${reason} (STRICT_SEO_BUILD=1 : build arrêté)`);
  console.warn(`[sitemap] ${reason} — sitemap = routes statiques uniquement.`);
}

async function run() {
  // Résilience build (audit 2026-06-16) : sans clé Supabase (build local sans .env),
  // on génère quand même le sitemap avec uniquement les routes statiques. Dans l'image
  // Docker (STRICT_SEO_BUILD=1), ces cas arrêtent le build au lieu de dégrader.
  let posts: { slug: string; updated_at: string }[] = [];

  if (!SUPABASE_KEY) {
    degrade("VITE_SUPABASE_PUBLISHABLE_KEY absente");
  } else {
    console.log("[sitemap] Fetching published posts from Supabase…");
    let res: Response | null = null;
    try {
      res = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at&status=eq.published&order=published_at.desc`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" } }
      );
    } catch (e) {
      degrade(`fetch KO : ${e instanceof Error ? e.message : String(e)}`);
    }
    if (res && !res.ok) {
      degrade(`Supabase REST ${res.status} (${(await res.text()).slice(0, 120)})`);
    } else if (res) {
      posts = await res.json();
    }
  }

  const staticUrls = STATIC_ROUTES
    .map(
      (p) =>
        `  <url>\n    <loc>${BASE_URL}${p.loc}</loc>\n    <priority>${p.priority}</priority>\n    <changefreq>${p.changefreq}</changefreq>\n  </url>`
    )
    .join("\n");

  // N'annoncer que des URL qui répondent 200 : ni article retiré (301/410 de
  // seo/blog-redirects.json, même s'il est encore « published » en base), ni slug que
  // prerender-blog.ts refuse de prérendre (nginx répondrait 404).
  const retired = new Set(Object.keys(loadRedirects()));
  const listed = posts.filter((p) => /^[a-z0-9][a-z0-9-]*$/i.test(p.slug) && !retired.has(`/blog/${p.slug}`));

  const dynamicUrls = listed
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
  console.log(`[sitemap] ✓ ${listed.length} article(s) (${posts.length - listed.length} retiré(s) ou invalide(s) exclu(s)) → ${out}`);
}

run().catch((e) => { console.error("[sitemap] ✗", e.message); process.exit(1); });
