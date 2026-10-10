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

  // ---------- Chapter 2 ----------
  diary_page: {
    id: 'diary_page',
    name: 'The Diary Page',
    description:
      'Under the dye, the pocket crane is a page from a school class diary (gakkyū nisshi): dated 9 June, ten years ago. The student on duty that day signed “Mori”.',
  },
  class_photo: {
    id: 'class_photo',
    name: 'Class 2-B Photo',
    description:
      'From Ishida’s flat. Seiran Academy class 2-B, ten years ago, with Ishida as homeroom teacher. One girl’s face is circled in pen. On the back: “Hinako. Forgive me.”',
  },
  ishida_letter: {
    id: 'ishida_letter',
    name: 'Ishida’s Unsent Letter',
    description:
      'A draft addressed “To Hinako’s family”, never sent: “She told me where he put them, and I told her not to make trouble. I have been a coward for ten years.” Who “he” is, Ishida never wrote.',
  },
  room_73: {
    id: 'room_73',
    name: 'Room 7-3',
    description:
      'Seiran’s old annex numbers its rooms by stairwell. 7-3 is the windowless storeroom at the top of stairwell 7 — the “reflection room” of school ghost stories. The annex has been locked for years.',
  },
  aya_club: {
    id: 'aya_club',
    name: 'Aya’s Old School',
    description:
      'Aya was a first-year at Seiran ten years ago, in the newspaper club. Hinako Mori begged the club to print a story about the “reflection room”. Aya was too scared to help. A week later Hinako was dead.',
  },
  aya_letter: {
    id: 'aya_letter',
    name: 'The Crane in Aya’s Mail',
    description:
      'Two months ago, before the first murder, Aya received a red paper crane in her mailbox. Written inside: “Ask them about Hinako Mori.” She kept it to herself, chasing the story.',
  },
  case_file: {
    id: 'case_file',
    name: 'The Hinako Mori File',
    description:
      'Hinako Mori, 17, class 2-B, fell from the old annex roof on 14 June ten years ago. Closed as an accident in three days. Statements, in this order: pharmacist Tanabe, board liaison Ueno, nurse Kurosaki, homeroom teacher Ishida — the order they were killed. Principal Sadao Kirishima: away at a conference in Kyoto. Investigating officer: Det. D. Hayama.',
  },
  effects_receipt: {
    id: 'effects_receipt',
    name: 'Receipt for Her Belongings',
    description:
      'Clipped to the file: Hinako’s belongings, returned by the school. Bag, uniform, books, and the class 2-B class diary she had taken home. Signed for by “elder sister, K.”',
  },
  desk_crane: {
    id: 'desk_crane',
    name: 'The Crane on Hayama’s Desk',
    description: 'Left on Hayama’s desk inside Mizunagi police station. Written on the wing: “YOU CLOSED THE FILE, INSPECTOR.”',
  },

  // ---------- Chapter 3 ----------
  hayama_pressure: {
    id: 'hayama_pressure',
    name: 'Why the File Closed',
    description:
      'Hayama, then a young detective, was ordered by board member Goro Ueno, through the chief, to close the Mori case within three days. He did. He was promoted that autumn.',
  },
  hayama_sister: {
    id: 'hayama_sister',
    name: 'The Sister at the Station',
    description:
      'For a month after the death, Hinako’s elder sister came to the station every day. A university student, about nineteen: short hair, glasses. Hayama called her “Mori-san” and told her to go home. On her last visit she left a white paper crane on his desk.',
  },
  old_autopsy: {
    id: 'old_autopsy',
    name: 'Mikami’s Old Notes',
    description:
      'Mikami was a trainee at the original autopsy. She noted grip bruises on both of Hinako’s wrists and sedatives in her blood. Her supervisor signed it off as an accident. She kept her notes.',
  },
  knife_profile: {
    id: 'knife_profile',
    name: 'The Blade',
    description:
      'All four wounds were made with the same short, thin, single-edged blade: a kitchen petty knife, kept very sharp. Mikami: “Someone who cuts things every day.”',
  },
  hinako_notebook: {
    id: 'hinako_notebook',
    name: 'Hinako’s Notebook',
    description:
      'Found under a floorboard in room 7-3. Dates and names: students locked in the reflection room, the nurse’s “calming pills” from Tanabe Pharmacy, Ishida-sensei’s “don’t make trouble”. Also: “I taught Onee-chan to fold cranes. She’s hopeless. A thousand for one wish.” And: “Onee-chan gave me her little bell so she’d always hear me coming.”',
  },
  last_entry: {
    id: 'last_entry',
    name: 'The Last Entry',
    description:
      '14 June: “Principal Kirishima wants to meet me on the roof after school. I’ll tell him I made copies. Tomorrow I give this to Onee-chan.” Kirishima was never in Kyoto.',
  },
  door_crane: {
    id: 'door_crane',
    name: 'The Crane on Kirishima’s Door',
    description: 'Pinned to former principal Kirishima’s front door: “TONIGHT. 22:00. THE ROOF WHERE IT ENDED. CONFESS.”',
  },

  // ---------- Chapter 4 ----------
  kirishima_truth: {
    id: 'kirishima_truth',
    name: 'Kirishima’s Admission',
    description:
      'Kirishima admits he met Hinako on the annex roof. He grabbed her wrists to take the notebook; she pulled free and went over the railing. He left, and had his Kyoto alibi written in afterwards.',
  },
  bell_owner: {
    id: 'bell_owner',
    name: 'The Girl at Kirishima’s Gate',
    description:
      'A month after the death, Hinako’s elder sister came to Kirishima’s house and screamed at his gate. On her bag hung the little silver bell Hinako used to wear. He had the police remove her.',
  },
  cafe_bell: {
    id: 'cafe_bell',
    name: 'The Bell at Café Lantern',
    description:
      'When Kotone hurried across the café, the silver charm on her apron string rang. Yuki went white: “That’s the sound. From under the bridge.” Then she wasn’t sure.',
  },
  family_register: {
    id: 'family_register',
    name: 'The Family Register',
    description:
      'Found by Aya. Kotone Amane, born 29 years ago. Parents divorced; her younger sister Hinako took their mother’s surname — Mori. Hinako Mori was Kotone’s sister.',
  },
  cafe_photo: {
    id: 'cafe_photo',
    name: 'Aya’s Stakeout Photo',
    description:
      'Taken by Aya on the night of Ishida’s murder, waiting for Hayama: Café Lantern dark, CLOSED sign up, timestamp 22:31. Kotone came back at 23:40, soaked, carrying a dark umbrella.',
  },
  crane_999: {
    id: 'crane_999',
    name: 'Crane No. 999',
    description: 'Clutched in Kirishima’s hand on the roof. Written along the wing in neat handwriting: “999”.',
  },
  rooftop_bell: {
    id: 'rooftop_bell',
    name: 'The Bell on the Roof',
    description:
      'Found on the annex roof where the attacker fled: a tiny silver bell on a cut length of apron string. It rings at the slightest movement.',
  },
}
