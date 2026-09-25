/**
 * marketing-pages.ts — Ce que le prérendu écrit pour chaque page marketing.
 *
 * Pour chaque route statique du sitemap (scripts/site-routes.ts), sauf « / » :
 *   - <head> : <title>, meta description, canonical, og:title/description/url et
 *     twitter:title/description — lus dans le <SEOHead> DU COMPOSANT (page-source.ts),
 *     jamais recopiés à la main ;
 *   - #root : le <h1> et l'introduction du composant, et pour les pages dont le contenu
 *     est structuré dans src/content/* (guides, comparatifs, livre blanc, lexique,
 *     éditeurs), le contenu complet.
 *
 * FAIL-CLOSED : route sans page connue, canonical du composant ≠ route, balise du shell
 * introuvable… → erreur, le build s'arrête.
 *
 * Le SPA reste inchangé : createRoot() remplace #root au montage (pas d'hydratation).
 * Les balises <head> injectées portent data-rh="true" : react-helmet-async les reconnaît
 * et les remplace à la navigation, sans doublon.
 */
import { PageSource, type PageMeta, type Scope } from "./page-source";
import { attr, esc, jsonLdScript, safeHref } from "./html";
import { STATIC_ROUTES } from "../site-routes";
import { GUIDE_BY_SLUG, type Guide } from "../../src/content/guides";
import { COMPARISONS, COMPARISON_BY_SLUG, compareDisclaimer, type Comparison } from "../../src/content/comparisons";
import { WHITE_PAPER } from "../../src/content/livreBlanc";
import { GLOSSARY } from "../../src/content/glossaire";
import { EDITEURS, editeursJsonLd } from "../../src/content/editeurs";
import { AUTO_ENTREPRENEURS, autoEntrepreneursJsonLd } from "../../src/content/autoEntrepreneurs";

export const BASE_URL = "https://odocpilot.com";

/** Pages dont le <SEOHead>, le <h1> et l'intro se lisent sans données extérieures. */
const SIMPLE_PAGES: Record<string, string> = {
  "/pricing": "src/pages/PricingPage.tsx",
  "/fonctionnalites": "src/pages/FonctionnalitesPage.tsx",
  "/e-facture": "src/pages/EFacturePage.tsx",
  "/diagnostic": "src/pages/DiagnosticPage.tsx",
  "/generateur-factur-x": "src/pages/GenerateurFacturXPage.tsx",
  "/verificateur": "src/pages/VerificateurPage.tsx",
  "/llm-info": "src/pages/LlmInfoPage.tsx",
  "/artisans": "src/pages/ArtisansPage.tsx",
  "/roadmap": "src/pages/RoadmapPage.tsx",
  "/changelog": "src/pages/ChangelogPage.tsx",
  "/a-propos": "src/pages/AProposPage.tsx",
  "/blog": "src/pages/BlogPage.tsx",
  "/contact": "src/pages/ContactPage.tsx",
  "/mentions-legales": "src/pages/MentionsLegalesPage.tsx",
  "/cgu": "src/pages/CguPage.tsx",
};

/** Routes servies par MetierPage (données METIERS dans le composant). */
const METIER_SLUGS = ["commerce", "professions-liberales", "cabinets-comptables"];

type Plan = { file: string; scope?: Scope; eyebrow?: string; content?: string; jsonLd?: Record<string, unknown> };

// ── Petits blocs HTML (classes Tailwind déjà présentes dans src/, donc dans le CSS) ──
const h2 = (t: string) => `<h2 class="mt-10 text-2xl font-bold tracking-tight text-foreground">${esc(t)}</h2>`;
const h3 = (t: string) => `<h3 class="mt-6 font-bold text-foreground">${esc(t)}</h3>`;
const p = (t: string) => `<p class="mt-4 leading-relaxed text-muted-foreground">${esc(t)}</p>`;
const strongP = (t: string) => `<p class="mt-6 font-bold text-foreground">${esc(t)}</p>`;
const ul = (items: string[]) => `<ul class="mt-4 space-y-2 text-muted-foreground">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
const ol = (items: string[]) => `<ol class="mt-4 space-y-2 text-muted-foreground">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`;
const link = (to: string, label: string) => `<a href="${attr(safeHref(to))}" class="font-semibold text-primary">${esc(label)}</a>`;
const links = (items: Array<{ to: string; label: string }>) =>
  `<ul class="mt-4 space-y-2">${items.map((l) => `<li>${link(l.to, l.label)}</li>`).join("")}</ul>`;
const faq = (title: string, items: Array<{ q: string; a: string }>) =>
  h2(title) + items.map((f) => h3(f.q) + p(f.a)).join("");
const eyebrow = (t: string) => `<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">${esc(t)}</p>`;

