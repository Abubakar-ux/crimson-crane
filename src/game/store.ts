import { create } from 'zustand'
import { SCRIPT } from './script'
import { CLUES } from './clues'
import { INTERROGATIONS } from './interrogations'
import type { ChoiceOption, Cmd, Emotion, LogEntry, StageChar } from './types'

const SAVE_KEY = 'crimson-crane:autosave'

/** Everything needed to restore the game exactly. */
type Snapshot = {
  scene: string
  idx: number
  bg: string
  stage: StageChar[]
  clues: string[]
  flags: string[]
  met: string[]
  log: LogEntry[]
  bgm?: string | null
  amb?: string | null
  cg?: string | null
  /** Ren's corner-portrait expression; persists until his next tagged line. */
  ren?: Emotion
}

type BlockingCmd = Extract<Cmd, { t: 'say' | 'choice' | 'interrogate' | 'present' | 'card' | 'end' }>

type GameState = Snapshot & {
  screen: 'title' | 'game'
  current: BlockingCmd | null
  effect: { kind: string; key: number } | null
  toast: { clue: string; key: number } | null
  sfx: { ids: string[]; key: number } | null
  hasSave: boolean
  newGame: () => void
  continueGame: () => void
  toTitle: () => void
  advance: () => void
  choose: (opt: ChoiceOption) => void
  present: (clueId: string) => void
  setEmotion: (char: string, emotion: StageChar['emotion']) => void
  addClue: (id: string) => void
  logLine: (e: LogEntry) => void
  finishInterrogation: () => void
}

const fresh = (): Snapshot => ({ scene: 'start', idx: 0, bg: 'black', stage: [], clues: [], flags: [], met: [], log: [], bgm: null, amb: null, cg: null })

const readSave = (): Snapshot | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? (JSON.parse(raw) as Snapshot) : null
  } catch {
    return null
  }
}

const writeSave = (s: Snapshot) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s))
  } catch {
    /* storage unavailable: play on without saving */
  }
}

const pick = (s: GameState): Snapshot => ({
  scene: s.scene, idx: s.idx, bg: s.bg, stage: s.stage, clues: s.clues, flags: s.flags, met: s.met, log: s.log,
  bgm: s.bgm, amb: s.amb, cg: s.cg, ren: s.ren,
})

/**
 * Runs script commands from (scene, idx) until one needs the player.
 * Returns the new state; side-effect-free apart from Date.now() keys.
 */
function run(snap: Snapshot): Partial<GameState> {
  let s = { ...snap, stage: [...snap.stage], clues: [...snap.clues], flags: [...snap.flags], met: [...snap.met], log: [...snap.log] }
  let effect: GameState['effect'] = null
  let toast: GameState['toast'] = null
  const sfxIds: string[] = []
  const out = (current: BlockingCmd | null): Partial<GameState> => ({
    ...s, current, effect, toast, sfx: sfxIds.length ? { ids: sfxIds, key: Date.now() } : null,
  })

  for (let guard = 0; guard < 1000; guard++) {
    const cmd = SCRIPT[s.scene]?.[s.idx]
    if (!cmd) return out(null)

    switch (cmd.t) {
      case 'bg':
        s.bg = cmd.id
        break
      case 'bgm':
        s.bgm = cmd.id
        break
      case 'amb':
        s.amb = cmd.id
        break
      case 'cg':
        s.cg = cmd.id
        break
      case 'ren':
        s.ren = cmd.emotion
        break
      case 'sfx':
        sfxIds.push(cmd.id)
        break
      case 'show': {
        const entry: StageChar = { char: cmd.char, emotion: cmd.emotion ?? 'neutral', pos: cmd.pos ?? 'center' }
        s.stage = [...s.stage.filter((c) => c.char !== cmd.char && c.pos !== entry.pos), entry]
        if (!s.met.includes(cmd.char)) s.met.push(cmd.char)
        break
      }
      case 'hide':
        s.stage = s.stage.filter((c) => c.char !== cmd.char)
        break
      case 'hideAll':
        s.stage = []
        break
      case 'clue':
        if (!s.clues.includes(cmd.id)) {
          s.clues.push(cmd.id)
          toast = { clue: cmd.id, key: Date.now() }
          sfxIds.push('evidence')
        }
        break
      case 'flag':
        if (!s.flags.includes(cmd.id)) s.flags.push(cmd.id)
        break
      case 'effect':
        effect = { kind: cmd.kind, key: Date.now() }
        break
      case 'jump':
        s.scene = cmd.scene
        s.idx = 0
        continue
      case 'jumpIf':
        if (!s.flags.includes(cmd.flag)) break
        s.scene = cmd.scene
        s.idx = 0
        continue
      case 'say':
        if (cmd.emotion && cmd.who) s.stage = s.stage.map((c) => (c.char === cmd.who ? { ...c, emotion: cmd.emotion! } : c))
        if (cmd.who === 'ren' && cmd.emotion) s.ren = cmd.emotion
        s.log.push({ who: cmd.who, text: cmd.text, thought: cmd.thought })
        if (s.log.length > 300) s.log = s.log.slice(-300)
        writeSave(s)
        return out(cmd)
      case 'interrogate': {
        const q = INTERROGATIONS[cmd.id]
        if (q && !s.met.includes(q.char)) s.met.push(q.char)
        writeSave(s)
        return out(cmd)
      }
      case 'choice':
      case 'present':
      case 'card':
      case 'end':
        writeSave(s)
        return out(cmd)
    }
    s.idx++
  }
  throw new Error(`Script loop detected in scene "${s.scene}"`)
}

