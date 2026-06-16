/**
 * blogContent.ts — Helpers PURS de contenu d'article (markdown → structure).
 *
 * Module sans aucun import React/DOM/Vite : il est consommé À LA FOIS par les
 * composants client (BlogPostPage, ArticleTOC…) ET par le script de prérendu Node
 * (scripts/prerender-blog.ts). C'est ce partage qui GARANTIT la parité stricte
 * entre ce que voit l'humain (SPA) et ce que voient les crawlers IA (HTML statique +
 * JSON-LD) : mêmes ancres de titres, même FAQ, même @graph.
 *
 * N'importe QUE blogTaxonomy (lui-même pur).
 */
import { categoryLongLabel, categoryGuideSlug } from "./blogTaxonomy";

export const BASE_URL = "https://odocpilot.com";
export const PUBLISHER_NAME = "OdocPilot";
export const PUBLISHER_LOGO = `${BASE_URL}/og-image.png`;
/** Auteur honnête par défaut (pas de faux expert) si author_name manque. */
export const DEFAULT_AUTHOR = "Équipe OdocPilot";

export interface Heading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Retire le balisage inline (gras, italique, code, liens) d'un texte de titre/question. */
export function stripInlineMd(s: string): string {
  return s
    // [texte](url) → texte. Classe du texte SANS « [ » (sinon backtracking O(n²) sur « [a[a[a… »).
    .replace(/\[([^[\]]+)\]\([^)\s]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#>]+\s*/g, "")
    .trim();
}

/** « Titre d'Été 2026 ! » → « titre-d-ete-2026 » (ancre stable, sans accents). */
export function slugify(text: string): string {
  return stripInlineMd(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // diacritiques combinants (Mark)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Itère les lignes en ignorant l'intérieur des fences de code (```), pour ne pas
 *  prendre un « ## » de bloc de code pour un vrai titre. */
function eachContentLine(markdown: string, fn: (line: string) => void) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) fn(line);
  }
}

const FAQ_HEADING_RE = /^##\s+.*(faq|questions?\s+fr[eé]quentes|questions?\s+courantes)/i;

