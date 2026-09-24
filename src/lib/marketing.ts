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
  id: "conformite" | "essential" | "pro" | "manager";
  name: string;
  /** Prix mensuel en euros, aligné sur le store Lemon Squeezy (commit 9700aad). */
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
      "Lecture automatique de 20 documents par mois",
      "Relances automatiques des impayés, désactivables facture par facture",
      "Recherche de documents et export comptable (FEC)",
      "Copilote : jusqu'à 20 conversations par mois",
      "1 utilisateur",
    ],
  },
  {
    id: "essential",
    name: "Essential",
    monthly: 49.99,
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
    monthly: 89.99,
    forWho: "Pour la petite équipe qui veut tout préparer",
    features: [
      "Tout Essential",
      "Lecture automatique de 2 000 documents par mois",
      "Copilote : jusqu'à 2 000 conversations par mois",
      "Statistiques d'activité détaillées",
      "Jusqu'à 5 utilisateurs",
    ],
  },
  {
    id: "manager",
    name: "Manager",
    monthly: 149.99,
    forWho: "Pour plusieurs équipes ou activités",
    features: [
      "Tout Pro",
      "Lecture automatique de 6 000 documents par mois",
      "Copilote : jusqu'à 6 000 conversations par mois",
      "Jusqu'à 10 utilisateurs",
      "Accompagnement à la prise en main",
    ],
  },
];

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** « 49,99 € » (espace fine insécable avant €, comme le veut l'usage français). */
export function formatEur(amount: number): string {
  return eur.format(amount);
}
