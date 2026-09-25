import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Circle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { InvoiceScene } from "@/components/home/InvoiceScene";
import { AppWindow } from "@/components/home/AppWindow";
import { AccountingExport, DocumentSearch, ReceivedInvoices, ReminderDraft } from "@/components/home/ProductVisuals";
import { CONTACT_EMAIL, PLANS, PUBLISHER, SIGNUP_URL, TRIAL, formatEur } from "@/lib/marketing";
import { fr } from "@/lib/typo";

/* ─── Contenus ──────────────────────────────────────────────── */

const CALENDAR = [
  {
    date: "1er septembre 2026",
    state: "En vigueur",
    title: "Toutes les entreprises doivent pouvoir recevoir des factures électroniques.",
    text: "Auto-entrepreneurs compris. Les grandes entreprises et les ETI émettent déjà les leurs en électronique.",
  },
  {
    date: "1er septembre 2027",
    state: "Dans moins d'un an",
    title: "Les TPE, PME et micro-entreprises devront aussi les émettre.",
    text: "Vos factures aux autres entreprises partiront au format électronique, par une plateforme agréée. Vos ventes aux particuliers seront déclarées à l'administration (e-reporting).",
  },
];

const CASES = [
  {
    who: "Vous facturez d'autres entreprises",
    what: "Vos factures passeront au format électronique au plus tard le 1er septembre 2027.",
  },
  {
    who: "Vous facturez des particuliers",
    what: "Pas de facture électronique à leur envoyer, mais vous déclarerez vos ventes à l'administration (e-reporting) à partir du 1er septembre 2027.",
  },
  {
    who: "Vous recevez des factures de fournisseurs",
    what: "Depuis le 1er septembre 2026, vous devez pouvoir les recevoir au format électronique, par une plateforme agréée.",
  },
  {
    who: "Vous êtes auto-entrepreneur",
    what: "Vous êtes concerné comme les autres : la franchise de TVA ne vous en dispense pas.",
  },
];

const NEW_MENTIONS = [
  "Le numéro SIREN de votre client",
  "La nature de l'opération : biens, services, ou les deux",
  "L'adresse de livraison, si elle diffère",
  "L'option pour le paiement de la TVA sur les débits, le cas échéant",
];

const STEPS = [
  {
    title: "Créez votre espace",
    text: "Votre adresse e-mail suffit : vous recevez un lien, pas de mot de passe à inventer. Vous renseignez votre entreprise une seule fois.",
  },
  {
    title: "Faites vos factures au format légal",
    text: "Chaque facture sort au format Factur-X, l'un des formats acceptés par la loi, et ses mentions obligatoires sont vérifiées avant l'envoi. Une mention manque ? Vous le savez tout de suite.",
  },
  {
    title: "Recevez et rangez celles de vos fournisseurs",
    text: "Déposez un PDF ou une photo : fournisseur, montants, TVA et échéance sont lus pour vous. Vous vérifiez, vous validez, c'est classé.",
  },
];

const TASKS = [
  {
    kicker: "Factures reçues",
    title: "Les factures de vos fournisseurs se remplissent seules.",
    text: "Déposez le PDF ou prenez la facture en photo. Fournisseur, numéro, montants, TVA et échéance sont reportés dans la fiche. Vous vérifiez, vous corrigez si besoin, vous validez.",
    visual: <ReceivedInvoices />,
  },
  {
    kicker: "Documents",
    title: "Chaque document retrouvé en une phrase.",
    text: "« La facture d'électricité de mars », « le contrat du camion » : écrivez-le comme vous le diriez, le document s'affiche. Chaque pièce déposée est classée pour vous.",
    visual: <DocumentSearch />,
  },
  {
    kicker: "Relances",
    title: "Vos clients en retard sont relancés.",
    text: "Avant l'échéance, puis après, la relance part avec le bon numéro et le bon montant. Vous choisissez qui est relancé : un clic suffit pour couper l'envoi d'une facture.",
    visual: <ReminderDraft />,
  },
  {
    kicker: "Comptabilité",
    title: "Votre comptable reçoit un export propre.",
    text: "Exportez le fichier des écritures comptables (FEC) quand vous voulez. Votre expert-comptable l'importe dans son logiciel, sans rien ressaisir. OdocPilot ne remplace pas votre comptable : il lui prépare le terrain.",
    visual: <AccountingExport />,
  },
];

