import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Circle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { ReceivedInvoices } from "@/components/home/ProductVisuals";
import { PLANS, SIGNUP_URL, TRIAL, formatEur } from "@/lib/marketing";
import { fr } from "@/lib/typo";

/**
 * Page pilier « facture électronique » (/e-facture).
 * État des faits au 24 septembre 2026, sourcé sur impots.gouv.fr (page officielle,
 * FAQ « Tout savoir sur la facturation électronique » et guide pratique de démarrage
 * de la DGFiP, juillet 2026). Aucun montant d'amende n'est cité : les pages officielles
 * n'en donnent pas, elles renvoient au code général des impôts.
 */

const BASE = "https://odocpilot.com";
const UPDATED = "24 septembre 2026";
const UPDATED_ISO = "2026-09-24";

const SRC = {
  page: "https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique",
  faq: "https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/faq_tout_savoir_facturation-electronique.pdf",
  guide: "https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/guide_pratique_facturation_electronique.pdf",
  liste: "https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees",
  questionnaire: "https://www.impots.gouv.fr/facturation-electronique-qu-est-ce-que-ca-change-pour-moi",
};

const H1 = "font-display display-tight text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.02]";
const H2 = "font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]";
const H3 = "font-display text-xl font-bold";

// Lus tels quels par le prérendu (scripts/lib/page-source.ts) : pas d'appel de fonction,
// espaces insécables écrites en toutes lettres (U+00A0 avant « : », U+202F avant « ? »).
const SEO_TITLE = "Facture électronique obligatoire 2026-2027 : le guide";
const SEO_DESC =
  "Réception obligatoire depuis le 1er septembre 2026, émission et e-reporting en 2027 : qui est concerné, formats, plateformes agréées, mentions.";
const H1_TEXT = "Facture électronique obligatoire : ce que vous devez faire, et quand";
const LEDE =
  "Depuis le 1er septembre 2026, toute entreprise assujettie à la TVA, auto-entrepreneurs compris, doit pouvoir recevoir des factures électroniques par une plateforme agréée. Le 1er septembre 2027, les PME, TPE et micro-entreprises devront aussi les émettre et transmettre certaines données à l'administration.";

const SECTIONS = [
  { id: "qui-est-concerne", title: "Qui est concerné" },
  { id: "calendrier", title: "Le calendrier" },
  { id: "ce-qui-change", title: "Ce qui change concrètement" },
  { id: "formats", title: "Les formats" },
  { id: "plateformes-agreees", title: "Les plateformes agréées" },
  { id: "mentions", title: "Les nouvelles mentions" },
  { id: "odocpilot", title: "Ce que fait OdocPilot" },
  { id: "questions", title: "Questions fréquentes" },
  { id: "sources", title: "Sources officielles" },
];

const CHANGES = [
  {
    t: "Pour recevoir vos factures, il vous faut une plateforme agréée.",
    d: "Vous pouvez la choisir directement, ou passer par votre logiciel, votre banque ou votre expert-comptable s'ils en proposent une. Sans plateforme, votre entreprise n'apparaît pas dans l'annuaire des destinataires : vos fournisseurs ne peuvent pas vous adresser de facture électronique.",
  },
  {
    t: "Les factures passent de plateforme à plateforme, avec un statut.",
    d: "Déposée, rejetée, refusée, encaissée : vous savez où en est chaque facture. Un rejet vient d'une plateforme (format, donnée manquante) ; un refus vient du client.",
  },
  {
    t: "L'administration reçoit des données, pas vos factures.",
    d: "Les factures ne sont pas centralisées par l'administration fiscale. Seules les données prévues par la loi lui sont transmises, par votre plateforme.",
  },
  {
    t: "Les règles de TVA ne changent pas.",
    d: "La réforme change la façon de transmettre les factures. Taux, exigibilité et droit à déduction restent les mêmes.",
  },
  {
    t: "Pendant le démarrage, une facture reçue en PDF ou sur papier reste utilisable.",
    d: "Si elle correspond à une opération réelle et porte les mentions nécessaires, vous pouvez la traiter, la payer et déduire la TVA. Le circuit électronique reste la cible.",
  },
];

