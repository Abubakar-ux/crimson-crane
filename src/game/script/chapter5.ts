import type { Script } from '../types'
import { amb, bg, bgm, card, cg, choice, end, face, flag, fx, hideAll, jump, jumpIf, nar, present, say, sfx, show, think } from './helpers'

/** A wrong answer in the accusation: Kotone's counter, then back to the same question. */
const rebut = (back: string, line: string) => [say('kotone', line, 'smug'), think('No. That isn’t it. Think.', 'serious'), jump(back)]

export const CHAPTER5: Script = {
  ch5_start: [
    hideAll,
    bg('black'),
    bgm(null),
    amb('rain'),
    card('CHAPTER 5', 'The Thousandth Crane'),
    bg('cafe_night'),
    nar('Outside, two patrol cars wait with their lights off. Hayama stands by the door with his hands in his coat pockets, nowhere near his gun.'),
    show('hayama', 'serious', 'left'),
    show('kotone', 'neutral'),
    say('kotone', 'Sit down, Ren-kun. You may as well have a coffee while you accuse me.'),
    say('kotone', 'Go on. I’ll answer everything. Isn’t that what you came for?', 'smug'),
    think('She won’t confess. She wants me to prove it. Every piece, out loud, in front of Hayama.', 'serious'),
    think('Fine.'),
    bgm('trial'),
    nar('— ACCUSATION — Kotone will argue every point. Answer each claim with the evidence that breaks it.'),
    jump('ch5_q1'),
  ],

  // 1. Who she is
  ch5_q1: [
    say('kotone', 'I make coffee, Detective. What could I possibly have to do with a pharmacist, a councilman, a nurse and a schoolteacher?', 'smug'),
    jump('ch5_q1p'),
  ],
  ch5_q1p: [present('Kotone claims she has no connection to the four victims. What ties her to them?', 'family_register', 'ch5_q1_ok', 'ch5_q1_bad')],
  ch5_q1_bad: rebut('ch5_q1p', 'That? That doesn’t say a single thing about me. You’re tired, Ren-kun.'),
  ch5_q1_ok: [
    say('ren', 'Kotone Amane. Twenty-nine. Your parents divorced when your little sister was nine, and she took your mother’s name.', 'serious'),
    fx('shake'),
    sfx('stinger'),
    say('ren', 'Hinako Mori.'),
    say('hayama', '…Kotone?', 'angry'),
    say('kotone', 'Yes. She was my sister.', 'sad'),
    say('kotone', 'Is grief a crime now?', 'smug'),
    say('ren', 'Every person who died signed her file.'),
    say('kotone', 'Being her sister doesn’t put a knife in my hand. The night Ishida-sensei died, I was right here behind this counter. Like always.', 'neutral'),
    jump('ch5_q2p'),
  ],

  // 2. The alibi
  ch5_q2p: [present('Kotone claims she was in the café the night Ishida was killed.', 'cafe_photo', 'ch5_q2_ok', 'ch5_q2_bad')],
  ch5_q2_bad: rebut('ch5_q2p', 'Is that supposed to prove I wasn’t here? I’m always here. Ask anyone.'),
  ch5_q2_ok: [
    say('ren', 'Ten thirty-one p.m. Your café was dark, with the CLOSED sign up. Aya was outside waiting for Hayama. You came back at eleven-forty, soaked to the skin.', 'serious'),
    say('ren', 'Ishida died between ten and eleven, four minutes’ walk from here.'),
    say('kotone', '…That woman and her camera.', 'angry'),
    say('kotone', 'So I went for a walk. I like the rain. Lots of people walk in the rain, Detective.', 'neutral'),
    jump('ch5_q3p'),
  ],

  // 3. The walk
  ch5_q3p: [present('Kotone claims she only went for a walk. What puts her under the bridge?', 'bell_sound', 'ch5_q3_ok', 'ch5_q3_bad')],
  ch5_q3_bad: rebut('ch5_q3p', 'A walk is a walk. Unless somebody saw me, of course.'),
  ch5_q3_ok: [
    say('ren', 'At ten-fifty, a girl on Shirasagi Bridge heard a tiny bell ringing underneath it. Then she saw someone with a dark umbrella walking away along the river.', 'serious'),
    say('kotone', 'A bell.', 'smug'),
    say('kotone', 'Ren-kun, there are bells on every bicycle in this city. On cats. On keyrings. On my apron, yes. So what?'),
    jump('ch5_q4p'),
  ],

  // 4. The bell
  ch5_q4p: [present('Kotone claims her bell is just a common charm, and it’s right there on her apron.', 'rooftop_bell', 'ch5_q4_ok', 'ch5_q4_bad')],
  ch5_q4_bad: rebut('ch5_q4p', 'And this proves my little charm is somewhere it shouldn’t be? I don’t think so.'),
  ch5_q4_ok: [
    say('ren', 'Not any more. Tonight it was on the roof of Seiran’s old annex, next to a man bleeding into the rain. The string was cut clean through.', 'serious'),
    sfx('bell'),
    nar('I set the evidence bag on the counter. The bell inside rings once, very softly.'),
    show('kotone', 'shocked'),
    nar('Kotone’s hand goes to her apron string. To the place where it isn’t.'),
    say('kotone', '…Anyone could own a bell like that.', 'nervous'),
    think('Not just any bell. Whose bell was it first?', 'serious'),
    jump('ch5_q5'),
  ],

  // 5. Whose bell
  ch5_q5: [
    choice(
      { text: 'It was Kirishima’s', goto: 'ch5_q5_bad' },
      { text: 'It was Hinako’s', goto: 'ch5_q5_ok' },
      { text: 'It was Aya’s', goto: 'ch5_q5_bad' },
    ),
  ],
  ch5_q5_bad: rebut('ch5_q5', 'You’re guessing now, Detective. I can hear it in your voice.'),
  ch5_q5_ok: [
    say('ren', 'It was Hinako’s. You gave it to her. “Onee-chan gave me her little bell so she’ll always hear me coming.” It’s in her notebook.', 'serious'),
    say('ren', 'And a month after she died, you wore it on your bag to Kirishima’s gate. He remembers the sound.'),
    say('kotone', '…It was a cheap thing from a summer festival. She wore it every day. Everyone at that school knew when she was coming.', 'sad'),
    say('kotone', 'Fine. I went out. I own a bell. But that crane in your pocket, Ren-kun.', 'neutral'),
    say('kotone', 'That reporter burst through my door right next to your coat. Why not her?', 'smug'),
    jump('ch5_q6'),
  ],

  // 6. The coat
  ch5_q6: [
    nar('Who could have put the crane in my coat?'),
    choice(
      { text: 'Aya, at the door', goto: 'ch5_q6_aya' },
      { text: 'Hayama, sitting beside me', goto: 'ch5_q6_hayama' },
      { text: 'Kotone, who hung it up', goto: 'ch5_q6_ok' },
    ),
  ],
  ch5_q6_aya: [
    think('No. Aya never got past the doormat. Hayama threw her out before she was even inside.', 'serious'),
    jump('ch5_q6'),
  ],
  ch5_q6_hayama: [
    say('hayama', 'Kid. I was sitting next to you the whole time. Your coat was across the room.', 'angry'),
    jump('ch5_q6'),
  ],
  ch5_q6_ok: [
    say('ren', 'You took my coat without asking, the moment I walked in. You hung it on the hook by the heater, with your back to us.', 'serious'),
    say('ren', 'Nobody else touched it all night.'),
    say('kotone', '…You noticed that?', 'nervous'),
    say('ren', 'Not at the time. I’m noticing it now.'),
    say('kotone', 'And the cranes themselves? The paper, the printing?', 'angry'),
    say('kotone', 'Where would a café owner get the pages of a ten-year-old school diary?'),
    jump('ch5_q7p'),
  ],

  // 7. The pages
  ch5_q7p: [present('Kotone asks where she could have got the pages of the class diary.', 'effects_receipt', 'ch5_q7_ok', 'ch5_q7_bad')],
  ch5_q7_bad: rebut('ch5_q7p', 'That tells you what the cranes are made of. It doesn’t tell you how I’d get them.'),
  ch5_q7_ok: [
    say('ren', 'The school sent Hinako’s things home after she died. Her bag, her uniform, her books, and the class diary she’d taken home that week.', 'serious'),
    say('ren', 'It was signed for by “elder sister, K.”'),
    fx('shake'),
    sfx('stinger'),
    say('ren', 'K for Kotone.'),
    bgm(null),
    nar('For a long time, the only sound is the rain.'),
    jump('ch5_confession'),
  ],

  // ---------- Confession ----------
  ch5_confession: [
    bgm('sorrow'),
    cg('kotone_confession'),
    say('kotone', 'She wrote “clear skies” on the ninth of June. It was pouring. She thought that was the funniest thing in the world.'),
    say('kotone', 'They gave me back her bag with the diary inside, and a form to sign. They spelled her name wrong on the form.'),
    say('kotone', 'I went to the police every day for a month. You gave me tissues, Hayama-san. You were very kind about it.'),
    say('hayama', '…The white crane.'),
    say('hayama', 'You were Mori-san.'),
    say('kotone', 'I was nobody. That was the problem. Nobody listened to Hinako, and then nobody listened to me.'),
    say('kotone', 'So I made them listen. One page at a time.'),
    say('ren', 'There was a crane on Hayama’s desk.'),
    say('kotone', 'I folded his first. Seven years ago. I could never bring myself to finish it.'),
    say('kotone', 'He kept coming back. Every night at three, telling me about the cases he couldn’t solve. He told me hers was the one he was most ashamed of.'),
    say('kotone', 'You can’t punish someone who already does it to himself every night.'),
    say('ren', 'Ishida wrote 7-3 on his hand. He was going to tell you where she’d hidden her notebook.'),
    say('kotone', '…He started to say something. “There’s a room—”'),
    say('kotone', 'And I didn’t let him finish. Ten years I waited for someone to tell me the truth, and when somebody finally tried, I didn’t let him finish.'),
    say('kotone', 'Nine hundred and ninety-nine. I only have one left.'),
    cg(null),
    show('kotone', 'sad'),
    nar('She takes a square of red paper from her apron pocket and lays it on the counter between us. Flat. Waiting.'),
    say('kotone', 'May I, Detective? Before you take me?'),
    choice(
      { text: 'Let her fold the last crane', goto: 'ch5_fold' },
      { text: 'Take her in now', goto: 'ch5_cuff' },
    ),
  ],

  ch5_fold: [
    flag('let_fold'),
    nar('Hayama opens his mouth. I shake my head, and he closes it again.'),
    nar('Her hands are perfectly steady. Fold, crease, turn. Hinako was right: they do look a little like ducks.'),
    nar('When it’s finished, she sets the thousandth crane on the counter beside the bell.'),
    say('kotone', 'There. Now it has to come true.', 'neutral'),
    say('ren', 'What did you wish for?', 'neutral'),
    say('kotone', 'If I told you, it wouldn’t come true, Detective.', 'happy'),
    jump('ch5_arrest'),
  ],

  ch5_cuff: [
    say('ren', 'No. You don’t get to finish it.', 'serious'),
    nar('The paper stays flat on the counter: a red square with nothing inside it.'),
    say('kotone', '…That’s fair.', 'sad'),
    say('kotone', 'She would have said the same thing.'),
    jump('ch5_arrest'),
  ],

  ch5_arrest: [
    show('hayama', 'serious', 'left'),
    say('hayama', 'Kotone Amane. You’re under arrest for the murders of Michiko Tanabe, Goro Ueno, Emi Kurosaki and Haruto Ishida, and the attempted murder of Sadao Kirishima.'),
    nar('His voice doesn’t shake. His hands do.'),
    nar('She holds out her wrists to him. Not to me.'),
    hideAll,
    bgm(null),
    nar('The patrol cars’ lights come on outside. Then the café is just a café again, with the lamps still lit and the rain on the glass.'),
    nar('On the counter: a silver bell, a cold coffee, and the notebook of a girl who wrote everything down so nobody could say it didn’t happen.'),
    face('neutral'),
    think('Kirishima will have lawyers by the morning. A dead girl’s notebook against a man with a lawyer for every finger.'),
    think('Aya would print it tomorrow. The prosecutors would want it kept quiet until trial. Maybe forever.'),
    choice(
      { text: 'Give Aya a copy of the notebook', goto: 'ending_truth' },
      { text: 'Leave it to the prosecutors', goto: 'ending_closed' },
    ),
  ],

  // ---------- Endings ----------
  ending_truth: [
    hideAll,
    bg('police_office'),
    bgm('sorrow'),
    nar('Three weeks later.'),
    nar('The Mizunagi Herald runs it across the whole front page: THE GIRL WHO WROTE IT DOWN. Every entry. Every name.'),
    nar('Aya’s byline is at the bottom, and under it, one line in small print: “I was in the newspaper club. I said no. I’m sorry, Hinako.”'),
    nar('Sadao Kirishima is charged two days later. Three former students come forward about room 7-3. Then eleven. Then thirty.'),
    nar('Inspector Hayama testifies about the file he closed. He loses his rank. He says it’s the first thing in ten years that has fitted him properly.'),
    cg('grave'),
    nar('On Sunday, Yuki and I take flowers to a small grave on the hill above the harbour.'),
    nar('Someone has been here before us. A string of white paper cranes is tied around the stone.'),
    say('yuki', 'Do you think she knew? That someone would find it, one day?'),
    say('ren', 'She hid it where they’d look last. I think she hoped.', 'neutral'),
    jumpIf('let_fold', 'ending_truth_wish'),
    end('THE THOUSANDTH WISH', 'Ending A'),
  ],

  ending_truth_wish: [
    nar('A week later, a letter comes for me from the detention centre. One line, in neat, careful handwriting.'),
    nar('“I wished that someone would finally listen to her. Thank you for listening, Detective.”'),
    end('THE THOUSANDTH WISH', 'True Ending'),
  ],

  ending_closed: [
    hideAll,
    bg('police_office'),
    bgm('title'),
    nar('Three weeks later.'),
    nar('The Crimson Crane case is closed. The press conference lasts eleven minutes. My name is mentioned twice.'),
    nar('Kirishima’s lawyers have the notebook ruled inadmissible: no chain of custody, no corroboration. He is never charged. He gives an interview about forgiveness.'),
    nar('Hinako Mori’s file is reopened, reviewed, and closed again. It takes three days.'),
    think('Three days. Of course it does.', 'serious'),
    nar('I get a commendation. Hayama doesn’t come to the ceremony.'),
    nar('That night, when I get back to my desk, something is waiting on it.'),
    sfx('stinger'),
    nar('A small white paper crane. No note. No name. Folded very carefully, by someone who was never very good at it.'),
    think('Somebody is still waiting for someone to listen.'),
    end('CLOSED FILE', 'Ending B'),
  ],
}
