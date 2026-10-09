import { useEffect, useState } from 'react'
import { getAiStatus } from './ai/interrogate'
import { Background, EventCG } from './components/Background'
import { CHARACTERS } from './game/characters'
import { DialogueBox } from './components/DialogueBox'
import { InterrogationPanel } from './components/InterrogationPanel'
import { Backlog, Notebook } from './components/Notebook'
import { Sprite } from './components/Sprite'
import { loadVolume, playAmbience, playMusic, playSfx, setVolume, type Volume } from './game/audio'
import { CLUES } from './game/clues'
import type { Emotion } from './game/types'
import { useGame, visibleOptions } from './game/store'

export default function App() {
  const screen = useGame((s) => s.screen)
  const [ai, setAi] = useState<{ configured: boolean; model: string } | null>(null)
  useEffect(() => void getAiStatus().then(setAi), [])

  return (
    <div className="viewport">
      <div className="stage">{screen === 'title' ? <TitleScreen ai={ai} /> : <GameScreen aiOn={!!ai?.configured} />}</div>
    </div>
  )
}

function TitleScreen({ ai }: { ai: { configured: boolean; model: string } | null }) {
  const { newGame, continueGame, hasSave } = useGame()
  const [sound, setSound] = useState(false)
  useEffect(() => {
    playMusic('title')
    playAmbience('rain')
  }, [])
  return (
    <div className="title-screen">
      <Background id="bridge_night" />
      <div className="title-content">
        <div className="title-kicker">A MIZUNAGI MURDER MYSTERY</div>
        <h1>
          CRIMSON<span>CRANE</span>
        </h1>
        <div className="title-buttons">
          <button onClick={newGame}>New Game</button>
          <button onClick={continueGame} disabled={!hasSave}>Continue</button>
          <button onClick={() => setSound(true)}>Sound</button>
        </div>
        {sound && <SoundSettings onClose={() => setSound(false)} />}
        <div className={`ai-status ${ai?.configured ? 'on' : ''}`}>
          {ai === null
            ? 'Checking AI…'
            : ai.configured
              ? `AI interrogations: ON · ${ai.model}`
              : 'AI interrogations: OFF (scripted replies). Add your OpenRouter key to .env to enable.'}
        </div>
      </div>
    </div>
  )
}

function GameScreen({ aiOn }: { aiOn: boolean }) {
  const { scene, idx, bg, bgm, amb, sfx, cg, ren, stage, current, effect, toast, flags, advance, choose, toTitle } = useGame()
  const [panel, setPanel] = useState<'notebook' | 'log' | 'sound' | null>(null)

  useEffect(() => playMusic(bgm ?? null), [bgm])
  useEffect(() => playAmbience(amb ?? null), [amb])
  useEffect(() => sfx?.ids.forEach(playSfx), [sfx])
  const [toastVisible, setToastVisible] = useState(false)
  const [fxVisible, setFxVisible] = useState(false)

  useEffect(() => {
    if (!effect || effect.kind === 'shake') return
    setFxVisible(true)
    const t = setTimeout(() => setFxVisible(false), 700)
    return () => clearTimeout(t)
  }, [effect])

  useEffect(() => {
    if (!toast) return
    setToastVisible(true)
    const t = setTimeout(() => setToastVisible(false), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const interrogating = current?.t === 'interrogate'
  // The protagonist's portrait stays in the corner except on full-screen cards.
  const showRen = !!current && current.t !== 'card' && current.t !== 'end'
  // Lit when Ren speaks/thinks, and throughout interrogations (the player is asking as Ren).
  const renSpeaking = (current?.t === 'say' && current.who === 'ren') || interrogating

  return (
    <div className={`game ${showRen ? 'with-ren' : ''}`}>
      <div className={`scene ${effect?.kind === 'shake' ? 'shake' : ''}`} key={effect?.kind === 'shake' ? effect.key : 'scene'}>
        <Background id={bg} />
        <div className="sprites">
          {stage.map((c) => (
            <div key={c.char} className={`sprite pos-${c.pos}`}>
              <Sprite char={c.char} emotion={c.emotion} />
            </div>
          ))}
        </div>
        {cg && <EventCG id={cg} />}
      </div>

      {showRen && <RenPortrait speaking={renSpeaking} emotion={ren ?? 'neutral'} />}

      {effect && fxVisible && effect.kind !== 'shake' && <div key={effect.key} className={`fx fx-${effect.kind}`} />}

      {current?.t === 'say' && <DialogueBox key={`${scene}:${idx}`} who={current.who} text={current.text} thought={current.thought} onNext={advance} />}

      {current?.t === 'choice' && (
        <div className="choices">
          {visibleOptions(current.options, flags).map((o) => (
            <button key={o.goto} onClick={() => choose(o)}>{o.text}</button>
          ))}
        </div>
      )}

      {interrogating && <InterrogationPanel key={current.id} id={current.id} aiOn={aiOn} />}

      {(current?.t === 'card' || current?.t === 'end') && (
        <div className={`card ${current.t}`} onClick={current.t === 'card' ? advance : undefined}>
          <h2>{current.title}</h2>
          {current.sub && <p>{current.sub}</p>}
          {current.t === 'end' ? (
            <button onClick={toTitle}>Return to title</button>
          ) : (
            <small>click to begin</small>
          )}
        </div>
      )}

      {toast && toastVisible && (
        <div className="toast" key={toast.key}>
          <small>EVIDENCE ADDED</small>
          {CLUES[toast.clue]?.name}
        </div>
      )}

      <div className="quickmenu">
        <button onClick={() => setPanel('notebook')}>Notebook</button>
        <button onClick={() => setPanel('log')}>Log</button>
        <button onClick={() => setPanel('sound')}>Sound</button>
        <button onClick={toTitle}>Title</button>
      </div>

      {panel === 'notebook' && <Notebook onClose={() => setPanel(null)} />}
      {panel === 'log' && <Backlog onClose={() => setPanel(null)} />}
      {panel === 'sound' && <SoundSettings onClose={() => setPanel(null)} />}
    </div>
  )
}

function RenPortrait({ speaking, emotion }: { speaking: boolean; emotion: Emotion }) {
  const sprites = CHARACTERS.ren.sprites
  const src = sprites?.[emotion] ?? sprites?.neutral
  if (!src) return null
  return (
    <div className={`ren-portrait ${speaking ? 'speaking' : ''}`}>
      <img src={src} alt="Ren Kagami" draggable={false} />
      <span>REN</span>
    </div>
  )
}

function SoundSettings({ onClose }: { onClose: () => void }) {
  const [vol, setVol] = useState<Volume>(loadVolume)
  const update = (patch: Partial<Volume>) => {
    const next = { ...vol, ...patch }
    setVol(next)
    setVolume(next)
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal sound" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>SOUND</h2>
          <button className="close" onClick={onClose}>✕</button>
        </header>
        <div className="sound-body">
          {(['music', 'sfx'] as const).map((k) => (
            <label key={k}>
              <span>{k === 'music' ? 'Music & ambience' : 'Sound effects'}</span>
              <input type="range" min={0} max={1} step={0.05} value={vol[k]} onChange={(e) => update({ [k]: Number(e.target.value) })} />
              <b>{Math.round(vol[k] * 100)}%</b>
            </label>
          ))}
          <button className="test" onClick={() => playSfx('evidence')}>Test sound effect</button>
        </div>
      </div>
    </div>
  )
}