const FORMATS = [
  { name: "Factur-X", what: "Un PDF lisible qui contient les données de la facture dans un fichier XML (CII).", who: "Le plus simple pour une TPE : la facture se lit comme un PDF." },
  { name: "UBL", what: "Un fichier XML seul, normalisé par l'organisation OASIS.", who: "Courant à l'international et dans les grands groupes." },
  { name: "CII", what: "Un fichier XML seul, normalisé par les Nations unies (UN/CEFACT).", who: "Le même langage que la partie XML d'un Factur-X." },
];

const MENTIONS = [
  "Le SIREN du client.",
  "La catégorie de l'opération : livraison de biens, prestation de services, ou les deux.",
  "L'option pour le paiement de la TVA d'après les débits, si vous l'avez choisie.",
  "L'adresse de livraison du bien, si elle diffère de l'adresse du client.",
];

const DONE = [
  "Vos factures sortent au format Factur-X, profil EN 16931. Le 18 septembre 2026, notre chaîne complète a été validée sur l'environnement de test d'une plateforme agréée.",
  "Les factures que vous recevez sont lues pour vous : fournisseur, numéro, dates, montants, TVA. Vous vérifiez la fiche, vous validez.",
  "Vos documents sont classés, et vous les retrouvez en écrivant une phrase en français courant.",
  "Vos relances de paiement partent automatiquement : 7 jours et 3 jours avant l'échéance, puis en cas de retard. Vous pouvez les couper facture par facture.",
  "Votre expert-comptable reçoit un export comptable au format FEC.",
];

const NOT_YET = [
  "OdocPilot n'est pas une plateforme agréée. L'envoi et la réception officiels de vos factures passeront par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert.",
  "OdocPilot ne transmet pas encore vos données d'e-reporting à l'administration.",
];

const FAQ = [
  {
    q: "La facture électronique est-elle obligatoire pour les auto-entrepreneurs ?",
    a: "Oui. Les micro-entrepreneurs sont concernés comme toutes les entreprises assujetties à la TVA, même en franchise en base. Ils doivent pouvoir recevoir des factures électroniques depuis le 1er septembre 2026, et devront les émettre à partir du 1er septembre 2027.",
  },
  {
    q: "Une facture en PDF envoyée par e-mail est-elle une facture électronique ?",
    a: "Non. Pour l'administration, une facture électronique est émise, transmise et reçue dans un format structuré (Factur-X, UBL ou CII), par une plateforme agréée. Un PDF envoyé par e-mail n'en est pas une, même s'il a été créé par un logiciel.",
  },
  {
    q: "Dois-je choisir une plateforme agréée dès maintenant ?",
    a: "Oui, pour recevoir vos factures : c'est obligatoire depuis le 1er septembre 2026. Vous pouvez passer par votre logiciel, votre banque ou votre expert-comptable s'ils en proposent une, ou choisir dans la liste officielle publiée sur impots.gouv.fr.",
  },
  {
    q: "Puis-je continuer à envoyer mes factures en PDF jusqu'en 2027 ?",
    a: "Oui, si vous êtes une PME, une TPE ou une micro-entreprise : votre obligation d'émettre en électronique commence le 1er septembre 2027. D'ici là, un client ne peut pas vous l'imposer au titre de la loi. Vous pouvez aussi passer à l'électronique plus tôt, par une plateforme agréée.",
  },
  {
    q: "Quelles sanctions en cas de retard ?",
    a: "Les textes prévoient des amendes (articles 1737 et 1788 D du code général des impôts). Pour la réception, une mise en demeure de trois mois précède toute amende. Pendant la phase de démarrage, l'administration annonce qu'elle ne sanctionnera pas les entreprises engagées dans une démarche sérieuse de mise en conformité.",
  },
  {
    q: "OdocPilot est-il une plateforme agréée ?",
    a: "Non. OdocPilot crée vos factures au format Factur-X et lit celles que vous recevez. L'envoi officiel passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert. Pour la réception obligatoire, choisissez dès maintenant une plateforme agréée.",
  },
];

