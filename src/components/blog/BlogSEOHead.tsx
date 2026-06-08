import { SEOHead } from "@/components/SEOHead";

const BASE_URL = "https://odocpilot.com";

interface BlogSEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  keywords?: string;
}

export function BlogSEOHead({
  title = "Blog OdocPilot — Facturation IA et gestion documentaire pour PME",
  description = "Tutoriels, bonnes pratiques et actualités sur la facturation automatique, la gestion documentaire IA et la comptabilité pour TPE/PME.",
  canonical = "/blog",
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
}: BlogSEOHeadProps) {
  const articleJsonLd =
    ogType === "article" && publishedTime
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: description,
          author: {
            "@type": "Organization",
            name: "OdocPilot",
            url: BASE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "OdocPilot",
            logo: {
              "@type": "ImageObject",
              url: `${BASE_URL}/og-image.svg`,
            },
          },
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          url: `${BASE_URL}${canonical}`,
          inLanguage: "fr-FR",
          ...(ogImage ? { image: ogImage } : {}),
        }
      : undefined;

  return (
    <SEOHead
      title={title}
      description={description}
      canonical={canonical}
      ogImage={ogImage}
      ogType={ogType}
      jsonLd={articleJsonLd}
    />
  );
}
