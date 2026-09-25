import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, Minus } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { TrustCredentials } from "@/components/TrustCredentials";
import { PLANS, SIGNUP_URL, TRIAL, formatEur, type Plan } from "@/lib/marketing";
import { fr } from "@/lib/typo";

type PlanId = Plan["id"];
type CellValue = string | boolean;

/*
 * Textes lus au build par le prérendu (scripts/lib/page-source.ts) : props de <SEOHead>,
 * <h1> et premier paragraphe. Littéraux uniquement (ni fr(), ni import), espaces
 * insécables tapées : U+202F avant ? ! ; %, U+00A0 avant : et €.
 * Les prix de la description doivent suivre PLANS (src/lib/marketing.ts).
 */
const SEO_TITLE = "Logiciel de facture électronique gratuit | Tarifs OdocPilot";
const SEO_DESCRIPTION =
  "Créez vos factures Factur-X gratuitement, sans limite de durée. Offres payantes à 29 €, 49 €, 89 € ou 149 € par mois. Essai 14 jours sans carte bancaire.";
const INTRO =
  "Créez vos factures au format de la facture électronique sans rien payer. Quand OdocPilot vous fait gagner du temps, choisissez l'offre qui suit votre volume, sans engagement.";

/** Même valeur pour les cinq offres : la fonction n'est réservée à aucune offre dans le logiciel. */
function everyPlan(value: CellValue): Record<PlanId, CellValue> {
  return { conformite: value, essentiel: value, pro: value, equipe: value, manager: value };
}

/**
 * Tableau comparatif. Quotas mensuels par entreprise et utilisateurs inclus : table
 * plan_limits du logiciel (vérifiée le 24/09/2026). Les relances, la recherche,
 * l'export FEC et la trésorerie ne sont réservés à aucune offre.
 */
const COMPARE: { label: string; hint?: string; values: Record<PlanId, CellValue> }[] = [
  {
    label: "Factures et devis au format Factur-X",
    hint: "Profil EN 16931. L'envoi officiel par plateforme agréée n'est pas encore ouvert.",
    values: everyPlan("Sans limite"),
  },
  {
    label: "Documents lus automatiquement, par mois",
    hint: "Factures reçues, justificatifs, contrats : chaque document déposé est lu et classé.",
    values: { conformite: "50", essentiel: "200", pro: "2 000", equipe: "4 000", manager: "6 000" },
  },
  {
    label: "Conversations avec le copilote, par mois",
    hint: "Vos questions sur vos documents et sur vos chiffres.",
    values: { conformite: false, essentiel: "200", pro: "2 000", equipe: "4 000", manager: "6 000" },
  },
  {
    label: "Relances automatiques des impayés",
    hint: "Un e-mail au client 7 et 3 jours avant l'échéance, puis en cas de retard. Désactivables facture par facture.",
    values: everyPlan(true),
  },
  {
    label: "Recherche de documents en français courant",
    hint: "« La facture d'électricité de mars »",
    values: everyPlan(true),
  },
  {
    label: "Export comptable (FEC)",
    hint: "Pour votre expert-comptable, à tout moment.",
    values: everyPlan(true),
  },
  {
    label: "Suivi de trésorerie",
    hint: "Avec les soldes que vous saisissez : la connexion bancaire n'est pas encore branchée.",
    values: everyPlan(true),
  },
  {
    label: "Statistiques d'activité détaillées",
    hint: "Documents traités, usage du copilote.",
    values: { conformite: false, essentiel: false, pro: true, equipe: true, manager: true },
  },
  {
    label: "Utilisateurs inclus",
    values: { conformite: "1", essentiel: "1", pro: "1", equipe: "5", manager: "10" },
  },
];

const TRIAL_STEPS = [
  { title: "Vous créez votre compte.", text: "Aucune carte bancaire n'est demandée." },
  {
    title: `Pendant ${TRIAL.days} jours, vous avez l'offre ${TRIAL.plan}.`,
    text: "Déposez vos factures reçues, créez les vôtres, posez vos questions au copilote.",
  },
  {
    title: "Ensuite, vous choisissez.",
    text: "Une offre payante si OdocPilot vous fait gagner du temps. Sinon, votre compte passe sur l'offre Conformité, gratuite. Rien n'est prélevé sans votre accord.",
  },
];

