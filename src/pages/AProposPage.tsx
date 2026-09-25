import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { CONTACT_EMAIL, PUBLISHER, SIGNUP_URL, TRIAL } from "@/lib/marketing";
import { fr } from "@/lib/typo";

// Identité : nom, rôle et ville seulement. Pas de SIREN, de forme juridique ni de
// lien vers l'annuaire tant que les mentions légales en ligne ne sont pas validées.
const FOUNDER_ROLE = "Développeur indépendant, fondateur d'OdocPilot";

/*
 * Textes lus au build par le prérendu (scripts/lib/page-source.ts) : props de <SEOHead>,
 * <h1> et premier paragraphe. Littéraux uniquement (ni fr(), ni import, donc le nom du
 * fondateur est écrit en toutes lettres, comme PUBLISHER.name), espaces insécables
 * tapées : U+202F avant ? ! ; %, U+00A0 avant : et €.
 */
const SEO_TITLE = "À propos d'OdocPilot, logiciel de facturation français";
const SEO_DESCRIPTION =
  "OdocPilot est conçu et développé à Paris par M. Brahimi R., développeur indépendant. Nos principes, nos choix techniques et ce que nous ne faisons pas encore.";
const INTRO =
  "OdocPilot est conçu et développé à Paris par M. Brahimi R., développeur indépendant. Il aide les indépendants, les TPE et les PME à tenir leur facturation en règle, à l'heure de la facture électronique obligatoire.";

const PRINCIPLES = [
  {
    title: "L'IA prépare, vous décidez.",
    text: "OdocPilot lit vos factures, les range et prépare le travail. Vous vérifiez chaque facture reçue avant de la valider. Les relances d'impayés partent automatiquement, avant et après l'échéance, mais vous gardez la main sur qui est relancé : l'envoi se désactive facture par facture.",
  },
  {
    title: "Vos documents restent en France.",
    text: "Ils sont stockés en France, sur des serveurs OVHcloud. Ils ne sont jamais revendus, et votre export comptable est disponible à tout moment.",
  },
  {
    title: "Une seule IA, française.",
    text: "La lecture des documents est faite par Mistral AI, entreprise française. Aucun autre fournisseur d'IA n'est appelé.",
  },
  {
    title: "Ce qui est prêt, et ce qui ne l'est pas.",
    text: "Nous décrivons le produit tel qu'il est aujourd'hui, pas tel qu'il sera peut-être. Ce qu'il ne fait pas encore est écrit plus bas, sur cette page.",
  },
];

const LIMITS = [
  {
    title: "OdocPilot n'est pas une plateforme agréée.",
    text: "Il crée vos factures au format Factur-X et lit celles que vous recevez. L'envoi officiel passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert. Le 18 septembre 2026, notre chaîne a été validée de bout en bout sur l'environnement de test d'une plateforme agréée.",
  },
  {
    title: "Pas d'archivage à valeur probante.",
    text: "Chaque document est conservé avec une empreinte numérique (SHA-256) et un historique. C'est utile pour retrouver et contrôler vos pièces, mais ce n'est pas un archivage à valeur probante au sens réglementaire.",
  },
  {
    title: "Aucune certification.",
    text: "OdocPilot n'est certifié ni ISO 27001 ni SOC 2, et aucun audit de sécurité n'a encore été mené par un organisme extérieur.",
  },
  {
    title: "Pas encore de connexion bancaire.",
    text: "Le suivi de trésorerie fonctionne avec les soldes que vous saisissez. La connexion automatique à votre banque n'est pas encore branchée.",
  },
  {
    title: "Pas de témoignages.",
    text: "OdocPilot est un produit jeune. Vous ne trouverez ici ni avis, ni note, ni logo de client : nous préférons vous montrer le produit plutôt que des avis inventés.",
  },
];

const h2Class = "font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]";

// Liens posés sur la feuille (qui reste claire en mode sombre) : soulignement et
// contour de focus à l'encre de la feuille, pas à celle du thème.
const sheetLink =
  "underline decoration-[hsl(var(--sheet-ink)/0.35)] decoration-1 underline-offset-[0.22em] transition-colors duration-200 hover:decoration-current focus-visible:outline-[hsl(var(--sheet-ink))]";

