/**
 * prerender-blog.ts — Pré-rend les articles de blog en HTML statique APRÈS `vite build`.
 *
 * POURQUOI : le site est un SPA Vite (rendu client). Les crawlers IA (GPTBot, ClaudeBot,
 * PerplexityBot) et les scrapers sociaux N'EXÉCUTENT PAS le JS → ils ne voient qu'un shell
 * vide. Ce script écrit, pour chaque article publié, un `dist/blog/<slug>/index.html` qui
 * contient DANS LE HTML BRUT : <title>, meta description, OpenGraph/Twitter par article,
 * canonical, le JSON-LD (BlogPosting + FAQPage), et le corps de l'article rendu.
 *
 * Le SPA reste actif : l'app monte via createRoot() et remplace #root côté client (aucun
 * souci d'hydratation puisque ce n'est pas hydrateRoot). Les humains voient le SPA, les
 * robots voient le contenu.
 *
 * ZÉRO nouvelle dépendance (utilise tsx déjà présent + un mini-rendu markdown maison).
 * 100% RÉSILIENT : si pas de clé / pas de dist / fetch KO / 0 article → log + exit 0
 * (ne casse JAMAIS le build).
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

// ── Charger .env sans dépendance (même pattern que generate-sitemap.ts) ─────────
try {
  const env = readFileSync(".env", "utf-8");
  for (const line of env.split("\n")) {
    const eq = line.indexOf("=");
    if (eq === -1 || line.startsWith("#")) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
  }
} catch { /* pas de .env → on tentera les variables d'env du process */ }

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "https://api.odocpilot.com";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";
const BASE_URL = "https://odocpilot.com";
const DIST = resolve("dist");
const SHELL = resolve(DIST, "index.html");