const LEDGER = [
  ["Vérifie les mentions obligatoires de chaque facture.", "Vous validez la facture."],
  ["Lit chaque facture reçue et remplit la fiche.", "Vous vérifiez les montants."],
  ["Propose un classement : catégorie, chantier.", "Vous confirmez ou vous changez."],
  ["Relance vos clients avant et après l'échéance.", "Vous choisissez qui est relancé."],
  ["Prépare l'export pour votre comptable.", "Vous le transmettez quand vous voulez."],
];

const WHO = [
  { to: "/e-facture#auto-entrepreneurs", name: "Auto-entrepreneurs et indépendants", text: "Concernés, même en franchise de TVA. Le palier gratuit suffit pour facturer au bon format." },
  { to: "/artisans", name: "Artisans et BTP", text: "Factures de négoce, bons de livraison, acomptes et soldes, rangés par chantier." },
  { to: "/commerce", name: "Commerces et services", text: "Fournisseurs, abonnements, frais du quotidien : tout est lu, rien ne se perd." },
  { to: "/professions-liberales", name: "Professions libérales", text: "Honoraires, justificatifs et dépenses, prêts pour votre expert-comptable." },
];

const TOOLS = [
  { to: "/diagnostic", name: "Suis-je concerné ?", text: "Quelques questions, trois minutes : vos obligations et vos dates, noir sur blanc." },
  { to: "/generateur-factur-x", name: "Générateur de facture Factur-X", text: "Remplissez, téléchargez : une facture au format électronique, gratuitement." },
  { to: "/verificateur", name: "Vérificateur de facture", text: "Déposez une facture Factur-X et voyez ce qu'elle contient vraiment." },
  { to: "/lexique", name: "Le lexique de la réforme", text: "Factur-X, PA, e-reporting, SIREN : chaque mot expliqué simplement." },
];