export default function AProposPage() {
  return (
    <div className="overflow-x-clip">
      <SEOHead
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        canonical="/a-propos"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "À propos d'OdocPilot",
          url: "https://odocpilot.com/a-propos",
          inLanguage: "fr-FR",
          mainEntity: {
            "@type": "Organization",
            name: "OdocPilot",
            url: "https://odocpilot.com",
            email: CONTACT_EMAIL,
            founder: {
              "@type": "Person",
              name: PUBLISHER.name,
              jobTitle: FOUNDER_ROLE,
              address: { "@type": "PostalAddress", addressLocality: PUBLISHER.city, addressCountry: "FR" },
            },
          },
        }}
      />

      {/* ─── Ouverture ─────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-20">
          <div>
            <p className="text-sm font-bold text-muted-foreground">À propos</p>
            <h1 className="mt-4 font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]">
              Être en règle, sans y laisser vos soirées.
            </h1>
            <p className="mt-6 max-w-[36rem] text-[1.1875rem] leading-relaxed text-muted-foreground">{INTRO}</p>
          </div>

          {/* Une carte de visite : un objet, donc une feuille. */}
          <div className="max-w-[26rem] rounded-[3px] bg-sheet p-6 text-sheet-ink shadow-lift sm:p-7">
            <p className="text-[0.8125rem] font-bold text-sheet-soft">Fondateur</p>
            <p className="mt-2 font-display text-[1.5rem] font-bold leading-tight">{PUBLISHER.name}</p>
            <p className="mt-1 text-sheet-soft">{fr(FOUNDER_ROLE)}</p>
            <p className="text-sheet-soft">{PUBLISHER.city}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sheet-rule pt-4">
              <a href={`mailto:${CONTACT_EMAIL}`} className={`font-data text-[0.9375rem] ${sheetLink}`}>
                {CONTACT_EMAIL}
              </a>
              <Link to="/contact" className={`inline-flex items-center gap-1.5 text-[0.9375rem] font-bold ${sheetLink}`}>
                Écrire au fondateur <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pourquoi ─────────────────────────────────────────── */}
      <section>
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <h2 className={h2Class}>{fr("Facture électronique obligatoire : pourquoi OdocPilot existe")}</h2>
          <div className="max-w-[40rem] space-y-5 text-[1.0625rem] leading-relaxed">
            <p className="text-muted-foreground">
              Depuis le 1<sup>er</sup> septembre 2026, toutes les entreprises assujetties à la TVA doivent pouvoir recevoir des
              factures électroniques. Le 1<sup>er</sup> septembre 2027, les TPE, les PME et les micro-entreprises devront aussi
              les émettre.
            </p>
            <p className="text-muted-foreground">
              {fr(
                "Les grandes entreprises ont des services entiers pour s'y préparer. Un artisan, un commerçant ou un indépendant fait souvent tout lui-même, après sa journée de travail.",
              )}
            </p>
            <p className="font-bold">
              {fr(
                "OdocPilot part d'une conviction : une petite entreprise mérite d'être en règle sans y passer ses soirées, et sans perdre la main sur ce qui part en son nom.",
              )}
            </p>
            <div className="flex flex-col items-start gap-3 pt-3">
              <Link to="/diagnostic" className="inline-flex items-center gap-2 font-bold link-underline" data-umami-event="apropos-diagnostic">
                Savoir ce qui vous concerne, en 3 minutes <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </Link>
              <Link to="/e-facture" className="inline-flex items-center gap-2 text-muted-foreground link-underline">
                Lire le guide de la facture électronique <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Comment nous travaillons ─────────────────────────── */}
      <section className="border-y border-border bg-desk">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <h2 className={h2Class}>Comment nous travaillons</h2>
          <dl className="border-t border-foreground/80">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="grid gap-2 border-b border-border py-6 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:gap-8">
                <dt className="font-display text-[1.25rem] font-bold leading-snug">{fr(p.title)}</dt>
                <dd className="leading-relaxed text-muted-foreground">{fr(p.text)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── Limites ──────────────────────────────────────────── */}
      <section id="limites" className="scroll-mt-20">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <h2 className={h2Class}>Ce que nous ne faisons pas encore</h2>
            <p className="mt-5 max-w-[26rem] leading-relaxed text-muted-foreground">
              {fr("Ces limites peuvent compter dans votre choix. Nous les écrivons avant que vous ne les cherchiez.")}
            </p>
            <p className="mt-5 font-data text-[0.8125rem] text-muted-foreground">Mis à jour le 24 septembre 2026</p>
          </div>
          <div>
            <ul className="border-t border-foreground/80">
              {LIMITS.map((l) => (
                <li key={l.title} className="border-b border-border py-6">
                  <h3 className="font-display text-xl font-bold">{fr(l.title)}</h3>
                  <p className="mt-2 max-w-[40rem] leading-relaxed text-muted-foreground">{fr(l.text)}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[40rem] leading-relaxed">
              {fr("Ce qui fonctionne déjà, sans créer de compte : le ")}
              <Link to="/generateur-factur-x" className="font-bold link-underline">
                générateur de factures Factur-X
              </Link>
              {" et le "}
              <Link to="/verificateur" className="font-bold link-underline">
                vérificateur de facture
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ─── Invitation ───────────────────────────────────────── */}
      <section className="border-t border-border bg-desk">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              <h2 className={h2Class}>Essayez, ou posez-nous vos questions.</h2>
              <p className="mt-5 max-w-[32rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
                {fr(`Votre compte démarre avec ${TRIAL.days} jours de l'offre ${TRIAL.plan}, sans carte bancaire. Ensuite, l'offre Conformité reste gratuite.`)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:justify-self-end">
              <a href={SIGNUP_URL} className="btn-ink" data-umami-event="apropos-essai">
                Commencer gratuitement <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
              </a>
              <Link to="/contact" className="inline-flex min-h-12 items-center gap-2 font-bold link-underline" data-umami-event="apropos-contact">
                Écrire au fondateur <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <nav aria-label="Liens complémentaires" className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-[0.9375rem] text-muted-foreground">
            <Link to="/recrutement" className="link-underline">
              Recrutement
            </Link>
            <Link to="/llm-info" className="link-underline">
              OdocPilot en bref
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
