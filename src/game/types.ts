export const EMOTIONS = ['neutral', 'happy', 'sad', 'angry', 'nervous', 'shocked', 'smug', 'serious'] as const
export type Emotion = (typeof EMOTIONS)[number]
export type Position = 'left' | 'center' | 'right'

export type ChoiceOption = {
  text: string
  goto: string
  /** Hide this option once the flag is set (for "investigate everything" hubs). */
  hideIfFlag?: string
  /** Only show once all these flags are set. */
  requireFlags?: string[]
}

/** One line of the script. "Blocking" commands wait for the player. */
export type Cmd =
  | { t: 'bg'; id: string }
  | { t: 'show'; char: string; emotion?: Emotion; pos?: Position }
  | { t: 'hide'; char: string }
  | { t: 'hideAll' }
  | { t: 'clue'; id: string }
  | { t: 'flag'; id: string }
  | { t: 'effect'; kind: 'shake' | 'flash' | 'redflash' }
  | { t: 'jump'; scene: string }
  /** Jump only if the flag is set (otherwise carry on with the next line). */
  | { t: 'jumpIf'; flag: string; scene: string }
  /** Background music track id (see audio.ts), or null to fade out. */
  | { t: 'bgm'; id: string | null }
  /** Looping ambience (rain etc.), or null to stop. */
  | { t: 'amb'; id: string | null }
  | { t: 'sfx'; id: string }
  /** Set the protagonist's corner-portrait expression without a line of dialogue. */
  | { t: 'ren'; emotion: Emotion }
  /** Full-screen event illustration over the scene (see CG_IMAGES), or null to clear. */
  | { t: 'cg'; id: string | null }
  // blocking
  | { t: 'say'; who?: string; text: string; emotion?: Emotion; thought?: boolean }
  | { t: 'choice'; options: ChoiceOption[] }
  | { t: 'interrogate'; id: string }
  /** Ask the player to present a clue: the right one jumps to `ok`, anything else to `fail`. */
  | { t: 'present'; prompt: string; answer: string; ok: string; fail: string }
  | { t: 'card'; title: string; sub?: string }
  | { t: 'end'; title: string; sub?: string }

export type Script = Record<string, Cmd[]>

export type StageChar = { char: string; emotion: Emotion; pos: Position }

export type LogEntry = { who?: string; text: string; thought?: boolean }

export type Clue = { id: string; name: string; description: string }

export type Character = {
  id: string
  name: string
  /** Short name for the dialogue name plate. */
  short: string
  age?: string
  role: string
  profile: string
  color: string
  /** Optional real art: emotion -> image URL (put files in /public/sprites). Falls back to placeholder. */
  sprites?: Partial<Record<Emotion, string>>
  /** Replacement art once a story flag is set (e.g. Kotone after she loses her bell). */
  altSprites?: { flag: string; sprites: Partial<Record<Emotion, string>> }
  look?: SpriteLook
}

export type SpriteLook = {
  skin: string
  hair: string
  hairStyle: 'short' | 'long' | 'bob' | 'messy' | 'slick'
  outfit: string
  outfitAccent: string
  eyes: string
  glasses?: boolean
}

/** One line in an interrogation. Lines without `who` are spoken by the character being questioned. */
export type Reply = { text: string; emotion?: Emotion; who?: 'ren'; thought?: boolean }

export type Question = {
  id: string
  /** What Ren asks (shown on the button and in the log). */
  text: string
  replies: Reply[]
  /** Secret (clue id) this answer gives up. */
  reveal?: string
  /** Only offered after these questions were asked... */
  afterAsked?: string[]
  /** ...and once Ren holds these clues. */
  needsClues?: string[]
}

export type EvidenceReaction = { replies: Reply[]; reveal?: string }

export type Interrogation = {
  id: string
  char: string
  /** Scene to jump to once every secret is uncovered and the player concludes. */
  next: string
  opening: Reply[]
  /** The clues this character is hiding; all of them must be uncovered to finish. */
  secrets: string[]
  questions: Question[]
  /** Reactions to specific evidence (keyed by clue id). */
  evidence: Record<string, EvidenceReaction>
  /** Said when Ren presents evidence that means nothing to them (cycled). */
  shrug: Reply[]
}
