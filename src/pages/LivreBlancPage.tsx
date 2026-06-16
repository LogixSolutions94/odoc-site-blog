import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { ArticleTOC } from "@/components/blog/ArticleTOC";
import { NewsletterInline } from "@/components/blog/NewsletterInline";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Button } from "@/components/ui/button";
import { WHITE_PAPER } from "@/content/livreBlanc";
import { ChevronRight, CheckCircle, ArrowRight, Printer, Sparkles } from "lucide-react";

const BASE = "https://odocpilot.com";
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

export default function LivreBlancPage() {
  const wp = WHITE_PAPER;
  const headings = wp.sections.map((s) => ({ depth: 2 as const, text: s.h2, id: s.slug }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: wp.title,
        description: wp.subtitle,
        inLanguage: "fr-FR",
        datePublished: "2026-06-14",
        dateModified: "2026-06-14",
        author: { "@type": "Organization", name: "OdocPilot", url: BASE },
        publisher: {
          "@type": "Organization",
          name: "OdocPilot",
          url: BASE,
          logo: { "@type": "ImageObject", url: `${BASE}/og-image.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/livre-blanc` },
        image: `${BASE}/og-image.png`,
      },
      {
        "@type": "FAQPage",
        mainEntity: wp.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
          { "@type": "ListItem", position: 2, name: "Guide conformité", item: `${BASE}/e-facture` },
          { "@type": "ListItem", position: 3, name: "Livre blanc", item: `${BASE}/livre-blanc` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <SEOHead
        title={`${wp.title} | OdocPilot`}
        description={wp.subtitle}
        canonical="/livre-blanc"
        jsonLd={jsonLd}
      />

      {/* En-tête */}
      <div className="mx-auto max-w-[68ch] print-article">
        <nav className="no-print flex flex-wrap items-center gap-1 text-xs text-muted-foreground" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/e-facture" className="hover:text-foreground">Guide conformité</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Livre blanc</span>
        </nav>

        <header className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Livre blanc · facturation électronique
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {wp.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{wp.subtitle}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Mis à jour en juin 2026 · Lecture libre, sans inscription · Source officielle :{" "}
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

          <div className="no-print mt-6 flex flex-wrap gap-2">
            <Link to="/diagnostic">
              <Button size="sm" className="bg-gradient-cta font-semibold text-primary-foreground">
                <Sparkles className="mr-1.5 h-4 w-4" /> Vérifier ma conformité
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" /> Imprimer / enregistrer en PDF
            </Button>
          </div>
        </header>

        {/* TL;DR */}
        <div className="article-tldr mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">L'essentiel en 1 minute</p>
          <ul className="mt-2 space-y-2">
            {wp.tldr.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-[15px] leading-relaxed text-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Corps + sommaire */}
      <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
        <div className="min-w-0">
          <div className="print-article mx-auto max-w-[68ch] space-y-12">
            {wp.sections.map((s) => (
              <MotionDiv key={s.slug} id={s.slug} className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{s.h2}</h2>
                {s.atomic && (
                  <p className="article-tldr mt-3 text-[15px] leading-relaxed text-foreground">{s.atomic}</p>
                )}
                {s.body.map((p, i) => (
                  <p key={i} className="mt-4 leading-relaxed text-muted-foreground">{p}</p>
                ))}
                {s.bullets && (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </MotionDiv>
            ))}

            {/* FAQ */}
            <section className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Questions fréquentes</h2>
              <div className="mt-6 space-y-4">
                {wp.faqs.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                    <h3 className="font-bold text-foreground">{f.q}</h3>
                    <p className="faq-answer mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Capture email — honnête : veille, pas un faux envoi de PDF */}
            <div className="no-print">
              <NewsletterInline
                source="livre-blanc"
                title="La réforme bouge encore — restez à jour"
                description="Plafonds, calendrier, plateformes agréées : certains points évoluent. Laissez votre email, on vous prévient quand quelque chose change vraiment. Pas de spam."
                cta="Me prévenir des évolutions"
              />
            </div>
          </div>
        </div>

        <aside className="no-print hidden lg:block">
          <div className="sticky top-24">
            <ArticleTOC headings={headings} />
          </div>
        </aside>
      </div>

      {/* CTA final */}
      <section className="no-print mx-auto mt-14 max-w-[68ch] rounded-2xl bg-brand-panel p-7 text-center text-brand-panel-foreground lg:mx-0">
        <h2 className="text-2xl font-bold tracking-tight">Passez du guide à l'action</h2>
        <p className="mx-auto mt-2 max-w-xl leading-relaxed text-brand-panel-foreground/80">
          Vérifiez votre situation en 3 minutes, générez une facture conforme gratuitement, ou laissez l'IA
          préparer votre administratif — vous validez en un clic.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={SIGNUP}>
            <Button size="lg" className="bg-gradient-cta px-7 font-bold text-primary-foreground">
              Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <Link to="/lexique">
            <Button
              size="lg"
              variant="outline"
              className="border-brand-panel-foreground/40 bg-transparent px-7 text-brand-panel-foreground hover:bg-brand-panel-foreground/10"
            >
              Consulter le lexique
            </Button>
          </Link>
        </div>
        <TrustCredentials className="mt-8" />
      </section>
    </div>
  );
}