const SOURCES = [
  { href: SRC.page, label: "Je passe à la facturation électronique", note: "impots.gouv.fr, page officielle" },
  { href: SRC.faq, label: "Tout savoir sur la facturation électronique", note: "DGFiP, FAQ en PDF" },
  { href: SRC.guide, label: "Guide pratique de démarrage au 1er septembre 2026", note: "DGFiP, juillet 2026, PDF" },
  { href: SRC.liste, label: "Liste des plateformes agréées", note: "impots.gouv.fr, mise à jour le 22 septembre 2026" },
];

const READ_NEXT = [
  { to: "/guide/facturation-electronique-2026", label: "Facturation électronique 2026 : le guide complet" },
  { to: "/guide/obligations-2026-2027", label: "Calendrier 2026-2027 et sanctions" },
  { to: "/guide/plateforme-agreee", label: "Plateforme agréée : rôle et comment choisir" },
  { to: "/guide/factur-x", label: "Factur-X expliqué simplement" },
  { to: "/guide/tpe-sans-comptable", label: "TPE sans expert-comptable : par où commencer" },
  { to: "/lexique", label: "Le lexique de la facture électronique" },
  { to: "/livre-blanc", label: "Le livre blanc, à lire ou à imprimer" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${BASE}/e-facture#article`,
      headline: H1_TEXT,
      description: SEO_DESC,
      inLanguage: "fr-FR",
      dateModified: UPDATED_ISO,
      author: { "@type": "Organization", name: "OdocPilot", url: BASE },
      publisher: {
        "@type": "Organization",
        name: "OdocPilot",
        url: BASE,
        logo: { "@type": "ImageObject", url: `${BASE}/logo.svg` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/e-facture` },
      image: `${BASE}/og-image.png`,
      isBasedOn: [SRC.page, SRC.faq, SRC.guide],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: fr(f.q),
        acceptedAnswer: { "@type": "Answer", text: fr(f.a) },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
        { "@type": "ListItem", position: 2, name: "Facture électronique", item: `${BASE}/e-facture` },
      ],
    },
  ],
};

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Le calendrier officiel, posé comme une note imprimée sur le bureau. */
function CalendarSheet() {
  const rows = [
    {
      date: "1er septembre 2026",
      state: "past" as const,
      lines: ["Recevoir : obligatoire pour toutes les entreprises.", "Émettre : grandes entreprises et ETI."],
    },
    { date: `${UPDATED}`, state: "today" as const, lines: ["Aujourd'hui."] },
    {
      date: "1er septembre 2027",
      state: "next" as const,
      lines: ["Émettre et transmettre vos données (e-reporting) : PME, TPE et micro-entreprises."],
    },
  ];
  return (
    <figure className="rounded-[3px] bg-sheet p-6 text-sheet-ink shadow-lift sm:p-8">
      <figcaption className="flex items-baseline justify-between gap-4 border-b border-sheet-rule pb-3">
        <span className="font-display text-[1.0625rem] font-bold">Le calendrier officiel</span>
        <span className="text-[0.75rem] text-sheet-soft">Source : impots.gouv.fr</span>
      </figcaption>
      <ol className="relative mt-5 space-y-6 pl-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-[hsl(var(--sheet-rule))]">
        {rows.map((r) => (
          <li key={r.date} className="relative">
            <span
              aria-hidden="true"
              className={
                r.state === "today"
                  ? "absolute -left-[29px] top-[0.4rem] h-[9px] w-[9px] rounded-full bg-[hsl(var(--sheet-ink))] ring-4 ring-[hsl(var(--sheet))]"
                  : `absolute -left-8 top-[0.2rem] h-[15px] w-[15px] rounded-full border-2 border-[hsl(var(--sheet-ink))] ${
                      r.state === "past" ? "bg-[hsl(var(--sheet-ink))]" : "bg-[hsl(var(--sheet))]"
                    }`
              }
            />
            <p className={`font-data font-semibold ${r.state === "today" ? "text-[0.8125rem] text-sheet-soft" : "text-[0.9375rem]"}`}>
              {r.date}
            </p>
            {r.lines.map((l) => (
              <p key={l} className={`mt-1 leading-snug ${r.state === "today" ? "text-[0.8125rem] text-sheet-soft" : "text-[0.9375rem]"}`}>
                {fr(l)}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Spécimen : où se placent les quatre nouvelles mentions sur une facture (fictive). */
function MentionsSpecimen() {
  const n = (i: number) => (
    <span
      aria-hidden="true"
      className="ml-2 inline-grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full bg-[hsl(var(--sheet-ink))] align-middle font-data text-[0.625rem] font-bold text-[hsl(var(--sheet))]"
    >
      {i}
    </span>
  );
  return (
    <figure className="rounded-[3px] bg-sheet p-5 text-sheet-ink shadow-sheet sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-sheet-rule pb-3">
        <div>
          <p className="font-display text-[1rem] font-bold leading-tight">Atelier Beaulieu</p>
          <p className="mt-0.5 font-data text-[0.6875rem] text-sheet-soft">SIREN 901 234 568</p>
        </div>
        <p className="font-data text-[0.75rem]">Facture F-2026-0158</p>
      </div>
      <dl className="mt-3 space-y-2.5 text-[0.8125rem] leading-snug">
        <div>
          <dt className="text-sheet-soft">Facturé à</dt>
          <dd className="font-bold">
            Garnier Rénovation, <span className="font-data font-normal">SIREN 812 345 671</span>
            {n(1)}
          </dd>
        </div>
        <div>
          <dt className="text-sheet-soft">{fr("Catégorie de l'opération")}</dt>
          <dd>
            Prestation de services
            {n(2)}
          </dd>
        </div>
        <div>
          <dt className="text-sheet-soft">TVA</dt>
          <dd>
            {fr("Option pour le paiement de la TVA d'après les débits")}
            {n(3)}
          </dd>
        </div>
        <div>
          <dt className="text-sheet-soft">Livraison</dt>
          <dd>
            12 rue des Lilas, 94100 Saint-Maur-des-Fossés
            {n(4)}
          </dd>
        </div>
      </dl>
      <figcaption className="mt-4 border-t border-sheet-rule pt-3 text-[0.75rem] text-sheet-soft">
        Exemple. Entreprises et numéros fictifs.
      </figcaption>
    </figure>
  );
}

export default function EFacturePage() {
  const paid = PLANS.filter((p) => p.monthly > 0);
  const from = formatEur(Math.min(...paid.map((p) => p.monthly)));
  const to = formatEur(Math.max(...paid.map((p) => p.monthly)));

  return (
    <div className="overflow-x-clip">
      <SEOHead title={SEO_TITLE} description={SEO_DESC} canonical="/e-facture" ogType="article" jsonLd={jsonLd} />

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
              <li aria-current="page" className="text-foreground">
                Facture électronique
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
            <div>
              <p className="font-data text-[0.8125rem] text-muted-foreground">Mis à jour le {UPDATED}</p>
              <h1 className={`mt-4 ${H1}`}>{H1_TEXT}</h1>
              <p className="mt-6 max-w-[40rem] text-[1.1875rem] leading-relaxed text-muted-foreground">{LEDE}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link to="/diagnostic" className="btn-ink" data-umami-event="cta-efacture-diagnostic-hero">
                  Faire le diagnostic (3 min) <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  to="/generateur-factur-x"
                  className="inline-flex min-h-12 items-center gap-2 font-bold link-underline"
                  data-umami-event="cta-efacture-generateur-hero"
                >
                  Créer une facture Factur-X, gratuitement
                </Link>
              </div>
            </div>
            <CalendarSheet />
          </div>
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
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 max-w-3xl pb-20 sm:pb-28">
            {/* Qui est concerné */}
            <section id="qui-est-concerne" className="scroll-mt-24 pt-14 lg:pt-20">
              <h2 className={H2}>{fr("Qui est concerné par la facture électronique obligatoire ?")}</h2>
              <p className="mt-6 border-l-2 border-foreground pl-5 text-[1.125rem] leading-relaxed">
                {fr(
                  "Toutes les entreprises établies en France et assujetties à la TVA, quelle que soit leur taille ou leur chiffre d'affaires : sociétés, entreprises individuelles, professions libérales, micro-entrepreneurs. Depuis le 1er septembre 2026, toutes doivent pouvoir recevoir des factures électroniques.",
                )}
              </p>

              <h3 id="auto-entrepreneurs" className={`mt-10 scroll-mt-24 ${H3}`}>Les auto-entrepreneurs aussi</h3>
              <p className="mt-3 leading-relaxed">
                {fr(
                  "Un micro-entrepreneur est concerné, même en franchise en base de TVA (la mention « TVA non applicable, art. 293 B du CGI »). Il doit pouvoir recevoir des factures électroniques depuis le 1er septembre 2026, et devra les émettre à partir du 1er septembre 2027.",
                )}
              </p>

              <h3 className={`mt-8 ${H3}`}>Vos clients particuliers ne sont pas concernés</h3>
              <p className="mt-3 leading-relaxed">
                {fr(
                  "La facture électronique vise les échanges entre entreprises. Les factures destinées aux particuliers ne changent pas de forme. En revanche, les données de ces ventes seront transmises à l'administration (c'est l'e-reporting) : à partir du 1er septembre 2027 pour les PME, TPE et micro-entreprises.",
                )}
              </p>

              <h3 className={`mt-8 ${H3}`}>{fr("Activité exonérée de TVA : vérifiez votre cas")}</h3>
              <p className="mt-3 leading-relaxed">
                {fr(
                  "Si toute votre activité est exonérée de TVA (certains soins ou l'enseignement, par exemple), vos obligations peuvent être différentes. Le ",
                )}
                <External href={SRC.questionnaire}>questionnaire officiel</External>
                {fr(" d'impots.gouv.fr vous indique votre situation en quatre questions.")}
              </p>
            </section>

            {/* Calendrier */}
            <section id="calendrier" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>Le calendrier de la facturation électronique 2026-2027</h2>
              <p className="mt-6 border-l-2 border-foreground pl-5 text-[1.125rem] leading-relaxed">
                {fr(
                  "Depuis le 1er septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques, et les grandes entreprises et les ETI les émettent. Au plus tard le 1er septembre 2027, les PME, TPE et micro-entreprises émettront à leur tour et transmettront leurs données de transaction et de paiement.",
                )}
              </p>

              <ol className="mt-8 border-t border-foreground/80">
                {[
                  ["1er septembre 2026", "Toutes les entreprises", "Recevoir les factures électroniques, par une plateforme agréée."],
                  ["1er septembre 2026", "Grandes entreprises et ETI", "Émettre leurs factures en électronique et transmettre leurs données (e-reporting)."],
                  ["1er septembre 2027", "PME, TPE et micro-entreprises", "Émettre leurs factures en électronique et transmettre leurs données (e-reporting)."],
                ].map(([date, who, what]) => (
                  <li key={`${date}-${who}`} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                    <p className="font-data text-[0.9375rem] font-semibold">{date}</p>
                    <div>
                      <p className="font-bold">{who}</p>
                      <p className="mt-1 leading-relaxed text-muted-foreground">{fr(what)}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <h3 className={`mt-10 ${H3}`}>{fr("Jusqu'en 2027, vous pouvez émettre comme aujourd'hui")}</h3>
              <p className="mt-3 leading-relaxed">
                {fr(
                  "Une PME, une TPE ou une micro-entreprise peut continuer à émettre ses factures comme avant jusqu'au 1er septembre 2027, avec les mentions habituelles. Un client ne peut pas lui imposer l'émission électronique avant cette date au titre de la loi. Elle peut aussi passer à l'électronique plus tôt, de façon volontaire, par une plateforme agréée.",
                )}
              </p>

              <h3 className={`mt-8 ${H3}`}>{fr("Des sanctions dès 2026 ?")}</h3>
              <p className="mt-3 leading-relaxed">
                {fr(
                  "Pas de manière automatique. Pendant la phase de démarrage, l'administration n'appliquera pas de sanction aux entreprises qui rencontrent des difficultés mais sont engagées dans une démarche sérieuse de mise en conformité. Les textes prévoient bien des amendes : par facture non émise en électronique (article 1737 du code général des impôts) et pour les données non transmises (article 1788 D). Pour la réception, une mise en demeure de trois mois précède toute amende.",
                )}
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {fr("Gardez la trace de vos démarches : choix d'une plateforme, échanges avec votre logiciel ou votre expert-comptable. Source : ")}
                <External href={SRC.guide}>guide pratique de la DGFiP</External>.
              </p>
            </section>

            {/* Ce qui change */}
            <section id="ce-qui-change" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>Ce qui change concrètement pour votre entreprise</h2>
              <ol className="mt-8 border-t border-foreground/80">
                {CHANGES.map((c, i) => (
                  <li key={c.t} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-border py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
                    <span className="font-data text-[0.9375rem] font-semibold text-muted-foreground">{i + 1}.</span>
                    <div>
                      <p className="font-bold leading-snug">{fr(c.t)}</p>
                      <p className="mt-2 leading-relaxed text-muted-foreground">{fr(c.d)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Formats */}
            <section id="formats" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>Les formats de facture électronique : Factur-X, UBL, CII</h2>
              <p className="mt-6 border-l-2 border-foreground pl-5 text-[1.125rem] leading-relaxed">
                {fr(
                  "Une facture électronique n'est pas un PDF envoyé par e-mail. C'est un fichier structuré, que les logiciels lisent sans ressaisie. Trois formats sont admis : Factur-X, UBL et CII. Tous suivent la norme européenne EN 16931.",
                )}
              </p>
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left">
                  <caption className="sr-only">Les trois formats admis</caption>
                  <thead>
                    <tr className="ledger-head">
                      <th scope="col" className="w-[7rem] pb-3 pr-4 font-display text-[1rem] font-bold">Format</th>
                      <th scope="col" className="pb-3 pr-4 font-display text-[1rem] font-bold">{fr("Ce que c'est")}</th>
                      <th scope="col" className="pb-3 font-display text-[1rem] font-bold">Bon à savoir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORMATS.map((f) => (
                      <tr key={f.name} className="border-b border-border align-top">
                        <th scope="row" className="py-4 pr-4 font-data text-[0.9375rem] font-semibold">{f.name}</th>
                        <td className="py-4 pr-4 text-[0.9375rem] leading-relaxed">{fr(f.what)}</td>
                        <td className="py-4 text-[0.9375rem] leading-relaxed text-muted-foreground">{fr(f.who)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6 leading-relaxed">
                {fr("Pour aller plus loin : ")}
                <Link to="/guide/factur-x" className="link-underline">Factur-X expliqué simplement</Link>
                {fr(". Pour contrôler une facture existante : le ")}
                <Link to="/verificateur" className="link-underline">vérificateur gratuit</Link>.
              </p>
            </section>

            {/* Plateformes agréées */}
            <section id="plateformes-agreees" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>Les plateformes agréées (PA, ex-PDP)</h2>
              <p className="mt-6 border-l-2 border-foreground pl-5 text-[1.125rem] leading-relaxed">
                {fr(
                  "Une plateforme agréée est un opérateur immatriculé par l'administration fiscale. Elle émet, transmet et reçoit les factures électroniques, contrôle leurs données, et transmet à l'administration les données prévues par la loi. On disait autrefois « PDP ».",
                )}
              </p>

              <div className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8">
                <p className="font-data text-[3rem] font-semibold leading-none">150</p>
                <p className="leading-relaxed text-muted-foreground">
                  {fr(
                    "plateformes agréées au 1er août 2026, dont plus d'une dizaine proposaient une offre gratuite ou sans surcoût pour les besoins essentiels des petites entreprises. Source : ",
                  )}
                  <External href={SRC.faq}>FAQ de la DGFiP</External>.
                </p>
              </div>

              <p className="mt-6 leading-relaxed">
                {fr(
                  "Il n'existe pas de plateforme publique gratuite pour échanger les factures. L'État tient l'annuaire des destinataires, qui indique la plateforme de réception de chaque entreprise, et reçoit les données fiscales. Les factures, elles, passent par les plateformes agréées.",
                )}
              </p>

              <h3 className={`mt-10 ${H3}`}>Comment choisir la vôtre</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed marker:text-muted-foreground">
                <li>{fr("Regardez d'abord ce que vous avez déjà : votre logiciel de facturation, votre banque ou votre expert-comptable proposent peut-être une plateforme agréée.")}</li>
                <li>{fr("Vérifiez qu'elle figure sur la liste officielle, et qu'elle gère la réception comme l'émission.")}</li>
                <li>{fr("Comparez le tarif à votre volume de factures. Vous pourrez changer de plateforme si vos besoins évoluent.")}</li>
              </ul>
              <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <a
                  href={SRC.liste}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold link-underline"
                >
                  La liste officielle des plateformes agréées <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </a>
                <Link to="/guide/plateforme-agreee" className="inline-flex items-center gap-1.5 link-underline">
                  Le guide de la plateforme agréée <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </p>
            </section>

            {/* Mentions */}
            <section id="mentions" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>Les nouvelles mentions obligatoires sur vos factures</h2>
              <p className="mt-6 border-l-2 border-foreground pl-5 text-[1.125rem] leading-relaxed">
                {fr(
                  "Une facture électronique porte 34 données obligatoires, transmises en format structuré. Quatre d'entre elles sont nouvelles et servent à acheminer la facture au bon destinataire.",
                )}
              </p>
              <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
                <ol className="space-y-4">
                  {MENTIONS.map((m, i) => (
                    <li key={m} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 leading-relaxed">
                      <span className="font-data font-semibold">{i + 1}.</span>
                      <span>{fr(m)}</span>
                    </li>
                  ))}
                </ol>
                <div className="rounded-lg bg-desk p-4 sm:p-6">
                  <MentionsSpecimen />
                </div>
              </div>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {fr(
                  "Le plus simple est de les ajouter dès maintenant à vos factures. Les autres mentions ne changent pas : numéro, date, identité et SIREN des parties, désignation, quantités, prix, TVA, conditions de paiement, pénalités de retard et indemnité forfaitaire de 40 € pour les professionnels.",
                )}
              </p>
            </section>

            {/* OdocPilot */}
            <section id="odocpilot" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>{fr("Ce que fait OdocPilot, et ce qu'il ne fait pas encore")}</h2>
              <p className="mt-6 text-[1.125rem] leading-relaxed text-muted-foreground">
                {fr("OdocPilot aide les TPE, les PME, les indépendants et les auto-entrepreneurs à mettre leur facturation en règle. Voici l'état exact au ")}
                {UPDATED}.
              </p>

              <h3 className={`mt-10 ${H3}`}>{fr("Aujourd'hui")}</h3>
              <ul className="mt-4 space-y-4">
                {DONE.map((d) => (
                  <li key={d} className="flex gap-4">
                    <Check size={20} strokeWidth={2.5} className="mt-1 shrink-0 text-petrole" aria-hidden="true" />
                    <p className="leading-relaxed">{fr(d)}</p>
                  </li>
                ))}
              </ul>

              <h3 className={`mt-10 ${H3}`}>Pas encore</h3>
              <ul className="mt-4 space-y-4">
                {NOT_YET.map((d) => (
                  <li key={d} className="flex gap-4">
                    <Circle size={20} strokeWidth={2} className="mt-1 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <p className="leading-relaxed text-muted-foreground">{fr(d)}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed">
                {fr("Pour la réception obligatoire depuis le 1er septembre 2026, choisissez donc dès maintenant une plateforme agréée dans la ")}
                <External href={SRC.liste}>liste officielle</External>.
              </p>

              <div className="mt-10 grid gap-8 rounded-lg bg-desk px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
                <div>
                  <p className="leading-relaxed">
                    {fr("Vos documents sont stockés en France, chez OVHcloud. L'IA est celle de Mistral AI, entreprise française : aucun autre fournisseur d'IA n'est appelé.")}
                  </p>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {fr(`Palier Conformité gratuit, puis de ${from} à ${to} par mois. ${TRIAL.short}.`)}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a href={SIGNUP_URL} className="btn-ink" data-umami-event="cta-efacture-signup">
                      Commencer gratuitement
                    </a>
                    <Link to="/pricing" className="inline-flex items-center gap-1.5 link-underline">
                      Voir les tarifs <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <figure>
                  <ReceivedInvoices />
                  <figcaption className="mt-3 text-[0.8125rem] text-muted-foreground">
                    {fr("L'écran « Factures reçues », redessiné avec des données fictives.")}
                  </figcaption>
                </figure>
              </div>
            </section>

            {/* FAQ */}
            <section id="questions" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>Questions fréquentes sur la facture électronique</h2>
              <div className="mt-8 border-t border-foreground/80">
                {FAQ.map((f) => (
                  <div key={f.q} className="border-b border-border py-6">
                    <h3 className="font-display text-[1.1875rem] font-bold leading-snug">{fr(f.q)}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{fr(f.a)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sources */}
            <section id="sources" className="scroll-mt-24 pt-16 sm:pt-20">
              <h2 className={H2}>Sources officielles</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {fr(`Les faits de cette page viennent de l'administration fiscale. Ils ont été vérifiés le ${UPDATED}.`)}
              </p>
              <ul className="mt-6 border-t border-border">
                {SOURCES.map((s) => (
                  <li key={s.href} className="border-b border-border">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="font-bold link-underline">{fr(s.label)}</span>
                        <span className="mt-0.5 block text-[0.875rem] text-muted-foreground">{fr(s.note)}</span>
                      </span>
                      <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" className="mt-1 shrink-0 text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ul>

              <h3 className={`mt-12 ${H3}`}>À lire ensuite</h3>
              <ul className="mt-4 border-t border-border">
                {READ_NEXT.map((r) => (
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
            <h2 className={H2}>Savoir ce qui vous concerne, en 3 minutes.</h2>
            <p className="mt-5 max-w-[34rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
              {fr("Trois questions, et vous repartez avec vos dates et une feuille de route. Gratuit, sans inscription.")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:justify-self-end">
            <Link to="/diagnostic" className="btn-ink" data-umami-event="cta-efacture-diagnostic-final">
              Faire le diagnostic <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/generateur-factur-x" className="link-underline" data-umami-event="cta-efacture-generateur-final">
              Créer une facture Factur-X gratuite
            </Link>
            <Link to="/verificateur" className="link-underline" data-umami-event="cta-efacture-verificateur-final">
              {fr("Vérifier une facture que j'ai déjà")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
