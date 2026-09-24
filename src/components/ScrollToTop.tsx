import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Remonte en haut à chaque changement de page, sauf si l'adresse vise une ancre
 * (/#produit) : on attend alors que la section soit rendue (pages chargées à la
 * demande) avant d'y descendre.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    let tries = 0;
    let frame = 0;
    const seek = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ block: "start" });
        return;
      }
      if (tries++ < 60) frame = requestAnimationFrame(seek);
    };
    seek();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
