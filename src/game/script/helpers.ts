import type { ChoiceOption, Cmd, Emotion, Position } from '../types'

// Small helpers to keep the chapter scripts readable.
export const say = (who: string, text: string, emotion?: Emotion): Cmd => ({ t: 'say', who, text, emotion })
export const think = (text: string, emotion?: Emotion): Cmd => ({ t: 'say', who: 'ren', text, thought: true, emotion })
/** Ren's portrait expression; it stays until his next tagged line. */
export const face = (emotion: Emotion): Cmd => ({ t: 'ren', emotion })
export const nar = (text: string): Cmd => ({ t: 'say', text })
export const show = (char: string, emotion: Emotion = 'neutral', pos: Position = 'center'): Cmd => ({ t: 'show', char, emotion, pos })
export const hide = (char: string): Cmd => ({ t: 'hide', char })
export const hideAll: Cmd = { t: 'hideAll' }
export const bg = (id: string): Cmd => ({ t: 'bg', id })
export const cg = (id: string | null): Cmd => ({ t: 'cg', id })
export const jump = (scene: string): Cmd => ({ t: 'jump', scene })
export const jumpIf = (flag: string, scene: string): Cmd => ({ t: 'jumpIf', flag, scene })
export const flag = (id: string): Cmd => ({ t: 'flag', id })
export const clue = (id: string): Cmd => ({ t: 'clue', id })
export const bgm = (id: string | null): Cmd => ({ t: 'bgm', id })
export const amb = (id: string | null): Cmd => ({ t: 'amb', id })
export const sfx = (id: string): Cmd => ({ t: 'sfx', id })
export const fx = (kind: 'shake' | 'flash' | 'redflash'): Cmd => ({ t: 'effect', kind })
export const choice = (...options: ChoiceOption[]): Cmd => ({ t: 'choice', options })
export const card = (title: string, sub?: string): Cmd => ({ t: 'card', title, sub })
export const end = (title: string, sub?: string): Cmd => ({ t: 'end', title, sub })
export const interrogate = (id: string): Cmd => ({ t: 'interrogate', id })
/** Accusation step: present `answer` to go to `ok`; anything else goes to `fail`. */
export const present = (prompt: string, answer: string, ok: string, fail: string): Cmd => ({ t: 'present', prompt, answer, ok, fail })
