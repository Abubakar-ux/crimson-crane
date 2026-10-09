/**
 * Placeholder backgrounds drawn in SVG. To use real art, add an entry to BG_IMAGES
 * (put files in /public/backgrounds), e.g. bridge_night: '/backgrounds/bridge_night.jpg'.
 */
export const BG_IMAGES: Partial<Record<string, string>> = {
  bridge_night: '/backgrounds/bridge_night.webp',
  station_night: '/backgrounds/station_night.webp',
  under_bridge: '/backgrounds/under_bridge.webp',
  patrol_car: '/backgrounds/patrol_car.webp',
  cafe_night: '/backgrounds/cafe_night.webp',
}

/** Full-screen event illustrations (put files in /public/cg). */
export const CG_IMAGES: Partial<Record<string, string>> = {
  body_bridge: '/cg/body_bridge.webp',
}

export function EventCG({ id }: { id: string }) {
  const src = CG_IMAGES[id]
  if (!src) return null
  return (
    <div className="cg" key={id}>
      <img src={src} alt="" draggable={false} />
      <div className="rain" />
      <div className="vignette" />
    </div>
  )
}

const RAINY = new Set(['station_night', 'bridge_night', 'under_bridge', 'patrol_car', 'cafe_night'])

export function Background({ id }: { id: string }) {
  const img = BG_IMAGES[id]
  return (
    <div className="bg" key={id}>
      {img ? <img src={img} alt="" draggable={false} /> : <Drawn id={id} />}
      {RAINY.has(id) && <div className={`rain ${id === 'cafe_night' || id === 'patrol_car' ? 'rain-window' : ''}`} />}
      <div className="vignette" />
    </div>
  )
}

