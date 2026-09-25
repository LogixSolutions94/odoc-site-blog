/**
 * Source unique des liens et des faits commerciaux de la vitrine.
 * Toute page qui affiche un prix, un lien d'inscription ou une condition d'essai
 * doit passer par ce fichier : un seul endroit à corriger le jour où ça change.
 */

export const APP_URL = import.meta.env.VITE_APP_URL || "https://app.odocpilot.com";
export const SIGNUP_URL = `${APP_URL}/auth?mode=signup`;
export const LOGIN_URL = `${APP_URL}/auth`;

export const CONTACT_EMAIL = "contact@odocpilot.com";

/** Condition d'essai affichée sur la page d'inscription (vérifiée le 24/09/2026). */
export const TRIAL = {
  days: 14,
  plan: "Pro",
  short: "14 jours d'essai, sans carte bancaire",
} as const;

/**
 * Éditeur. Hors textes légaux, le fondateur s'affiche « M. Brahimi R. » (demande de Riad,
 * 24/09/2026, AGENTS.md) : le nom complet ne figure que dans les pages légales.
 */
export const PUBLISHER = {
  name: "M. Brahimi R.",
  status: "entrepreneur individuel",
  siren: "842 920 084",
  city: "Paris",
  registryUrl: "https://annuaire-entreprises.data.gouv.fr/entreprise/842920084",
} as const;

export type Plan = {
  id: "conformite" | "essentiel" | "pro" | "equipe" | "manager";
  name: string;
  /**
   * Prix mensuel en euros. Grille 2026 (décision fondateur du 18/09/2026, appliquée le
   * jour où les variantes Lemon Squeezy portent les mêmes montants) : miroir de
   * `plan_limits` du logiciel.
   */
  monthly: number;
  forWho: string;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "conformite",
    name: "Conformité",
    monthly: 0,
    forWho: "Créer des factures au bon format, gratuitement",
    features: [
      "Factures et devis au format Factur-X, sans limite",
      "Lecture automatique de 50 documents par mois",
      "Relances automatiques des impayés, désactivables facture par facture",
      "Recherche de documents et export comptable (FEC)",
      "1 utilisateur",
    ],
  },
  {
    id: "essentiel",
    name: "Essentiel",
    monthly: 29,
    forWho: "Pour l'indépendant qui travaille seul",
    features: [
      "Tout Conformité, avec plus de volume",
      "Lecture automatique de 200 documents par mois",
      "Copilote : jusqu'à 200 conversations par mois",
      "1 utilisateur",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 49,
    forWho: "Pour celui qui veut tout préparer",
    features: [
      "Tout Essentiel",
      "Lecture automatique de 2 000 documents par mois",
      "Copilote : jusqu'à 2 000 conversations par mois",
      "Statistiques d'activité détaillées",
      "1 utilisateur",
    ],
  },
  {
    id: "equipe",
    name: "Équipe",
    monthly: 89,
    forWho: "Pour la petite équipe",
    features: [
      "Tout Pro",
      "Lecture automatique de 4 000 documents par mois",
      "Copilote : jusqu'à 4 000 conversations par mois",
      "Jusqu'à 5 utilisateurs",
    ],
  },
  {
    id: "manager",
    name: "Manager",
    monthly: 149,
    forWho: "Pour plusieurs équipes ou activités",
    features: [
      "Tout Équipe",
      "Lecture automatique de 6 000 documents par mois",
      "Copilote : jusqu'à 6 000 conversations par mois",
      "Jusqu'à 10 utilisateurs",
      "Accompagnement à la prise en main",
    ],
  },
];

/** « 29 € » ou « 23,20 € » (espace fine insécable avant €, comme le veut l'usage français). */
export function formatEur(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
