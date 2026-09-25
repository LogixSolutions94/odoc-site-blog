import { useParams, Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { SIGNUP_URL, TRIAL } from "@/lib/marketing";
import { fr } from "@/lib/typo";
import { GUIDE_BY_SLUG } from "@/content/guides";

const NotFound = lazy(() => import("./NotFound"));
const BASE = "https://odocpilot.com";
const UPDATED = "24 septembre 2026";
const UPDATED_ISO = "2026-09-24";
const OFFICIAL = "https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique";

const H1 = "font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]";
const H2 = "font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]";

/** Ancre stable à partir d'un titre : « Qu'est-ce que Factur-X ? » → « qu-est-ce-que-factur-x ». */
function anchor(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** « 1. Faire ceci » ×N → liste numérotée ; sinon liste à puces. */
function Bullets({ items }: { items: string[] }) {
  const numbered = items.every((b) => /^\d+\.\s/.test(b));
  if (numbered) {
    return (
      <ol className="mt-5 space-y-3">
        {items.map((b, i) => (
          <li key={b} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 leading-relaxed">
            <span className="font-data font-semibold">{i + 1}.</span>
            <span>{fr(b.replace(/^\d+\.\s/, ""))}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed marker:text-muted-foreground">
      {items.map((b) => (
        <li key={b}>{fr(b)}</li>
      ))}
    </ul>
  );
}

export default function GuidePillarPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const guide = GUIDE_BY_SLUG[slug];

  if (!guide) {
    return (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    );
  }

  const url = `${BASE}/guide/${guide.slug}`;
  const crumb = guide.eyebrow.replace(/^Guide(\s*pilier)?\s*·\s*/i, "");
  const crumbLabel = crumb.charAt(0).toUpperCase() + crumb.slice(1);
  const toc = guide.sections.map((s) => ({ id: anchor(s.h2), title: s.h2 }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.h1,
        description: guide.seoDesc,
        inLanguage: "fr-FR",
        dateModified: UPDATED_ISO,
        author: { "@type": "Organization", name: "OdocPilot", url: BASE },
        publisher: { "@type": "Organization", name: "OdocPilot", url: BASE, logo: { "@type": "ImageObject", url: `${BASE}/logo.svg` } },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: `${BASE}/og-image.png`,
        isBasedOn: OFFICIAL,
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((f) => ({ "@type": "Question", name: fr(f.q), acceptedAnswer: { "@type": "Answer", text: fr(f.a) } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
          { "@type": "ListItem", position: 2, name: "Facture électronique", item: `${BASE}/e-facture` },
          { "@type": "ListItem", position: 3, name: guide.h1, item: url },
        ],
      },
    ],
  };

  return (
    <div className="overflow-x-clip">
      <SEOHead title={guide.seoTitle} description={guide.seoDesc} canonical={`/guide/${guide.slug}`} ogType="article" jsonLd={jsonLd} />

      {/* ─── En-tête ─────────────────────────────────────────── */}
      <header className="border-b border-border bg-desk">
        <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:pt-10">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.875rem] text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors duration-200 hover:text-foreground">Accueil</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={14} strokeWidth={1.75} /></li>
              <li>
                <Link to="/e-facture" className="transition-colors duration-200 hover:text-foreground">Facture électronique</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={14} strokeWidth={1.75} /></li>
              <li aria-current="page" className="text-foreground">{crumbLabel}</li>
            </ol>
          </nav>

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-bold text-muted-foreground">{guide.eyebrow}</p>
            <h1 className={`mt-4 ${H1}`}>{guide.h1}</h1>
            <p className="mt-6 max-w-[42rem] text-[1.1875rem] leading-relaxed text-muted-foreground">{guide.intro}</p>
            <p className="mt-5 font-data text-[0.8125rem] text-muted-foreground">
              Mis à jour le {UPDATED} · Source{fr(" : ")}
              <a href={OFFICIAL} target="_blank" rel="noopener noreferrer" className="link-underline">impots.gouv.fr</a>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link to="/diagnostic" className="btn-ink" data-umami-event={`guide-${guide.slug}-diagnostic`}>
                Faire le diagnostic (3 min) <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/generateur-factur-x" className="inline-flex min-h-12 items-center font-bold link-underline">
                Créer une facture Factur-X, gratuitement
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Corps ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <nav aria-label="Sommaire" className="border-b border-border py-10 lg:sticky lg:top-24 lg:self-start lg:border-b-0 lg:py-20">
            <p className="text-sm font-bold text-muted-foreground">Dans ce guide</p>
            <ol className="mt-4">
              {toc.map((t, i) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="flex gap-3 rounded-md py-1.5 text-[0.9375rem] leading-snug text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    <span className="font-data text-[0.8125rem] leading-[1.45rem]">{String(i + 1).padStart(2, "0")}</span>
                    <span>{fr(t.title)}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#questions"
                  className="flex gap-3 rounded-md py-1.5 text-[0.9375rem] leading-snug text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  <span className="font-data text-[0.8125rem] leading-[1.45rem]">{String(toc.length + 1).padStart(2, "0")}</span>
                  <span>Questions fréquentes</span>
                </a>
              </li>
            </ol>
          </nav>

          <article className="min-w-0 max-w-3xl pb-20 sm:pb-28">
            {guide.sections.map((s) => (
              <section key={s.h2} id={anchor(s.h2)} className="scroll-mt-24 pt-14 lg:pt-20">
                <h2 className={H2}>{fr(s.h2)}</h2>
                {s.atomic && (
                  <p className="mt-6 border-l-2 border-foreground pl-5 text-[1.125rem] leading-relaxed">{fr(s.atomic)}</p>
                )}
                {s.body.map((p) => (
                  <p key={p} className="mt-5 leading-relaxed">{fr(p)}</p>
                ))}
                {s.bullets && <Bullets items={s.bullets} />}
              </section>
            ))}

            <section id="questions" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>Questions fréquentes</h2>
              <div className="mt-8 border-t border-foreground/80">
                {guide.faqs.map((f) => (
                  <div key={f.q} className="border-b border-border py-6">
                    <h3 className="font-display text-[1.1875rem] font-bold leading-snug">{fr(f.q)}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{fr(f.a)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-16 sm:pt-20">
              <h2 className="font-display text-xl font-bold">Pour aller plus loin</h2>
              <ul className="mt-4 border-t border-border">
                {guide.related.map((r) => (
                  <li key={r.to} className="border-b border-border">
                    <Link to={r.to} className="group flex items-center justify-between gap-4 py-4 font-bold">
                      {fr(r.label)}
                      <ArrowRight
                        size={18}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </div>

      {/* ─── Invitation ──────────────────────────────────────── */}
      <section className="border-t border-border bg-desk">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <div>
            <h2 className={H2}>Mettez votre facturation en règle, simplement.</h2>
            <p className="mt-5 max-w-[34rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
              {fr("OdocPilot crée vos factures au format Factur-X et lit celles que vous recevez. Vous vérifiez, vous validez.")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:justify-self-end">
            <a href={SIGNUP_URL} className="btn-ink" data-umami-event={`guide-${guide.slug}-signup`}>
              Commencer gratuitement <ArrowRight size={18} aria-hidden="true" />
            </a>
            <p className="text-[0.9375rem] text-muted-foreground">{fr(TRIAL.short)}</p>
            <Link to="/diagnostic" className="link-underline">
              Faire le diagnostic (3 min)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
