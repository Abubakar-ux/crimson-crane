import { useEffect, useRef, useState } from 'react'
import { CHARACTERS, speakerName } from '../game/characters'

/** Typewriter text. Click once to finish the line, again to continue. */
export function useTypewriter(text: string, speed = 22) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), speed)
    return () => clearInterval(id)
  }, [text, speed])
  return { shown: text.slice(0, n), done: n >= text.length, finish: () => setN(text.length) }
}

export function DialogueBox({ who, text, thought, onNext }: { who?: string; text: string; thought?: boolean; onNext: () => void }) {
  const { shown, done, finish } = useTypewriter(text)
  const doneRef = useRef(done)
  doneRef.current = done

  const click = () => (doneRef.current ? onNext() : finish())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        click()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const color = who ? CHARACTERS[who]?.color : undefined
  const narration = !who
  return (
    <div className={`dialogue ${narration ? 'narration' : ''}`} onClick={click}>
      {who && (
        <div className="nameplate" style={{ ['--accent' as string]: color }}>
          {speakerName(who)}
          {thought && <span className="thought-tag">thinking</span>}
        </div>
      )}
      <p className={thought ? 'thought' : ''}>{shown}</p>
      {done && <span className="next-arrow">▼</span>}
    </div>
  )
}
