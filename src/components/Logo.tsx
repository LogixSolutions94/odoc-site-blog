/**
 * Marque OdocPilot, reprise du BrandLogo du SaaS (odoc-pulse, src/components/brand/BrandLogo.tsx) :
 * carré orange arrondi, sphère orbitale blanche à 66 % du carré, mêmes épaisseurs.
 * `animated` (par défaut) : le carré s'illumine toutes les 6 s et la sphère fait un tour en 24 s,
 * comme sur la page de connexion de l'app. Coupé si `prefers-reduced-motion` (classes dans index.css).
 * Pas de « ® » : la marque n'est pas déposée à l'INPI (vérifié le 21/08/2026).
 */
const SIZES = {
  sm: { box: "h-[26px] w-[26px] rounded-[7px]", orb: 17, word: "text-[1.05rem]" },
  md: { box: "h-8 w-8 rounded-[9px]", orb: 21, word: "text-[1.25rem]" },
  lg: { box: "h-10 w-10 rounded-[11px]", orb: 26, word: "text-[1.55rem]" },
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

  return (
    <span className="inline-flex items-center gap-2.5" aria-label="OdocPilot" role="img">
      <span className={`odoc-mark inline-flex shrink-0 items-center justify-center ${s.box} ${animated ? "odoc-mark--animated" : ""}`} aria-hidden="true">
        <svg className={`odoc-orb ${animated ? "odoc-orb--spin" : ""}`} width={s.orb} height={s.orb} viewBox="0 0 64 64" fill="none">
          <g transform="translate(32,32)">
            <circle r="18" stroke="#fff" strokeWidth="2.5" />
            <ellipse rx="18" ry="7" stroke="#fff" strokeWidth="2.5" />
            <ellipse rx="7" ry="18" stroke="#fff" strokeWidth="2.5" transform="rotate(45)" />
            <circle cy="-18" r="2.8" fill="#fff" />
            <circle cx="18" r="2.8" fill="#fff" />
            <circle cy="18" r="2.8" fill="#fff" />
            <circle cx="-18" r="2.8" fill="#fff" />
          </g>
        </svg>
      </span>
      {withWordmark && (
        <span className={`font-display ${s.word} font-extrabold leading-none tracking-[-0.03em] text-foreground`} aria-hidden="true">
          OdocPilot
        </span>
      )}
    </span>
  );
}
