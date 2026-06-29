import { useEffect, useRef, useState } from "react";

/**
 * Vidéo d'ambiance plein cadre derrière le hero.
 * - Décorative (aria-hidden), muette, en boucle.
 * - Respecte `prefers-reduced-motion` : la vidéo est mise en pause (1ʳᵉ image figée)
 *   au lieu de jouer, pour les utilisateurs sensibles au mouvement.
 * - Le voile (scrim) est piloté par le token `--background` : il reste lisible
 *   en thème CLAIR comme en SOMBRE, sans couleur hardcodée.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) {
      v.pause();
    } else {
      // Certains navigateurs n'auto-jouent pas tant que la promesse n'est pas relancée.
      v.play().catch(() => {});
    }
  }, [reduced]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Voile lisibilité — adaptatif clair/sombre via --background.
          1) base translucide ; 2) dégradé vertical (fond plein haut/bas) ;
          3) halo central pour blanchir derrière le titre. */}
      <div className="absolute inset-0 bg-background/72" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/45 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_38%,hsl(var(--background)/0.85),transparent_75%)]" />
    </div>
  );
}
