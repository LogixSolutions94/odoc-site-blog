import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
  /** Si true, ajoute <meta name="robots" content="noindex,nofollow"> (pour pages d'action type /unsubscribe). */
  noindex?: boolean;
}

const BASE_URL = "https://odocpilot.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function SEOHead({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noindex,
}: SEOHeadProps) {
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:site_name" content="OdocPilot" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD — on échappe « < » et « > » (→ </>, JSON toujours valide)
          pour empêcher tout « </script> »/« <!-- » présent dans des données de contenu
          (titre, FAQ, etc.) de s'échapper du contexte <script> (XSS stocké). */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e")}
        </script>
      )}
    </Helmet>
  );
}