function Drawn({ id }: { id: string }) {
  switch (id) {
    case 'station_night':
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#05060f" />
              <stop offset="1" stopColor="#1b2340" />
            </linearGradient>
            <radialGradient id="lamp">
              <stop offset="0" stopColor="#ffe9b0" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ffe9b0" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#sky1)" />
          <path d="M0 520 L200 470 L260 500 L420 440 L520 480 L700 420 L900 470 L1100 430 L1300 480 L1600 440 L1600 600 L0 600 Z" fill="#0b0f1e" />
          <rect x="0" y="600" width="1600" height="300" fill="#151821" />
          <rect x="0" y="600" width="1600" height="14" fill="#e8c547" opacity="0.7" />
          <rect x="0" y="560" width="1600" height="40" fill="#0e1018" />
          {[200, 600, 1000, 1400].map((x) => (
            <g key={x}>
              <rect x={x - 5} y="300" width="10" height="300" fill="#222630" />
              <circle cx={x} cy="300" r="140" fill="url(#lamp)" />
              <rect x={x - 25} y="295" width="50" height="10" fill="#fff4d0" />
            </g>
          ))}
          <rect x="640" y="180" width="320" height="70" rx="4" fill="#0d3b66" stroke="#f0f0f0" strokeWidth="3" />
          <text x="800" y="228" textAnchor="middle" fill="#fff" fontSize="40" fontFamily="Bebas Neue" letterSpacing="6">MIZUNAGI</text>
        </svg>
      )
    case 'bridge_night':
    case 'under_bridge': {
      const under = id === 'under_bridge'
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#03070c" />
              <stop offset="1" stopColor="#0f2a33" />
            </linearGradient>
            <radialGradient id="flood" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#dff6ff" stopOpacity="0.45" />
              <stop offset="1" stopColor="#dff6ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#sky2)" />
          <rect y="640" width="1600" height="260" fill="#071419" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={i * 140} y={680 + (i % 3) * 50} width="90" height="3" fill="#6fd3ff" opacity="0.15" />
          ))}
          {under ? (
            <>
              <rect x="0" y="0" width="1600" height="160" fill="#0a0d10" />
              <rect x="620" y="140" width="180" height="560" fill="#1a1f24" />
              <rect x="620" y="140" width="20" height="560" fill="#262c33" />
              <path d="M0 160 L1600 160 L1600 190 L0 190 Z" fill="#14181c" />
              <path d="M700 640 Q740 600 800 640 L800 700 L680 700 Z" fill="#000" opacity="0.6" />
              <circle cx="1250" cy="250" r="380" fill="url(#flood)" />
              <path d="M690 700 Q760 680 900 720" stroke="#8b0000" strokeWidth="18" opacity="0.5" fill="none" />
            </>
          ) : (
            <>
              <path d="M0 360 Q800 120 1600 360 L1600 400 Q800 170 0 400 Z" fill="#141a20" />
              <rect x="0" y="380" width="1600" height="40" fill="#10151a" />
              {Array.from({ length: 17 }).map((_, i) => (
                <rect key={i} x={i * 100} y="340" width="6" height="45" fill="#20262d" />
              ))}
              <rect x="300" y="420" width="70" height="240" fill="#11161b" />
              <rect x="1230" y="420" width="70" height="240" fill="#11161b" />
              <circle cx="800" cy="600" r="300" fill="url(#flood)" />
            </>
          )}
          <g transform="rotate(-6 800 560)">
            <rect x="-50" y="560" width="1700" height="22" fill="#f2c200" />
            {Array.from({ length: 20 }).map((_, i) => (
              <text key={i} x={i * 180} y="577" fontSize="16" fontFamily="Bebas Neue" fill="#111" letterSpacing="2">KEEP OUT</text>
            ))}
          </g>
          <rect className="siren" width="1600" height="900" />
        </svg>
      )
    }
    case 'patrol_car':
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="dome" cx="0.5" cy="0" r="0.9">
              <stop offset="0" stopColor="#d9c46a" stopOpacity="0.55" />
              <stop offset="1" stopColor="#120f05" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="900" fill="#0d0c08" />
          <rect x="200" y="120" width="560" height="320" rx="40" fill="#13202a" />
          <rect x="840" y="120" width="560" height="320" rx="40" fill="#13202a" />
          <rect x="0" y="560" width="1600" height="340" fill="#1b1a16" />
          <rect x="120" y="470" width="1360" height="120" rx="40" fill="#24221c" />
          <rect width="1600" height="900" fill="url(#dome)" />
          <rect className="siren" width="1600" height="900" />
        </svg>
      )
    case 'cafe_night':
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a1a12" />
              <stop offset="1" stopColor="#4a2e1e" />
            </linearGradient>
            <radialGradient id="warm">
              <stop offset="0" stopColor="#ffcf86" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffcf86" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#wall)" />
          <rect x="1050" y="120" width="440" height="420" fill="#0b1520" stroke="#1d120c" strokeWidth="20" />
          <rect x="1260" y="120" width="20" height="420" fill="#1d120c" />
          <rect x="0" y="600" width="1600" height="300" fill="#2b1810" />
          <rect x="0" y="580" width="1600" height="30" fill="#6b4226" />
          {[300, 700].map((x) => (
            <g key={x}>
              <line x1={x} y1="0" x2={x} y2="140" stroke="#111" strokeWidth="3" />
              <path d={`M${x - 50} 180 L${x + 50} 180 L${x + 25} 140 L${x - 25} 140 Z`} fill="#1a1a1a" />
              <circle cx={x} cy="190" r="260" fill="url(#warm)" />
            </g>
          ))}
          <path d="M60 300 Q500 360 960 300" stroke="#bba" strokeWidth="2" fill="none" />
          {Array.from({ length: 18 }).map((_, i) => {
            const x = 80 + i * 50
            const y = 300 + Math.sin((i / 17) * Math.PI) * 55
            return <path key={i} d={`M${x - 12} ${y + 10} L${x} ${y + 2} L${x + 14} ${y + 8} L${x + 2} ${y + 22} Z`} fill="#f4f1ea" />
          })}
          <rect x="120" y="440" width="140" height="140" fill="#3a2418" />
          <rect x="140" y="400" width="30" height="45" rx="4" fill="#d9d2c5" />
          <rect x="190" y="390" width="30" height="55" rx="4" fill="#8a5a3a" />
        </svg>
      )
    default:
      return <svg viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#000" /></svg>
  }
}