type Section = { h2: string; atomic?: string; body: string[]; bullets?: string[] };
const sections = (list: Section[]) =>
  list.map((s) => h2(s.h2) + (s.atomic ? p(s.atomic) : "") + s.body.map(p).join("") + (s.bullets ? ul(s.bullets) : "")).join("");

// ── Contenus complets (données structurées de src/content/*) ─────────────────────
function guideContent(g: Guide): string {
  return sections(g.sections) + faq("Questions fréquentes", g.faqs) + h2("Pour aller plus loin") + links(g.related);
}

function comparisonContent(c: Comparison): string {
  const cell = (v: string | boolean) => esc(typeof v === "boolean" ? (v ? "Oui" : "Non") : v);
  const table =
    `<table class="mt-4 w-full text-sm"><thead><tr><th></th><th>OdocPilot</th><th>${esc(c.competitor)}</th></tr></thead><tbody>` +
    c.rows.map((r) => `<tr><td>${esc(r.dim)}</td><td>${cell(r.odoc)}</td><td>${cell(r.them)}</td></tr>`).join("") +
    `</tbody></table>`;
  const others = COMPARISONS.filter((o) => o.slug !== c.slug).map((o) => ({ to: `/comparatif/${o.slug}`, label: `OdocPilot vs ${o.competitor}` }));
  return (
    strongP(`Ce que ${c.competitor} fait très bien`) + p(c.themStrength) +
    strongP("Le créneau d'OdocPilot") + p(c.odocAngle) +
    h2(`OdocPilot vs ${c.competitor}, point par point`) + table + p(compareDisclaimer(c.competitor)) +
    strongP(`Choisissez ${c.competitor} si…`) + ul(c.chooseThem) +
    strongP("Choisissez OdocPilot si…") + ul(c.chooseOdoc) +
    faq("Questions fréquentes", c.faqs) +
    h2("Autres comparatifs") + links(others)
  );
}

function whitePaperContent(): string {
  return strongP("L'essentiel en 1 minute") + ul(WHITE_PAPER.tldr) + sections(WHITE_PAPER.sections) + faq("Questions fréquentes", WHITE_PAPER.faqs);
}

function glossaryContent(): string {
  // Même ordre que LexiquePage (tri alphabétique français).
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "fr", { sensitivity: "base" }));
  return sorted
    .map((t) =>
      `<h2 id="${attr(t.slug)}" class="mt-10 text-2xl font-bold tracking-tight text-foreground">${esc(t.acronym ? `${t.term} ${t.acronym}` : t.term)}</h2>` +
      p(t.short) + (t.body ? p(t.body) : "") + (t.related ? `<p class="mt-3">${link(t.related.to, t.related.label)}</p>` : ""),
    )
    .join("");
}

function editeursContent(): string {
  const e = EDITEURS;
  const cta = `<p class="mt-6">${link("/contact", e.cta)} · ${esc(e.ctaEmailLead)} <strong>${esc(e.email)}</strong></p>`;
  return (
    cta +
    h2(e.why.h2) + p(e.why.body) +
    h2(e.learned.h2) + p(e.learned.body) +
    `<ul class="mt-4 space-y-2 text-muted-foreground">${e.learned.rules.map((r) => `<li><strong>${esc(r.codes)}</strong> : ${esc(r.text)}</li>`).join("")}</ul>` +
    p(e.learned.outro) +
    h2(e.plans.h2) + e.plans.items.map((pl) => h3(`${pl.name} — ${pl.price}`) + ul(pl.items)).join("") + p(e.plans.note) +
    h2(e.steps.h2) + ol(e.steps.items) +
    h2(e.notThis.h2) + p(e.notThis.body) +
    h2(e.after.h2) + p(e.after.body) +
    faq(e.faqTitle, e.faqs)
  );
}