/** Only overwrite one-shot events (effect/toast/sfx) when the run produced new ones. */
const merge = (patch: Partial<GameState>): Partial<GameState> => {
  const { effect, toast, sfx, ...rest } = patch
  return { ...rest, ...(effect ? { effect } : {}), ...(toast ? { toast } : {}), ...(sfx ? { sfx } : {}) }
}

export const useGame = create<GameState>((set, get) => ({
  ...fresh(),
  screen: 'title',
  current: null,
  effect: null,
  toast: null,
  sfx: null,
  hasSave: readSave() !== null,

  newGame: () => set({ screen: 'game', effect: null, toast: null, sfx: null, ...merge(run(fresh())) }),

  continueGame: () => {
    const save = readSave()
    if (!save) return get().newGame()
    // Re-run from the saved blocking command; drop its log entry since run() re-adds it.
    const replay = { ...save, log: save.log.slice(0, -1) }
    const cmd = SCRIPT[save.scene]?.[save.idx]
    set({ screen: 'game', effect: null, toast: null, sfx: null, ...merge(run(cmd?.t === 'say' ? replay : save)) })
  },

  toTitle: () => set({ screen: 'title', hasSave: readSave() !== null }),

  advance: () => {
    const s = get()
    if (!s.current || (s.current.t !== 'say' && s.current.t !== 'card')) return
    set(merge(run({ ...pick(s), idx: s.idx + 1 })))
  },

  choose: (opt) => {
    const s = get()
    const log = [...s.log, { who: 'ren', text: `▶ ${opt.text}` }]
    set(merge(run({ ...pick(s), log, scene: opt.goto, idx: 0 })))
  },

  present: (clueId) => {
    const s = get()
    if (s.current?.t !== 'present') return
    const log = [...s.log, { who: 'ren', text: `▶ Presents: ${CLUES[clueId]?.name ?? clueId}` }]
    const scene = clueId === s.current.answer ? s.current.ok : s.current.fail
    set(merge(run({ ...pick(s), log, scene, idx: 0 })))
  },

  setEmotion: (char, emotion) => set((s) => ({ stage: s.stage.map((c) => (c.char === char ? { ...c, emotion } : c)) })),

  addClue: (id) =>
    set((s) => {
      if (s.clues.includes(id)) return {}
      const next = { ...pick(s), clues: [...s.clues, id] }
      writeSave(next)
      return { clues: next.clues, toast: { clue: id, key: Date.now() }, sfx: { ids: ['evidence'], key: Date.now() } }
    }),

  logLine: (e) => set((s) => ({ log: [...s.log, e].slice(-300) })),

  finishInterrogation: () => {
    const s = get()
    if (s.current?.t !== 'interrogate') return
    const q = INTERROGATIONS[s.current.id]
    set(merge(run({ ...pick(s), scene: q.next, idx: 0 })))
  },
}))

export const visibleOptions = (opts: ChoiceOption[], flags: string[]) =>
  opts.filter((o) => !(o.hideIfFlag && flags.includes(o.hideIfFlag)) && (o.requireFlags ?? []).every((f) => flags.includes(f)))
