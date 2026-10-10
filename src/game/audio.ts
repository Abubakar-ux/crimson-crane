/**
 * Music, ambience and sound effects. Files live in /public/music and /public/sfx.
 * A missing file is silently skipped, so the game runs fine before audio is added.
 */

export const MUSIC: Record<string, string> = {
  title: 'music/title.mp3',
  night_rain: 'music/night_rain.mp3',
  crime_scene: 'music/crime_scene.mp3',
  interrogation: 'music/interrogation.mp3',
  cafe: 'music/cafe.mp3',
  school: 'music/school.mp3',
  climax: 'music/climax.mp3',
  trial: 'music/trial.mp3',
  sorrow: 'music/sorrow.mp3',
}

export const AMBIENCE: Record<string, string> = {
  rain: 'sfx/rain_loop.mp3',
}

export const SFX: Record<string, string> = {
  evidence: 'sfx/evidence.mp3',
  door_bang: 'sfx/door_bang.mp3',
  stinger: 'sfx/stinger.mp3',
  thunder: 'sfx/thunder.mp3',
  bell: 'sfx/bell.mp3',
  footsteps: 'sfx/footsteps.mp3',
  phone: 'sfx/phone.mp3',
  glass: 'sfx/glass.mp3',
}

const VOL_KEY = 'crimson-crane:volume'
export type Volume = { music: number; sfx: number }

export function loadVolume(): Volume {
  try {
    const v = JSON.parse(localStorage.getItem(VOL_KEY) ?? '')
    if (typeof v?.music === 'number' && typeof v?.sfx === 'number') return v
  } catch {
    /* no saved volume */
  }
  return { music: 0.6, sfx: 0.8 }
}

let volume = loadVolume()

export function setVolume(v: Volume) {
  volume = v
  try {
    localStorage.setItem(VOL_KEY, JSON.stringify(v))
  } catch {
    /* storage unavailable */
  }
  for (const ch of [music, ambience]) if (ch.el) ch.el.volume = ch.target * volume.music
}

type Channel = { id: string | null; el: HTMLAudioElement | null; target: number }
const music: Channel = { id: null, el: null, target: 1 }
const ambience: Channel = { id: null, el: null, target: 0.5 }

function fade(el: HTMLAudioElement, to: number, ms: number, done?: () => void) {
  const from = el.volume
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / ms)
    el.volume = Math.min(1, Math.max(0, from + (to - from) * p))
    if (p < 1) requestAnimationFrame(tick)
    else done?.()
  }
  requestAnimationFrame(tick)
}

/** Crossfade a looping channel to a new track (or silence). */
function switchLoop(ch: Channel, id: string | null, table: Record<string, string>, ms = 1200) {
  if (ch.id === id) return
  ch.id = id
  const old = ch.el
  if (old) fade(old, 0, ms, () => old.pause())
  ch.el = null
  const src = id ? table[id] : undefined
  if (!src) return
  const el = new Audio(src)
  el.loop = true
  el.volume = 0
  el.addEventListener('error', () => {
    if (ch.el === el) ch.el = null
  })
  ch.el = el
  const start = () => el.play().then(() => fade(el, ch.target * volume.music, ms))
  // Browsers block audio until the player's first click; retry then.
  start().catch(() => {
    const retry = () => {
      if (ch.el === el) start().catch(() => {})
    }
    window.addEventListener('pointerdown', retry, { once: true })
    window.addEventListener('keydown', retry, { once: true })
  })
}

export const playMusic = (id: string | null) => switchLoop(music, id, MUSIC)
export const playAmbience = (id: string | null) => switchLoop(ambience, id, AMBIENCE, 2000)

export function playSfx(id: string) {
  const src = SFX[id]
  if (!src || volume.sfx <= 0) return
  const el = new Audio(src)
  el.volume = volume.sfx
  el.play().catch(() => {})
}