const FAQ = [
  {
    q: "Qui est concerné par la facture électronique obligatoire ?",
    a: "Toutes les entreprises établies en France et assujetties à la TVA : sociétés, artisans, commerçants, professions libérales et micro-entrepreneurs. Depuis le 1er septembre 2026, chacune doit pouvoir recevoir des factures électroniques. Le 1er septembre 2027, les TPE, PME et micro-entreprises devront aussi émettre les leurs en électronique.",
  },
  {
    q: "Auto-entrepreneur : suis-je concerné ?",
    a: "Oui, dès que vous facturez d'autres entreprises en France. La franchise en base de TVA ne vous dispense pas de la réforme : vous devez pouvoir recevoir des factures électroniques depuis le 1er septembre 2026, et vous émettrez les vôtres en électronique à partir du 1er septembre 2027.",
  },
  {
    q: "Je vends surtout à des particuliers. Suis-je concerné ?",
    a: "Oui, en partie. Vous n'envoyez pas de facture électronique à un particulier. Mais vous devez pouvoir recevoir celles de vos fournisseurs depuis le 1er septembre 2026, et vous déclarerez vos ventes aux particuliers à l'administration (e-reporting) à partir du 1er septembre 2027.",
  },
  {
    q: "Un PDF envoyé par e-mail, est-ce une facture électronique ?",
    a: "Non. Au sens de la réforme, une facture électronique est un fichier structuré, lisible par les logiciels : Factur-X, UBL ou CII. Elle circule par une plateforme agréée, pas par e-mail. Un PDF classique ne suffira plus entre entreprises.",
  },
  {
    q: "Qu'est-ce que Factur-X ?",
    a: "C'est un format hybride : un PDF que vous lisez comme d'habitude, qui contient un fichier de données lisible par les logiciels. C'est l'un des trois formats acceptés par la réforme. OdocPilot produit vos factures dans ce format, au profil EN 16931.",
  },
  {
    q: "OdocPilot est-il une plateforme agréée ?",
    a: "Non. OdocPilot produit vos factures au format Factur-X et lit celles que vous recevez. L'envoi officiel passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert. Le 18 septembre 2026, notre chaîne complète a été validée sur l'environnement de test d'une plateforme agréée.",
  },
  {
    q: "Je ne suis pas à l'aise avec l'informatique. C'est pour moi ?",
    a: "Si vous savez envoyer une photo par e-mail, oui. Vous remplissez une facture comme sur papier, vous déposez celles que vous recevez, vous relisez, vous validez. Et si vous bloquez, vous écrivez : c'est le fondateur d'OdocPilot qui vous répond.",
  },
  {
    q: "L'IA peut-elle se tromper ?",
    a: "Oui, comme toute lecture automatique. C'est pour cela que rien n'est validé sans vous : chaque champ lu s'affiche à côté du document d'origine, et vous le corrigez avant de valider.",
  },
  {
    q: "Est-ce que je garde mon expert-comptable ?",
    a: "Oui. OdocPilot n'est pas un logiciel de comptabilité : il prépare et range vos pièces, puis produit un export (FEC) que votre expert-comptable importe directement dans son logiciel.",
  },
  {
    q: "Où sont stockés mes documents ?",
    a: "En France, sur des serveurs OVHcloud. La lecture des documents est faite par les modèles de Mistral AI, une entreprise française ; aucun autre fournisseur d'IA n'est appelé. Vos données ne sont jamais revendues.",
  },
  {
    q: "Que se passe-t-il après les 14 jours d'essai ?",
    a: "Rien d'automatique : l'essai ne demande pas de carte bancaire, vous n'êtes donc jamais prélevé par surprise. Si OdocPilot vous fait gagner du temps, vous choisissez une offre. Sinon, vous n'avez rien à faire.",
  },
];

/* ─── Petits éléments ───────────────────────────────────────── */

function Kicker({ children }: { children: string }) {
  return <p className="text-[0.875rem] font-bold text-orange-ink">{children}</p>;
}

/** Cellule d'une rangée à filets : 1 colonne (mobile), 2 (sm), 4 (lg). */
function cell(i: number, n: number): string {
  const smLeft = i % 2 === 0;
  const lgFirst = i === 0;
  const lgLast = i === n - 1;
  return [
    "border-b border-border py-7",
    smLeft ? "sm:border-r sm:pl-0 sm:pr-6" : "sm:border-r-0 sm:pl-6 sm:pr-0",
    lgFirst ? "lg:pl-0 lg:pr-6" : lgLast ? "lg:pl-6 lg:pr-0" : "lg:px-6",
    lgLast ? "lg:border-r-0" : "lg:border-r",
    "lg:border-b-0",
  ].join(" ");
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`display-tight text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.02] ${className}`}>{children}</h2>;
}

