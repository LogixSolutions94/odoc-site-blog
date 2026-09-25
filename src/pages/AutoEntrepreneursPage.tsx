import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { MicroInvoiceSpecimen } from "@/components/content/MicroInvoiceSpecimen";
import { AUTO_ENTREPRENEURS, autoEntrepreneursJsonLd } from "@/content/autoEntrepreneurs";
import { SIGNUP_URL } from "@/lib/marketing";
import { fr } from "@/lib/typo";

/**
 * /auto-entrepreneurs : la facture électronique pour les micro-entrepreneurs.
 * Textes : src/content/autoEntrepreneurs.ts (source unique, reprise par le prérendu).
 * Le <SEOHead>, le <h1> et l'intro lisent directement AUTO_ENTREPRENEURS : le prérendu
 * (scripts/lib/page-source.ts) les évalue sans exécuter le composant.
 */

const H1 = "font-display display-tight text-[clamp(2.3rem,5vw,4rem)] font-bold leading-[1.03]";
const H2 = "font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.4rem]";
const H3 = "font-display text-xl font-bold";
const ATOMIC = "mt-6 border-l-2 border-foreground pl-5 text-[1.125rem] leading-relaxed";

const SECTIONS = [
  { id: "concerne", title: "Êtes-vous concerné ?" },
  { id: "calendrier", title: "Le calendrier" },
  { id: "factures", title: "Ce qui change sur vos factures" },
  { id: "etapes", title: "Quatre étapes" },
  { id: "rejets", title: "Ce qui fait rejeter une facture" },
  { id: "tarif", title: "Combien ça coûte ?" },
  { id: "questions", title: "Questions fréquentes" },
  { id: "sources", title: "Sources officielles" },
];

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-1 link-underline">
      {children}
      <ArrowUpRight size={13} aria-hidden="true" className="self-center" />
    </a>
  );
}

