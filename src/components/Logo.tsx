/**
 * Marque OdocPilot : carré orange + sphère orbitale (source : public/favicon.svg,
 * identique au BrandLogo du SaaS) et nom en toutes lettres.
 * Statique : une marque qui tourne sur elle-même fait gadget, pas éditeur.
 */
export function Logo({
  size = "md",
  variant = "full",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "symbol" | "white";
}) {
  const box = { sm: 22, md: 26, lg: 34 }[size];
  const text = { sm: "text-[1.05rem]", md: "text-[1.2rem]", lg: "text-[1.55rem]" }[size];
  const wordColor = variant === "white" ? "text-white" : "text-foreground";

  return (
    <span className="inline-flex items-center gap-2.5" aria-label="OdocPilot" role="img">
      <svg width={box} height={box} viewBox="0 0 64 64" fill="none" aria-hidden="true" className="shrink-0">
        <rect width="64" height="64" rx="15" fill="#F97316" />
        <g transform="translate(32,32)">
          <circle r="18" stroke="#fff" strokeWidth="3" />
          <ellipse rx="18" ry="7" stroke="#fff" strokeOpacity="0.72" strokeWidth="3" />
          <ellipse rx="7" ry="18" stroke="#fff" strokeOpacity="0.72" strokeWidth="3" transform="rotate(45)" />
          <circle cy="-18" r="3" fill="#fff" />
          <circle cx="18" r="3" fill="#fff" />
          <circle cy="18" r="3" fill="#fff" />
          <circle cx="-18" r="3" fill="#fff" />
        </g>
      </svg>
      {variant !== "symbol" && (
        <span className={`font-display ${text} font-bold leading-none tracking-[-0.03em] ${wordColor}`} aria-hidden="true">
          OdocPilot
        </span>
      )}
    </span>
  );
}
