// Plays Chapter 1 automatically and records it to video, logging every audio cue.
// The dev server must be running (npm run dev). Then:  node tools/record_walkthrough.mjs
// Output: walkthrough/raw.webm + walkthrough/audio_cues.json (merged by tools/make_walkthrough.py)
import { chromium } from 'playwright'
import { mkdir, readdir, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const URL = 'http://localhost:5173'
const OUT = 'walkthrough'
const W = 1280
const H = 720
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })
const context = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: OUT, size: { width: W, height: H } } })
const t0 = Date.now() // video starts recording with the page

// Log audio: page audio isn't captured by the recorder, so we rebuild it from these cues.
await context.addInitScript(() => {
  window.__cues = []
  const play = HTMLMediaElement.prototype.play
  HTMLMediaElement.prototype.play = function () {
    window.__cues.push({ at: Date.now(), kind: 'play', src: new URL(this.src).pathname, loop: this.loop })
    const el = this
    if (!el.__hooked) {
      el.__hooked = true
      el.addEventListener('pause', () => window.__cues.push({ at: Date.now(), kind: 'pause', src: new URL(el.src).pathname }))
    }
    return play.call(this)
  }
  try { localStorage.removeItem('crimson-crane:autosave') } catch {}
})

const page = await context.newPage()
await page.goto(URL)
await sleep(2500) // linger on the title screen
await page.getByRole('button', { name: 'New Game' }).click()

const choicePlan = ['Examine the body', 'Examine the paper crane', 'Ask Hayama', 'Talk to the witness', 'Ask about the cranes']
const questions = [
  { ask: 'You look terrified. Nobody here thinks you did this. What really happened tonight?' },
  { present: 'Autopsy' },
  { present: 'Fourth Crane' },
  { ask: 'Did you know the man under the bridge? Why were you really out so late?' },
  { present: 'Autopsy' },
]

async function interrogate() {
  for (const q of questions) {
    if (await page.locator('.int-done').count()) break
    if (q.ask) {
      await page.locator('.int-input input').click()
      await page.keyboard.type(q.ask, { delay: 18 })
      await sleep(300)
      await page.locator('.int-input button[type=submit]').click()
    } else {
      await page.locator('.present-btn').click()
      await sleep(700)
      await page.locator('.nb-list li', { hasText: q.present }).click()
      await sleep(900)
      await page.locator('.present').click()
    }
    await sleep(500)
    await page.waitForFunction(() => !document.querySelector('.typing'), null, { timeout: 60000 })
    // let the viewer read the reply
    const last = await page.locator('.int-line.them').last().innerText()
    await sleep(Math.min(5500, 1500 + last.length * 22))
  }
  await sleep(1200)
  await page.locator('.int-done .primary').click()
}

for (let guard = 0; guard < 600; guard++) {
  if (await page.locator('.card.end').count()) {
    await sleep(4500)
    break
  }
  if (await page.locator('.card').count()) {
    await sleep(2200)
    await page.locator('.card').click()
    continue
  }
  if (await page.locator('.interrogation').count()) {
    await sleep(1500)
    await interrogate()
    continue
  }
  if (await page.locator('.choices button').count()) {
    await sleep(1200)
    const labels = await page.locator('.choices button').allInnerTexts()
    const next = choicePlan.find((c) => labels.some((l) => l.includes(c))) ?? labels[0]
    await page.locator('.choices button', { hasText: next }).first().hover()
    await sleep(600)
    await page.locator('.choices button', { hasText: next }).first().click()
    continue
  }
  if (await page.locator('.dialogue').count()) {
    // wait for the typewriter to finish, then a short reading pause
    await page.waitForSelector('.dialogue .next-arrow', { timeout: 20000 }).catch(() => {})
    const text = await page.locator('.dialogue p').innerText().catch(() => '')
    await sleep(Math.min(2600, 650 + text.length * 16))
    await page.locator('.dialogue').click()
    await sleep(150)
    continue
  }
  await sleep(200)
}

const cues = await page.evaluate(() => window.__cues)
const end = Date.now()
await context.close() // finalises the video file
await browser.close()

const vid = (await readdir(OUT)).find((f) => f.endsWith('.webm') && f !== 'raw.webm')
await rename(join(OUT, vid), join(OUT, 'raw.webm'))
await writeFile(join(OUT, 'audio_cues.json'), JSON.stringify({ t0, end, cues }, null, 2))
console.log(`recorded ${((end - t0) / 1000).toFixed(1)}s, ${cues.length} audio cues`)
