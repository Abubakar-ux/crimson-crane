import { useState } from 'react'
import { CHARACTERS } from '../game/characters'
import { CLUES } from '../game/clues'
import { useGame } from '../game/store'
import { Sprite } from './Sprite'

/** Case notebook. When `onPresent` is given, evidence can be presented (interrogation mode). */
export function Notebook({ onClose, onPresent }: { onClose: () => void; onPresent?: (clueId: string) => void }) {
  const clues = useGame((s) => s.clues)
  const met = useGame((s) => s.met)
  const [tab, setTab] = useState<'evidence' | 'people'>('evidence')
  const [sel, setSel] = useState<string | null>(clues[0] ?? null)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal notebook" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{onPresent ? 'PRESENT EVIDENCE' : 'CASE NOTEBOOK'}</h2>
          {!onPresent && (
            <nav>
              <button className={tab === 'evidence' ? 'on' : ''} onClick={() => setTab('evidence')}>Evidence</button>
              <button className={tab === 'people' ? 'on' : ''} onClick={() => setTab('people')}>People</button>
            </nav>
          )}
          <button className="close" onClick={onClose}>✕</button>
        </header>

        {tab === 'evidence' || onPresent ? (
          <div className="nb-body">
            <ul className="nb-list">
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
                  <h3>{CLUES[sel].name}</h3>
                  <p>{CLUES[sel].description}</p>
                  {onPresent && (
                    <button className="present" onClick={() => onPresent(sel)}>
                      PRESENT THIS!
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="people">
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
      </div>
    </div>
  )
}

export function Backlog({ onClose }: { onClose: () => void }) {
  const log = useGame((s) => s.log)
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal backlog" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>LOG</h2>
          <button className="close" onClick={onClose}>✕</button>
        </header>
        <div className="log-list" ref={(el) => el && (el.scrollTop = el.scrollHeight)}>
          {log.map((e, i) => (
            <div key={i} className="log-line">
              {e.who && <b style={{ color: CHARACTERS[e.who]?.color }}>{CHARACTERS[e.who]?.short ?? e.who}</b>}
              <span className={e.thought ? 'thought' : e.who ? '' : 'narr'}>{e.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
