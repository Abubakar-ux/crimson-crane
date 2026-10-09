# Crimson Crane — Game Overview

![Cast](images/cast.png)

> Spoiler-free. The full solution of the mystery is in [STORY_BIBLE.md](STORY_BIBLE.md) — don't open it if you want to play blind.

## At a glance

| | |
|---|---|
| **Genre** | Mystery / detective visual novel |
| **Style** | Anime art, dark noir atmosphere — inspired by *Danganronpa* and *Ace Attorney* |
| **Tone** | Dark and tense; crime scenes are described frankly, with moments of dry humor |
| **Player** | Detective Ren Kagami |
| **Setting** | Mizunagi, a rain-soaked Japanese port town, present day |
| **Length** | 3 chapters planned; Chapter 1 is about 20–30 minutes |
| **Platforms** | Web (browser) today; PC and mobile builds planned |
| **Signature feature** | Interrogations where you type your own questions and an AI plays the suspect |

## The story

For nine weeks, a killer the newspapers call **the Crimson Crane** has stalked Mizunagi. Four victims — a pharmacist, a city councilman, a nurse, and now a retired schoolteacher — each found with a single precise wound and a **red paper crane** left on the body. Different ages, different jobs, different neighborhoods. No witnesses. No pattern anyone can see.

**Ren Kagami**, 24, transferred from Tokyo, was supposed to start work on Monday. At 1:12 a.m. on Saturday he's standing under Shirasagi Bridge in the rain, looking at the fourth victim — and at the faint printing that bleeds through the red dye of the crane: *Seiran Academy — Class 2-B.*

Partnered with a burnt-out veteran inspector, Ren has to work out what connects the victims before the next crane is folded. Everyone he meets is hiding something. Some of them are hiding the wrong things.

### Chapters

1. **The Fourth Crane** — the bridge, a frightened witness, a late-night café, and a message from the killer that ends the night. *(playable)*
2. **Class 2-B** — the trail leads to Seiran Academy and to something that happened there ten years ago. *(planned)*
3. **One Thousand Cranes** — a race to stop the next murder, and a final confrontation where Ren must prove who the Crimson Crane is with the evidence he's gathered. *(planned)*

## Characters

| Character | Role |
|---|---|
| **Ren Kagami** (24) | The player. Quiet, observant, stubborn rookie detective. Still sleeps at night — for now. |
| **Daigo Hayama** (48) | Lead inspector on the case. Chain-smoking, exhausted, angrier at himself than at anyone else. |
| **Shiori Mikami** (31) | Medical examiner. Deadpan, precise, more polite to corpses than to people. |
| **Yuki Sakuraba** (17) | Seiran Academy student who found the fourth body. Quiet, sharp — and not telling the whole truth. |
| **Kotone Amane** (27) | Owner of Café Lantern, open late for exhausted cops. Warm, teasing, always folding paper cranes. |
| **Aya Tsukishima** (26) | Reporter for the Mizunagi Herald. Loud, nosy, and right more often than the police would like. |

## How it plays

### Story scenes
Classic visual novel presentation: illustrated characters over painted backgrounds, a typewriter dialogue box, Ren's inner thoughts, and dramatic effects (screen shake, red flashes, thunder) at key moments. Click, Space or Enter to advance.

- **Event illustrations** — the biggest moments, like the discovery of a victim, get a full-screen illustrated scene. The game does not shy away from blood.
- **Ren's portrait** — the protagonist is always shown in the bottom-left corner. It lights up when he speaks or thinks, and his expression (calm, serious, shocked) reacts to what he's seeing.

### Investigation
At crime scenes you choose what to examine — the body, the crane, the inspector's case notes. Each thread adds **evidence** to Ren's Case Notebook. Key conversations unlock once you've seen enough.

### Interrogation — the core mechanic
Witnesses and suspects have **secrets**. Instead of picking from a menu, you:

- **Type any question** in your own words — kind, aggressive, clever, or sideways.
- **Present evidence** from the notebook to catch a lie ("Then explain *this*").
- Watch the character's **expression change** as they react — nervous, angry, shocked, breaking down.

Each secret has a condition: the character only gives it up when you ask about the right thing, press the right contradiction, or show the right evidence. A progress tracker shows how many secrets remain. When everything is uncovered, the story moves on.

Behind the scenes, an AI language model plays the character using a detailed character card — personality, speech style, what they know, what they're hiding and when they'd reveal it. The game validates everything the AI says against the script, so **the AI can never invent clues, change the facts, or reveal the killer**. Characters who are innocent aren't even told who the killer is.

### Case Notebook & Log
- **Evidence** — every clue with its full description; also used to present evidence during interrogations.
- **People** — portraits and profiles of everyone Ren has met.
- **Log** — the complete dialogue history.

## Art and audio direction

- **Visuals:** anime cel-shaded characters with multiple expressions each, painted night-time backgrounds (train station, bridge crime scene, patrol car, Café Lantern), a black-and-hot-pink interface with slanted, comic-style panels.
- **Atmosphere:** constant rain, police lights, harsh floodlights against warm café light.
- **Music:** melancholic piano for the title, tense ambient investigation themes, eerie drones at the crime scene, a pulsing interrogation track, and rainy-night lounge jazz at the café.
- **Sound:** rain ambience, thunder, door slams, an evidence chime, and impact stingers for the big reveals.

## Technology

| Part | Choice |
|---|---|
| Engine | Custom visual novel engine — React + TypeScript, built with Vite |
| State | Zustand; autosave to the browser |
| AI | GLM models via OpenRouter, behind a local proxy so the API key never reaches the player |
| Art pipeline | PixAI (Tsubaki.3 Flash) for generation and expression edits; `rembg` (anime model) for background removal |
| Audio | Pixabay music and sound effects; crossfading music and ambience channels |

## Release plan

The final release is planned as **scripted-only**: every AI interrogation during development is saved, and the best lines are curated into fixed dialogue. That makes the published game free to run, fully offline, and consistent for every player. Planned targets are PC (Electron/Tauri → Steam / itch.io) and mobile (Capacitor → Google Play / App Store).

## Roadmap

- [x] Chapter 1 — story, investigation, AI interrogation, full art, music and sound
- [ ] Chapter 2 script and art
- [ ] Chapter 3 script, final accusation sequence, multiple endings
- [ ] Curate AI transcripts into scripted interrogations
- [ ] Final music (licensed for commercial release)
- [ ] PC and mobile builds
