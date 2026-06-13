import { useParams, Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { TrustCredentials } from "@/components/TrustCredentials";
import { Button } from "@/components/ui/button";
import { COMPARISON_BY_SLUG, COMPARISONS } from "@/content/comparisons";
import { ChevronRight, Check, X, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

const NotFound = lazy(() => import("./NotFound"));
const BASE = "https://odocpilot.com";
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
const SIGNUP = `${APP_URL}/auth?mode=signup`;

function Cell({ value, accent }: { value: string | boolean; accent?: boolean }) {
  if (typeof value === "boolean") {
    return value
      ? <Check className={`h-4 w-4 mx-auto ${accent ? "text-primary" : "text-green-600"}`} />
      : <X className="h-4 w-4 mx-auto text-muted-foreground/50" />;
  }
  return <span className={`text-sm ${accent ? "font-medium text-foreground" : "text-muted-foreground"}`}>{value}</span>;
}

export default function ComparePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const c = COMPARISON_BY_SLUG[slug];
  if (!c) return <Suspense fallback={null}><NotFound /></Suspense>;

  const url = `${BASE}/comparatif/${c.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: c.h1,
        description: c.seoDesc,
        inLanguage: "fr-FR",
        author: { "@type": "Organization", name: "OdocPilot", url: BASE },
        publisher: { "@type": "Organization", name: "OdocPilot", url: BASE, logo: { "@type": "ImageObject", url: `${BASE}/og-image.png` } },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: `${BASE}/og-image.png`,
      },
      { "@type": "FAQPage", mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
          { "@type": "ListItem", position: 2, name: "Comparatifs", item: `${BASE}/pricing` },
          { "@type": "ListItem", position: 3, name: `OdocPilot vs ${c.competitor}`, item: url },
        ],
      },
    ],
  };

  const others = COMPARISONS.filter((o) => o.slug !== c.slug);

  return (
    <div className="flex flex-col items-center">
      <SEOHead title={`${c.seoTitle} | OdocPilot`} description={c.seoDesc} canonical={`/comparatif/${c.slug}`} jsonLd={jsonLd} />

      <article className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">OdocPilot vs {c.competitor}</span>
        </nav>

        <header className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Comparatif honnête · juin 2026</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">{c.h1}</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{c.intro}</p>
        </header>

        {/* Ce que le concurrent fait bien + créneau OdocPilot */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="font-bold text-foreground">Ce que {c.competitor} fait très bien</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.themStrength}</p>
          </div>
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
            <p className="font-bold text-foreground flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Le créneau d'OdocPilot</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.odocAngle}</p>
          </div>
        </div>

        {/* Tableau comparatif */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">OdocPilot vs {c.competitor}, point par point</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/60">
                  <th className="px-4 py-3.5 text-left font-semibold text-foreground"></th>
                  <th className="px-3 py-3.5 text-center font-semibold text-primary">OdocPilot</th>
                  <th className="px-3 py-3.5 text-center font-semibold text-foreground">{c.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr key={r.dim} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-3.5 font-medium text-foreground">{r.dim}</td>
                    <td className="px-3 py-3.5 text-center bg-primary/5"><Cell value={r.odoc} accent /></td>
                    <td className="px-3 py-3.5 text-center"><Cell value={r.them} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Comparatif établi à partir d'informations publiques (juin 2026) ; les offres de {c.competitor} évoluent — vérifiez sur leur site. Côté OdocPilot, la transmission via une plateforme agréée partenaire est en cours de raccordement.
          </p>
        </section>

        {/* Quand choisir quoi */}
        <section className="mt-12 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="font-bold text-foreground">Choisissez {c.competitor} si…</p>
            <ul className="mt-3 space-y-2">
              {c.chooseThem.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground"><ChevronRight className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" /><span>{b}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
            <p className="font-bold text-foreground">Choisissez OdocPilot si…</p>
            <ul className="mt-3 space-y-2">
              {c.chooseOdoc.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{b}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Questions fréquentes</h2>
          <div className="mt-6 space-y-4">
            {c.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-bold text-foreground">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Autres comparatifs */}
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Autres comparatifs</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {others.map((o) => (
              <Link key={o.slug} to={`/comparatif/${o.slug}`} className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
                OdocPilot vs {o.competitor}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-2xl bg-brand-panel text-brand-panel-foreground p-7 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Essayez OdocPilot par vous-même</h2>
          <p className="mt-2 text-brand-panel-foreground/80 max-w-xl mx-auto leading-relaxed">Vérifiez votre conformité en 3 minutes, ou laissez l'IA préparer votre administratif sur vos propres documents — vous validez en un clic.</p>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={SIGNUP}><Button size="lg" className="bg-gradient-cta text-primary-foreground font-bold px-7">Démarrer l'essai 14 jours <ArrowRight className="ml-2 h-5 w-5" /></Button></a>
            <Link to="/diagnostic"><Button size="lg" variant="outline" className="border-brand-panel-foreground/40 bg-transparent text-brand-panel-foreground hover:bg-brand-panel-foreground/10 px-7">Vérifier ma conformité (3 min)</Button></Link>
          </div>
          <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-brand-panel-foreground/80">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Données et IA en France</span>
          </p>
          <TrustCredentials className="mt-8" />
        </section>
      </article>
    </div>
  );
}
