import type { Emotion, Interrogation, Reply } from './types'

// Line helpers: `r` is the character being questioned, `ren` is Ren speaking, `th` is Ren thinking.
const r = (text: string, emotion?: Emotion): Reply => ({ text, emotion })
const ren = (text: string): Reply => ({ who: 'ren', text })
const th = (text: string): Reply => ({ who: 'ren', text, thought: true })

/**
 * Every secret can be uncovered two ways: by pressing the right chain of questions,
 * or (faster) by presenting the right evidence.
 */
export const INTERROGATIONS: Record<string, Interrogation> = {
  // ---------------------------------------------------------------- Chapter 1
  yuki_bridge: {
    id: 'yuki_bridge',
    char: 'yuki',
    next: 'witness_after',
    opening: [r('…I was walking home from the convenience store. I saw him under the bridge. That’s all. Can I go home now?', 'nervous')],
    secrets: ['bell_sound', 'ishida_text'],
    questions: [
      {
        id: 'what',
        text: 'Tell me what happened tonight, from the start.',
        replies: [
          r('I was walking home from the convenience store. I took the river path because it’s shorter.', 'nervous'),
          r('Someone was sitting under the bridge. I thought he was drunk. I went closer and… he wasn’t moving.', 'sad'),
          r('I called the police. Then I just stood there. I don’t know for how long.', 'sad'),
        ],
      },
      {
        id: 'when',
        text: 'What time did you find him?',
        afterAsked: ['what'],
        replies: [
          r('Midnight. Around midnight. I looked at my phone when I called.', 'nervous'),
          th('Midnight. Mikami put the time of death between ten and eleven. He’d been sitting there for over an hour.'),
        ],
      },
      {
        id: 'store',
        text: 'Which convenience store?',
        afterAsked: ['what'],
        replies: [
          r('The… the one by the station.', 'nervous'),
          th('The station is on the far side of the river. Nobody walks home from there along this bank. She’s making it up as she goes.'),
        ],
      },
      {
        id: 'before',
        text: 'Nobody here thinks you did this. Were you here before midnight?',
        afterAsked: ['when', 'store'],
        reveal: 'bell_sound',
        replies: [
          r('…You really don’t think it was me?', 'sad'),
          r('Then— okay. It wasn’t midnight when I first got here. It was earlier. Around ten to eleven. I was up on the bridge.', 'nervous'),
          r('I heard a bell. A tiny one, high and thin, ringing under the bridge. Then someone with a dark umbrella walked away along the riverbank.', 'nervous'),
          r('I couldn’t see their face. I couldn’t see anything. I hid in the bus shelter for an hour before I made myself go down and look.', 'sad'),
        ],
      },
      {
        id: 'school',
        text: 'Your uniform. Which school?',
        replies: [r('Seiran Academy. Second year, class 2-A.', 'nervous'), r('…Why does that matter?', 'nervous')],
      },
      {
        id: 'knew',
        text: 'Did you know the man under the bridge?',
        afterAsked: ['school'],
        replies: [
          r('N-no. I’d never seen him before.', 'nervous'),
          th('She hasn’t let go of her phone once. She keeps turning it face down on her knee, like it might say something.'),
        ],
      },
      {
        id: 'phone',
        text: 'You keep hiding your phone. Who were you talking to tonight?',
        afterAsked: ['knew'],
        reveal: 'ishida_text',
        replies: [
          r('…', 'sad'),
          r('I knew him. Ishida-sensei. He gave me maths lessons at his flat, for free, because my family can’t afford cram school. Seiran forbids outside tutoring, so I never told anyone.', 'sad'),
          r('I had a lesson at ten. At nine-forty he texted me. Look.', 'sad'),
          r('“Sorry, Yuki. Cancel tonight. Someone from the old days wants to talk.”', 'sad'),
          r('It felt wrong. So I went toward his flat, over the bridge. That’s why I was out here.', 'sad'),
        ],
      },
      {
        id: 'figure',
        text: 'The person with the umbrella. Anything at all you remember?',
        needsClues: ['bell_sound'],
        replies: [
          r('A big, dark umbrella. They walked slowly. Not like someone running away.', 'nervous'),
          r('Like someone who wasn’t afraid of anything.', 'sad'),
        ],
      },
    ],
    evidence: {
      autopsy: {
        reveal: 'bell_sound',
        replies: [
          r('Between ten and eleven…? But I found him at midnight. I—', 'shocked'),
          r('…No. That’s not true. I’m sorry. I was on the bridge much earlier. Around ten to eleven.', 'nervous'),
          r('I heard a tiny bell, high-pitched, ringing under the bridge. Then someone with a dark umbrella walked away along the river.', 'nervous'),
          r('I couldn’t see their face. I hid in the bus shelter for an hour before I dared to go down. I’m sorry I lied.', 'sad'),
        ],
      },
      red_crane: {
        reveal: 'ishida_text',
        replies: [
          r('Seiran… that’s my school. But class 2-B? I’m in 2-A. I’ve never seen that page.', 'shocked'),
          r('…Detective, I lied about the convenience store. Ishida-sensei was my maths tutor. Private lessons at his flat, for free. Seiran forbids it, so I couldn’t say.', 'sad'),
          r('That night he texted me at nine-forty. “Sorry, Yuki. Cancel tonight. Someone from the old days wants to talk.”', 'sad'),
          r('It felt wrong, so I went toward his flat. Over the bridge. Here — it’s still on my phone.', 'sad'),
        ],
      },
      victims_list: {
        replies: [
          r('Four…? I only knew about him. A pharmacist, a councilman, a nurse…', 'shocked'),
          r('I don’t know any of them. I just found him. That’s all.', 'nervous'),
        ],
      },
      ink_hand: {
        replies: [r('A seven and a three…? I didn’t see his hands. Only the crane.', 'nervous'), r('I’m sorry. I don’t know what that means.', 'sad')],
      },
      bell_sound: {
        replies: [r('That’s what I heard. Small and high, like a charm on a bag.', 'nervous'), r('I keep hearing it when I close my eyes.', 'sad')],
      },
      ishida_text: {
        replies: [r('That’s all he wrote. I keep reading it, as if it might say something else.', 'sad')],
      },
    },
    shrug: [
      r('…I don’t understand what that has to do with me.', 'nervous'),
      r('I’m sorry, Detective. I don’t know anything about that.', 'sad'),
    ],
  },

  // ---------------------------------------------------------------- Chapter 2
  aya_office: {
    id: 'aya_office',
    char: 'aya',
    next: 'ch2_after_aya',
    opening: [r('Relax, new guy, I brought you a coffee. Not from Café Lantern, sadly. So — Seiran Academy, huh? Told you to ask about ten years ago.', 'smug')],
    secrets: ['aya_club', 'aya_letter'],
    questions: [
      {
        id: 'howin',
        text: 'How did you even get in here?',
        replies: [r('I told the front desk I was delivering coffee. Then I delivered coffee. I’m a very honest person.', 'happy')],
      },
      {
        id: 'tenyears',
        text: 'What do you know about ten years ago?',
        replies: [
          r('That every one of your victims lived in Mizunagi ten years ago and was over forty. That’s public record, new guy.', 'smug'),
          r('Anything past that is a trade. What are you offering?', 'smug'),
        ],
      },
      {
        id: 'school',
        text: 'Where did you go to high school?',
        afterAsked: ['tenyears'],
        replies: [
          r('Wow. Personal. Do you ask all your suspects that, or just the cute reporters?', 'smug'),
          th('She answered a question with a question. She’s been doing it all afternoon, except when it’s about that school.'),
        ],
      },
      {
        id: 'seiran',
        text: 'You know Seiran’s old annex too well. You went there.',
        afterAsked: ['school'],
        reveal: 'aya_club',
        replies: [
          r('…', 'serious'),
          r('Yeah. I went to Seiran. Newspaper club, first year. I was fifteen.', 'serious'),
          r('A second-year called Hinako Mori came to the club with a notebook. Stories about a “reflection room” where they locked students up. She begged us to print it.', 'serious'),
          r('I told her it wasn’t my decision. We never printed anything. A week later she fell off the annex roof, and the school called it an accident.', 'serious'),
          r('I became a reporter because I said no when it counted.', 'serious'),
        ],
      },
      {
        id: 'source',
        text: 'Who’s your source?',
        afterAsked: ['tenyears'],
        replies: [r('Sources are sacred, Detective. Even mine.', 'smug')],
      },
      {
        id: 'contact',
        text: 'Four people are dead, Aya. Has the killer contacted you?',
        afterAsked: ['source'],
        reveal: 'aya_letter',
        replies: [
          r('…', 'nervous'),
          r('Two months ago. Before the pharmacist. A red paper crane in my mailbox, no stamp.', 'nervous'),
          r('Unfolded, it said: “Ask them about Hinako Mori.” That’s my so-called source.', 'nervous'),
          r('I thought it was a whistleblower. A scoop. Now I can’t tell whether I’ve been dancing to the killer’s tune this whole time. Here. Take it.', 'serious'),
        ],
      },
      {
        id: 'cafe',
        text: 'Why do you wait for Hayama at Café Lantern?',
        replies: [
          r('Because he’s a creature of habit. Three a.m., every night, same stool.', 'happy'),
          r('Kotone pretends to hate me. She doesn’t. She gives me the burnt end of the cheesecake for free.', 'smug'),
        ],
      },
    ],
    evidence: {
      class_photo: {
        reveal: 'aya_club',
        replies: [
          r('…You got that from Ishida’s flat?', 'serious'),
          r('That’s Hinako Mori. I know the face. She came to my school newspaper club ten years ago, with a notebook full of stories about the reflection room.', 'serious'),
          r('She wanted us to print it. I was a first-year. I told her it wasn’t my call. A week later she fell off the old annex roof.', 'sad'),
          r('I became a reporter because I didn’t say yes when it counted.', 'serious'),
        ],
      },
      ishida_letter: {
        reveal: 'aya_club',
        replies: [
          r('“Don’t make trouble.” He told her that too?', 'serious'),
          r('…I knew her. Hinako Mori. She came to the Seiran newspaper club after that, then. I was in it. Fifteen years old.', 'serious'),
          r('She begged us to print her story about the reflection room. I told her it wasn’t my decision. That’s the same thing he said, isn’t it.', 'sad'),
        ],
      },
      room_73: {
        reveal: 'aya_club',
        replies: [
          r('The reflection room. God. I haven’t heard anyone say that out loud in ten years.', 'serious'),
          r('…I went to Seiran, okay? Hinako Mori came to my newspaper club asking us to write about that room. I was fifteen. I said no. A week later she fell.', 'sad'),
        ],
      },
      pocket_crane: {
        reveal: 'aya_letter',
        replies: [
          r('“Welcome to Mizunagi.” So it’s talking to you now. Great. We’re both on the mailing list.', 'nervous'),
          r('Two months ago, before the first body, one of these turned up in my mailbox. No stamp. It said: “Ask them about Hinako Mori.”', 'nervous'),
          r('That’s why I started digging. And now I can’t decide if my big scoop came straight from the killer’s hands. Here. Take it.', 'serious'),
        ],
      },
      diary_page: {
        reveal: 'aya_letter',
        replies: [
          r('Mori. She was on duty that day…', 'nervous'),
          r('Same paper. Same dye. I know, because I’ve got one. It came in my mailbox two months ago, before anybody died. No stamp, no name.', 'nervous'),
          r('Inside: “Ask them about Hinako Mori.” Take it. I don’t want it any more.', 'serious'),
        ],
      },
      ishida_text: {
        replies: [
          r('“Someone from the old days.” So Ishida knew it was coming, and he still went out to meet them.', 'serious'),
          r('Ten years of cowards, Detective. Everyone from that school kept their mouths shut until people started dying.', 'serious'),
        ],
      },
      aya_tip: {
        replies: [r('Quoting me back to me? I’m flattered. Over forty, here ten years ago. Somebody’s settling accounts.', 'smug')],
      },
    },
    shrug: [
      r('Cute. What am I supposed to do with that?', 'smug'),
      r('Is that evidence, or are you showing me your scrapbook?', 'happy'),
    ],
  },

  // ---------------------------------------------------------------- Chapter 3
  hayama_file: {
    id: 'hayama_file',
    char: 'hayama',
    next: 'ch3_after_hayama',
    opening: [r('…Sit down, Kagami. Ask what you came to ask. I closed that file. You read the signature.', 'serious')],
    secrets: ['hayama_pressure', 'hayama_sister'],
    questions: [
      {
        id: 'case',
        text: 'Tell me about the Mori case.',
        replies: [
          r('Seventeen-year-old falls off a school roof in the rain. Wet concrete, low railing, no witnesses.', 'neutral'),
          r('I went up there myself. Everyone said she slipped. I wrote it up.', 'serious'),
        ],
      },
      {
        id: 'fast',
        text: 'Why was it closed in three days?',
        afterAsked: ['case'],
        replies: [
          r('Because it was an accident. Accidents don’t take long.', 'angry'),
          th('He said it to the table, not to me.'),
        ],
      },
      {
        id: 'who',
        text: 'You don’t believe that. Who leaned on you?',
        afterAsked: ['fast'],
        reveal: 'hayama_pressure',
        replies: [
          r('…', 'serious'),
          r('Third day, the chief called me in. Goro Ueno — school board liaison, your dead man number two — wanted it finished before the entrance exams. For the school’s reputation.', 'serious'),
          r('I had doubts. The homeroom teacher was too calm. The nurse was too quick with her story.', 'serious'),
          r('I signed anyway. Got promoted that autumn. Never said that out loud before.', 'neutral'),
          r('…Got a cigarette on you?', 'neutral'),
        ],
      },
      {
        id: 'asking',
        text: 'Did anyone come asking about her afterwards?',
        afterAsked: ['case'],
        replies: [r('Reporters. The school’s lawyer. Her mother called once, then never again.', 'neutral')],
      },
      {
        id: 'family',
        text: 'Nobody else? No other family?',
        afterAsked: ['asking'],
        reveal: 'hayama_sister',
        replies: [
          r('…Her sister.', 'serious'),
          r('She came every day for a month. Sat in that lobby, polite as anything. University kid, nineteen maybe. Short hair, glasses.', 'neutral'),
          r('I called her Mori-san. Never even asked her first name. Told her to go home and grieve.', 'serious'),
          r('Last visit, she left a white paper crane on my desk. I kept it for a year. Then I threw it away.', 'neutral'),
          r('God. I don’t even know her name.', 'serious'),
        ],
      },
      {
        id: 'crane',
        text: 'Who could have left the crane on your desk?',
        replies: [
          r('Inside the station, Kagami. On my desk. Someone walked straight past my own people and left that.', 'angry'),
          r('They know the file. They know the order. And they know it was me. …I’m not handing this case to anyone else.', 'serious'),
        ],
      },
      {
        id: 'cafe',
        text: 'How long have you been going to Café Lantern?',
        replies: [
          r('Seven years. Since the week she opened. Kotone has my coffee on the counter before I sit down.', 'neutral'),
          r('Only person in this city who doesn’t want something from me.', 'smug'),
        ],
      },
    ],
    evidence: {
      case_file: {
        reveal: 'hayama_pressure',
        replies: [
          r('So you read all of it. Then you noticed the dates.', 'serious'),
          r('Three days, Kagami. I didn’t close it because I believed it. The chief called me in. Ueno wanted it finished before the entrance exams. The school’s reputation.', 'serious'),
          r('I had doubts. Ishida was too calm. Kurosaki was too quick. I signed anyway, and I got promoted that autumn.', 'serious'),
          r('…Never said that out loud before.', 'neutral'),
        ],
      },
      effects_receipt: {
        reveal: 'hayama_sister',
        replies: [
          r('…“Elder sister.” Yeah. She came.', 'serious'),
          r('Every day for a month. Short hair, glasses, maybe nineteen. I called her Mori-san. Never learned her first name. Told her to go home and grieve.', 'neutral'),
          r('Last visit, she left a white paper crane on my desk. Kept it a year. Then I threw it away.', 'neutral'),
        ],
      },
      class_photo: {
        reveal: 'hayama_sister',
        replies: [
          r('That’s her. Hinako.', 'serious'),
          r('Her sister brought me that same photo. Came in every day for a month — short hair, glasses, polite as anything. I told her to go home.', 'neutral'),
          r('Last time, she left a white crane on my desk. I never even asked her name.', 'serious'),
        ],
      },
      desk_crane: {
        replies: [
          r('Inside my own station. Past my own people. Whoever folded that knows exactly what I did.', 'angry'),
          r('Crane or no crane, I’m staying on this case.', 'serious'),
        ],
      },
      victims_list: {
        replies: [
          r('Same four names as the statements in that file. Same order as the bodies.', 'serious'),
          r('Somebody read the Mori file a lot closer than I ever did.', 'neutral'),
        ],
      },
    },
    shrug: [r('What am I looking at, kid?', 'neutral'), r('That’s not about her. Stay on her.', 'serious')],
  },

  mikami_morgue: {
    id: 'mikami_morgue',
    char: 'mikami',
    next: 'ch3_after_mikami',
    opening: [r('Detective. Visiting hours for the living are short, so be efficient. You’re here about a ten-year-old death, not about Mr. Ishida. I can tell from your face.', 'neutral')],
    secrets: ['old_autopsy', 'knife_profile'],
    questions: [
      {
        id: 'four',
        text: 'You examined all four victims.',
        replies: [
          r('One cut each. From behind, left to right. A right-handed person.', 'neutral'),
          r('Yes, Detective, I am right-handed. So is ninety percent of the city. I’m flattered you noticed.', 'smug'),
        ],
      },
      {
        id: 'alibi',
        text: 'Where were you on Friday between ten and eleven?',
        afterAsked: ['four'],
        replies: [
          r('Here. With a drowning victim from the harbour and a vending-machine coffee. The door log will say the same.', 'smug'),
          r('You may check. I would think less of you if you didn’t.', 'neutral'),
        ],
      },
      {
        id: 'seiran',
        text: 'Did you go to Seiran Academy?',
        replies: [r('Public school, two cities away. Their uniforms were nicer than ours. That is the extent of my knowledge.', 'neutral')],
      },
      {
        id: 'howlong',
        text: 'How long have you worked here?',
        replies: [r('Eleven years. I started as a trainee. I was twenty-one, and I still believed reports were read.', 'neutral')],
      },
      {
        id: 'hinako',
        text: 'Then you were here ten years ago. Did you see Hinako Mori?',
        afterAsked: ['howlong'],
        reveal: 'old_autopsy',
        replies: [
          r('…Yes.', 'serious'),
          r('I assisted at her autopsy. I recorded grip bruises on both wrists. Adult fingers. And sedatives in her blood, with no prescription anywhere.', 'serious'),
          r('My supervisor called the bruises “consistent with the fall” and signed it as an accident.', 'serious'),
          r('I kept my own notes. I have never shown them to anyone. Until now, apparently.', 'neutral'),
        ],
      },
      {
        id: 'killer',
        text: 'What do the wounds tell you about the killer?',
        replies: [r('Calm. Practised. No hesitation marks, no second tries. This person has done this motion many, many times.', 'serious')],
      },
      {
        id: 'weapon',
        text: 'What kind of blade does that?',
        afterAsked: ['killer'],
        reveal: 'knife_profile',
        replies: [
          r('Off the record?', 'smug'),
          r('The same blade every time. Short, thin, single-edged, kept razor sharp. A kitchen petty knife — the small one cooks use all day.', 'serious'),
          r('I left it out of my reports as speculation. It still is. But whoever this is cuts things for a living.', 'neutral'),
        ],
      },
    ],
    evidence: {
      case_file: {
        reveal: 'old_autopsy',
        replies: [
          r('You brought that file in here.', 'serious'),
          r('Then you should know I was a trainee at this office that June, and I assisted at her autopsy. Grip bruises on both wrists — adult fingers. Sedatives in her blood with no prescription anywhere.', 'serious'),
          r('My supervisor said the bruises were from the fall and signed it an accident. I kept my own notes.', 'serious'),
          r('I have never shown them to anyone. Until now.', 'neutral'),
        ],
      },
      hayama_pressure: {
        reveal: 'old_autopsy',
        replies: [
          r('Pressure from the board. That explains why my supervisor was in such a hurry.', 'serious'),
          r('I was the trainee at that autopsy, Detective. Bruises on both wrists, fingers. Sedatives. He called it the fall. I kept my notes.', 'serious'),
        ],
      },
      autopsy: {
        reveal: 'knife_profile',
        replies: [
          r('My notes are incomplete. Deliberately.', 'smug'),
          r('All four wounds came from the same blade: short, thin, single-edged, kept razor sharp. A kitchen petty knife.', 'serious'),
          r('The cuts are economical. Someone whose hands have made this motion every day for years. A cook, perhaps. I called it speculation. It still is.', 'neutral'),
        ],
      },
      ink_hand: {
        replies: [r('I had his palm under UV. A seven, a dash, and a three. I gather you’ve already worked out what it means.', 'smug')],
      },
      room_73: {
        replies: [r('A room they locked children in. I’ve seen what that does to a body over the years. Mostly it doesn’t show. That is the point of it.', 'serious')],
      },
    },
    shrug: [r('That is not medical evidence, Detective.', 'neutral'), r('Interesting. Irrelevant, but interesting.', 'smug')],
  },

  // ---------------------------------------------------------------- Chapter 4
  kirishima_interview: {
    id: 'kirishima_interview',
    char: 'kirishima',
    next: 'ch4_after_kirishima',
    opening: [r('I have agreed to this conversation as a courtesy, young man. I ran a school for twenty years. I do not require protection, and I do not require questioning.', 'smug')],
    secrets: ['kirishima_truth', 'bell_owner'],
    questions: [
      {
        id: 'where',
        text: 'Where were you on the fourteenth of June, ten years ago?',
        replies: [r('In Kyoto, at the National Education Conference. It is in the file. I assume you can read.', 'smug')],
      },
      {
        id: 'confirm',
        text: 'Who can confirm you were in Kyoto?',
        afterAsked: ['where'],
        replies: [
          r('My secretary arranged everything. She kept impeccable records.', 'smug'),
          th('Records she wrote. Not a single witness who saw him there.'),
        ],
      },
      {
        id: 'roof',
        text: 'Hinako wrote that you asked to meet her on the roof that day.',
        afterAsked: ['confirm'],
        reveal: 'kirishima_truth',
        replies: [
          r('She— a schoolgirl’s diary is hardly—', 'angry'),
          r('…', 'nervous'),
          r('Very well. I was there. On the roof, in the rain. She said she had copies and would go to the newspapers.', 'nervous'),
          r('I took her wrists. Only to take the notebook from her. She twisted free. She stepped back, and the railing was so low.', 'shocked'),
          r('I let go. I did not push her. I let go. And the next day my secretary recorded Kyoto, because the truth would have ended everything I had built.', 'nervous'),
        ],
      },
      {
        id: 'room',
        text: 'What was room 7-3?',
        replies: [r('A quiet room. Students who needed guidance were given time to reflect. It was standard practice at the time.', 'smug')],
      },
      {
        id: 'howmany',
        text: 'How many children did you lock in there?',
        afterAsked: ['room'],
        replies: [r('I do not remember numbers, young man. I remember results. Seiran’s results were excellent.', 'angry')],
      },
      {
        id: 'family',
        text: 'Did Hinako’s family ever contact you?',
        replies: [r('Her mother wrote a letter. My lawyer answered it.', 'neutral')],
      },
      {
        id: 'gate',
        text: 'Only her mother? Nobody came to your house?',
        afterAsked: ['family'],
        reveal: 'bell_owner',
        replies: [
          r('…There was a girl.', 'nervous'),
          r('About a month after that unfortunate incident. University age, short hair, glasses. Hinako’s elder sister. She stood at my gate and screamed that I had killed her sister.', 'nervous'),
          r('Hanging from her bag was a little silver bell. I knew it. Hinako wore it on her school bag every day, until I confiscated it once for the noise.', 'nervous'),
          r('I had the police remove her. I never learned her name, and I never saw her again.', 'neutral'),
        ],
      },
      {
        id: 'sender',
        text: 'Who do you think pinned that crane to your door?',
        replies: [r('A disgruntled former student. There are always a few. Weak people blame structure for their own failures.', 'smug')],
      },
    ],
    evidence: {
      last_entry: {
        reveal: 'kirishima_truth',
        replies: [
          r('…So that is what you have.', 'nervous'),
          r('Yes. I was there. On the roof, in the rain. She said she had copies and would go to the papers.', 'nervous'),
          r('I only took her wrists, Detective. Only to take the notebook from her. She twisted free. She stepped back. The railing…', 'shocked'),
          r('I let go. I did not push. I swear to you I let go. Then I drove home, and the next day I had my secretary record Kyoto.', 'nervous'),
        ],
      },
      old_autopsy: {
        reveal: 'kirishima_truth',
        replies: [
          r('Bruises. Of course there were bruises, I—', 'shocked'),
          r('I held her wrists. Only for a moment. She pulled away and she… the railing. I let go. It was an accident. I simply was not in Kyoto.', 'nervous'),
        ],
      },
      hinako_notebook: {
        reveal: 'bell_owner',
        replies: [
          r('The notebook. And the bell…', 'nervous'),
          r('You should understand something, Detective. A month after that unfortunate incident, a young woman came to my house. Short hair, glasses. Hinako’s elder sister.', 'nervous'),
          r('She stood at my gate and screamed that I had killed her sister. Hanging from her bag was a tiny silver bell. Hinako’s. I had confiscated it from her once.', 'nervous'),
          r('I had the police remove the girl. I never learned her name.', 'neutral'),
        ],
      },
      hayama_sister: {
        reveal: 'bell_owner',
        replies: [
          r('The sister. Yes. She came to my house as well, a month later. Screamed at my gate.', 'nervous'),
          r('Glasses, short hair, and that wretched little bell of Hinako’s on her bag, jingling with every step. I had her removed.', 'nervous'),
        ],
      },
      bell_sound: {
        reveal: 'bell_owner',
        replies: [
          r('A bell…', 'nervous'),
          r('The Mori girl wore a little silver bell on her bag. When her sister came to my gate to scream at me, it was hanging from hers. I have not thought of that sound in ten years.', 'nervous'),
        ],
      },
      door_crane: {
        replies: [
          r('“Confess.” To what? To running a school with standards?', 'smug'),
          r('I will be at home tonight with your officers in my garden. I trust that will be adequate.', 'neutral'),
        ],
      },
      room_73: {
        replies: [r('A quiet room for reflection. Students who are given structure become adults who are grateful for it.', 'smug')],
      },
      case_file: {
        replies: [r('Kyoto. As you see. The record is quite clear.', 'smug')],
      },
    },
    shrug: [
      r('I fail to see the relevance.', 'neutral'),
      r('Is this how they train detectives now? Waving paper at their elders?', 'angry'),
    ],
  },
}
