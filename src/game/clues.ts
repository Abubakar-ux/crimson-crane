import type { Clue } from './types'

export const CLUES: Record<string, Clue> = {
  victims_list: {
    id: 'victims_list',
    name: 'The Four Victims',
    description:
      '1) Michiko Tanabe, pharmacist, in her shop. 2) Councilman Goro Ueno, in his car. 3) Emi Kurosaki, nurse, park restroom. 4) Haruto Ishida, retired teacher, under Shirasagi Bridge. No obvious link.',
  },
  autopsy: {
    id: 'autopsy',
    name: 'Autopsy Notes (Ishida)',
    description:
      'Time of death 22:00–23:00. One deep cut, left to right, from behind. Killer right-handed and calm. No defensive wounds — the victim never saw it coming, or trusted the person behind him.',
  },
  ink_hand: {
    id: 'ink_hand',
    name: 'Ink on the Victim’s Palm',
    description: 'Ishida wrote something on his left palm in blue ink before he died. Rain smeared it. Only a “7” and maybe a “3” are legible.',
  },
  red_crane: {
    id: 'red_crane',
    name: 'The Fourth Crane',
    description:
      'Not origami paper — an ordinary printed page dyed red. Faint text shows through: “SEIRAN ACADEMY — CLASS 2-B”. Every crane is a page from the same unknown document.',
  },
  bell_sound: {
    id: 'bell_sound',
    name: 'The Bell in the Rain',
    description:
      'Yuki was on the bridge around 22:50. She heard a tiny, high bell ringing below, then saw a figure with a dark umbrella walking away along the riverbank.',
  },
  ishida_text: {
    id: 'ishida_text',
    name: 'Ishida’s Last Message',
    description:
      'Yuki secretly took free maths lessons at Ishida’s home. At 21:40 he texted her: “Sorry, Yuki. Cancel tonight. Someone from the old days wants to talk.”',
  },
  aya_tip: {
    id: 'aya_tip',
    name: 'Aya’s Tip',
    description: 'According to reporter Aya Tsukishima, every victim was over forty and lived in Mizunagi ten years ago.',
  },
  pocket_crane: {
    id: 'pocket_crane',
    name: 'The Crane in My Pocket',
    description: 'A red crane found in Ren’s coat at Café Lantern. Written on the wing: “WELCOME TO MIZUNAGI, DETECTIVE KAGAMI.”',
  },
}