function autoEntrepreneursContent(): string {
  const a = AUTO_ENTREPRENEURS;
  const extLinks = (items: Array<{ href: string; label: string }>) =>
    `<ul class="mt-4 space-y-2">${items.map((s) => `<li><a href="${attr(safeHref(s.href))}" rel="noopener noreferrer" class="font-semibold text-primary">${esc(s.label)}</a></li>`).join("")}</ul>`;
  return (
    `<p class="mt-6">${link("/diagnostic", a.cta.secondary)}</p>` +
    strongP("L'essentiel") + ul(a.essentials.map((e) => `${e.label} : ${e.text}`)) +
    h2(a.concerned.h2) + p(a.concerned.atomic) + a.concerned.cases.map((c) => h3(c.title) + p(c.text)).join("") +
    h2(a.calendar.h2) + ul(a.calendar.rows.map((r) => `${r.date} : ${r.text}`)) +
    h2(a.changes.h2) + p(a.changes.atomic) + ul(a.changes.points) +
    h2(a.steps.h2) + a.steps.items.map((s, i) => h3(`${i + 1}. ${s.title}`) + p(s.text)).join("") +
    h2(a.lessons.h2) + p(a.lessons.body) + ul(a.lessons.items) + p(a.lessons.outro) +
    h2(a.pricing.h2) + p(a.pricing.atomic) + ul(a.pricing.items) + p(a.pricing.note) +
    faq(a.faqTitle, a.faqs) +
    h2("Pour aller plus loin") + links(a.related.map((r) => ({ to: r.to, label: r.label }))) +
    h2("Sources officielles") + extLinks(a.sources)
  );
}
// ── Route → composant, données, contenu ─────────────────────────────────────────
let metierData: Record<string, unknown> | null = null;
function metiers(): Record<string, unknown> {
  metierData ??= new PageSource("src/pages/MetierPage.tsx").constValue("METIERS") as Record<string, unknown>;
  return metierData;
}

export function planFor(loc: string): Plan {
  if (SIMPLE_PAGES[loc]) return { file: SIMPLE_PAGES[loc] };

  const guide = /^\/guide\/([a-z0-9-]+)$/.exec(loc);
  if (guide) {
    const g = GUIDE_BY_SLUG[guide[1]];
    if (!g) throw new Error(`${loc} : guide absent de src/content/guides.ts`);
    return { file: "src/pages/GuidePillarPage.tsx", scope: { guide: g }, eyebrow: g.eyebrow, content: guideContent(g) };
  }
  const cmp = /^\/comparatif\/([a-z0-9-]+)$/.exec(loc);
  if (cmp) {
    const c = COMPARISON_BY_SLUG[cmp[1]];
    if (!c) throw new Error(`${loc} : comparatif absent de src/content/comparisons.ts`);
    return { file: "src/pages/ComparePage.tsx", scope: { c }, content: comparisonContent(c) };
  }
  const metier = /^\/([a-z0-9-]+)$/.exec(loc);
  if (metier && METIER_SLUGS.includes(metier[1])) {
    const m = metiers()[metier[1]];
    if (!m) throw new Error(`${loc} : entrée absente de METIERS (src/pages/MetierPage.tsx)`);
    return { file: "src/pages/MetierPage.tsx", scope: { m } };
  }
  if (loc === "/livre-blanc") return { file: "src/pages/LivreBlancPage.tsx", scope: { wp: WHITE_PAPER }, content: whitePaperContent() };
  if (loc === "/lexique") return { file: "src/pages/LexiquePage.tsx", content: glossaryContent() };
  if (loc === "/editeurs") {
    return { file: "src/pages/EditeursPage.tsx", scope: { EDITEURS }, eyebrow: EDITEURS.eyebrow, content: editeursContent(), jsonLd: editeursJsonLd() };
  }
  if (loc === "/auto-entrepreneurs") {
    return {
      file: "src/pages/AutoEntrepreneursPage.tsx",
      scope: { AUTO_ENTREPRENEURS },
      eyebrow: AUTO_ENTREPRENEURS.eyebrow,
      content: autoEntrepreneursContent(),
      jsonLd: autoEntrepreneursJsonLd(),
    };
  }  throw new Error(`${loc} : aucune page associée — l'ajouter dans scripts/lib/marketing-pages.ts`);
}

