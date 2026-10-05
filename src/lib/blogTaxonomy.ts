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
  {
    // Fourre-tout hors wedge conformité (outils, gestion, trésorerie, OCR…). Pas de page pilier /guide.
    slug: "outils-gestion",
    label: "Outils & gestion",
    longLabel: "Outils & gestion de l'entreprise",
    guideSlug: "",
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
  // `|| null` (et non `??`) : le silo « outils-gestion » a un guideSlug vide (pas de pilier) → null.
  return getSilo(category)?.guideSlug || null;
}

/**
 * Mappe la valeur BRUTE de blog_posts.silo (écrite par le pipeline de production) vers
 * un silo canonique du site. Les anciens silos larges (positionnement « OS d'entreprise »)
 * tombent dans « outils-gestion » ; btp-artisans rejoint le segment TPE sans comptable.
 */
const SILO_SOURCE_MAP: Record<string, string> = {
  "facturation-electronique": "facturation-electronique",
  "obligations-2026-2027": "obligations-2026-2027",
  "plateforme-agreee": "plateforme-agreee",
  "factur-x": "factur-x",
  "tpe-sans-comptable": "tpe-sans-comptable",
  "outils-gestion": "outils-gestion",
  "logiciel-gestion-tpe-pme": "outils-gestion",
  "automatisation-ia-pme": "outils-gestion",
  "tresorerie-paiements": "outils-gestion",
  "comptabilite-tpe-pme": "outils-gestion",
  "conformite-rgpd": "outils-gestion",
  "crm-gestion-commerciale": "outils-gestion",
  "btp-artisans": "tpe-sans-comptable",
};

/**
 * Affinage par slug d'article : force le silo fin (hub & spoke) sur le wedge conformité,
 * là où la colonne `silo` du pipeline est trop grossière (tout « facturation-electronique »).
 * Éditer ici pour re-siloter un article.
 */
const SLUG_SILO_OVERRIDE: Record<string, string> = {
  "e-reporting-2027-tpe-editeurs-preparer": "obligations-2026-2027",
  "mentions-obligatoires-facture-2026-nouvelles-mentions": "obligations-2026-2027",
  "annuaire-facturation-electronique-plateforme-de-votre-client": "plateforme-agreee",
  "editeurs-logiciels-marque-blanche-marque-grise-integration-facture-electronique": "plateforme-agreee",
  "chorus-pro-artisan-guide-complet-2026": "plateforme-agreee",
  "factur-x-rejetee-9-erreurs-plateforme-agreee": "factur-x",
  "facturation-electronique-obligatoire-2026-auto-entrepreneur": "tpe-sans-comptable",
  "meilleur-logiciel-facturation-micro-entreprise": "tpe-sans-comptable",
  "facture-electronique-expert-comptable-qui-fait-quoi-2026": "tpe-sans-comptable",
  "logiciel-devis-facture-artisan-batiment-guide-2026": "tpe-sans-comptable",
};

export interface BlogPostSiloInput {
  slug?: string | null;
  silo?: string | null;
  category?: string | null;
}

/**
 * Silo canonique EFFECTIF d'un article. Ordre de résolution :
 *   1) override explicite par slug (wedge fin),
 *   2) colonne `silo` du pipeline (mappée, ou déjà canonique),
 *   3) ancienne colonne `category` si elle porte un slug canonique,
 *   4) null (aucun silo → pas de fil d'Ariane silo, pilier /e-facture par défaut).
 */
export function resolveSiloSlug(post: BlogPostSiloInput): string | null {
  if (post.slug && SLUG_SILO_OVERRIDE[post.slug]) return SLUG_SILO_OVERRIDE[post.slug];
  if (post.silo) {
    if (SILO_SOURCE_MAP[post.silo]) return SILO_SOURCE_MAP[post.silo];
    if (SILO_BY_SLUG[post.silo]) return post.silo;
  }
  if (post.category && SILO_BY_SLUG[post.category]) return post.category;
  return null;
}