type Post = {
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  excerpt: string | null;
  meta_description: string | null;
  content: string | null;
  json_ld: unknown;
  schema_faq: unknown;
  cover_image_url: string | null;
  author_name: string | null;
  category: string | null;
  published_at: string | null;
  updated_at: string | null;
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function attr(s: string): string {
  return esc(s).replace(/\n/g, " ");
}

// ── Mini-rendu markdown → HTML (suffisant pour l'extraction crawler/IA) ─────────
function inline(md: string): string {
  let s = esc(md);
  // liens [texte](url)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, u) => `<a href="${attr(u)}">${t}</a>`);
  // gras **x** puis italique *x* ; code `x`
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;
  const flushPara: string[] = [];
  const closePara = () => {
    if (flushPara.length) { out.push(`<p>${inline(flushPara.join(" ").trim())}</p>`); flushPara.length = 0; }
  };
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    // code fence
    if (t.startsWith("```")) {
      closePara(); const buf: string[] = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { buf.push(esc(lines[i])); i++; }
      i++; out.push(`<pre><code>${buf.join("\n")}</code></pre>`); continue;
    }
    // heading
    const h = t.match(/^(#{1,6})\s+(.*)$/);
    if (h) { closePara(); const lvl = h[1].length; out.push(`<h${lvl}>${inline(h[2].trim())}</h${lvl}>`); i++; continue; }
    // blockquote
    if (t.startsWith(">")) { closePara(); out.push(`<blockquote>${inline(t.replace(/^>\s?/, ""))}</blockquote>`); i++; continue; }
    // table GFM
    if (t.startsWith("|") && i + 1 < lines.length && /^\s*\|?[-:\s|]+\|?\s*$/.test(lines[i + 1])) {
      closePara();
      const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(t); i += 2; const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(cells(lines[i])); i++; }
      out.push(
        `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>` +
        `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
      );
      continue;
    }
    // listes
    if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) {
      closePara(); const ordered = /^\d+\.\s+/.test(t); const items: string[] = [];
      while (i < lines.length && (/^[-*]\s+/.test(lines[i].trim()) || /^\d+\.\s+/.test(lines[i].trim()))) {
        items.push(`<li>${inline(lines[i].trim().replace(/^([-*]|\d+\.)\s+/, ""))}</li>`); i++;
      }
      out.push(`<${ordered ? "ol" : "ul"}>${items.join("")}</${ordered ? "ol" : "ul"}>`); continue;
    }
    // ligne vide → fin de paragraphe
    if (t === "") { closePara(); i++; continue; }
    flushPara.push(t); i++;
  }
  closePara();
  return out.join("\n");
}

// ── Construit le <head> spécifique à l'article + le JSON-LD ─────────────────────
function buildHead(post: Post): { title: string; tags: string } {
  const url = `${BASE_URL}/blog/${post.slug}`;
  const title = `${post.seo_title || post.title} — Blog OdocPilot`;
  const desc = (post.seo_description || post.excerpt || post.meta_description || "").slice(0, 300);
  const img = post.cover_image_url || `${BASE_URL}/og-image.svg`;

  // JSON-LD : on réutilise celui de l'agent s'il existe, sinon on synthétise.
  let jsonLd: unknown = post.json_ld;
  if (!jsonLd || (typeof jsonLd === "object" && Object.keys(jsonLd as object).length === 0)) {
    const graph: unknown[] = [{
      "@type": "BlogPosting", headline: post.title, description: desc,
      author: { "@type": "Person", name: post.author_name || "Lucas Belloc" },
      publisher: { "@type": "Organization", name: "OdocPilot", url: BASE_URL },
      url, datePublished: (post.published_at || "").slice(0, 10),
      dateModified: (post.updated_at || post.published_at || "").slice(0, 10),
      image: img, inLanguage: "fr-FR",
    }];
    if (Array.isArray(post.schema_faq) && post.schema_faq.length > 0) {
      graph.push({ "@type": "FAQPage", mainEntity: post.schema_faq });
    }
    jsonLd = { "@context": "https://schema.org", "@graph": graph };
  }
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const tags = [
    `<link rel="canonical" href="${attr(url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    `<meta property="og:title" content="${attr(post.title)}" />`,
    `<meta property="og:description" content="${attr(desc)}" />`,
    `<meta property="og:image" content="${attr(img)}" />`,
    post.published_at ? `<meta property="article:published_time" content="${attr(post.published_at)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attr(post.title)}" />`,
    `<meta name="twitter:description" content="${attr(desc)}" />`,
    `<meta name="twitter:image" content="${attr(img)}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`,
  ].filter(Boolean).join("\n    ");

  return { title, tags };
}

// ── Injecte head + corps dans le shell index.html ───────────────────────────────
export function buildPage(shell: string, post: Post): string {
  const { title, tags } = buildHead(post);
  const desc = (post.seo_description || post.excerpt || post.meta_description || "").slice(0, 300);
  let html = shell;

  // <title> et meta description génériques → spécifiques à l'article
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${attr(desc)}" />`);
  // retirer les OG/twitter génériques (seront remplacés par ceux de l'article)
  html = html.replace(/<meta\s+property="og:(title|description|image|type|url)"[^>]*>/gi, "");
  html = html.replace(/<meta\s+name="twitter:(card|title|description|image)"[^>]*>/gi, "");
  // injecter les balises article + JSON-LD avant </head>
  html = html.replace(/<\/head>/i, `    ${tags}\n  </head>`);

  // Corps rendu (visible aux crawlers ; React le remplace côté client)
  const cover = post.cover_image_url
    ? `<img src="${attr(post.cover_image_url)}" alt="${attr(post.title)}" />` : "";
  const body =
    `<article>` +
    `<nav><a href="${BASE_URL}">Accueil</a> › <a href="${BASE_URL}/blog">Blog</a>${post.category ? " › " + esc(post.category) : ""}</nav>` +
    `<h1>${esc(post.title)}</h1>` +
    (post.excerpt ? `<p><em>${esc(post.excerpt)}</em></p>` : "") +
    (post.author_name ? `<p>${esc(post.author_name)}${post.published_at ? " · " + esc(post.published_at.slice(0, 10)) : ""}</p>` : "") +
    cover +
    renderMarkdown(post.content || "") +
    `</article>`;
  html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${body}</div>`);
  // fallback si #root n'est pas vide dans le shell
  if (!html.includes("<article>")) {
    html = html.replace(/(<div id="root"[^>]*>)/i, `$1${body}`);
  }
  return html;
}

async function run() {
  if (!existsSync(SHELL)) {
    console.warn("[prerender-blog] dist/index.html absent — lancer `vite build` d'abord. Skip (build non cassé).");
    return;
  }
  if (!SUPABASE_KEY) {
    console.warn("[prerender-blog] VITE_SUPABASE_PUBLISHABLE_KEY absente — skip (build non cassé).");
    return;
  }

  console.log("[prerender-blog] Récupération des articles publiés…");
  let posts: Post[] = [];
  try {
    const cols = "slug,title,seo_title,seo_description,excerpt,meta_description,content,json_ld,schema_faq,cover_image_url,author_name,category,published_at,updated_at";
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=${cols}&status=eq.published`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) { console.warn(`[prerender-blog] Supabase ${res.status} — skip.`); return; }
    posts = await res.json() as Post[];
  } catch (e) {
    console.warn("[prerender-blog] fetch KO — skip :", e instanceof Error ? e.message : e);
    return;
  }

  const shell = readFileSync(SHELL, "utf-8");
  let ok = 0;
  for (const post of posts) {
    if (!post.slug || !post.content) continue;
    try {
      const page = buildPage(shell, post);
      const dir = resolve(DIST, "blog", post.slug);
      mkdirSync(dir, { recursive: true });
      writeFileSync(resolve(dir, "index.html"), page, "utf-8");
      ok++;
    } catch (e) {
      console.warn(`[prerender-blog] skip ${post.slug} :`, e instanceof Error ? e.message : e);
    }
  }
  console.log(`[prerender-blog] ✓ ${ok}/${posts.length} article(s) pré-rendu(s) dans dist/blog/<slug>/index.html`);
}

run().catch((e) => { console.warn("[prerender-blog] erreur non bloquante :", e); });
