<p align="center">
  <img src="docs/images/banner.png" alt="Crimson Crane" width="100%">
</p>

# Crimson Crane

**An anime detective visual novel about a serial killer who leaves red paper cranes — where you question suspects in your own words.**

Four bodies in nine weeks. Four red paper cranes. Rookie detective **Ren Kagami** arrives in the rain-soaked port town of Mizunagi on the night the fourth victim is found — and before dawn, the killer has already left a crane in *his* pocket.

Crimson Crane is a dark mystery in the spirit of *Danganronpa* and *Ace Attorney*. Investigate crime scenes, collect evidence, and interrogate witnesses who have something to hide. During interrogations there are no dialogue menus: you **type your own questions**, present evidence, and an AI plays each character in real time — but the mystery itself is fully scripted, so the truth never changes.

| The fourth victim | The crime scene |
|---|---|
| ![The body under Shirasagi Bridge](docs/images/screenshot_body.jpg) | ![Dr. Mikami at the crime scene](docs/images/screenshot_bridge.jpg) |
| **Interrogate in your own words** | **Café Lantern** |
| ![Interrogating Yuki](docs/images/screenshot_interrogation.jpg) | ![Café Lantern](docs/images/screenshot_cafe.jpg) |

> ⚠️ Contains depictions of violence and blood.

## Features

- **Free-text interrogations** — ask anything; characters answer in character, lie, deflect, and crack when you push the right way or present the right evidence.
- **A fixed, fair mystery** — the killer, clues and endings are hand-written. The AI can only reveal secrets the story defines, so it can't invent evidence or spoil the culprit.
- **Case Notebook** — every clue and every person you meet, with a full dialogue log.
- **Event illustrations** — full-screen crime-scene artwork for the story's biggest moments.
- **Protagonist portrait** — Ren is always on screen in the corner, lighting up when he speaks and reacting to what he sees.
- **Anime art and atmosphere** — fully illustrated cast with expressions, rainy-night backgrounds, music, ambience and sound effects.
- **Works offline** — no AI key? Interrogations fall back to scripted replies and the game stays fully playable.
- **Autosave** and continue, volume settings, keyboard controls (Space / Enter).

## Status

| Chapter | Status |
|---|---|
| 1 — The Fourth Crane | ✅ Playable (story, art, music, AI interrogation) |
| 2 — Class 2-B | 📝 Planned |
| 3 — One Thousand Cranes | 📝 Planned |

Read the full game description in **[docs/GAME_OVERVIEW.md](docs/GAME_OVERVIEW.md)**.

## Running it

Requires [Node.js](https://nodejs.org) (LTS).

```bash
npm install
npm run dev
```

Open http://localhost:5173 and click once to enable sound.

### Turning on AI interrogations (optional)

1. Create a key at [openrouter.ai](https://openrouter.ai) → *Keys* (give it a small credit limit).
2. Copy `.env.example` to `.env` and paste the key after `OPENROUTER_API_KEY=`.
3. Optionally change `OPENROUTER_MODEL` (default `z-ai/glm-5.3-flash`). Reload the game.

The key is read only by the local dev server and never reaches the browser. `.env` is git-ignored — **never commit it**.

## Project layout

| Path | What |
|---|---|
| `src/game/script/` | Story script — scenes, dialogue, choices, music cues |
| `src/game/interrogations.ts` | AI character cards, secrets, and scripted fallbacks |
| `src/game/characters.ts`, `clues.ts` | Cast (incl. sprite files per emotion) and evidence |
| `src/game/store.ts` | Script engine, flags, clues, autosave |
| `src/game/audio.ts` | Music, ambience and sound effects |
| `src/ai/interrogate.ts` | Prompt building, OpenRouter call, reply validation |
| `vite.config.ts` | Local `/api/chat` proxy that holds the API key; saves AI transcripts |
| `public/` | Sprites, backgrounds, music and sound effects used by the game |
| `art-source/` | Original full-size art before background removal |
| `tools/` | Python helpers: background removal, comparison sheets, banner |
| `transcripts/` | Saved AI interrogations, for curating into fixed dialogue later |
| `docs/STORY_BIBLE.md` | ⚠️ **Spoilers** — the full truth of the case |
| `CREDITS.md` | Source and license of every art, music and sound file |

## Credits

Character art and backgrounds generated with [PixAI](https://pixai.art). Music and sound effects from [Pixabay](https://pixabay.com). Interrogation dialogue powered by GLM via [OpenRouter](https://openrouter.ai). Full list in [CREDITS.md](CREDITS.md).