/** Titres H2/H3 (hors section FAQ) avec ancres dédoublonnées, en ordre document. */
export function extractHeadings(markdown: string): Heading[] {
  const out: Heading[] = [];
  const seen: Record<string, number> = {};
  eachContentLine(markdown, (line) => {
    // Amorce SANS quantificateur ambigu (l'ancienne `(.+?)\s*#*\s*$` était ReDoS O(n²+)) :
    // on détecte « ##/### + espace », puis on retire les « # » de fermeture ATX en linéaire.
    const hm = line.match(/^(#{2,3})[ \t]/);
    if (!hm) return;
    const depth = hm[1].length as 2 | 3;
    const text = stripInlineMd(line.slice(hm[1].length).replace(/[ \t#]+$/, "").trim());
    if (!text) return;
    let id = slugify(text) || "section";
    if (seen[id] != null) {
      seen[id] += 1;
      id = `${id}-${seen[id]}`;
    } else {
      seen[id] = 0;
    }
    out.push({ depth, text, id });
  });
  return out;
}

/**
 * Sépare le corps de la section FAQ.
 * Convention attendue : un H2 « ## FAQ » / « ## Questions fréquentes », puis des
 * questions en H3 (### …) suivies de leur réponse, jusqu'au prochain H2 (ou la fin).
 * Repli si aucun H3 : lignes en gras (**Question ?**) suivies de la réponse.
 * Retourne le corps SANS la section FAQ (pour ne pas la dupliquer) + les Q/R.
 */
export function splitFaq(markdown: string): { body: string; faq: FaqItem[] } {
  const src = markdown.replace(/\r/g, "");
  const lines = src.split("\n");

  // Localiser la section FAQ (hors fences).
  let inFence = false;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    if (FAQ_HEADING_RE.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) return { body: src, faq: [] };

  // Fin = prochain H2 hors fences.
  let end = lines.length;
  inFence = false;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    if (/^##\s+/.test(lines[i]) && !/^###/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const faqLines = lines.slice(start + 1, end);
  const faq = parseFaqLines(faqLines);

  // Corps sans la section FAQ (on retire start..end, on nettoie les lignes vides en trop).
  const body = [...lines.slice(0, start), ...lines.slice(end)].join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return { body, faq };
}

function parseFaqLines(faqLines: string[]): FaqItem[] {
  const items: FaqItem[] = [];
  let curQ: string | null = null;
  let curA: string[] = [];
  const push = () => {
    if (curQ) {
      const a = curA.join(" ").replace(/\s+/g, " ").trim();
      if (a) items.push({ q: curQ, a });
    }
    curQ = null;
    curA = [];
  };
  for (const raw of faqLines) {
    const line = raw.trim();
    // Amorce non ambiguë (évite le ReDoS de `(.+?)\s*#*$`) ; « # » de fin retirés en linéaire.
    const h3 = line.match(/^###[ \t]+(.+)$/);
    const boldQ = line.match(/^\*\*(.+?)\*\*$/);
    if (h3) {
      push();
      curQ = stripInlineMd(h3[1].replace(/[ \t#]+$/, ""));
    } else if (boldQ && /\?/.test(boldQ[1])) {
      push();
      curQ = stripInlineMd(boldQ[1]);
    } else if (curQ) {
      curA.push(stripInlineMd(line));
    }
  }
  push();
  return items;
}

/** Parse la FAQ d'un markdown complet (raccourci sans le corps). */
export function parseFaq(markdown: string): FaqItem[] {
  return splitFaq(markdown).faq;
}

export interface ArticleGraphInput {
  slug: string;
  title: string; // headline (seo_title || title)
  description: string;
  authorName?: string | null;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  category?: string | null;
  keywords?: string | null;
  faq?: FaqItem[];
}

function isoDate(d?: string | null): string | undefined {
  if (!d) return undefined;
  return d.length > 10 ? d : d.slice(0, 10);
}

/**
 * Construit le @graph JSON-LD UNIQUE d'un article (BlogPosting + Person + Organization
 * + BreadcrumbList + FAQPage si présente). Source de vérité partagée client + SSR.
 */
export function buildArticleGraph(input: ArticleGraphInput): Record<string, unknown> {
  const url = `${BASE_URL}/blog/${input.slug}`;
  const author = (input.authorName || "").trim() || DEFAULT_AUTHOR;
  const orgId = `${BASE_URL}/#organization`;
  const personId = `${url}#author`;
  const articleId = `${url}#article`;
  const image = input.image || PUBLISHER_LOGO;

  const graph: Record<string, unknown>[] = [];

  graph.push({
    "@type": "BlogPosting",
    "@id": articleId,
    headline: input.title,
    description: input.description,
    image,
    inLanguage: "fr-FR",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": personId },
    publisher: { "@id": orgId },
    ...(isoDate(input.datePublished) ? { datePublished: isoDate(input.datePublished) } : {}),
    ...(isoDate(input.dateModified || input.datePublished)
      ? { dateModified: isoDate(input.dateModified || input.datePublished) }
      : {}),
    ...(input.category ? { articleSection: categoryLongLabel(input.category) } : {}),
    ...(input.keywords ? { keywords: input.keywords } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-tldr", ".faq-answer"],
    },
  });

  graph.push({
    "@type": "Person",
    "@id": personId,
    name: author,
    worksFor: { "@id": orgId },
  });

  graph.push({
    "@type": "Organization",
    "@id": orgId,
    name: PUBLISHER_NAME,
    url: BASE_URL,
    logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
  });

  // Fil d'Ariane : Accueil › Blog › [Silo] › Article. Le silo pointe vers sa page pilier.
  const guideSlug = categoryGuideSlug(input.category);
  const crumbs: Record<string, unknown>[] = [
    { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
  ];
  if (input.category && guideSlug) {
    crumbs.push({
      "@type": "ListItem",
      position: 3,
      name: categoryLongLabel(input.category),
      item: `${BASE_URL}/guide/${guideSlug}`,
    });
  }
  crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: input.title, item: url });
  graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: crumbs });

  if (input.faq && input.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: input.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