const FREE_TOOLS = [
  { to: "/diagnostic", title: "Diagnostic facture électronique", text: "Ce qui vous concerne, date par date. 3 minutes." },
  { to: "/generateur-factur-x", title: "Générateur Factur-X", text: "Une facture au format Factur-X (EN 16931), sans inscription." },
  { to: "/verificateur", title: "Vérificateur de facture", text: "Les mentions obligatoires et les totaux d'une facture Factur-X ou XML." },
  { to: "/e-facture", title: "Guide de la facture électronique", text: "Le calendrier 2026-2027, les formats, les plateformes agréées." },
];

const COMPARE_LINKS = [
  { slug: "pennylane", name: "Pennylane" },
  { slug: "qonto", name: "Qonto" },
  { slug: "indy", name: "Indy" },
  { slug: "sellsy", name: "Sellsy" },
  { slug: "axonaut", name: "Axonaut" },
  { slug: "abby", name: "Abby" },
];

const FAQ = [
  {
    q: "Que comprend l'offre gratuite ?",
    a: "L'offre Conformité est gratuite, sans limite de durée. Vous y créez vos factures et vos devis au format Factur-X, sans limite de nombre. Elle comprend aussi la lecture automatique de 20 documents par mois, les relances automatiques et l'export comptable, pour un utilisateur.",
  },
  {
    q: `Comment se passe l'essai de ${TRIAL.days} jours ?`,
    a: `Votre compte démarre avec ${TRIAL.days} jours de l'offre ${TRIAL.plan}, sans carte bancaire. Vous essayez tout sur vos vraies factures. À la fin de l'essai, votre compte passe sur l'offre Conformité, gratuite : rien n'est prélevé, et vous choisissez une offre payante seulement si vous le voulez.`,
  },
  {
    q: "Combien d'utilisateurs sont inclus ?",
    a: "Un utilisateur avec Conformité, Essentiel et Pro, jusqu'à 5 avec Équipe et jusqu'à 10 avec Manager. Au-delà, écrivez-nous : nous étudions une offre adaptée.",
  },
  {
    q: "Puis-je changer d'offre ou arrêter ?",
    a: "Oui. Les offres sont mensuelles et sans engagement de durée : vous changez d'offre ou vous arrêtez votre abonnement depuis votre espace, quand vous le voulez.",
  },
  {
    q: "OdocPilot est-il une plateforme agréée pour la facture électronique ?",
    a: "Non. OdocPilot crée vos factures au format Factur-X (profil EN 16931) et lit celles que vous recevez. L'envoi officiel passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert. Le 18 septembre 2026, notre chaîne a été validée de bout en bout sur l'environnement de test d'une plateforme agréée.",
  },
  {
    q: "Où sont stockées mes données, et quelle IA les lit ?",
    a: "Vos documents sont stockés en France, sur des serveurs OVHcloud. La lecture automatique est faite par Mistral AI, entreprise française ; aucun autre fournisseur d'IA n'est appelé. Vos données ne sont jamais revendues.",
  },
];

const h2Class = "font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]";

function price(plan: Plan): string {
  return plan.monthly === 0 ? fr("0 €") : formatEur(plan.monthly);
}

function FeatureList({ features, className = "" }: { features: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {features.map((feature) => (
        <li key={feature} className="flex gap-3 leading-snug">
          <Check size={18} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-petrole" />
          <span>{fr(feature)}</span>
        </li>
      ))}
    </ul>
  );
}

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <>
        <Check size={18} strokeWidth={1.75} aria-hidden="true" className="mx-auto block text-petrole" />
        <span className="sr-only">Inclus</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus size={16} strokeWidth={1.75} aria-hidden="true" className="mx-auto block text-muted-foreground" />
        <span className="sr-only">Non inclus</span>
      </>
    );
  }
  return <span className="font-data text-[0.9375rem] font-bold">{fr(value)}</span>;
}

