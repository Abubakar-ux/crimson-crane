import type { Character } from './types'

/**
 * To swap in real art, add e.g.
 *   sprites: { neutral: 'sprites/yuki_neutral.png', nervous: 'sprites/yuki_nervous.png' }
 * Missing emotions fall back to `neutral`, then to the placeholder drawing.
 */
export const CHARACTERS: Record<string, Character> = {
  ren: {
    id: 'ren',
    name: 'Ren Kagami',
    short: 'Ren',
    age: '24',
    role: 'Detective, Mizunagi PD Homicide',
    profile:
      'Transferred from Tokyo the night the fourth body was found. Quiet, observant, stubborn. Still sleeps at night. For now.',
    color: '#ff2e63',
    sprites: {
      neutral: 'sprites/ren_neutral.png',
      shocked: 'sprites/ren_shocked.png',
      serious: 'sprites/ren_serious.png',
    },
  },
  hayama: {
    id: 'hayama',
    name: 'Daigo Hayama',
    short: 'Hayama',
    age: '48',
    role: 'Inspector, lead on the Crimson Crane case',
    profile:
      'Chain-smoking veteran who has chased the Crimson Crane for nine weeks. Gruff, tired, and angrier at himself than anyone else.',
    color: '#c9a66b',
    sprites: {
      neutral: 'sprites/hayama_neutral.png',
      serious: 'sprites/hayama_neutral.png',
      angry: 'sprites/hayama_angry.png',
      smug: 'sprites/hayama_smug.png',
    },
    look: { skin: '#e8c4a0', hair: '#8a8a8a', hairStyle: 'slick', outfit: '#5a4632', outfitAccent: '#2b2b2b', eyes: '#3b2a1a' },
  },
  mikami: {
    id: 'mikami',
    name: 'Shiori Mikami',
    short: 'Dr. Mikami',
    age: '31',
    role: 'Medical Examiner',
    profile: 'Deadpan, precise, and unsettlingly comfortable around the dead. Speaks to corpses more politely than to people.',
    color: '#9ad1d4',
    sprites: {
      neutral: 'sprites/mikami_neutral.png',
      smug: 'sprites/mikami_smug.png',
      serious: 'sprites/mikami_serious.png',
    },
    look: { skin: '#f3d9c6', hair: '#1a1a24', hairStyle: 'long', outfit: '#f2f2f2', outfitAccent: '#3a4a5a', eyes: '#4a3a6a', glasses: true },
  },
  yuki: {
    id: 'yuki',
    name: 'Yuki Sakuraba',
    short: 'Yuki',
    age: '17',
    role: 'Seiran Academy student, witness',
    profile: 'Found the fourth victim under Shirasagi Bridge. Quiet and polite, grips her umbrella like a weapon.',
    color: '#8fb8ff',
    sprites: {
      neutral: 'sprites/yuki_neutral.png',
      nervous: 'sprites/yuki_neutral.png',
      sad: 'sprites/yuki_sad.png',
      shocked: 'sprites/yuki_shocked.png',
      angry: 'sprites/yuki_angry.png',
    },
    look: { skin: '#f6e0d0', hair: '#a9c4ef', hairStyle: 'bob', outfit: '#1f2a4a', outfitAccent: '#c8102e', eyes: '#3a5a9a' },
  },
  kotone: {
    id: 'kotone',
    name: 'Kotone Amane',
    short: 'Kotone',
    age: '29',
    role: 'Owner of Café Lantern',
    profile: 'Warm, teasing, always open late. Folds paper cranes between customers. Has known Hayama for years.',
    color: '#f4b183',
    sprites: {
      neutral: 'sprites/kotone_neutral.png',
      happy: 'sprites/kotone_neutral.png',
      sad: 'sprites/kotone_sad.png',
      nervous: 'sprites/kotone_nervous.png',
      smug: 'sprites/kotone_smug.png',
      angry: 'sprites/kotone_angry.png',
      shocked: 'sprites/kotone_shocked.png',
    },
    altSprites: {
      flag: 'bell_lost',
      sprites: {
        neutral: 'sprites/kotone_neutral_nobell.png',
        happy: 'sprites/kotone_neutral_nobell.png',
        sad: 'sprites/kotone_sad_nobell.png',
        nervous: 'sprites/kotone_nervous_nobell.png',
        smug: 'sprites/kotone_smug_nobell.png',
        angry: 'sprites/kotone_angry_nobell.png',
        shocked: 'sprites/kotone_shocked_nobell.png',
      },
    },
    look: { skin: '#f5dcc8', hair: '#7a4a2a', hairStyle: 'long', outfit: '#3d2b22', outfitAccent: '#e9d3b5', eyes: '#7a4a2a' },
  },
  aya: {
    id: 'aya',
    name: 'Aya Tsukishima',
    short: 'Aya',
    age: '26',
    role: 'Reporter, Mizunagi Herald',
    profile: 'Loud, nosy, fearless. Has a habit of being right about things the police would rather she wasn’t.',
    color: '#ffd23f',
    sprites: {
      neutral: 'sprites/aya_neutral.png',
      happy: 'sprites/aya_neutral.png',
      smug: 'sprites/aya_smug.png',
      serious: 'sprites/aya_serious.png',
    },
    look: { skin: '#f3d2b8', hair: '#c0392b', hairStyle: 'messy', outfit: '#e0a800', outfitAccent: '#222', eyes: '#2d6a4f' },
  },
  kirishima: {
    id: 'kirishima',
    name: 'Sadao Kirishima',
    short: 'Kirishima',
    age: '68',
    role: 'Former principal of Seiran Academy',
    profile:
      'Ran Seiran Academy for twenty years and retired with honours. Silver hair, perfect manners, and the habit of speaking to adults as if they were students who had disappointed him.',
    color: '#b8b8d0',
    sprites: {
      neutral: 'sprites/kirishima_neutral.png',
      smug: 'sprites/kirishima_neutral.png',
      shocked: 'sprites/kirishima_shocked.png',
      nervous: 'sprites/kirishima_shocked.png',
      angry: 'sprites/kirishima_angry.png',
    },
    look: { skin: '#e6c9ad', hair: '#d8d8d8', hairStyle: 'slick', outfit: '#2b2f3a', outfitAccent: '#7a1f2b', eyes: '#2a2a2a', glasses: true },
  },
}

export const speakerName = (who?: string) => (who ? CHARACTERS[who]?.short ?? who : '')
