import { Link } from "react-router-dom";
import { MotionDiv } from "@/components/MotionDiv";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { EDITEURS, editeursJsonLd } from "@/content/editeurs";
import { ArrowRight, Check, ShieldAlert } from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

/** Bouton « Demander un test » (→ /contact) + adresse affichée en texte sélectionnable. */
function ContactCta({ umami, className = "" }: { umami: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${className}`}>
      <Button asChild size="lg" className="bg-gradient-cta text-primary-foreground font-bold px-7">
        <Link to="/contact" data-umami-event={umami}>
          {EDITEURS.cta} <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground">
        {EDITEURS.ctaEmailLead}{" "}
        <span className="select-all font-semibold text-foreground">{EDITEURS.email}</span>
      </p>
    </div>
  );
}

export default function EditeursPage() {
  const { why, learned, plans, steps, notThis, after } = EDITEURS;

  return (
    <div className="flex flex-col items-center">
      <SEOHead title={EDITEURS.seoTitle} description={EDITEURS.seoDesc} canonical="/editeurs" jsonLd={editeursJsonLd()} />

      <article className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        {/* Hero */}
        <header>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{EDITEURS.eyebrow}</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">{EDITEURS.h1}</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{EDITEURS.intro}</p>
          <ContactCta umami="cta-editeurs-demander-test" className="mt-7" />
        </header>

        <div className="mt-14 space-y-14">
          {/* Pourquoi maintenant */}
          <MotionDiv {...reveal}>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{why.h2}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{why.body}</p>
          </MotionDiv>

          {/* Retour d'expérience : les 9 règles relevées par la plateforme */}
          <MotionDiv {...reveal}>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{learned.h2}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{learned.body}</p>
            <ul className="mt-5 space-y-2.5 rounded-2xl border border-border bg-card p-5 shadow-card">
              {learned.rules.map((r) => (
                <li key={r.codes} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="font-mono text-[13px] font-semibold text-foreground">{r.codes}</strong> : {r.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-medium text-foreground leading-relaxed">{learned.outro}</p>
          </MotionDiv>

          {/* Deux formules */}
          <MotionDiv {...reveal}>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{plans.h2}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {plans.items.map((p) => (
                <div key={p.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h3 className="font-bold text-foreground">{p.name}</h3>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">{p.price}</p>
                  <ul className="mt-5 space-y-2">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{plans.note}</p>
          </MotionDiv>

          {/* Déroulé */}
          <MotionDiv {...reveal}>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{steps.h2}</h2>
            <ol className="mt-6 space-y-4">
              {steps.items.map((s, i) => (
                <li key={s} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-muted-foreground leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
          </MotionDiv>

          {/* Limites, dites par nous */}
          <MotionDiv {...reveal}>
            <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
                <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />
                {notThis.h2}
              </h2>
              <p className="mt-3 text-foreground leading-relaxed">{notThis.body}</p>
            </div>
          </MotionDiv>

          {/* Et après */}
          <MotionDiv {...reveal}>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{after.h2}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{after.body}</p>
          </MotionDiv>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{EDITEURS.faqTitle}</h2>
            <div className="mt-6 space-y-4">
              {EDITEURS.faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <h3 className="font-bold text-foreground">{f.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Rappel du contact en fin de page (mêmes libellés que le haut de page) */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <ContactCta umami="cta-editeurs-demander-test-bas" />
          </div>
        </div>
      </article>
    </div>
  );
}