export default function PricingPage() {
  const free = PLANS.find((p) => p.monthly === 0) ?? PLANS[0];
  const paid = PLANS.filter((p) => p.monthly > 0);

  return (
    <div className="overflow-x-clip">
      <SEOHead
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        canonical="/pricing"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      {/* ─── Ouverture : l'offre gratuite ─────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-20">
          <div>
            <p className="text-sm font-bold text-muted-foreground">Tarifs</p>
            <h1 className="mt-4 font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]">
              Gratuit pour être en règle. Simple ensuite.
            </h1>
            <p className="mt-6 max-w-[34rem] text-[1.1875rem] leading-relaxed text-muted-foreground">{INTRO}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={SIGNUP_URL} className="btn-ink" data-umami-event="cta-essai-gratuit" data-umami-event-plan="hero">
                Commencer gratuitement <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
              </a>
              <a href="#offres" className="inline-flex min-h-12 items-center gap-2 font-bold link-underline">
                Voir les offres payantes <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
            <p className="mt-5 text-[0.9375rem] text-muted-foreground">
              {fr(`Votre compte démarre avec ${TRIAL.days} jours de l'offre ${TRIAL.plan}, sans carte bancaire.`)}
            </p>
          </div>

          <div className="rounded-lg bg-desk p-6 sm:p-8">
            <p className="text-sm font-bold text-muted-foreground">{fr("L'offre gratuite")}</p>
            <div className="mt-2 flex items-baseline justify-between gap-4 border-b border-foreground/80 pb-4">
              <h2 className="font-display text-[1.75rem] font-bold leading-tight">{free.name}</h2>
              <p className="font-display text-[2.5rem] font-bold leading-none tracking-[-0.03em]">{price(free)}</p>
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">{fr(`${free.forWho}. Sans limite de durée.`)}</p>
            <FeatureList features={free.features} className="mt-5" />
          </div>
        </div>
      </section>

      {/* ─── Les offres payantes ──────────────────────────────── */}
      <section id="offres" className="scroll-mt-20">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-[46rem]">
            <h2 className={h2Class}>Trois offres, selon votre volume de factures</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {fr(
                "Chaque offre donne accès au même logiciel de facturation. Ce qui change : le nombre de documents lus chaque mois, les conversations avec le copilote et le nombre d'utilisateurs. Pro et Manager ajoutent des statistiques d'activité.",
              )}
            </p>
          </div>

          <div className="mt-12 grid border-t border-foreground/80 md:grid-cols-3">
            {paid.map((plan) => (
              <article
                key={plan.id}
                className="flex flex-col border-b border-border py-8 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className="mt-3">
                  <span className="font-display text-[2.5rem] font-bold leading-none tracking-[-0.03em]">{price(plan)}</span>
                  <span className="ml-1.5 text-muted-foreground">par mois</span>
                </p>
                <p className="mt-3 text-muted-foreground">{fr(plan.forWho)}</p>
                <FeatureList features={plan.features} className="mt-6 flex-1" />
                <a
                  href={SIGNUP_URL}
                  className="mt-8 inline-flex items-center gap-2 self-start font-bold link-underline"
                  data-umami-event="cta-essai-gratuit"
                  data-umami-event-plan={plan.id}
                >
                  {fr("Commencer par l'essai")} <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>

          <p className="mt-8 max-w-[46rem] leading-relaxed text-muted-foreground">
            {fr("Plus de 50 personnes, ou plus de 10 utilisateurs ? ")}
            <Link to="/contact" className="text-foreground link-underline">
              Écrivez-nous
            </Link>
            {fr(" : nous étudions une offre adaptée.")}
          </p>
        </div>
      </section>

      {/* ─── L'essai ──────────────────────────────────────────── */}
      <section className="border-y border-border bg-desk">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <h2 className={h2Class}>{fr(`Essai de ${TRIAL.days} jours, sans carte bancaire`)}</h2>
            <p className="mt-5 max-w-[28rem] leading-relaxed text-muted-foreground">
              {fr("Essayez OdocPilot sur vos vraies factures avant de payer quoi que ce soit.")}
            </p>
          </div>
          <ol className="self-start border-t border-foreground/80">
            {TRIAL_STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 border-b border-border py-5 sm:gap-4">
                <span aria-hidden="true" className="font-data text-[1.0625rem] font-bold leading-relaxed">
                  {i + 1}
                </span>
                <p className="leading-relaxed">
                  <span className="font-bold">{fr(step.title)}</span> <span className="text-muted-foreground">{fr(step.text)}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Le détail, ligne par ligne ───────────────────────── */}
      <section>
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-[46rem]">
            <h2 id="comparatif-offres" className={h2Class}>
              Comparer les offres, ligne par ligne
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {fr("Prix mensuels. Les quantités sont données par mois et par entreprise.")}
            </p>
          </div>

          {/* Défilement horizontal sur petit écran, première colonne fixe. « relative » retient
              les libellés sr-only (positionnés en absolu) dans la zone qui défile : sans lui,
              ils débordent de la page sur mobile. */}
          <div role="region" aria-labelledby="comparatif-offres" tabIndex={0} className="relative mt-10 overflow-x-auto">
            <table className="w-full min-w-[46rem] border-separate border-spacing-0 text-left">
              <caption className="sr-only">{fr("Ce que comprend chaque offre d'OdocPilot")}</caption>
              <thead>
                <tr>
                  <th scope="col" className="ledger-head sticky left-0 z-10 w-[38%] bg-background pb-3 pr-6 align-bottom font-display text-[1.0625rem] font-bold">
                    Offre
                  </th>
                  {PLANS.map((plan) => (
                    <th key={plan.id} scope="col" className="ledger-head px-3 pb-3 text-center align-bottom">
                      <span className="block font-display text-[1.0625rem] font-bold">{plan.name}</span>
                      <span className="mt-0.5 block font-data text-[0.875rem] font-normal text-muted-foreground">{price(plan)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label} className="align-top">
                    <th scope="row" className="sticky left-0 z-10 border-b border-border bg-background py-4 pr-6 text-left font-normal">
                      <span className="block font-bold">{fr(row.label)}</span>
                      {row.hint && <span className="mt-1 block text-[0.875rem] leading-snug text-muted-foreground">{fr(row.hint)}</span>}
                    </th>
                    {PLANS.map((plan) => (
                      <td key={plan.id} className="border-b border-border px-3 py-4 text-center">
                        <Cell value={row.values[plan.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Outils gratuits et comparatifs ───────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
          <h2 className={`${h2Class} max-w-[46rem]`}>{fr("Facture électronique : outils gratuits et comparatifs")}</h2>
          <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h3 className="font-display text-xl font-bold">Sans créer de compte</h3>
              <ul className="mt-4 border-t border-foreground/80">
                {FREE_TOOLS.map((tool) => (
                  <li key={tool.to} className="border-b border-border">
                    <Link
                      to={tool.to}
                      className="group flex items-start justify-between gap-6 py-5"
                      data-umami-event={tool.to === "/diagnostic" ? "pricing-diagnostic" : undefined}
                    >
                      <span>
                        <span className="block font-bold">{fr(tool.title)}</span>
                        <span className="mt-1 block leading-relaxed text-muted-foreground">{fr(tool.text)}</span>
                      </span>
                      <ArrowRight
                        size={18}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">OdocPilot face aux autres logiciels</h3>
              <p className="mt-2 text-muted-foreground">Qui fait quoi, et pour qui.</p>
              <ul className="mt-4 grid border-t border-foreground/80 sm:grid-cols-2 sm:gap-x-8">
                {COMPARE_LINKS.map((c) => (
                  <li key={c.slug} className="border-b border-border">
                    <Link to={`/comparatif/${c.slug}`} className="group flex items-center justify-between gap-4 py-4 font-bold">
                      OdocPilot vs {c.name}
                      <ArrowRight
                        size={16}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Questions ────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <h2 className={h2Class}>Questions sur les tarifs et la facture électronique</h2>
            <p className="mt-5 max-w-[24rem] leading-relaxed text-muted-foreground">
              {fr("Une autre question ? ")}
              <Link to="/contact" className="text-foreground link-underline">
                Écrivez-nous
              </Link>
              {fr(" : c'est le fondateur qui vous répond.")}
            </p>
          </div>
          <div className="border-t border-foreground/80">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.0625rem] font-bold leading-snug [&::-webkit-details-marker]:hidden">
                  {fr(f.q)}
                  <span
                    aria-hidden="true"
                    className="mt-0.5 font-display text-[1.5rem] font-normal leading-none transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="-mt-1 pb-6 pr-10 leading-relaxed text-muted-foreground">{fr(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Invitation ───────────────────────────────────────── */}
      <section className="border-t border-border bg-desk">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              <h2 className={h2Class}>Essayez sur une vraie facture.</h2>
              <p className="mt-5 max-w-[32rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
                {fr(`Créez votre compte, déposez une facture et regardez la fiche se remplir. ${TRIAL.short}.`)}
              </p>
            </div>
            <div className="lg:justify-self-end">
              <a href={SIGNUP_URL} className="btn-ink" data-umami-event="cta-essai-gratuit" data-umami-event-plan="final">
                Commencer gratuitement <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
          </div>
          <TrustCredentials className="mt-14 justify-start border-t border-border pt-6 text-left" />
        </div>
      </section>
    </div>
  );
}
