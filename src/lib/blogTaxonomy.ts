/**
 * blogTaxonomy.ts — Source de vérité UNIQUE des silos du blog.
 *
 * La colonne `category` de blog_posts, les filtres de BlogPage, les libellés de
 * BlogCategoryBadge, le fil d'Ariane et le lien vers la page pilier /guide/:slug
 * doivent TOUS dériver d'ici pour éviter le drift (ex : un badge qui retombe sur
 * « Général », un lien pilier en 404).
 *
 * ⚠️ `guideSlug` ≠ `slug` pour le silo n°1 : la page pilier de la facturation
 * électronique vit sous /guide/facturation-electronique-2026 (cf. src/content/guides.ts).
 *
 * Module PUR (aucun import React/DOM) : réutilisable côté client ET par le script
 * de prérendu Node (scripts/prerender-blog.ts).
 */

export interface BlogSilo {
  /** Valeur stockée dans blog_posts.category + filtre BlogPage. */
  slug: string;
  /** Libellé court (chips, badges). */
  label: string;
  /** Libellé long (fil d'Ariane, titres « du même silo »). */
  longLabel: string;
  /** Slug de la page pilier /guide/:slug correspondante (peut différer du slug). */
  guideSlug: string;
}

export const BLOG_SILOS: BlogSilo[] = [
  {
    slug: "facturation-electronique",
    label: "Facturation électronique",
    longLabel: "Facturation électronique",
    guideSlug: "facturation-electronique-2026",
  },
  {
    slug: "obligations-2026-2027",
    label: "Obligations 2026/2027",
    longLabel: "Obligations & calendrier 2026/2027",
    guideSlug: "obligations-2026-2027",
  },
  {
    slug: "plateforme-agreee",
    label: "Plateforme agréée",
    longLabel: "Plateforme agréée (PA)",
    guideSlug: "plateforme-agreee",
  },
  {
    slug: "factur-x",
    label: "Factur-X & formats",
    longLabel: "Factur-X & formats",
    guideSlug: "factur-x",
  },
  {
    slug: "tpe-sans-comptable",
    label: "TPE sans comptable",
    longLabel: "TPE & indépendants sans comptable",
    guideSlug: "tpe-sans-comptable",
  },
];

const SILO_BY_SLUG: Record<string, BlogSilo> = Object.fromEntries(
  BLOG_SILOS.map((s) => [s.slug, s]),
);

/** Filtres de la page liste (« Tous » + les 5 silos). */
export const BLOG_CATEGORY_FILTERS = [
  { value: "all", label: "Tous" },
  ...BLOG_SILOS.map((s) => ({ value: s.slug, label: s.label })),
] as const;

export function getSilo(category: string | null | undefined): BlogSilo | undefined {
  return category ? SILO_BY_SLUG[category] : undefined;
}

/** Humanise un slug inconnu (« mon-sujet » → « Mon sujet ») sans mentir avec « Général ». */
function humanizeSlug(slug: string): string {
  const s = slug.replace(/-/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function categoryLabel(category: string | null | undefined): string {
  if (!category) return "Article";
  return SILO_BY_SLUG[category]?.label ?? humanizeSlug(category);
}

export function categoryLongLabel(category: string | null | undefined): string {
  if (!category) return "Article";
  return SILO_BY_SLUG[category]?.longLabel ?? humanizeSlug(category);
}

/** Slug de la page pilier /guide/:slug pour un silo, ou null si pas de pilier. */
export function categoryGuideSlug(category: string | null | undefined): string | null {
  return getSilo(category)?.guideSlug ?? null;
}
