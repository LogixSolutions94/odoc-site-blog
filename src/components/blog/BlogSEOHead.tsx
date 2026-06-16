import { SEOHead } from "@/components/SEOHead";

interface BlogSEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  /**
   * @graph JSON-LD complet (BlogPosting + Person + Organization + BreadcrumbList +
   * FAQPage pour un article ; Blog + BreadcrumbList pour la liste). Construit par
   * l'appelant via blogContent.buildArticleGraph pour garantir la parité avec le SSR.
   */
  jsonLd?: Record<string, unknown>;
}

export function BlogSEOHead({
  title = "Blog OdocPilot — Conformité, facturation électronique & gestion sereine",
  description = "Guides clairs et à jour sur la réforme 2026/2027, la Factur-X et les plateformes agréées — pour les dirigeants de TPE qui veulent se mettre en règle sans jargon.",
  canonical = "/blog",
  ogImage,
  ogType = "website",
  jsonLd,
}: BlogSEOHeadProps) {
  return (
    <SEOHead
      title={title}
      description={description}
      canonical={canonical}
      ogImage={ogImage}
      ogType={ogType}
      jsonLd={jsonLd}
    />
  );
}
