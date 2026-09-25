/**
 * Page /auto-entrepreneurs : la facture électronique pour les micro-entrepreneurs.
 *
 * Source unique : lue par src/pages/AutoEntrepreneursPage.tsx (rendu) ET par le prérendu
 * (scripts/lib/marketing-pages.ts), qui écrit tout ce texte dans le HTML servi à Google.
 *
 * Faits vérifiés le 25/09/2026 sur les sources officielles listées dans `sources` :
 * fiche 1 d'impots.gouv.fr (mise à jour juin 2026) et page « Franchisé en base,
 * micro-entrepreneur ou auto-entrepreneur, suis-je concerné ? ». Les limites d'OdocPilot
 * suivent ../odoc-pulse/docs/dataroom/CE_QUE_NOUS_NE_REVENDIQUONS_PAS.md.
 * Aucun tiret cadratin, aucune promesse au-delà du produit.
 */
import { fr } from "../lib/typo";

export type AeFaq = { q: string; a: string };
export type AeCase = { title: string; text: string };
export type AeStep = { title: string; text: string };
export type AeLink = { to: string; label: string; text: string };

const f = fr;

export const AUTO_ENTREPRENEURS = {
  seoTitle: "Facture électronique auto-entrepreneur : le guide 2026-2027",
  seoDesc:
    "Micro-entrepreneur, même en franchise de TVA : recevoir des factures électroniques depuis le 1er septembre 2026, les émettre en 2027. Ce qui change, pas à pas.",

  eyebrow: "Auto-entrepreneurs et micro-entreprises",
  h1: f("Facture électronique : ce qui change pour les auto-entrepreneurs"),
  /** Le H1 est rendu en deux morceaux pour que « auto-entrepreneurs » ne se coupe pas au trait d'union. */
  h1Lead: f("Facture électronique : ce\u00A0qui change pour les "),
  h1Word: "auto-entrepreneurs",
  intro: f(
    "Oui, un auto-entrepreneur est concerné, même en franchise de TVA. Depuis le 1er septembre 2026, vous devez pouvoir recevoir des factures électroniques. Au plus tard le 1er septembre 2027, vous devrez émettre les vôtres au format électronique, par une plateforme agréée, dès que votre client est un professionnel.",
  ),
  updated: "Mis à jour le 25 septembre 2026",

  essentials: [
    { label: "Depuis le 1er septembre 2026", text: f("Recevoir des factures électroniques. Vos fournisseurs d'énergie, de téléphone ou de matériel peuvent déjà vous en envoyer.") },
    { label: "Le 1er septembre 2027", text: f("Émettre vos factures au format électronique pour vos clients professionnels, et transmettre certaines données à l'administration.") },
    { label: "Ce qui ne change pas", text: f("En franchise de TVA, vos factures gardent la mention « TVA non applicable, art. 293 B du CGI ».") },
  ],

  concerned: {
    h2: f("Êtes-vous concerné ?"),
    atomic: f(
      "Oui. La réforme s'applique à toutes les entreprises assujetties à la TVA, qu'elles la facturent ou non. Un micro-entrepreneur en franchise en base est un assujetti « non redevable » : il est donc concerné, comme une société.",
    ),
    cases: [
      {
        title: "Vous facturez des professionnels en France",
        text: f("Vos factures à des clients qui ont un SIREN devront être électroniques et passer par une plateforme agréée, au plus tard le 1er septembre 2027."),
      },
      {
        title: "Vous facturez des particuliers",
        text: f("Vos factures aux particuliers ne changent pas de forme. Certaines données de ces ventes pourront devoir être transmises à l'administration à partir de 2027 : c'est l'e-reporting. Le questionnaire officiel vous dit ce qu'il en est pour votre activité."),
      },
      {
        title: "Vous achetez à des entreprises",
        text: f("C'est déjà en place : depuis le 1er septembre 2026, les grandes entreprises émettent leurs factures en électronique. Il vous faut une plateforme agréée pour les recevoir."),
      },
      {
        title: "Votre activité est exonérée de TVA",
        text: f("Certaines activités, comme l'enseignement ou certains soins, relèvent de règles particulières. Vérifiez votre cas avec le questionnaire d'impots.gouv.fr."),
      },
    ] as AeCase[],
  },

  calendar: {
    h2: "Le calendrier",
    rows: [
      {
        date: "1er septembre 2026",
        text: f("Toutes les entreprises, micro-entrepreneurs compris, doivent pouvoir recevoir des factures électroniques. Les grandes entreprises et les entreprises de taille intermédiaire émettent déjà les leurs."),
      },
      {
        date: "1er septembre 2027",
        text: f("Les micro-entreprises, les TPE et les PME émettent à leur tour leurs factures au format électronique et transmettent leurs données de transaction à l'administration."),
      },
    ],
  },

  changes: {
    h2: "Ce qui change sur vos factures",
    atomic: f(
      "Une facture électronique n'est pas un PDF envoyé par email. C'est un fichier au format structuré (Factur-X, UBL ou CII), transmis par une plateforme agréée, qui porte de nouvelles mentions.",
    ),
    points: [
      f("Le format : un fichier que les logiciels savent lire. Le Factur-X est le plus simple pour un indépendant : c'est un PDF lisible qui contient aussi les données de la facture."),
      f("Le circuit : la facture part de votre plateforme agréée vers celle de votre client. Vous ne l'envoyez plus directement par email à un client professionnel."),
      f("Les nouvelles mentions : le SIREN de votre client, la catégorie de l'opération (livraison de biens, prestation de services, ou les deux) et, si elle diffère, l'adresse de livraison. L'option pour la TVA sur les débits ne vous concerne pas tant que vous êtes en franchise."),
      f("La mention « TVA non applicable, art. 293 B du CGI » reste obligatoire tant que vous bénéficiez de la franchise en base."),
    ],
    specimenLegend: [
      f("SIREN du client : nouvelle mention obligatoire."),
      f("Catégorie de l'opération : nouvelle mention (biens, services, ou les deux)."),
      f("Mention de franchise en base : elle reste."),
      f("Conditions de paiement, pénalités de retard et indemnité de 40 € : déjà obligatoires entre professionnels."),
      f("Format électronique structuré : le PDF contient aussi les données."),
    ],
  },

  steps: {
    h2: f("Se mettre en règle en quatre étapes"),
    items: [
      { title: "Vérifiez votre situation", text: f("Le questionnaire d'impots.gouv.fr ou notre diagnostic en trois minutes vous disent ce qui s'applique à vous, et à quelle date.") },
      { title: "Choisissez une plateforme agréée", text: f("Elle est nécessaire pour recevoir vos factures depuis septembre 2026 et pour émettre les vôtres en 2027. La liste officielle est publiée sur impots.gouv.fr. Plusieurs solutions proposent une offre gratuite aux petites entreprises : comparez avant de choisir.") },
      { title: "Complétez vos fiches clients", text: f("Notez le SIREN de chacun de vos clients professionnels et la nature de ce que vous leur facturez. C'est ce qui manque le plus souvent.") },
      { title: "Facturez au bon format", text: f("Créez dès maintenant vos factures au format Factur-X, avec les nouvelles mentions. Vous serez prêt avant l'échéance, sans tout changer au dernier moment.") },
    ] as AeStep[],
  },

  lessons: {
    h2: f("Ce qui fait rejeter une facture"),
    body: f(
      "Le 18 septembre 2026, nous avons déposé nos propres factures sur l'environnement de test d'une plateforme agréée. Il a fallu quatre dépôts pour qu'elles soient acceptées. Ce qui bloquait :",
    ),
    items: [
      f("l'adresse électronique de facturation du vendeur et celle de l'acheteur ;"),
      f("la quantité, l'unité et le prix unitaire de chaque ligne ;"),
      f("les mentions françaises obligatoires (pénalités de retard, indemnité de 40 €), attendues sous forme codée ;"),
      f("le mode de facturation : biens, services, ou les deux."),
    ],
    outro: f("Un PDF ordinaire ne passe pas ces contrôles. Une facture produite au format électronique, avec les bonnes données, si."),
  },

  pricing: {
    h2: f("Combien ça coûte ?"),
    atomic: f("Se préparer ne doit pas vous coûter cher. Avec OdocPilot, l'offre Conformité est gratuite, sans limite de durée et sans carte bancaire."),
    items: [
      f("Factures et devis au format Factur-X, sans limite"),
      f("Lecture automatique de 50 documents par mois"),
      f("Relances automatiques des impayés, désactivables facture par facture"),
      f("Recherche de documents et export comptable (FEC)"),
      f("1 utilisateur"),
    ],
    note: f(
      "OdocPilot n'est pas une plateforme agréée. L'envoi officiel de vos factures passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert. Nous l'indiquerons sur cette page dès qu'il le sera.",
    ),
  },

  faqTitle: "Questions fréquentes des auto-entrepreneurs",
  faqs: [
    {
      q: f("Je suis en franchise en base de TVA : suis-je concerné ?"),
      a: f("Oui. En franchise, vous êtes assujetti à la TVA sans la facturer : la réforme s'applique à vous. Vous devez pouvoir recevoir des factures électroniques depuis le 1er septembre 2026 et devrez émettre les vôtres au 1er septembre 2027 pour vos clients professionnels."),
    },
    {
      q: f("Je ne facture que des particuliers : que dois-je faire ?"),
      a: f("Vos factures aux particuliers ne deviennent pas électroniques. Vous devez tout de même pouvoir recevoir les factures électroniques de vos fournisseurs, et certaines données de vos ventes pourront devoir être transmises à l'administration à partir de 2027. Le questionnaire officiel d'impots.gouv.fr précise votre cas."),
    },
    {
      q: f("La mention « TVA non applicable, art. 293 B du CGI » disparaît-elle ?"),
      a: f("Non. Tant que vous êtes en franchise en base, vos factures électroniques continuent de porter cette mention. C'est l'exemple donné par l'administration fiscale elle-même."),
    },
    {
      q: f("Un PDF envoyé par email suffit-il encore ?"),
      a: f("Pour vos clients professionnels en France, plus à partir du 1er septembre 2027 : la facture devra être au format structuré et passer par une plateforme agréée. Un PDF ordinaire, un scan ou un document envoyé par email ne sera plus conforme."),
    },
    {
      q: f("Dois-je acheter un logiciel ?"),
      a: f("Pas forcément. Les plateformes agréées proposent différentes façons de créer une facture, et plusieurs solutions ont une offre gratuite pour les petites entreprises. Avec OdocPilot, créer vos factures au format Factur-X est gratuit, sans limite de durée."),
    },
    {
      q: f("Comment recevoir les factures électroniques de mes fournisseurs ?"),
      a: f("En choisissant une plateforme agréée : elle reçoit pour vous les factures de vos fournisseurs et les met à votre disposition. La liste des plateformes agréées est publiée et mise à jour sur impots.gouv.fr."),
    },
    {
      q: f("OdocPilot est-il une plateforme agréée ?"),
      a: f("Non. OdocPilot crée vos factures au format Factur-X et lit celles que vous recevez. L'envoi officiel passera par une plateforme agréée partenaire ; ce raccordement n'est pas encore ouvert."),
    },
  ] as AeFaq[],

  related: [
    { to: "/generateur-factur-x", label: "Générateur de facture Factur-X", text: f("Une facture au format électronique, gratuitement et sans créer de compte.") },
    { to: "/diagnostic", label: "Diagnostic en trois minutes", text: f("Vos obligations et vos dates, noir sur blanc.") },
    { to: "/e-facture", label: "Le guide complet de la facture électronique", text: f("Calendrier, formats, plateformes agréées, mentions obligatoires.") },
    { to: "/guide/plateforme-agreee", label: "Choisir une plateforme agréée", text: f("Ce qu'elle fait, ce qu'elle coûte, comment comparer.") },
  ] as AeLink[],

  sources: [
    {
      label: "Fiche « Que va-t-il se passer pour mon entreprise en matière de facturation ? » (impots.gouv.fr, juin 2026)",
      href: "https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/fiche-1_que-va-t-il-se-passer-pour-mon-entreprise.pdf",
    },
    {
      label: "Franchisé en base, micro-entrepreneur ou auto-entrepreneur : suis-je concerné ? (impots.gouv.fr)",
      href: "https://www.impots.gouv.fr/professionnel/questions/franchise-en-base-micro-entrepreneur-ou-auto-entrepreneur-suis-je-concerne",
    },
    {
      label: "Questionnaire : ce que la réforme change pour moi (impots.gouv.fr)",
      href: "https://www.impots.gouv.fr/facturation-electronique-qu-est-ce-que-ca-change-pour-moi",
    },
    {
      label: "Liste des plateformes agréées (impots.gouv.fr)",
      href: "https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees",
    },
  ],

  cta: {
    h2: f("Vos factures au bon format, dès aujourd'hui."),
    text: f("Créez gratuitement vos factures Factur-X avec les nouvelles mentions. Sans carte bancaire, sans limite de durée."),
    button: "Commencer gratuitement",
    secondary: f("Faire le diagnostic (3 min)"),
  },
};

/** FAQPage : textes identiques à ceux affichés (règle de la bible SEO, section 8.5). */
export function autoEntrepreneursJsonLd(): Record<string, unknown> {
  const AE = AUTO_ENTREPRENEURS;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: AE.faqs.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://odocpilot.com/" },
          { "@type": "ListItem", position: 2, name: "Facture électronique", item: "https://odocpilot.com/e-facture" },
          { "@type": "ListItem", position: 3, name: "Auto-entrepreneurs", item: "https://odocpilot.com/auto-entrepreneurs" },
        ],
      },
    ],
  };
}
