export function Logo({
  size = 'md',
  variant = 'full',
}: {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'symbol' | 'white'
}) {
  const scales = { sm: 0.75, md: 1, lg: 1.4 }
  const s = scales[size]

  const symbolColor = variant === 'white' ? '#ffffff' : 'currentColor'
  const textColor = variant === 'symbol' ? 'transparent' : variant === 'white' ? '#ffffff' : '#F97316'

  return (
    <svg
      width={200 * s}
      height={48 * s}
      viewBox="0 0 200 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      aria-label="OdocPilot"
    >
      {/* Sphère orbitale animée : anneaux et sphère en contre-rotation
          (centre de rotation = centre du symbole via transform-box: fill-box) */}
      <g transform={`translate(0, ${4 * s})`} opacity="0.9">
        {/* Anneaux orbitaux — rotation sens inverse */}
        <g className="motion-safe:animate-spin-slow-reverse [transform-box:fill-box] [transform-origin:center]">
          {/* Orbite équatoriale */}
          <ellipse cx="20" cy="20" rx="18" ry="8" stroke={symbolColor} strokeWidth="1.5" fill="none" />
          {/* Orbite diagonale 1 */}
          <ellipse cx="20" cy="20" rx="8" ry="18" stroke={symbolColor} strokeWidth="1.5" fill="none" transform="rotate(45 20 20)" />
          {/* Orbite diagonale 2 */}
          <ellipse cx="20" cy="20" rx="8" ry="18" stroke={symbolColor} strokeWidth="1.5" fill="none" transform="rotate(-45 20 20)" />
        </g>
        {/* Sphère principale + points de connexion — rotation sens direct */}
        <g className="motion-safe:animate-spin-slow [transform-box:fill-box] [transform-origin:center]">
          <circle cx="20" cy="20" r="18" stroke={symbolColor} strokeWidth="1.5" fill="none" />
          <circle cx="20" cy="2" r="2.5" fill={symbolColor} />
          <circle cx="38" cy="20" r="2.5" fill={symbolColor} />
          <circle cx="20" cy="38" r="2.5" fill={symbolColor} />
          <circle cx="2" cy="20" r="2.5" fill={symbolColor} />
        </g>
      </g>

      {/* Texte "OdocPilot" */}
      <text
        x={48}
        y={28}
        fontFamily="'Cabinet Grotesk', 'Helvetica Neue', sans-serif"
        fontSize={22}
        fontWeight="900"
        fill={textColor}
        letterSpacing="-0.5"
      >
        OdocPilot
      </text>

      {/* Sous-titre "BUSINESS OS" */}
      <text
        x={49}
        y={40}
        fontFamily="'Satoshi', 'Inter', 'Plus Jakarta Sans', sans-serif"
        fontSize={8}
        fontWeight="500"
        fill={textColor === 'transparent' ? symbolColor : textColor}
        opacity={textColor === 'transparent' ? 0 : 0.7}
        letterSpacing="3"
      >
        BUSINESS OS
      </text>
    </svg>
  )
}
