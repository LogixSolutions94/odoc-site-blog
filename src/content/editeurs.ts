/**
 * Page /editeurs : offre « test de conformité » pour éditeurs de logiciels et intégrateurs.
 *
 * TEXTE VALIDÉ (D5, 24/09/2026), intégré MOT POUR MOT : ne pas reformuler sans validation.
 * Seules adaptations typographiques : espace insécable devant le « ? » du H1 et dans les
 * montants affichés, pour éviter une coupure de ligne. Les champs SEO restent exacts.
 *
 * Source unique : lue par src/pages/EditeursPage.tsx (rendu) ET par le prérendu
 * (scripts/lib/marketing-pages.ts) : le HTML brut et la page affichent le même texte.
 */
export type EditeursRule = { codes: string; text: string };
export type EditeursPlan = { name: string; price: string; items: string[] };
export type EditeursFaq = { q: string; a: string };

const NBSP = " ";

export const EDITEURS = {
  seoTitle: "Test de conformité Factur-X pour éditeurs — OdocPilot",
  seoDesc:
    "Vos factures Factur-X, UBL ou CII passeront-elles la plateforme agréée ? Dépôt réel en bac à sable, rapport règle par règle. Dès 490 €.",

  eyebrow: "Éditeurs de logiciels et intégrateurs",
  h1: `Vos factures passeront-elles la plateforme agréée${NBSP}?`,
  intro:
    "Nous déposons vos factures sur l'environnement de test d'une plateforme agréée et vous rendons, règle par règle, ce qui bloque et comment le corriger.",
  cta: "Demander un test",
  ctaEmailLead: "ou écrivez à",
  email: "hello@odocpilot.com",

  why: {
    h2: "Pourquoi maintenant",
    body:
      "Depuis le 1er septembre 2026, les grandes entreprises et les ETI émettent leurs factures par une plateforme agréée. Au 1er septembre 2027, ce sera le cas de toutes les entreprises. Une facture refusée par la plateforme ne part pas : c'est votre client qui appelle votre support.",
  },

  learned: {
    h2: "Ce que nous avons appris en déposant nos propres factures",
    body:
      "Le 18 septembre 2026, nous avons soumis une facture produite par OdocPilot à la validation officielle d'une plateforme agréée (bac à sable SuperPDP). Notre propre validateur la jugeait conforme. La plateforme a relevé neuf règles non respectées, corrigées en quatre dépôts :",
    rules: [
      { codes: "BT-34 et BT-49", text: "adresses électroniques de routage du vendeur et de l'acheteur ;" },
      { codes: "BR-22, BR-23, BR-26 et BR-27", text: "quantité, unité et prix unitaire des lignes ;" },
      { codes: "BR-S-02", text: "identifiant de TVA du vendeur ;" },
      { codes: "BR-FR-05", text: "mentions obligatoires françaises, attendues sous forme de notes codées ;" },
      { codes: "BR-FR-08", text: "mode de facturation." },
    ] as EditeursRule[],
    outro: "Aucune de ces erreurs n'apparaissait dans notre outil. C'est exactement ce que nous testons pour vous.",
  },

  plans: {
    h2: "Deux formules",
    items: [
      {
        name: "Test flash",
        price: `490${NBSP}€`,
        items: [
          "1 modèle de facture (Factur-X, UBL ou CII)",
          "dépôt sur l'environnement de test d'une plateforme agréée",
          "rapport : règle, champ, valeur trouvée, valeur attendue, correction",
          "sous 5 jours ouvrés",
        ],
      },
      {
        name: "Audit complet",
        price: `1${NBSP}500${NBSP}€`,
        items: [
          "jusqu'à 5 modèles : facture, avoir, acompte, plusieurs taux de TVA, cas particuliers de votre métier",
          "rapport détaillé et visio de restitution d'une heure",
          "nouveau test après vos corrections, inclus",
          "sous 10 jours ouvrés",
        ],
      },
    ] as EditeursPlan[],
    note: "Prix nets, TVA non applicable (article 293 B du CGI). Paiement par virement à la commande.",
  },

  steps: {
    h2: "Comment ça se passe",
    items: [
      "Vous nous envoyez des factures d'exemple, avec des données de test ou anonymisées.",
      "Nous les déposons sur l'environnement de test d'une plateforme agréée et les passons dans notre moteur de contrôle.",
      "Vous recevez le rapport, règle par règle, avec la correction attendue.",
      "Formule complète : nous testons à nouveau après vos corrections.",
    ],
  },

  notThis: {
    h2: "Ce que ce test n'est pas",
    body:
      "Nous ne sommes pas une plateforme agréée : nous testons vos factures contre la validation d'une plateforme agréée, en environnement de test. Le rapport ne vaut ni agrément ni certification. Chaque plateforme peut ajouter ses propres contrôles : le test réduit le risque de rejet, il ne le supprime pas.",
  },

  after: {
    h2: "Et après",
    body:
      "Si vous voulez que la production et la transmission de vos factures électroniques soient faites pour vous, nous pouvons construire cette brique au forfait, sous votre marque. Parlons-en après le test.",
  },

  faqTitle: "Questions fréquentes",
  faqs: [
    {
      q: "Quels formats testez-vous ?",
      a: "Factur-X (PDF/A-3 contenant un XML CII, profil EN 16931), UBL et CII.",
    },
    {
      q: "Faut-il nous donner accès à notre logiciel ?",
      a: "Non. Des fichiers de factures suffisent.",
    },
    {
      q: "Nos données sont-elles protégées ?",
      a: "Envoyez des factures de test ou anonymisées. Les fichiers sont supprimés à la fin de la mission. Nos serveurs sont hébergés en France.",
    },
    {
      q: "Combien de temps faut-il ?",
      a: "Cinq jours ouvrés pour le test flash, dix pour l'audit complet, à compter de la réception des fichiers.",
    },
    {
      q: "Le test garantit-il qu'une plateforme acceptera toujours nos factures ?",
      a: "Non. Les règles EN 16931 et les règles françaises sont communes à toutes les plateformes, mais chacune peut ajouter ses contrôles. Le test vous montre ce qui bloque aujourd'hui.",
    },
  ] as EditeursFaq[],
};

/** JSON-LD de la page : FAQPage dérivée des questions (l'Organization est déjà dans index.html). */
export function editeursJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: EDITEURS.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
