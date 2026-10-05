/**
 * Page /editeurs : partenaire facture électronique pour éditeurs de logiciels et intégrateurs.
 *
 * Offre B2B : on ajoute la conformité e-facture, l'IA et l'automatisation au produit de
 * l'éditeur (marque blanche / sur mesure). PAS DE PRIX affiché (chiffrage sur devis selon
 * le produit et le volume) — décision Riad du 04/10/2026. Le test de conformité en bac à
 * sable réel (histoire vécue du 18/09/2026, 9 règles) reste le point d'entrée.
 *
 * Garde-fous : OdocPilot n'est PAS une plateforme agréée (SuperPDP = PA partenaire) ;
 * aucun client / témoignage inventé ; « l'IA prépare, l'utilisateur valide ».
 *
 * Source unique : lue par src/pages/EditeursPage.tsx (rendu) ET par le prérendu
 * (scripts/lib/marketing-pages.ts) : le HTML brut et la page affichent le même texte.
 */
export type EditeursRule = { codes: string; text: string };
export type EditeursOffer = { tag: string; name: string; desc: string };
export type EditeursFaq = { q: string; a: string };

const NBSP = " ";

export const EDITEURS = {
  seoTitle: "Facture électronique pour éditeurs de logiciels — OdocPilot",
  seoDesc:
    "Ajoutez la facture électronique 2026/2027 à votre logiciel : moteur Factur-X/UBL/CII en marque blanche, raccordement à une plateforme agréée, lecture IA, agents et modules sur mesure.",

  eyebrow: "Éditeurs de logiciels et intégrateurs",
  h1: `Votre logiciel sera-t-il prêt pour la facture électronique 2026-2027${NBSP}?`,
  intro:
    "Vous éditez un logiciel de gestion, un ERP ou un outil métier. Vos clients devront bientôt émettre et recevoir leurs factures au format électronique. Nous ajoutons cette brique à votre produit, sous votre marque : génération conforme, raccordement à une plateforme agréée, lecture IA et agents, modules sur mesure. Et pour commencer sans risque, nous testons d'abord vos factures sur une plateforme agréée réelle.",
  cta: "Parlons de votre projet",
  ctaEmailLead: "ou écrivez à",
  email: "hello@odocpilot.com",

  why: {
    h2: "Pourquoi maintenant",
    body:
      "Depuis le 1er septembre 2026, les grandes entreprises et les ETI émettent leurs factures par une plateforme agréée. Au 1er septembre 2027, ce sera le cas de toutes les entreprises. Vos clients vont vous le demander : une facture refusée par la plateforme ne part pas, et c'est votre support qui reçoit l'appel.",
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
    outro: "Aucune de ces erreurs n'apparaissait dans notre outil. C'est le genre de détail qui fait rejeter une facture en production, et c'est exactement ce que nous savons détecter et corriger pour vous.",
  },

  offers: {
    h2: "Ce que nous construisons pour vous",
    lead:
      "Des briques prêtes à intégrer, en marque blanche ou développées sur mesure. Vous gardez votre produit et votre relation client ; nous apportons la conformité, l'IA et l'automatisation.",
    items: [
      {
        tag: "Conformité",
        name: "Test de conformité en bac à sable réel",
        desc: "Nous déposons vos factures sur l'environnement de test d'une plateforme agréée (SuperPDP) et vous rendons, règle par règle, ce qui bloque et comment le corriger. Le point de départ le plus simple.",
      },
      {
        tag: "Conformité",
        name: "Audit multi-modèles",
        desc: "Facture, avoir, acompte, plusieurs taux de TVA, cas particuliers de votre métier, avec une visio de restitution et un nouveau test après vos corrections.",
      },
      {
        tag: "Intégration",
        name: "Moteur Factur-X, UBL et CII en marque blanche",
        desc: "Une API qui produit, à partir de vos données, des factures conformes à la norme EN 16931, sous votre marque.",
      },
      {
        tag: "Intégration",
        name: "Validateur de conformité embarqué",
        desc: "Le contrôle EN 16931 et les règles françaises (BR-FR) directement dans votre produit, pour bloquer une facture non conforme avant l'envoi.",
      },
      {
        tag: "Intégration",
        name: "Raccordement à une plateforme agréée",
        desc: "Nous gérons l'émission et la réception via une plateforme agréée. Vous gardez votre interface, vos clients ne changent pas d'outil.",
      },
      {
        tag: "Conformité",
        name: "E-reporting",
        desc: "La transmission des données de transaction et de paiement à l'administration, pour vos clients concernés par le e-reporting.",
      },
      {
        tag: "IA",
        name: "Lecture IA des factures",
        desc: "Extraction des lignes, des montants et de la TVA depuis un PDF ou un scan, pour pré-remplir vos écrans. L'IA prépare, l'utilisateur valide.",
      },
      {
        tag: "IA",
        name: "Agents métier",
        desc: "Relance client, classement des pièces, contrôle des documents manquants, rapprochement : des agents qui préparent le travail sans jamais décider à la place de l'utilisateur.",
      },
      {
        tag: "Automatisation",
        name: "Webhooks et suivi des statuts",
        desc: "Émis, reçu, rejeté, accepté : vos événements de facturation synchronisés avec votre back-office, en temps réel.",
      },
      {
        tag: "Sur mesure",
        name: "Modules métier sur mesure",
        desc: "Co-développement d'une brique propre à votre secteur (BTP, santé, services, négoce) et à vos écrans.",
      },
      {
        tag: "Intégration",
        name: "Marque blanche, marque grise ou forfait",
        desc: "Trois modèles de raccordement selon votre base clients, comparés sur le support, la conformité, le coût par facture et le délai.",
      },
      {
        tag: "Conformité",
        name: "Archivage à valeur probante",
        desc: "Conservation des factures émises et reçues selon les durées légales, avec piste d'audit.",
      },
    ] as EditeursOffer[],
    note:
      "Pas de grille tarifaire figée : chaque intégration est chiffrée selon votre produit, vos formats et votre volume. Données et IA hébergées en France.",
  },

  steps: {
    h2: "Un test de conformité, étape par étape",
    items: [
      "Vous nous envoyez des factures d'exemple, avec des données de test ou anonymisées.",
      "Nous les déposons sur l'environnement de test de SuperPDP, plateforme agréée, et les passons dans notre moteur de contrôle.",
      "Vous recevez le rapport, règle par règle, avec la correction attendue.",
      "Nous testons à nouveau après vos corrections, puis nous parlons de l'étape suivante.",
    ],
  },

  notThis: {
    h2: "Ce que nous ne sommes pas",
    body:
      "Nous ne sommes pas une plateforme agréée : nous testons vos factures contre la validation d'une plateforme agréée, en environnement de test, et nous nous raccordons à une plateforme agréée pour vous. Un rapport de test ne vaut ni agrément ni certification. Chaque plateforme peut ajouter ses propres contrôles : le test réduit le risque de rejet, il ne le supprime pas.",
  },

  after: {
    h2: "Et ensuite",
    body:
      "Une fois vos modèles conformes, nous pouvons prendre en charge la production et la transmission de vos factures électroniques au forfait, sous votre marque, puis ajouter la lecture IA, les agents et les modules dont vos clients ont besoin. On avance brique par brique, à votre rythme.",
  },

  faqTitle: "Questions fréquentes",
  faqs: [
    {
      q: "Devons-nous devenir plateforme agréée ?",
      a: "Non. Un éditeur n'a pas à devenir plateforme agréée. Nous nous raccordons à une plateforme agréée pour vous ; vous gardez votre produit et votre relation client.",
    },
    {
      q: "Travaillez-vous en marque blanche ?",
      a: "Oui. Le moteur de génération, le validateur et le raccordement s'intègrent sous votre marque, via API, sans que vos clients changent d'outil. Marque blanche, marque grise ou forfait, selon votre base clients.",
    },
    {
      q: "Quels formats gérez-vous ?",
      a: "Factur-X (PDF/A-3 contenant un XML CII, profil EN 16931), UBL et CII.",
    },
    {
      q: "Combien ça coûte ?",
      a: "Il n'y a pas de grille figée : chaque intégration est chiffrée selon votre produit, vos formats et votre volume. Un test de conformité est le point de départ le plus simple et le moins engageant.",
    },
    {
      q: "Faut-il nous donner accès à votre logiciel ?",
      a: "Pour un test, non : des fichiers de factures suffisent. Pour une intégration, nous travaillons par API, sans accès à vos données de production.",
    },
    {
      q: "Nos données sont-elles protégées ?",
      a: "Pour un test, envoyez des factures de test ou anonymisées ; les fichiers sont supprimés à la fin de la mission. Nos serveurs, et l'IA, sont hébergés en France.",
    },
    {
      q: "Un test garantit-il qu'une plateforme acceptera toujours nos factures ?",
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
