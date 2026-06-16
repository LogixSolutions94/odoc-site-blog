import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

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

const staticPages = [
  { loc: "/",                  priority: "1.0", changefreq: "weekly"  },
  { loc: "/pricing",           priority: "0.9", changefreq: "monthly" },
  { loc: "/fonctionnalites",   priority: "0.9", changefreq: "monthly" },
  { loc: "/e-facture",         priority: "0.9", changefreq: "weekly"  },
  { loc: "/diagnostic",        priority: "0.8", changefreq: "monthly" },
  { loc: "/generateur-factur-x", priority: "0.8", changefreq: "monthly" },
  { loc: "/verificateur",      priority: "0.8", changefreq: "monthly" },
  { loc: "/llm-info",          priority: "0.6", changefreq: "monthly" },
  { loc: "/guide/facturation-electronique-2026", priority: "0.8", changefreq: "monthly" },
  { loc: "/guide/obligations-2026-2027",         priority: "0.8", changefreq: "monthly" },
  { loc: "/guide/plateforme-agreee",             priority: "0.8", changefreq: "monthly" },
  { loc: "/guide/factur-x",                      priority: "0.8", changefreq: "monthly" },
  { loc: "/guide/tpe-sans-comptable",            priority: "0.8", changefreq: "monthly" },
  { loc: "/comparatif/pennylane", priority: "0.8", changefreq: "monthly" },
  { loc: "/comparatif/qonto",     priority: "0.8", changefreq: "monthly" },
  { loc: "/comparatif/indy",      priority: "0.8", changefreq: "monthly" },
  { loc: "/comparatif/sellsy",    priority: "0.7", changefreq: "monthly" },
  { loc: "/comparatif/axonaut",   priority: "0.7", changefreq: "monthly" },
  { loc: "/comparatif/abby",      priority: "0.7", changefreq: "monthly" },
  { loc: "/artisans",          priority: "0.7", changefreq: "monthly" },
  { loc: "/commerce",          priority: "0.7", changefreq: "monthly" },
  { loc: "/professions-liberales", priority: "0.7", changefreq: "monthly" },
  { loc: "/cabinets-comptables", priority: "0.6", changefreq: "monthly" },
  { loc: "/lexique",           priority: "0.7", changefreq: "monthly" },
  { loc: "/livre-blanc",       priority: "0.8", changefreq: "monthly" },
  { loc: "/roadmap",           priority: "0.5", changefreq: "monthly" },
  { loc: "/changelog",         priority: "0.5", changefreq: "monthly" },
  { loc: "/a-propos",          priority: "0.7", changefreq: "monthly" },
  { loc: "/blog",              priority: "0.8", changefreq: "daily"   },
  { loc: "/contact",           priority: "0.6", changefreq: "monthly" },
  { loc: "/mentions-legales",  priority: "0.3", changefreq: "yearly"  },
  { loc: "/cgu",               priority: "0.3", changefreq: "yearly"  },
];

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

  const staticUrls = staticPages
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