/** Routes prérendues : toutes les routes statiques du sitemap, sauf l'accueil. */
export function prerenderableRoutes(): string[] {
  return STATIC_ROUTES.map((r) => r.loc).filter((loc) => loc !== "/");
}

function replaceOnce(html: string, re: RegExp, value: string, what: string): string {
  const matches = html.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`));
  if (!matches || matches.length !== 1) {
    throw new Error(`shell index.html : ${what} attendu une fois, trouvé ${matches ? matches.length : 0} fois`);
  }
  return html.replace(re, () => value);
}

/** HTML complet de la page `loc`, construit à partir du shell dist/index.html. */
export function renderPage(shell: string, loc: string): { html: string; meta: PageMeta } {
  if (!/^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(loc)) throw new Error(`${loc} : route invalide`);
  const plan = planFor(loc);
  const meta = new PageSource(plan.file).readMeta(plan.scope);
  if (meta.canonical !== loc) {
    throw new Error(`${loc} : le canonical du composant (${meta.canonical}) ne correspond pas à la route`);
  }
  const url = `${BASE_URL}${loc}`;

  let html = shell;
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`, "<title>");
  // Balises génériques du shell (texte de l'accueil) retirées, remplacées par celles de la page.
  html = replaceOnce(html, /[ \t]*<meta\s+name="description"[^>]*>\r?\n?/i, "", 'meta name="description"');
  html = replaceOnce(html, /[ \t]*<meta\s+property="og:title"[^>]*>\r?\n?/i, "", 'meta property="og:title"');
  html = replaceOnce(html, /[ \t]*<meta\s+property="og:description"[^>]*>\r?\n?/i, "", 'meta property="og:description"');
  html = replaceOnce(html, /[ \t]*<meta\s+name="twitter:title"[^>]*>\r?\n?/i, "", 'meta name="twitter:title"');
  html = replaceOnce(html, /[ \t]*<meta\s+name="twitter:description"[^>]*>\r?\n?/i, "", 'meta name="twitter:description"');
  html = html.replace(/[ \t]*<meta\s+property="og:url"[^>]*>\r?\n?/gi, "");
  html = html.replace(/[ \t]*<link\s+rel="canonical"[^>]*>\r?\n?/gi, "");

  const head = [
    `<meta name="description" content="${attr(meta.description)}" data-rh="true" />`,
    `<link rel="canonical" href="${attr(url)}" data-rh="true" />`,
    `<meta property="og:title" content="${attr(meta.title)}" data-rh="true" />`,
    `<meta property="og:description" content="${attr(meta.description)}" data-rh="true" />`,
    `<meta property="og:url" content="${attr(url)}" data-rh="true" />`,
    `<meta name="twitter:title" content="${attr(meta.title)}" data-rh="true" />`,
    `<meta name="twitter:description" content="${attr(meta.description)}" data-rh="true" />`,
    ...(plan.jsonLd ? [jsonLdScript(plan.jsonLd)] : []),
  ];
  html = replaceOnce(html, /<\/head>/i, `    ${head.join("\n    ")}\n  </head>`, "</head>");

  // Surtitre éventuel, <h1>, intro, puis contenu complet.
  const body =
    `<main class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">` +
    (plan.eyebrow ? eyebrow(plan.eyebrow) : "") +
    `<h1 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">${esc(meta.h1)}</h1>` +
    `<p class="mt-5 text-lg leading-relaxed text-muted-foreground">${esc(meta.intro)}</p>` +
    (plan.content ?? "") +
    `</main>`;
  html = replaceOnce(html, /<div id="root">\s*<\/div>/i, `<div id="root">${body}</div>`, '<div id="root"></div> vide');

  return { html, meta };
}
