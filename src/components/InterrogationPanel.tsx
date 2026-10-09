import { useEffect, useRef, useState } from 'react'
import { askCharacter, evidenceMessage, scriptedReply, type ChatMsg } from '../ai/interrogate'
import { CHARACTERS } from '../game/characters'
import { CLUES } from '../game/clues'
import { INTERROGATIONS } from '../game/interrogations'
import { useGame } from '../game/store'
import { Notebook } from './Notebook'

type Line = { from: 'ren' | 'them' | 'system'; text: string; emotion?: string; reveal?: string | null; source?: string }

/** Fire-and-forget: the dev server writes it to /transcripts. Silently ignored in a static build. */
const saveTranscript = (t: object) =>
  fetch('/api/transcript', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) }).catch(() => {})

export function InterrogationPanel({ id, aiOn }: { id: string; aiOn: boolean }) {
  const q = INTERROGATIONS[id]
  const char = CHARACTERS[q.char]
  const { clues, addClue, setEmotion, logLine, finishInterrogation } = useGame()
  const secretIds = q.card.secrets.map((s) => s.clue)
  const found = secretIds.filter((c) => clues.includes(c))
  const complete = found.length === secretIds.length

  const [lines, setLines] = useState<Line[]>([{ from: 'them', text: q.opening }])
  const [history, setHistory] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [presenting, setPresenting] = useState(false)
  const [turn, setTurn] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)
  const [session] = useState(() => new Date().toISOString().replace(/\D/g, '').slice(0, 14))

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [lines, busy])

  async function send(text: string, presented: string | null) {
    if (busy || !text.trim()) return
    const display = presented ? `Presents: ${CLUES[presented].name}` : text
    setLines((l) => [...l, { from: 'ren', text: display }])
    logLine({ who: 'ren', text: display })
    setInput('')
    setBusy(true)

    const playerMsg = presented ? evidenceMessage(presented) : text
    let reply
    let note: string | null = null
    if (aiOn) {
      try {
        reply = await askCharacter(q, history, playerMsg, found)
      } catch (e) {
        note = `AI unavailable (${(e as Error).message}). Using scripted reply.`
      }
    }
    reply ??= scriptedReply(q, text, presented, found, turn)

    setTurn((t) => t + 1)
    setHistory((h) => [
      ...h,
      { role: 'user', content: playerMsg },
      { role: 'assistant', content: JSON.stringify({ dialogue: reply.dialogue, emotion: reply.emotion, reveal: reply.reveal }) },
    ])
    setEmotion(q.char, reply.emotion)
    const nextLines: Line[] = [
      ...lines,
      { from: 'ren', text: display },
      ...(note ? [{ from: 'system' as const, text: note }] : []),
      { from: 'them', text: reply.dialogue, emotion: reply.emotion, reveal: reply.reveal, source: reply.source },
    ]
    setLines(nextLines)
    saveTranscript({ session, interrogation: q.id, char: q.char, lines: nextLines })
    logLine({ who: q.char, text: reply.dialogue })
    if (reply.reveal && !found.includes(reply.reveal)) addClue(reply.reveal)
    setBusy(false)
  }

  return (
    <div className="interrogation">
      <div className="int-head">
        <span className="int-title">INTERROGATION · {char.name}</span>
        <span className="int-progress">
          Secrets uncovered {found.length}/{secretIds.length}
          {secretIds.map((s) => (
            <i key={s} className={clues.includes(s) ? 'got' : ''} />
          ))}
        </span>
        <span className={`ai-badge ${aiOn ? 'on' : ''}`}>{aiOn ? 'AI' : 'SCRIPTED'}</span>
      </div>

      <div className="int-lines" ref={scroller}>
        {lines.map((l, i) => (
          <div key={i} className={`int-line ${l.from}`}>
            {l.from !== 'system' && <b style={{ color: l.from === 'ren' ? CHARACTERS.ren.color : char.color }}>{l.from === 'ren' ? 'Ren' : char.short}</b>}
            <span>{l.text}</span>
          </div>
        ))}
        {busy && (
          <div className="int-line them typing">
            <b style={{ color: char.color }}>{char.short}</b>
            <span>…</span>
          </div>
        )}
      </div>

      {complete ? (
        <div className="int-done">
          <span>You’ve uncovered everything {char.short} was hiding.</span>
          <button className="primary" onClick={finishInterrogation}>Conclude interrogation ▶</button>
        </div>
      ) : (
        <form
          className="int-input"
          onSubmit={(e) => {
            e.preventDefault()
            send(input, null)
          }}
        >
          <input
            autoFocus
            value={input}
            disabled={busy}
            maxLength={300}
            placeholder={`Ask ${char.short} something…`}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={busy || !input.trim()}>Ask</button>
          <button type="button" className="present-btn" disabled={busy} onClick={() => setPresenting(true)}>
            Present evidence
          </button>
        </form>
      )}

      {presenting && (
        <Notebook
          onClose={() => setPresenting(false)}
          onPresent={(clue) => {
            setPresenting(false)
            send(CLUES[clue].name, clue)
          }}
        />
      )}
    </div>
  )
}
