import { CHARACTERS } from '../game/characters'
import type { Emotion, SpriteLook } from '../game/types'

/** Real art if provided, otherwise a code-drawn placeholder bust. */
export function Sprite({ char, emotion }: { char: string; emotion: Emotion }) {
  const c = CHARACTERS[char]
  const img = c?.sprites?.[emotion] ?? c?.sprites?.neutral
  if (img) return <img className="sprite-img" src={img} alt={c.name} draggable={false} />
  if (!c?.look) return null
  return <PlaceholderSprite look={c.look} emotion={emotion} />
}

function hairBack(style: SpriteLook['hairStyle'], color: string) {
  switch (style) {
    case 'long':
      return <path d="M110 230 Q100 120 200 110 Q300 120 290 230 L310 520 Q200 545 90 520 Z" fill={color} />
    case 'bob':
      return <path d="M115 240 Q105 120 200 112 Q295 120 285 240 L290 345 Q200 365 110 345 Z" fill={color} />
    case 'messy':
      return <path d="M112 250 L100 200 Q110 110 200 108 Q290 110 300 200 L288 250 L300 300 L270 280 L130 280 L100 300 Z" fill={color} />
    default:
      return <path d="M122 235 Q115 125 200 115 Q285 125 278 235 Z" fill={color} />
  }
}

function hairFront(style: SpriteLook['hairStyle'], color: string) {
  switch (style) {
    case 'slick':
      return <path d="M125 215 Q130 135 200 128 Q275 135 278 215 Q250 160 200 165 Q160 165 125 215 Z" fill={color} />
    case 'messy':
      return <path d="M122 225 Q120 130 200 125 Q285 130 280 225 L262 185 L250 225 L232 180 L215 215 L200 175 L180 212 L165 178 L150 220 L138 188 Z" fill={color} />
    case 'bob':
      return <path d="M122 235 Q118 128 200 122 Q285 128 280 235 L265 200 L255 185 Q200 175 150 185 L135 205 Z" fill={color} />
    case 'long':
      return <path d="M125 245 Q118 128 200 122 Q282 128 276 245 L262 190 Q230 160 200 168 Q175 172 158 195 L148 180 L138 210 Z" fill={color} />
    default:
      return <path d="M125 215 Q120 130 200 125 Q280 130 276 215 L255 180 L230 195 L205 175 L180 195 L155 178 Z" fill={color} />
  }
}

function Eyes({ emotion, color }: { emotion: Emotion; color: string }) {
  const eye = (cx: number, flip: 1 | -1) => {
    switch (emotion) {
      case 'happy':
        return <path key={cx} d={`M${cx - 16} 238 Q${cx} 222 ${cx + 16} 238`} stroke="#1a1a1a" strokeWidth={4} fill="none" strokeLinecap="round" />
      case 'smug':
        return (
          <g key={cx}>
            <ellipse cx={cx} cy={238} rx={14} ry={9} fill="#fff" />
            <ellipse cx={cx + 3} cy={240} rx={7} ry={7} fill={color} />
            <path d={`M${cx - 17} 233 L${cx + 17} 233`} stroke="#1a1a1a" strokeWidth={5} strokeLinecap="round" />
          </g>
        )
      case 'shocked':
        return (
          <g key={cx}>
            <ellipse cx={cx} cy={236} rx={15} ry={17} fill="#fff" stroke="#1a1a1a" strokeWidth={2.5} />
            <circle cx={cx} cy={236} r={4} fill="#1a1a1a" />
          </g>
        )
      case 'serious':
      case 'angry':
        return (
          <g key={cx}>
            <path d={`M${cx - 16} 236 Q${cx} 228 ${cx + 16} 236 L${cx + 14} 246 Q${cx} 250 ${cx - 14} 246 Z`} fill="#fff" />
            <circle cx={cx} cy={240} r={7} fill={color} />
            <circle cx={cx} cy={240} r={3} fill="#111" />
          </g>
        )
      default: {
        const small = emotion === 'nervous'
        return (
          <g key={cx}>
            <ellipse cx={cx} cy={236} rx={14} ry={16} fill="#fff" stroke="#1a1a1a" strokeWidth={2} />
            <ellipse cx={cx + (small ? flip * 3 : 0)} cy={238} rx={small ? 6 : 9} ry={small ? 7 : 11} fill={color} />
            <circle cx={cx + (small ? flip * 3 : 0)} cy={238} r={small ? 3 : 4.5} fill="#111" />
            <circle cx={cx - 4} cy={232} r={3} fill="#fff" />
          </g>
        )
      }
    }
  }
  const brow = (cx: number, flip: 1 | -1) => {
    const inner = cx + flip * 14
    const outer = cx - flip * 14
    const [yi, yo] =
      emotion === 'angry' ? [222, 208] : emotion === 'sad' || emotion === 'nervous' ? [206, 216] : emotion === 'shocked' ? [202, 204] : emotion === 'serious' ? [214, 212] : [210, 210]
    return <path key={`b${cx}`} d={`M${inner} ${yi} L${outer} ${yo}`} stroke="#2a1a1a" strokeWidth={5} strokeLinecap="round" />
  }
  return (
    <g>
      {eye(172, 1)}
      {eye(228, -1)}
      {brow(172, 1)}
      {brow(228, -1)}
    </g>
  )
}