export default function HomePage() {
  // Le trait de surligneur du titre se pose une fois, juste après l'affichage.
  const [marked, setMarked] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMarked(true), 350);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="overflow-x-clip">
      <SEOHead
        title="Facture électronique obligatoire : soyez en règle | OdocPilot"
        description="Auto-entrepreneur, artisan, TPE ou PME : créez vos factures au format légal (Factur-X) et sachez ce qui change en 2026 et 2027. Gratuit pour commencer."
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      {/* ─── Ouverture ─────────────────────────────────────────── */}
      <section className="relative border-b border-border">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[47%] bg-desk lg:block" />
        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 pb-14 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="flex flex-col justify-center">
            <p className="text-[0.9375rem] text-muted-foreground">
              Obligatoire depuis le 1<sup>er</sup> septembre 2026 pour recevoir vos factures
            </p>
            <h1 className="display-tight mt-5 text-[clamp(2.6rem,4.6vw,4.3rem)] leading-[1]">
              {fr("Facture électronique :")}
              <br />
              soyez <span className="marker marker-title" data-on={marked}>en règle</span>,
              <br /> simplement.
            </h1>
            <p className="mt-7 max-w-[32rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
              {fr("Auto-entrepreneur, artisan, commerçant ou PME : OdocPilot crée vos factures au format légal, lit celles que vous recevez et vous dit ce qui vous concerne, date par date. Vous gardez la main sur tout.")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={SIGNUP_URL} className="btn-ink" data-umami-event="home-hero-trial">
                Commencer gratuitement <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link to="/diagnostic" className="inline-flex min-h-12 items-center gap-2 font-bold link-underline" data-umami-event="home-hero-diagnostic">
                {fr("Suis-je concerné ? (3 min)")}
              </Link>
            </div>
            <p className="mt-5 text-[0.9375rem] text-muted-foreground">
              {fr(`Gratuit pour créer vos factures au format légal. ${TRIAL.days} jours d'essai de l'offre ${TRIAL.plan}, sans carte bancaire.`)}
            </p>
          </div>

          <div className="relative lg:py-4">
            <div aria-hidden="true" className="absolute -inset-x-5 -inset-y-6 rounded-xl bg-desk sm:-inset-x-8 lg:hidden" />
            <div className="relative">
              <InvoiceScene />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ce qui change ─────────────────────────────────────── */}
      <section id="reforme" className="scroll-mt-20">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="font-data text-[0.8125rem] text-muted-foreground">Mis à jour le 24 septembre 2026</p>
              <SectionTitle className="mt-4">{fr("Facturation électronique : ce qui change pour vous.")}</SectionTitle>
              <p className="mt-5 max-w-[26rem] leading-relaxed text-muted-foreground">
                {fr("La réforme concerne toutes les entreprises assujetties à la TVA, de l'auto-entrepreneur à la PME. Voici le calendrier officiel, sans jargon.")}
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <Link to="/diagnostic" className="btn-ink btn-ink-sm" data-umami-event="home-reforme-diagnostic">
                  {fr("Vérifier ce qui me concerne")} <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link to="/e-facture" className="inline-flex items-center gap-2 text-muted-foreground link-underline">
                  Le guide complet de la facture électronique <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div>
              <ol className="border-t border-foreground/80">
                {CALENDAR.map((c) => (
                  <li key={c.date} className="grid gap-3 border-b border-border py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
                    <div>
                      <p className="font-data text-[0.9375rem] font-semibold">{fr(c.date)}</p>
                      <p className="mt-1 text-[0.8125rem] text-muted-foreground">{fr(c.state)}</p>
                    </div>
                    <div>
                      <p className="font-display text-[1.25rem] font-bold leading-snug">{fr(c.title)}</p>
                      <p className="mt-2 leading-relaxed text-muted-foreground">{fr(c.text)}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10">
                <h3 className="text-[1.25rem]">Votre cas, en une ligne</h3>
                <dl className="mt-4 border-t border-border">
                  {CASES.map((c) => (
                    <div key={c.who} className="grid gap-1 border-b border-border py-4 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-6">
                      <dt className="font-bold">{fr(c.who)}</dt>
                      <dd className="leading-relaxed text-muted-foreground">{fr(c.what)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-[1.25rem]">{fr("Un PDF par e-mail ne suffira plus")}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {fr("Une facture électronique est un fichier que les logiciels lisent tout seuls (les formats s'appellent Factur-X, UBL ou CII). Elle passe par une plateforme agréée, un intermédiaire autorisé par l'État, et non plus par e-mail.")}
                  </p>
                </div>
                <div>
                  <h3 className="text-[1.25rem]">{fr("Quatre nouvelles mentions")}</h3>
                  <ul className="mt-3 space-y-2">
                    {NEW_MENTIONS.map((m) => (
                      <li key={m} className="flex gap-2.5 leading-snug text-muted-foreground">
                        <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--marker))]" />
                        {fr(m)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-8 text-[0.8125rem] text-muted-foreground">
                Source :{" "}
                <a href="https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique" target="_blank" rel="noopener noreferrer" className="link-underline">
                  impots.gouv.fr, « Je passe à la facturation électronique »
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── En règle en trois étapes ─────────────────────────── */}
      <section className="border-y border-border bg-desk">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionTitle className="max-w-[44rem]">{fr("En règle en trois étapes, sans rien installer.")}</SectionTitle>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-foreground pt-6">
                <p className="font-data text-[0.875rem] font-semibold text-muted-foreground">Étape {i + 1}</p>
                <h3 className="mt-2 text-[1.5rem] leading-tight">{fr(s.title)}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{fr(s.text)}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-6 border-t border-border pt-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex gap-4">
              <Check size={20} strokeWidth={2.5} className="mt-1 shrink-0 text-petrole" aria-label="Disponible" />
              <p className="leading-relaxed">
                {fr("Format Factur-X (norme européenne EN 16931) : disponible. Le 18 septembre 2026, nos factures ont passé la validation d'une plateforme agréée, sur son environnement de test.")}
              </p>
            </div>
            <div className="flex gap-4">
              <Circle size={20} strokeWidth={2} className="mt-1 shrink-0 text-muted-foreground" aria-label="Pas encore disponible" />
              <p className="leading-relaxed text-muted-foreground">
                {fr("Envoi et réception officiels par plateforme agréée : pas encore ouverts. OdocPilot n'est pas lui-même une plateforme agréée ; ce raccordement passera par un partenaire, et nous l'annoncerons ici.")}
              </p>
            </div>
          </div>
          <div className="mt-12">
            <a href={SIGNUP_URL} className="btn-ink" data-umami-event="home-steps-trial">
              Commencer gratuitement <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Au quotidien ─────────────────────────────────────── */}
      <section id="produit" className="scroll-mt-20">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-[46rem]">
            <SectionTitle>{fr("Et chaque jour, moins de paperasse.")}</SectionTitle>
            <p className="mt-5 max-w-[34rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
              {fr("Être en règle, c'est la base. OdocPilot vous fait aussi gagner le temps que vous passiez sur vos papiers.")}
            </p>
          </div>

          <figure className="mt-14 rounded-xl bg-desk px-3 py-6 sm:px-10 sm:py-12 lg:mt-20">
            <div className="mx-auto max-w-[62rem]">
              <AppWindow />
            </div>
            <figcaption className="mx-auto mt-4 max-w-[62rem] text-[0.8125rem] text-muted-foreground">
              {fr("L'écran Factures d'OdocPilot, avec les données d'une entreprise fictive.")}
            </figcaption>
          </figure>

          <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
            {TASKS.map((task, i) => (
              <article key={task.kicker} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <Kicker>{task.kicker}</Kicker>
                  <h3 className="mt-3 text-[clamp(1.6rem,2.6vw,2.15rem)] leading-[1.1]">{fr(task.title)}</h3>
                  <p className="mt-4 max-w-[31rem] leading-relaxed text-muted-foreground">{fr(task.text)}</p>
                </div>
                <div className={`rounded-xl bg-desk px-5 py-8 sm:px-10 sm:py-12 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="mx-auto max-w-[26rem]">{task.visual}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Le partage des rôles ─────────────────────────────── */}
      <section className="border-y border-border bg-desk">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-28">
          <div>
            <SectionTitle>
              {fr("L'IA prépare.")}
              <br />
              Vous décidez.
            </SectionTitle>
            <p className="mt-5 max-w-[26rem] leading-relaxed text-muted-foreground">
              {fr("La règle de partage d'OdocPilot, tenue comme un livre de comptes : à gauche ce qu'il fait pour vous, à droite ce qui vous revient.")}
            </p>
          </div>
          <table className="w-full self-start text-left">
            <caption className="sr-only">Ce que fait OdocPilot et ce que vous décidez</caption>
            <thead>
              <tr className="ledger-head">
                <th scope="col" className="w-1/2 pb-3 pr-4 font-display text-[1.0625rem] font-bold">OdocPilot</th>
                <th scope="col" className="w-1/2 pb-3 pl-4 font-display text-[1.0625rem] font-bold">Vous</th>
              </tr>
            </thead>
            <tbody>
              {LEDGER.map(([ai, you]) => (
                <tr key={ai} className="border-b border-border align-top">
                  <td className="py-4 pr-4 text-[0.9375rem] leading-snug text-muted-foreground sm:text-base">{fr(ai)}</td>
                  <td className="border-l border-border py-4 pl-4 text-[0.9375rem] font-bold leading-snug sm:text-base">{fr(you)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Pour qui ─────────────────────────────────────────── */}
      <section id="metiers" className="scroll-mt-20">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionTitle className="max-w-[44rem]">{fr("Pour toutes les entreprises, même quand vous êtes seul.")}</SectionTitle>
          <div className="mt-12 grid border-t border-foreground/80 sm:grid-cols-2 lg:grid-cols-4">
            {WHO.map((t, i) => (
              <Link key={t.to} to={t.to} className={`group flex flex-col ${cell(i, WHO.length)}`}>
                <h3 className="text-[1.375rem] leading-tight">{fr(t.name)}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{fr(t.text)}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-bold">
                  Ce qui change pour moi
                  <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-4 rounded-lg border border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <p className="max-w-[44rem] leading-relaxed">
              <span className="font-bold">{fr("Vous éditez un logiciel qui émet des factures ?")}</span>{" "}
              <span className="text-muted-foreground">{fr("Nous testons vos modèles Factur-X sur une vraie plateforme agréée, et nous vous rendons ce qui bloque, règle par règle.")}</span>
            </p>
            <Link to="/editeurs" className="inline-flex shrink-0 items-center gap-2 font-bold link-underline" data-umami-event="home-editeurs">
              {fr("L'offre éditeurs")} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Outils gratuits ──────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-28">
          <div>
            <SectionTitle>{fr("Commencez sans créer de compte.")}</SectionTitle>
            <p className="mt-5 max-w-[26rem] leading-relaxed text-muted-foreground">
              {fr("Quatre outils gratuits pour comprendre la réforme et faire votre première facture au bon format, tout de suite.")}
            </p>
          </div>
          <ul className="border-t border-foreground/80">
            {TOOLS.map((t) => (
              <li key={t.to} className="border-b border-border">
                <Link to={t.to} className="group grid gap-1 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-8" data-umami-event={`home-tool-${t.to.slice(1)}`}>
                  <div>
                    <p className="font-display text-[1.25rem] font-bold leading-snug">{fr(t.name)}</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{fr(t.text)}</p>
                  </div>
                  <ArrowRight size={20} aria-hidden="true" className="hidden transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Qui construit OdocPilot ──────────────────────────── */}
      <section className="border-y border-border bg-desk">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <div>
            <SectionTitle>{fr("Qui construit OdocPilot ?")}</SectionTitle>
            <p className="mt-6 max-w-[32rem] text-[1.1875rem] leading-relaxed">
              {fr(`OdocPilot est conçu et développé à Paris par ${PUBLISHER.name}, développeur indépendant.`)}
            </p>
            <p className="mt-4 max-w-[32rem] leading-relaxed text-muted-foreground">
              {fr("Il n'y a ni standard ni centre d'appels : quand vous écrivez, c'est lui qui vous répond. Et quand quelque chose n'est pas encore prêt, il vous le dit.")}
            </p>
            <p className="mt-4 max-w-[32rem] leading-relaxed text-muted-foreground">
              {fr("Vous préférez en parler de vive voix ? Indiquez votre numéro dans votre message : le fondateur vous rappelle.")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/contact" className="btn-ink" data-umami-event="home-contact">
                {fr("Écrire au fondateur")}
              </Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-data text-[0.9375rem] link-underline">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <dl className="self-start divide-y divide-border border-y border-foreground/80">
            {[
              ["Vos documents", "Stockés en France, sur des serveurs OVHcloud."],
              ["L'IA", "Mistral AI, entreprise française. Aucun autre fournisseur n'est appelé."],
              ["Vos données", "Jamais revendues. Vos factures restent téléchargeables et l'export comptable se fait en un clic : vous n'êtes jamais prisonnier."],
              ["Vos factures", "Au format Factur-X, validé sur l'environnement de test d'une plateforme agréée."],
              ["Les avis clients", "Pas encore ici : OdocPilot est jeune. Plutôt que des avis inventés, nous vous laissons l'essayer gratuitement."],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-bold">{fr(k)}</dt>
                <dd className="text-muted-foreground">{fr(v)}</dd>
              </div>
            ))}
            <div className="grid gap-1 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-bold">Nos limites</dt>
              <dd>
                <Link to="/a-propos#limites" className="text-muted-foreground link-underline">
                  {fr("Écrites noir sur blanc, avant que vous ne les cherchiez.")}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ─── Combien ça coûte ─────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle>{fr("Combien ça coûte ?")}</SectionTitle>
            <Link to="/pricing" className="inline-flex items-center gap-2 font-bold link-underline" data-umami-event="home-pricing">
              Comparer les offres en détail <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid border-t border-foreground/80 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p, i) => (
              <div key={p.id} className={cell(i, PLANS.length)}>
                <p className="font-display text-[1.25rem] font-bold">{p.name}</p>
                <p className="mt-3">
                  {p.monthly === 0 ? (
                    <span className="font-display text-[2.5rem] font-bold leading-none tracking-[-0.03em]">Gratuit</span>
                  ) : (
                    <>
                      <span className="font-display text-[2.5rem] font-bold leading-none tracking-[-0.03em]">{formatEur(p.monthly)}</span>
                      <span className="ml-1.5 text-muted-foreground">par mois</span>
                    </>
                  )}
                </p>
                <p className="mt-3 text-muted-foreground">{fr(p.forWho)}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-4 text-[0.9375rem]">
                  {p.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex gap-2.5 leading-snug">
                      <Check size={16} strokeWidth={2.25} className="mt-0.5 shrink-0 text-petrole" aria-hidden="true" />
                      {fr(f)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[44rem] leading-relaxed text-muted-foreground">
            {fr(`Les offres payantes commencent par ${TRIAL.days} jours d'essai, sans carte bancaire. Sans engagement : vous arrêtez quand vous voulez.`)}
          </p>
        </div>
      </section>

      {/* ─── Questions ────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-28">
          <div>
            <SectionTitle>{fr("Vos questions sur la facture électronique.")}</SectionTitle>
            <p className="mt-5 max-w-[24rem] leading-relaxed text-muted-foreground">
              {fr("Une autre question ?")}{" "}
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
                  <span aria-hidden="true" className="mt-0.5 font-display text-[1.5rem] font-normal leading-none transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none">
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
      <section className="px-5 pb-6 sm:px-8">
        <div className="mx-auto max-w-[1240px] rounded-xl bg-brand-panel px-6 py-16 text-brand-panel-foreground sm:px-12 sm:py-20 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              <h2 className="display-tight text-[clamp(2.4rem,5vw,4rem)] leading-[1]">{fr("Mettez votre facturation en règle aujourd'hui.")}</h2>
              <p className="mt-5 max-w-[32rem] text-[1.1875rem] leading-relaxed opacity-80">
                {fr("Créez votre espace en deux minutes, faites votre première facture au format légal et déposez celles que vous recevez.")}
              </p>
            </div>
            <div className="lg:justify-self-end">
              <a
                href={SIGNUP_URL}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-lg bg-brand-panel-foreground px-6 py-3 font-bold text-brand-panel transition-transform duration-150 active:scale-[0.97]"
                data-umami-event="home-final-trial"
              >
                Commencer gratuitement <ArrowRight size={18} aria-hidden="true" />
              </a>
              <p className="mt-4 text-[0.9375rem] opacity-75">{fr(TRIAL.short)}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
