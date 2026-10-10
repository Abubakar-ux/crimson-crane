import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CHARACTERS } from '../game/characters'
import { CLUES } from '../game/clues'
import { useGame } from '../game/store'
import { Sprite } from './Sprite'

/**
 * A popup window over the whole game screen. Rendered into the stage root so it is never
 * squeezed or clipped by whatever opened it (e.g. the interrogation panel).
 */
export function StageModal({ className, title, onClose, nav, children }: {
  className: string
  title: string
  onClose: () => void
  nav?: ReactNode
  children: ReactNode
}) {
  const root = document.querySelector('.stage')
  const modal = (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${className}`} onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          {nav}
          <button className="close" onClick={onClose}>✕</button>
        </header>
        {children}
      </div>
    </div>
  )
  return root ? createPortal(modal, root) : modal
}

/** Case notebook. When `onPresent` is given, evidence can be presented (interrogation mode). */
export function Notebook({ onClose, onPresent }: { onClose: () => void; onPresent?: (clueId: string) => void }) {
  const clues = useGame((s) => s.clues)
  const met = useGame((s) => s.met)
  const [tab, setTab] = useState<'evidence' | 'people'>('evidence')
  const [sel, setSel] = useState<string | null>(clues[0] ?? null)

  const nav = !onPresent && (
    <nav>
      <button className={tab === 'evidence' ? 'on' : ''} onClick={() => setTab('evidence')}>Evidence</button>
      <button className={tab === 'people' ? 'on' : ''} onClick={() => setTab('people')}>People</button>
    </nav>
  )

  return (
    <StageModal className="notebook" title={onPresent ? 'PRESENT EVIDENCE' : 'CASE NOTEBOOK'} onClose={onClose} nav={nav}>
      {tab === 'evidence' || onPresent ? (
        <div className="nb-body">
          <ul className="nb-list scroll">
            {clues.length === 0 && <li className="empty">No evidence yet.</li>}
            {clues.map((id) => (
              <li key={id} className={sel === id ? 'on' : ''} onClick={() => setSel(id)}>
                {CLUES[id].name}
              </li>
            ))}
          </ul>
          <div className="nb-detail">
            {sel && (
              <>
                <div className="nb-text scroll">
                  <h3>{CLUES[sel].name}</h3>
                  <p>{CLUES[sel].description}</p>
                </div>
                {onPresent && (
                  <div className="nb-actions">
                    <button className="present" onClick={() => onPresent(sel)}>
                      PRESENT THIS!
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="people scroll">
          {['ren', ...met].map((id) => {
            const c = CHARACTERS[id]
            return (
              <div className="person" key={id} style={{ ['--accent' as string]: c.color }}>
                <div className="portrait">{c.look || c.sprites ? <Sprite char={id} emotion="neutral" /> : <span>?</span>}</div>
                <div>
                  <h3>{c.name}{c.age && <small> · {c.age}</small>}</h3>
                  <em>{c.role}</em>
                  <p>{c.profile}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </StageModal>
  )
}

export function Backlog({ onClose }: { onClose: () => void }) {
  const log = useGame((s) => s.log)
  return (
    <StageModal className="backlog" title="LOG" onClose={onClose}>
      {/* opens scrolled to the most recent line */}
      <div className="log-list scroll" ref={(el) => el && (el.scrollTop = el.scrollHeight)}>
        {log.map((e, i) => (
          <div key={i} className="log-line">
            {e.who && <b style={{ color: CHARACTERS[e.who]?.color }}>{CHARACTERS[e.who]?.short ?? e.who}</b>}
            <span className={e.thought ? 'thought' : e.who ? '' : 'narr'}>{e.text}</span>
          </div>
        ))}
      </div>
    </StageModal>
  )
}
