import { useParams, Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Button } from "@/components/ui/button";
import { GUIDE_BY_SLUG } from "@/content/guides";
import { ChevronRight, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

const NotFound = lazy(() => import("./NotFound"));
const BASE = "https://odocpilot.com";
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

export default function GuidePillarPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const guide = GUIDE_BY_SLUG[slug];

  if (!guide) {
    return <Suspense fallback={null}><NotFound /></Suspense>;
  }

  const url = `${BASE}/guide/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.h1,
        description: guide.seoDesc,
        inLanguage: "fr-FR",
        author: { "@type": "Organization", name: "OdocPilot", url: BASE },
        publisher: { "@type": "Organization", name: "OdocPilot", url: BASE, logo: { "@type": "ImageObject", url: `${BASE}/og-image.png` } },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: `${BASE}/og-image.png`,
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
          { "@type": "ListItem", position: 2, name: "Guide conformité", item: `${BASE}/e-facture` },
          { "@type": "ListItem", position: 3, name: guide.h1, item: url },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      <SEOHead title={`${guide.seoTitle} | OdocPilot`} description={guide.seoDesc} canonical={`/guide/${guide.slug}`} jsonLd={jsonLd} />

      <article className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Fil d'Ariane */}
        <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/e-facture" className="hover:text-foreground">Guide conformité</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{guide.eyebrow.replace(/^Guide(\s*pilier)?\s*·\s*/i, "")}</span>
        </nav>

        {/* Hero */}
        <header className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{guide.eyebrow}</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">{guide.h1}</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{guide.intro}</p>
          <p className="mt-3 text-xs text-muted-foreground">Mis à jour en juin 2026 · Source officielle : <a href="https://www.impots.gouv.fr/professionnel/facturation-electronique" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">impots.gouv.fr</a>.</p>
        </header>

        {/* CTA rapide */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/diagnostic"><Button size="sm" className="bg-gradient-cta text-primary-foreground font-semibold"><Sparkles className="mr-1.5 h-4 w-4" /> Vérifier ma conformité</Button></Link>
          <a href={SIGNUP}><Button size="sm" variant="outline">Commencer gratuitement</Button></a>
        </div>

        {/* Sections */}
        <div className="mt-12 space-y-12">
          {guide.sections.map((s) => (
            <MotionDiv key={s.h2} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{s.h2}</h2>
              {s.atomic && (
                <p className="mt-3 rounded-xl border-l-4 border-primary bg-primary/5 px-4 py-3 text-[15px] text-foreground leading-relaxed">{s.atomic}</p>
              )}
              {s.body.map((p, i) => (
                <p key={i} className="mt-4 text-muted-foreground leading-relaxed">{p}</p>
              ))}
              {s.bullets && (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{b}</span></li>
                  ))}
                </ul>
              )}
            </MotionDiv>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Questions fréquentes</h2>
          <div className="mt-6 space-y-4">
            {guide.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-bold text-foreground">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Maillage interne */}
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Pour aller plus loin</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {guide.related.map((r) => (
              <Link key={r.to} to={r.to} className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-primary/40 hover:shadow-card-hover transition-all">
                <span>{r.label}</span>
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-14 rounded-2xl bg-brand-panel text-brand-panel-foreground p-7 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Préparez votre conformité maintenant</h2>
          <p className="mt-2 text-brand-panel-foreground/80 max-w-xl mx-auto leading-relaxed">Vérifiez votre situation en 3 minutes, générez une facture conforme gratuitement, ou laissez l'IA préparer votre administratif — vous validez en un clic.</p>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={SIGNUP}><Button size="lg" className="bg-gradient-cta text-primary-foreground font-bold px-7">Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" /></Button></a>
            <Link to="/diagnostic"><Button size="lg" variant="outline" className="border-brand-panel-foreground/40 bg-transparent text-brand-panel-foreground hover:bg-brand-panel-foreground/10 px-7">Vérifier ma conformité (3 min)</Button></Link>
          </div>
          <TrustCredentials className="mt-8" />
        </section>
      </article>
    </div>
  );
}
