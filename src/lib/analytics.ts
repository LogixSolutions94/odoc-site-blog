/**
 * Chargement de l'analytics (Umami) — robuste et conforme.
 *
 * Garde-fous (dans cet ordre) :
 *  1. HTTPS uniquement  → jamais de script http:// (sinon mixed-content bloqué en prod = zéro donnée).
 *  2. Consentement      → ne charge qu'après acceptation des cookies (RGPD / CNIL).
 *  3. Idempotent        → ne s'injecte jamais deux fois.
 *  4. Fail-safe         → toute erreur est silencieuse : l'analytics ne doit JAMAIS casser le site.
 *  5. Configurable      → URL et website-id pilotés par variables d'env (cf. .env.example).
 *
 * ⚠️ Déploiement : l'instance Umami doit être servie en HTTPS (ex. https://analytics.odocpilot.com
 * en reverse-proxy SSL vers le conteneur Umami). Tant que ce sous-domaine HTTPS n'existe pas,
 * le script ne se charge pas (et c'est volontaire : on ne réintroduit pas de mixed-content).
 */

const CONSENT_KEY = "odoc_cookie_consent";

const UMAMI_SRC =
  (import.meta.env.VITE_UMAMI_SRC as string | undefined) ||
  "https://analytics.odocpilot.com/script.js";

const UMAMI_WEBSITE_ID =
  (import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined) ||
  "8d6ac049-8bbb-452a-a55f-d1ac8a838c76";

/** Le consentement cookies a-t-il été explicitement accepté ? */
export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

/** Injecte le script Umami si toutes les conditions sont réunies. Sûr à appeler plusieurs fois. */
export function loadAnalytics(): void {
  try {
    if (typeof document === "undefined") return;
    if (!UMAMI_SRC || !UMAMI_WEBSITE_ID) return;
    if (!UMAMI_SRC.startsWith("https://")) return; // jamais de mixed-content
    if (!hasAnalyticsConsent()) return; // RGPD : pas de tracking sans accord
    if (document.querySelector("script[data-odoc-analytics]")) return; // déjà chargé

    const s = document.createElement("script");
    s.async = true;
    s.defer = true;
    s.src = UMAMI_SRC;
    s.setAttribute("data-website-id", UMAMI_WEBSITE_ID);
    s.setAttribute("data-odoc-analytics", "true");
    s.onerror = () => {
      /* échec silencieux : analytics indisponible ≠ site cassé */
    };
    document.head.appendChild(s);
  } catch {
    /* no-op */
  }
}

/**
 * À appeler au démarrage de l'app : charge l'analytics si le consentement a déjà
 * été donné lors d'une visite précédente. Sinon, attend l'acceptation du bandeau.
 */
export function initAnalytics(): void {
  if (hasAnalyticsConsent()) loadAnalytics();
}