export default function AutoEntrepreneursPage() {
  const AE = AUTO_ENTREPRENEURS;

  return (
    <div className="overflow-x-clip">
      <SEOHead
        title={AUTO_ENTREPRENEURS.seoTitle}
        description={AUTO_ENTREPRENEURS.seoDesc}
        canonical="/auto-entrepreneurs"
        ogType="article"
        jsonLd={autoEntrepreneursJsonLd()}
      />

      {/* ─── En-tête ─────────────────────────────────────────── */}
      <header className="border-b border-border bg-desk">
        <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:pt-10">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.875rem] text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors duration-200 hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} strokeWidth={1.75} />
              </li>
              <li>
                <Link to="/e-facture" className="transition-colors duration-200 hover:text-foreground">
                  Facture électronique
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} strokeWidth={1.75} />
              </li>
              <li aria-current="page" className="text-foreground">
                Auto-entrepreneurs
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
            <div>
              <p className="text-[0.9375rem] text-muted-foreground">{AE.eyebrow}</p>
              <h1 className={`mt-4 ${H1}`}>{AUTO_ENTREPRENEURS.h1Lead}<span className="whitespace-nowrap max-[359px]:whitespace-normal">{AUTO_ENTREPRENEURS.h1Word}</span></h1>
              <p className="mt-6 max-w-[40rem] text-[1.1875rem] leading-relaxed text-muted-foreground">{AUTO_ENTREPRENEURS.intro}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href={SIGNUP_URL} className="btn-ink" data-umami-event="cta-ae-hero-signup">
                  {AE.cta.button} <ArrowRight size={18} aria-hidden="true" />
                </a>
                <Link to="/diagnostic" className="inline-flex min-h-12 items-center gap-2 font-bold link-underline" data-umami-event="cta-ae-hero-diagnostic">
                  {AE.cta.secondary}
                </Link>
              </div>
              <p className="mt-6 font-data text-[0.8125rem] text-muted-foreground">{AE.updated}</p>
            </div>
            <div className="mx-auto w-full max-w-[30rem] lg:mx-0 lg:justify-self-end">
              <MicroInvoiceSpecimen caption={fr("Exemple de facture d'auto-entrepreneur au format électronique. Personnes, entreprises et montants fictifs.")} />
            </div>
          </div>

          {/* L'essentiel */}
          <dl className="mt-16 grid border-t border-foreground/80 md:grid-cols-3">
            {AE.essentials.map((e, i) => (
              <div
                key={e.label}
                className={`border-b border-border py-6 md:border-b-0 md:px-7 ${i === 0 ? "md:pl-0" : "md:border-l"} ${i === AE.essentials.length - 1 ? "md:pr-0" : ""}`}
              >
                <dt className="font-data text-[0.9375rem] font-semibold">{e.label}</dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">{e.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ─── Corps ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <nav aria-label="Sommaire" className="border-b border-border py-10 lg:sticky lg:top-24 lg:self-start lg:border-b-0 lg:py-20">
            <p className="text-sm font-bold text-muted-foreground">Sommaire</p>
            <ol className="mt-4 sm:columns-2 sm:gap-8 lg:columns-1">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="break-inside-avoid">
                  <a
                    href={`#${s.id}`}
                    className="flex gap-3 rounded-md py-1.5 text-[0.9375rem] leading-snug text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    <span className="font-data text-[0.8125rem] leading-[1.45rem]">{String(i + 1).padStart(2, "0")}</span>
                    <span>{fr(s.title)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 max-w-3xl pb-20 sm:pb-28">
            {/* Êtes-vous concerné ? */}
            <section id="concerne" className="scroll-mt-24 pt-14 lg:pt-20">
              <h2 className={H2}>{AE.concerned.h2}</h2>
              <p className={ATOMIC}>{AE.concerned.atomic}</p>
              <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {AE.concerned.cases.map((c) => (
                  <div key={c.title} className="border-t border-border pt-5">
                    <h3 className={H3}>{c.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{c.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Calendrier */}
            <section id="calendrier" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>{AE.calendar.h2}</h2>
              <ol className="mt-8 border-t border-foreground/80">
                {AE.calendar.rows.map((r) => (
                  <li key={r.date} className="grid gap-2 border-b border-border py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                    <p className="font-data text-[0.9375rem] font-semibold">{r.date}</p>
                    <p className="leading-relaxed text-muted-foreground">{r.text}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[0.875rem] text-muted-foreground">
                Source : <External href={AE.sources[0].href}>impots.gouv.fr, fiche mise à jour en juin 2026</External>
              </p>
            </section>

            {/* Ce qui change */}
            <section id="factures" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>{AE.changes.h2}</h2>
              <p className={ATOMIC}>{AE.changes.atomic}</p>
              <ul className="mt-8 space-y-5">
                {AE.changes.points.map((pt) => (
                  <li key={pt} className="flex gap-4 leading-relaxed">
                    <Check size={20} strokeWidth={2.25} className="mt-0.5 shrink-0 text-petrole" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 rounded-lg bg-desk p-5 sm:p-7">
                <p className="font-bold">{fr("Sur l'exemple de facture, en haut de page :")}</p>
                <ol className="mt-4 space-y-3">
                  {AE.changes.specimenLegend.map((l, i) => (
                    <li key={l} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 leading-relaxed">
                      <span className="font-data font-semibold">{i + 1}.</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Étapes */}
            <section id="etapes" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>{AE.steps.h2}</h2>
              <ol className="mt-8 border-t border-foreground/80">
                {AE.steps.items.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-border py-6">
                    <span className="font-display text-[1.75rem] font-bold leading-none">{i + 1}</span>
                    <div>
                      <h3 className={H3}>{s.title}</h3>
                      <p className="mt-2 leading-relaxed text-muted-foreground">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
                <External href={AE.sources[2].href}>Le questionnaire officiel</External>
                <External href={AE.sources[3].href}>La liste des plateformes agréées</External>
                <Link to="/diagnostic" className="inline-flex items-center gap-1.5 font-bold link-underline" data-umami-event="cta-ae-steps-diagnostic">
                  Notre diagnostic en 3 minutes <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </section>

            {/* Rejets */}
            <section id="rejets" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>{AE.lessons.h2}</h2>
              <p className="mt-6 leading-relaxed">{AE.lessons.body}</p>
              <ul className="mt-5 space-y-3 border-l-2 border-[hsl(var(--marker))] pl-5">
                {AE.lessons.items.map((it) => (
                  <li key={it} className="leading-relaxed">
                    {it}
                  </li>
                ))}
              </ul>
              <p className="mt-5 leading-relaxed text-muted-foreground">{AE.lessons.outro}</p>
            </section>

            {/* Tarif */}
            <section id="tarif" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>{AE.pricing.h2}</h2>
              <p className={ATOMIC}>{AE.pricing.atomic}</p>
              <div className="mt-8 rounded-lg border border-border p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-display text-[1.5rem] font-bold">Conformité</p>
                  <p className="font-display text-[2rem] font-bold leading-none">{fr("0 €")}</p>
                </div>
                <ul className="mt-6 space-y-3">
                  {AE.pricing.items.map((it) => (
                    <li key={it} className="flex gap-3 leading-relaxed">
                      <Check size={18} strokeWidth={2.25} className="mt-1 shrink-0 text-petrole" aria-hidden="true" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <a href={SIGNUP_URL} className="btn-ink" data-umami-event="cta-ae-pricing-signup">
                    {AE.cta.button} <ArrowRight size={18} aria-hidden="true" />
                  </a>
                  <Link to="/pricing" className="font-bold link-underline">
                    Voir toutes les offres
                  </Link>
                </div>
              </div>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">{AE.pricing.note}</p>
            </section>

            {/* FAQ */}
            <section id="questions" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>{AE.faqTitle}</h2>
              <div className="mt-8 border-t border-foreground/80">
                {AE.faqs.map((q) => (
                  <details key={q.q} className="group border-b border-border">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.0625rem] font-bold leading-snug [&::-webkit-details-marker]:hidden">
                      {q.q}
                      <span aria-hidden="true" className="mt-0.5 font-display text-[1.5rem] font-normal leading-none transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none">
                        +
                      </span>
                    </summary>
                    <p className="-mt-1 pb-6 pr-10 leading-relaxed text-muted-foreground">{q.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Pour aller plus loin */}
            <section className="pt-16 sm:pt-20">
              <h2 className={H2}>Pour aller plus loin</h2>
              <ul className="mt-8 grid gap-x-10 border-t border-foreground/80 sm:grid-cols-2">
                {AE.related.map((r) => (
                  <li key={r.to} className="border-b border-border">
                    <Link to={r.to} className="group flex items-start justify-between gap-4 py-5">
                      <span>
                        <span className="block font-bold">{r.label}</span>
                        <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted-foreground">{r.text}</span>
                      </span>
                      <ArrowRight size={16} aria-hidden="true" className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Sources */}
            <section id="sources" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className="font-display text-xl font-bold">Sources officielles</h2>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                {AE.sources.map((s) => (
                  <li key={s.href}>
                    <External href={s.href}>{s.label}</External>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </div>

      {/* ─── Invitation ───────────────────────────────────────── */}
      <section className="px-5 pb-6 sm:px-8">
        <div className="mx-auto max-w-[1240px] rounded-2xl bg-brand-panel px-6 py-14 text-brand-panel-foreground sm:px-12 sm:py-16 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              <h2 className="display-tight font-display text-[clamp(2.2rem,4.6vw,3.5rem)] font-bold leading-[1.02]">{AE.cta.h2}</h2>
              <p className="mt-5 max-w-[32rem] text-[1.125rem] leading-relaxed opacity-80">{AE.cta.text}</p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:justify-self-end">
              <a
                href={SIGNUP_URL}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-lg bg-brand-panel-foreground px-6 py-3 font-bold text-brand-panel transition-transform duration-150 active:scale-[0.97]"
                data-umami-event="cta-ae-final-signup"
              >
                {AE.cta.button} <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link to="/diagnostic" className="font-bold underline underline-offset-4 opacity-90" data-umami-event="cta-ae-final-diagnostic">
                {AE.cta.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
