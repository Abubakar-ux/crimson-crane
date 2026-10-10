/**
 * Sanity-checks the whole story script: every jump target exists, every clue / character /
 * interrogation / background / music id is known, and every scene is reachable from "start".
 *
 * Run: npx esbuild tools/check_script.ts --bundle --platform=node --log-level=warning | node
 */
import { SCRIPT } from '../src/game/script'
import { CLUES } from '../src/game/clues'
import { CHARACTERS } from '../src/game/characters'
import { INTERROGATIONS } from '../src/game/interrogations'
import { MUSIC, SFX, AMBIENCE } from '../src/game/audio'
import type { Cmd } from '../src/game/types'

const problems: string[] = []
const bgs = new Set<string>()
const cgs = new Set<string>()
const targets = (c: Cmd): string[] => {
  switch (c.t) {
    case 'jump':
    case 'jumpIf':
      return [c.scene]
    case 'choice':
      return c.options.map((o) => o.goto)
    case 'present':
      return [c.ok, c.fail]
    case 'interrogate':
      return INTERROGATIONS[c.id] ? [INTERROGATIONS[c.id].next] : []
    default:
      return []
  }
}

for (const [scene, cmds] of Object.entries(SCRIPT)) {
  if (cmds.length === 0) problems.push(`${scene}: empty scene`)
  cmds.forEach((c, i) => {
    const at = `${scene}[${i}]`
    for (const t of targets(c)) if (!SCRIPT[t]) problems.push(`${at}: unknown scene "${t}"`)
    if (c.t === 'clue' && !CLUES[c.id]) problems.push(`${at}: unknown clue "${c.id}"`)
    if (c.t === 'present' && !CLUES[c.answer]) problems.push(`${at}: unknown answer clue "${c.answer}"`)
    if ((c.t === 'show' || c.t === 'hide') && !CHARACTERS[c.char]) problems.push(`${at}: unknown character "${c.char}"`)
    if (c.t === 'say' && c.who && !CHARACTERS[c.who]) problems.push(`${at}: unknown speaker "${c.who}"`)
    if (c.t === 'interrogate' && !INTERROGATIONS[c.id]) problems.push(`${at}: unknown interrogation "${c.id}"`)
    if (c.t === 'bgm' && c.id && !MUSIC[c.id]) problems.push(`${at}: unknown music "${c.id}"`)
    if (c.t === 'amb' && c.id && !AMBIENCE[c.id]) problems.push(`${at}: unknown ambience "${c.id}"`)
    if (c.t === 'sfx' && !SFX[c.id]) problems.push(`${at}: unknown sfx "${c.id}"`)
    if (c.t === 'bg') bgs.add(c.id)
    if (c.t === 'cg' && c.id) cgs.add(c.id)
    // A scene that ends without jumping, choosing or ending would leave the player stuck.
    const last = i === cmds.length - 1
    if (last && !['jump', 'choice', 'interrogate', 'present', 'end'].includes(c.t)) problems.push(`${scene}: ends without jump/choice/end`)
  })
}

for (const q of Object.values(INTERROGATIONS)) {
  const where = `interrogation ${q.id}`
  if (!CHARACTERS[q.char]) problems.push(`${where}: unknown character "${q.char}"`)
  const ids = new Set(q.questions.map((x) => x.id))
  for (const c of q.secrets) if (!CLUES[c]) problems.push(`${where}: unknown secret clue "${c}"`)
  for (const x of q.questions) {
    if (x.reveal && !q.secrets.includes(x.reveal)) problems.push(`${where}: question ${x.id} reveals non-secret "${x.reveal}"`)
    for (const a of x.afterAsked ?? []) if (!ids.has(a)) problems.push(`${where}: question ${x.id} waits for unknown question "${a}"`)
    for (const c of x.needsClues ?? []) if (!CLUES[c]) problems.push(`${where}: question ${x.id} needs unknown clue "${c}"`)
  }
  for (const [c, e] of Object.entries(q.evidence)) {
    if (!CLUES[c]) problems.push(`${where}: reaction to unknown clue "${c}"`)
    if (e.reveal && !q.secrets.includes(e.reveal)) problems.push(`${where}: evidence ${c} reveals non-secret "${e.reveal}"`)
    if (q.secrets.includes(c) && e.reveal) problems.push(`${where}: evidence ${c} is one of its own secrets`)
  }
  // Route 1: questions only (needsClues counts as met once that secret is out; other clues assumed held).
  const asked: string[] = []
  const got: string[] = []
  for (let guard = 0; guard < 100; guard++) {
    const next = q.questions.find(
      (x) =>
        !asked.includes(x.id) &&
        (x.afterAsked ?? []).every((a) => asked.includes(a)) &&
        (x.needsClues ?? []).every((c) => !q.secrets.includes(c) || got.includes(c)) &&
        !(x.reveal && got.includes(x.reveal)),
    )
    if (!next) break
    asked.push(next.id)
    if (next.reveal) got.push(next.reveal)
  }
  for (const c of q.secrets) if (!got.includes(c)) problems.push(`${where}: secret "${c}" can't be reached by questions`)
  // Route 2: evidence.
  for (const c of q.secrets) if (!Object.values(q.evidence).some((e) => e.reveal === c)) problems.push(`${where}: no evidence reveals "${c}"`)
}

// Reachability from the first scene.
const seen = new Set<string>()
const queue = ['start']
while (queue.length) {
  const s = queue.pop()!
  if (seen.has(s) || !SCRIPT[s]) continue
  seen.add(s)
  for (const c of SCRIPT[s]) queue.push(...targets(c))
}
for (const s of Object.keys(SCRIPT)) if (!seen.has(s)) problems.push(`unreachable scene "${s}"`)

// Clues given anywhere in the script or interrogations.
const given = new Set<string>()
for (const cmds of Object.values(SCRIPT)) for (const c of cmds) if (c.t === 'clue') given.add(c.id)
for (const q of Object.values(INTERROGATIONS)) for (const c of q.secrets) given.add(c)
for (const id of Object.keys(CLUES)) if (!given.has(id)) problems.push(`clue "${id}" is never given`)

console.log(`${Object.keys(SCRIPT).length} scenes, ${Object.keys(CLUES).length} clues, ${Object.keys(INTERROGATIONS).length} interrogations`)
console.log(`backgrounds used: ${[...bgs].join(', ')}`)
console.log(`CGs used: ${[...cgs].join(', ')}`)
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log('OK: no problems found')