function Mouth({ emotion }: { emotion: Emotion }) {
  const p = { stroke: '#5a2a2a', strokeWidth: 3.5, fill: 'none', strokeLinecap: 'round' as const }
  switch (emotion) {
    case 'happy':
      return <path d="M185 285 Q200 300 215 285" {...p} />
    case 'sad':
      return <path d="M188 292 Q200 284 212 292" {...p} />
    case 'angry':
      return <path d="M186 284 L214 284 L210 296 L190 296 Z" fill="#5a2a2a" />
    case 'nervous':
      return <path d="M186 289 Q191 284 196 289 Q201 294 206 289 Q211 284 214 289" {...p} />
    case 'shocked':
      return <ellipse cx={200} cy={290} rx={7} ry={10} fill="#5a2a2a" />
    case 'smug':
      return <path d="M188 290 Q204 292 214 280" {...p} />
    default:
      return <path d="M191 288 L209 288" {...p} />
  }
}

function PlaceholderSprite({ look, emotion }: { look: SpriteLook; emotion: Emotion }) {
  return (
    <svg className="sprite-svg" viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet">
      {hairBack(look.hairStyle, look.hair)}
      {/* body */}
      <path d="M60 600 Q70 420 150 385 L200 410 L250 385 Q330 420 340 600 Z" fill={look.outfit} />
      <path d="M150 385 L200 470 L250 385 L232 378 L200 420 L168 378 Z" fill={look.outfitAccent} />
      <rect x={180} y={320} width={40} height={70} fill={look.skin} />
      <path d="M180 360 L200 380 L220 360 L220 390 L180 390 Z" fill="rgba(0,0,0,0.12)" />
      {/* head */}
      <path d="M128 220 Q128 150 200 145 Q272 150 272 220 Q272 300 200 335 Q128 300 128 220 Z" fill={look.skin} />
      <ellipse cx={160} cy={270} rx={14} ry={6} fill="#ff8a8a" opacity={emotion === 'happy' || emotion === 'nervous' ? 0.45 : 0.15} />
      <ellipse cx={240} cy={270} rx={14} ry={6} fill="#ff8a8a" opacity={emotion === 'happy' || emotion === 'nervous' ? 0.45 : 0.15} />
      <Eyes emotion={emotion} color={look.eyes} />
      <path d="M200 255 L196 268 L202 268" stroke="rgba(0,0,0,0.25)" strokeWidth={2} fill="none" />
      <Mouth emotion={emotion} />
      {look.glasses && (
        <g stroke="#222" strokeWidth={3} fill="rgba(200,230,255,0.15)">
          <rect x={150} y={220} width={44} height={34} rx={6} />
          <rect x={206} y={220} width={44} height={34} rx={6} />
          <path d="M194 236 L206 236" />
        </g>
      )}
      {emotion === 'nervous' && <path d="M268 200 Q278 218 268 226 Q258 218 268 200 Z" fill="#9fd8ff" stroke="#4a8ab0" strokeWidth={2} />}
      {emotion === 'angry' && <path d="M262 160 l10 10 m0 -10 l-10 10 m18 -4 l8 8" stroke="#ff2e63" strokeWidth={5} strokeLinecap="round" />}
      {hairFront(look.hairStyle, look.hair)}
    </svg>
  )
}
