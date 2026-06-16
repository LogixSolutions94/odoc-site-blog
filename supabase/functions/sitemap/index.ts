import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Le sitemap est intentionnellement public (référencement) — pas de CORS strict
// puisqu'aucun navigateur n'en a besoin (Googlebot consomme du XML, pas du JS).
const PUBLIC_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
};

const BASE_URL = "https://odocpilot.com";

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/pricing", priority: "0.9", changefreq: "monthly" },
  { loc: "/fonctionnalites", priority: "0.9", changefreq: "monthly" },
  { loc: "/a-propos", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog", priority: "0.8", changefreq: "daily" },
  { loc: "/contact", priority: "0.6", changefreq: "monthly" },
  { loc: "/mentions-legales", priority: "0.3", changefreq: "yearly" },
  { loc: "/cgu", priority: "0.3", changefreq: "yearly" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  if (req.method !== "GET") return new Response("method not allowed", { status: 405 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  // RLS doit filtrer drafts : on demande quand même status='published' par défense en profondeur.
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const staticUrls = staticPages
    .map(
      (p) => `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
  </url>`
    )
    .join("\n");

  const dynamicUrls = (posts || [])
    .map(
      (p) => `  <url>
    <loc>${BASE_URL}/blog/${encodeURIComponent(p.slug)}</loc>
    <lastmod>${new Date(p.updated_at).toISOString().split("T")[0]}</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${dynamicUrls}
</urlset>`;

  return new Response(xml, { headers: PUBLIC_HEADERS });
});
