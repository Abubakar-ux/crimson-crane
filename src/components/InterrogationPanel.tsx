import { useEffect, useRef, useState } from 'react'
import { CHARACTERS } from '../game/characters'
import { CLUES } from '../game/clues'
import { INTERROGATIONS } from '../game/interrogations'
import { useGame } from '../game/store'
import type { Question, Reply } from '../game/types'
import { Notebook } from './Notebook'

type Line = { from: 'ren' | 'them'; text: string; thought?: boolean }

/** Pause between lines of one answer, so it reads like speech rather than a wall of text. */
const LINE_DELAY = 650

/**
 * Hand-written interrogation: pick a question or present evidence.
 * Questions unlock as earlier ones are asked; every secret has a question route and an evidence route.
 */
export function InterrogationPanel({ id }: { id: string }) {
  const q = INTERROGATIONS[id]
  const char = CHARACTERS[q.char]
  const { clues, addClue, setEmotion, logLine, finishInterrogation } = useGame()
  const found = q.secrets.filter((c) => clues.includes(c))
  const complete = found.length === q.secrets.length

  const [lines, setLines] = useState<Line[]>(() => q.opening.map((o) => ({ from: o.who === 'ren' ? 'ren' : 'them', text: o.text, thought: o.thought })))
  const [asked, setAsked] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [presenting, setPresenting] = useState(false)
  const [shrugs, setShrugs] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const last = q.opening.at(-1)
    if (last?.emotion) setEmotion(q.char, last.emotion)
  }, [q, setEmotion])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [lines, busy])

  const available = q.questions.filter(
    (x) =>
      !asked.includes(x.id) &&
      (x.afterAsked ?? []).every((a) => asked.includes(a)) &&
      (x.needsClues ?? []).every((c) => clues.includes(c)) &&
      !(x.reveal && clues.includes(x.reveal)),
  )

  /** Plays Ren's line, then the answer one line at a time, then hands over any secret. */
  async function play(prompt: string, replies: Reply[], reveal?: string) {
    setBusy(true)
    setLines((l) => [...l, { from: 'ren', text: prompt }])
    logLine({ who: 'ren', text: prompt })
    for (const rep of replies) {
      await new Promise((res) => setTimeout(res, LINE_DELAY))
      const mine = rep.who === 'ren'
      if (!mine && rep.emotion) setEmotion(q.char, rep.emotion)
      setLines((l) => [...l, { from: mine ? 'ren' : 'them', text: rep.text, thought: rep.thought }])
      logLine({ who: mine ? 'ren' : q.char, text: rep.text, thought: rep.thought })
    }
    if (reveal && !clues.includes(reveal)) addClue(reveal)
    setBusy(false)
  }

  function ask(x: Question) {
    setAsked((a) => [...a, x.id])
    play(x.text, x.replies, x.reveal)
  }

  function present(clueId: string) {
    setPresenting(false)
    const reaction = q.evidence[clueId]
    const prompt = `Presents: ${CLUES[clueId].name}`
    if (!reaction) {
      play(prompt, [q.shrug[shrugs % q.shrug.length]])
      setShrugs((n) => n + 1)
      return
    }
    // Already given up this secret: just the closing line, not the whole confession again.
    const repeat = reaction.reveal && clues.includes(reaction.reveal)
    play(prompt, repeat ? reaction.replies.slice(-1) : reaction.replies, reaction.reveal)
  }

  return (
    <div className="interrogation">
      <div className="int-head">
        <span className="int-title">INTERROGATION · {char.name}</span>
        <span className="int-progress">
          Secrets uncovered {found.length}/{q.secrets.length}
          {q.secrets.map((s) => (
            <i key={s} className={clues.includes(s) ? 'got' : ''} />
          ))}
        </span>
      </div>

      <div className="int-body">
        <div className="int-lines" ref={scroller}>
          {lines.map((l, i) => (
            <div key={i} className={`int-line ${l.from} ${l.thought ? 'thought-line' : ''}`}>
              <b style={{ color: l.from === 'ren' ? CHARACTERS.ren.color : char.color }}>{l.from === 'ren' ? 'Ren' : char.short}</b>
              <span className={l.thought ? 'thought' : ''}>{l.text}</span>
            </div>
          ))}
          {busy && (
            <div className="int-line them typing">
              <b style={{ color: char.color }}>{char.short}</b>
              <span>…</span>
            </div>
          )}
        </div>

        <div className="int-actions">
          {complete && (
            <div className="int-done">
              <span>You’ve uncovered everything {char.short} was hiding.</span>
              <button className="primary" disabled={busy} onClick={finishInterrogation}>
                Conclude ▶
              </button>
            </div>
          )}
          <div className="int-questions">
            {available.map((x) => (
              <button key={x.id} disabled={busy} onClick={() => ask(x)}>
                {x.text}
              </button>
            ))}
            {available.length === 0 && !complete && <p className="int-hint">Nothing left to ask. Maybe something in your notebook will make {char.short} talk.</p>}
          </div>
          {!complete && (
            <button className="present-btn" disabled={busy} onClick={() => setPresenting(true)}>
              Present evidence
            </button>
          )}
        </div>
      </div>

      {presenting && <Notebook onClose={() => setPresenting(false)} onPresent={present} />}
    </div>
  )
}
