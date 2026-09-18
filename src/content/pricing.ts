/**
 * TARIFS — source unique de vérité de la vitrine.
 *
 * Pourquoi ce fichier existe : au 18/09/2026, les prix étaient recopiés en dur
 * dans dix endroits (page Tarifs, accueil, JSON-LD, comparatifs, guides, livre
 * blanc, CGU, pages métier). Changer la grille demandait dix modifications
 * cohérentes, et les données structurées lues par Google étaient les plus
 * faciles à oublier. Tout part désormais d'ici.
 *
 * ⚠️ La source de vérité ABSOLUE est la table `plan_limits` du SaaS
 * (prix en centimes). Ce fichier en est le miroir public : à chaque changement
 * de grille, aligner les deux — et les variantes Lemon Squeezy avec.
 *
 * Grille en vigueur depuis le 18/09/2026 :
 *   Conformité   0 €  · Essentiel 29 € · Pro 49 € · Équipe 89 € · Manager 149 €
 *   Annuel = −20 %. Siège supplémentaire : 12 €/mois.
 */

export interface PublicPlan {
  /** Clé technique, identique à `plan_limits.plan` côté application. */
  key: "starter" | "essential" | "pro" | "team" | "manager";
  name: string;
  /** Euros TTC par mois, facturation mensuelle. */
  monthlyPrice: number;
  /** Euros par mois quand la facturation est annuelle (−20 %). */
  annualPrice: number;
  target: string;
  badge: string | null;
  highlight: boolean;
  /** Sièges inclus (compte de l'utilisateur principal compris). */
  seats: number;
  /** Documents traités par mois. */
  documents: number;
  /** Le copilote IA est-il inclus ? */
  copilot: boolean;
  features: string[];
}

/** Siège supplémentaire, au-delà de ceux inclus dans le plan. */
export const EXTRA_SEAT_PRICE = 12;

export const PLANS: PublicPlan[] = [
  {
    key: "starter",
    name: "Conformité",
    monthlyPrice: 0,
    annualPrice: 0,
    target: "Se mettre en conformité, gratuitement",
    badge: "Gratuit",
    highlight: false,
    seats: 1,
    documents: 50,
    copilot: false,
    features: [
      "Générateur de factures Factur-X illimité",
      "Diagnostic + vérificateur de conformité",
      "50 documents traités par mois",
      "1 utilisateur · hébergé en France",
      "Sans carte bancaire, sans engagement",
    ],
  },
  {
    key: "essential",
    name: "Essentiel",
    monthlyPrice: 29,
    annualPrice: 23.2,
    target: "Indépendant, solo, TPE",
    badge: "Le plus choisi",
    highlight: true,
    seats: 1,
    documents: 200,
    copilot: true,
    features: [
      "Copilote IA inclus : il répond sur VOS données",
      "Devis & factures illimités, au format Factur-X",
      "Lecture IA des factures reçues",
      "Recherche de documents en langage naturel",
      "Export FEC pour votre expert-comptable",
      "200 documents traités par mois",
      "Support par email",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 49,
    annualPrice: 39.2,
    target: "Le copilote complet, tous les modules",
    badge: null,
    highlight: false,
    seats: 1,
    documents: 2000,
    copilot: true,
    features: [
      "Tout Essentiel",
      "Relances clients préparées automatiquement",
      "Suivi de trésorerie et tableaux de bord",
      "Classement intelligent des documents",
      "Webhooks et API",
      "2 000 documents traités par mois",
      "Support prioritaire",
    ],
  },
  {
    key: "team",
    name: "Équipe",
    monthlyPrice: 89,
    annualPrice: 71.2,
    target: "Quand vous êtes plusieurs",
    badge: null,
    highlight: false,
    seats: 5,
    documents: 4000,
    copilot: true,
    features: [
      "Tout Pro",
      "5 utilisateurs inclus",
      "4 000 documents traités par mois",
      `Sièges supplémentaires à ${EXTRA_SEAT_PRICE} €`,
      "Support prioritaire",
    ],
  },
  {
    key: "manager",
    name: "Manager",
    monthlyPrice: 149,
    annualPrice: 119.2,
    target: "Multi-entités, dirigeants",
    badge: null,
    highlight: false,
    seats: 10,
    documents: 6000,
    copilot: true,
    features: [
      "Tout Équipe",
      "10 utilisateurs inclus",
      "Multi-équipes & délégation",
      "Rapports dirigeant personnalisés",
      "6 000 documents traités par mois",
      "Accompagnement à la mise en conformité",
      "Support dédié",
    ],
  },
];

/** Premier palier payant — celui qu'on cite dans les textes (« dès … »). */
export const ENTRY_PLAN = PLANS.find((p) => p.monthlyPrice > 0)!;

/** « 29 € », « 23,20 € » — format français, décimales seulement si utiles. */
export function fmtEur(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** « 29 €/mois » — à utiliser dans les textes plutôt qu'un montant en dur. */
export const ENTRY_PRICE_LABEL = `${fmtEur(ENTRY_PLAN.monthlyPrice)}/mois`;

/**
 * Phrase de vérité sur la facturation des utilisateurs.
 *
 * ⚠️ Ne PAS écrire « sans coût par utilisateur » : c'était affiché jusqu'au
 * 18/09/2026 alors que la base plafonnait les sièges (1 / 1 / 5 / 10) et
 * facturait les sièges supplémentaires. Une allégation invérifiable de ce type
 * expose à la DGCCRF autant qu'elle déçoit le client au moment d'inviter un
 * collaborateur.
 */
export const SEATS_CLAIM =
  `Tarif par entreprise, pas par utilisateur : les sièges sont inclus selon le plan ` +
  `(1 à 10), et un siège supplémentaire coûte ${EXTRA_SEAT_PRICE} €.`;

/** Offres pour les données structurées (schema.org). */
export const JSONLD_OFFERS = PLANS.filter((p) => p.monthlyPrice > 0).map((p) => ({
  "@type": "Offer" as const,
  name: p.name,
  price: p.monthlyPrice.toFixed(2),
  priceCurrency: "EUR" as const,
}));

export const JSONLD_PRICE_RANGE = {
  lowPrice: PLANS[0].monthlyPrice.toFixed(2),
  highPrice: PLANS[PLANS.length - 1].monthlyPrice.toFixed(2),
};
