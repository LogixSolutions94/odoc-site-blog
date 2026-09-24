import { useId } from "react";

/**
 * Tampon encreur. SVG pur : double cadre, lettres calées à la largeur du cadre,
 * encre irrégulière (turbulence) et usure (masque de bruit). mix-blend multiply
 * pour qu'il se pose SUR l'impression, comme un vrai coup de tampon.
 */
export function Stamp({
  on,
  word = "VALIDÉ",
  subline,
  className = "",
}: {
  on: boolean;
  word?: string;
  subline: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 240 118" aria-hidden="true" data-on={on} className={`stamp text-[#0E5870] mix-blend-multiply ${className}`}>
      <defs>
        <filter id={`rough-${uid}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`wear-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="1.35" numOctaves="1" seed="11" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -3 2.3" />
        </filter>
        <mask id={`mask-${uid}`}>
          <rect width="240" height="118" fill="#fff" filter={`url(#wear-${uid})`} />
        </mask>
      </defs>
      <g filter={`url(#rough-${uid})`} mask={`url(#mask-${uid})`}>
        <rect x="5" y="5" width="230" height="108" rx="12" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="14" y="14" width="212" height="90" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <text
          x="120"
          y="67"
          textAnchor="middle"
          fill="currentColor"
          className="font-display"
          fontSize="46"
          fontWeight="800"
          textLength="190"
          lengthAdjust="spacingAndGlyphs"
        >
          {word}
        </text>
        <text x="120" y="92" textAnchor="middle" fill="currentColor" className="font-data" fontSize="12" textLength="168" lengthAdjust="spacing">
          {subline}
        </text>
      </g>
    </svg>
  );
}
