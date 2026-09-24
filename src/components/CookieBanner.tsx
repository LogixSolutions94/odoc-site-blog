import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadAnalytics } from "@/lib/analytics";
import { fr } from "@/lib/typo";

const STORAGE_KEY = "odoc_cookie_consent";

function readConsent(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Bandeau de consentement : discret, en bas à gauche, jamais par-dessus le produit.
 * Accepter et Refuser ont le même poids (recommandation CNIL).
 * « Gérer mes cookies » (pied de page) le rouvre via l'événement odoc:cookie-consent-reset.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer = 0;
    if (!readConsent()) timer = window.setTimeout(() => setVisible(true), 1200);
    const reopen = () => setVisible(true);
    window.addEventListener("odoc:cookie-consent-reset", reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("odoc:cookie-consent-reset", reopen);
    };
  }, []);

  function choose(accepted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, accepted ? "accepted" : "refused");
    } catch {
      /* stockage indisponible : le choix vaut pour la session */
    }
    setVisible(false);
    // RGPD : la mesure d'audience ne démarre QUE si l'utilisateur accepte.
    if (accepted) loadAnalytics();
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Mesure d'audience"
      className="fixed bottom-4 left-4 right-4 z-50 max-w-[26rem] rounded-lg border border-border bg-background p-5 shadow-lift sm:right-auto"
    >
      <p className="text-[0.9375rem] leading-relaxed">
        {fr("Nous mesurons l'audience du site avec Umami, hébergé chez nous, uniquement si vous l'acceptez.")}{" "}
        <Link to="/politique-confidentialite" className="link-underline">
          En savoir plus
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose(false)} className="min-h-10 rounded-md border border-border px-3 text-[0.9375rem] font-bold transition-colors duration-200 hover:bg-muted">
          Refuser
        </button>
        <button type="button" onClick={() => choose(true)} className="min-h-10 rounded-md border border-border px-3 text-[0.9375rem] font-bold transition-colors duration-200 hover:bg-muted">
          Accepter
        </button>
      </div>
    </div>
  );
}
