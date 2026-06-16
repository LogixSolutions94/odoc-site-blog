import { Link } from "react-router-dom";
import { useMemo } from "react";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { GLOSSARY } from "@/content/glossaire";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";

const BASE = "https://odocpilot.com";
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

const SEO_TITLE = "Lexique de la facturation électronique : tous les termes (PA, Factur-X, e-reporting…)";
const SEO_DESC =
  "PA, PDP, PPF, Factur-X, EN 16931, CII, UBL, e-reporting… Le lexique clair de la facturation électronique 2026/2027 pour les dirigeants de TPE/PME, sans jargon.";

export default function LexiquePage() {
  const sorted = useMemo(
    () => [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "fr", { sensitivity: "base" })),
    [],
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        "@id": `${BASE}/lexique`,
        name: "Lexique de la facturation électronique",
        description: SEO_DESC,
        url: `${BASE}/lexique`,
        inLanguage: "fr-FR",
        hasDefinedTerm: sorted.map((t) => ({
          "@type": "DefinedTerm",
          name: t.acronym ? `${t.term} (${t.acronym})` : t.term,
          description: t.short,
          url: `${BASE}/lexique#${t.slug}`,
          inDefinedTermSet: `${BASE}/lexique`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
          { "@type": "ListItem", position: 2, name: "Guide conformité", item: `${BASE}/e-facture` },
          { "@type": "ListItem", position: 3, name: "Lexique", item: `${BASE}/lexique` },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      <SEOHead title={`${SEO_TITLE} | OdocPilot`} description={SEO_DESC} canonical="/lexique" jsonLd={jsonLd} />

      <article className="w-full max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        {/* Fil d'Ariane */}
        <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/e-facture" className="hover:text-foreground">Guide conformité</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Lexique</span>
        </nav>

        {/* Hero */}
        <header className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Lexique · facturation électronique
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            Le lexique de la facturation électronique
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            PA, PDP, PPF, Factur-X, EN 16931, e-reporting… La réforme 2026/2027 a son jargon. Voici les
            définitions claires, à jour, sans détour — et ce qui est encore mouvant, dit honnêtement.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Mis à jour en juin 2026 · Source officielle :{" "}
            <a
              href="https://www.impots.gouv.fr/professionnel/facturation-electronique"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              impots.gouv.fr
            </a>
            .
          </p>
        </header>

        {/* Index des termes */}
        <nav aria-label="Index des termes" className="mt-8 flex flex-wrap gap-2">
          {sorted.map((t) => (
            <a
              key={t.slug}
              href={`#${t.slug}`}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
            >
              {t.term}
            </a>
          ))}
        </nav>

        {/* Définitions */}
        <div className="mt-12 space-y-10">
          {sorted.map((t) => (
            <MotionDiv key={t.slug} id={t.slug} className="scroll-mt-24 border-t border-border pt-8 first:border-t-0 first:pt-0">
              <h2 className="flex flex-wrap items-baseline gap-x-2 text-2xl font-bold tracking-tight text-foreground">
                <span>{t.term}</span>
                {t.acronym && <span className="text-base font-medium text-muted-foreground">{t.acronym}</span>}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground">{t.short}</p>
              {t.body && <p className="mt-3 leading-relaxed text-muted-foreground">{t.body}</p>}
              {t.related && (
                <Link
                  to={t.related.to}
                  className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  {t.related.label}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </MotionDiv>
          ))}
        </div>

        {/* Pour aller plus loin */}
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Pour aller plus loin</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { to: "/livre-blanc", label: "Livre blanc : le guide 2026/2027 (PDF)" },
              { to: "/guide/facturation-electronique-2026", label: "Le guide complet 2026" },
              { to: "/guide/plateforme-agreee", label: "Comprendre la plateforme agréée" },
              { to: "/generateur-factur-x", label: "Générateur Factur-X gratuit" },
            ].map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:shadow-card-hover"
              >
                <span>{r.label}</span>
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-14 rounded-2xl bg-brand-panel p-7 text-center text-brand-panel-foreground">
          <h2 className="text-2xl font-bold tracking-tight">Le jargon, c'est notre travail. Pas le vôtre.</h2>
          <p className="mx-auto mt-2 max-w-xl leading-relaxed text-brand-panel-foreground/80">
            OdocPilot génère vos factures au format conforme et prépare votre administratif. L'IA prépare,
            vous validez en un clic.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/diagnostic">
              <Button size="lg" className="bg-gradient-cta px-7 font-bold text-primary-foreground">
                <Sparkles className="mr-1.5 h-4 w-4" /> Vérifier ma conformité (3 min)
              </Button>
            </Link>
            <a href={SIGNUP}>
              <Button
                size="lg"
                variant="outline"
                className="border-brand-panel-foreground/40 bg-transparent px-7 text-brand-panel-foreground hover:bg-brand-panel-foreground/10"
              >
                Démarrer l'essai 14 jours
              </Button>
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}
