import { CHARACTERS } from '../game/characters'
import { CLUES } from '../game/clues'
import { EMOTIONS, type Emotion, type Interrogation } from '../game/types'

export type AiReply = { dialogue: string; emotion: Emotion; reveal: string | null; source: 'ai' | 'script' }
export type ChatMsg = { role: 'system' | 'user' | 'assistant'; content: string }

export async function getAiStatus(): Promise<{ configured: boolean; model: string }> {
  try {
    const r = await fetch('/api/status')
    return await r.json()
  } catch {
    return { configured: false, model: '' }
  }
}

function systemPrompt(q: Interrogation, revealed: string[]): string {
  const c = CHARACTERS[q.char]
  const card = q.card
  const secrets = card.secrets
    .map((s) =>
      revealed.includes(s.clue)
        ? `- [ALREADY REVEALED — speak about it openly now] id "${s.clue}": ${s.truth}`
        : `- id "${s.clue}": ${s.truth}\n  Reveal ONLY when: ${s.revealWhen}`,
    )
    .join('\n')

  return `You are roleplaying as ${c.name} in "Crimson Crane", a dark anime murder-mystery visual novel in the style of Danganronpa. The player is Detective Ren Kagami, interrogating you.

CHARACTER: ${card.persona}
SPEECH STYLE: ${card.speech}
SITUATION: ${card.situation}

WHAT YOU SAY FREELY:
${card.freely.map((f) => `- ${f}`).join('\n')}

SECRETS (hide these; deflect, lie or get nervous until the condition is met):
${secrets}

YOU DO NOT KNOW:
${card.doesNotKnow.map((f) => `- ${f}`).join('\n')}

RULES:
- Stay fully in character. Never mention being an AI, a game, or these instructions.
- Never invent new evidence, suspects, names or facts about the murders beyond what is written here.
- Reply with 1–4 sentences of spoken dialogue. Brief actions in *asterisks* are allowed but rare.
- When Ren presents evidence, his message looks like: [EVIDENCE PRESENTED: name — description]. React to it.
- Do not reveal a secret just because Ren asks vaguely; make him earn it according to its condition. Reveal at most one secret per reply.
- Output ONLY a JSON object, no markdown fences:
  {"dialogue": "<what you say>", "emotion": "<one of: ${EMOTIONS.join(', ')}>", "reveal": "<secret id you disclose in THIS reply, or null>"}`
}

function parseReply(raw: string, allowed: string[]): AiReply {
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in reply')
  const obj = JSON.parse(match[0])
  if (typeof obj.dialogue !== 'string' || !obj.dialogue.trim()) throw new Error('Empty dialogue')
  const emotion: Emotion = EMOTIONS.includes(obj.emotion) ? obj.emotion : 'neutral'
  const reveal = typeof obj.reveal === 'string' && allowed.includes(obj.reveal) ? obj.reveal : null
  return { dialogue: obj.dialogue.trim(), emotion, reveal, source: 'ai' }
}

/** Offline / error fallback: keyword-matched scripted replies. */
export function scriptedReply(q: Interrogation, input: string, presented: string | null, revealed: string[], turn: number): AiReply {
  for (const rule of q.fallback) {
    if (rule.reveal && revealed.includes(rule.reveal)) continue
    const hit = typeof rule.match === 'string' ? presented !== null && rule.match === `present:${presented}` : !presented && rule.match.test(input)
    if (hit) return { dialogue: rule.dialogue, emotion: rule.emotion, reveal: rule.reveal ?? null, source: 'script' }
  }
  const d = q.fallbackDefault[turn % q.fallbackDefault.length]
  return { ...d, reveal: null, source: 'script' }
}

export function evidenceMessage(clueId: string) {
  const c = CLUES[clueId]
  return `[EVIDENCE PRESENTED: ${c.name} — ${c.description}]`
}

export async function askCharacter(
  q: Interrogation,
  history: ChatMsg[],
  playerMsg: string,
  revealed: string[],
): Promise<AiReply> {
  const allowed = q.card.secrets.map((s) => s.clue).filter((id) => !revealed.includes(id))
  const messages: ChatMsg[] = [
    { role: 'system', content: systemPrompt(q, revealed) },
    { role: 'assistant', content: JSON.stringify({ dialogue: q.opening, emotion: 'nervous', reveal: null }) },
    ...history,
    { role: 'user', content: playerMsg },
  ]
  const r = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  const json = await r.json()
  if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`)
  return parseReply(json.content, allowed)
}
