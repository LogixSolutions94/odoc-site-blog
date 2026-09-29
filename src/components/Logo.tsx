/**
 * Marque OdocPilot : sphère orbitale en noir et blanc (couleur du texte, donc encre en clair,
 * craie en sombre) qui tourne sur elle-même, anneaux et sphère en contre-rotation.
 * C'est le logo d'en-tête du site d'avant la refonte (commit bcda2d4, 18/06/2026), retenu par
 * Riad le 29/09/2026. Rotation coupée si `prefers-reduced-motion` (variante motion-safe).
 * Les icônes (public/favicon.svg, logo.svg, PNG) reprennent la sphère, blanche sur carré d'encre.
 */
const SIZES = {
  sm: { mark: 24, word: "text-[1.05rem]" },
  md: { mark: 30, word: "text-[1.25rem]" },
  lg: { mark: 40, word: "text-[1.55rem]" },
};

export function Logo({
  size = "md",
  withWordmark = true,
  animated = true,
}: {
  size?: keyof typeof SIZES;
  withWordmark?: boolean;
  animated?: boolean;
}) {
  const s = SIZES[size];
  const spin = "[transform-box:fill-box] [transform-origin:center]";

  return (
    <span className="inline-flex items-center gap-2.5 text-foreground" aria-label="OdocPilot" role="img">
      <svg width={s.mark} height={s.mark} viewBox="-1 -1 42 42" fill="none" aria-hidden="true" className="shrink-0">
        {/* Anneaux orbitaux : sens inverse */}
        <g className={`${spin} ${animated ? "motion-safe:animate-spin-slow-reverse" : ""}`} stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="20" cy="20" rx="18" ry="8" />
          <ellipse cx="20" cy="20" rx="8" ry="18" transform="rotate(45 20 20)" />
          <ellipse cx="20" cy="20" rx="8" ry="18" transform="rotate(-45 20 20)" />
        </g>
        {/* Sphère et points de connexion : sens direct */}
        <g className={`${spin} ${animated ? "motion-safe:animate-spin-slow" : ""}`}>
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
          <g fill="currentColor">
            <circle cx="20" cy="2" r="2.5" />
            <circle cx="38" cy="20" r="2.5" />
            <circle cx="20" cy="38" r="2.5" />
            <circle cx="2" cy="20" r="2.5" />
          </g>
        </g>
      </svg>
      {withWordmark && (
        <span className={`font-display ${s.word} font-extrabold leading-none tracking-[-0.03em]`} aria-hidden="true">
          OdocPilot<span className="relative -top-[0.72em] ml-[0.06em] text-[0.42em] font-semibold tracking-normal">®</span>
        </span>
      )}
    </span>
  );
}
