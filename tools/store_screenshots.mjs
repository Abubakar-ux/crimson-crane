// Capture 1280x720 store screenshots of key scenes by loading crafted saves.
// Usage: node tools/store_screenshots.mjs   (dev server must be running on :5173)
import { chromium } from 'playwright'

const URL = 'http://localhost:5173/'
const OUT = 'release/screenshots'
const allClues = ['victims_list', 'autopsy', 'ink_hand', 'red_crane', 'bell_sound', 'ishida_text', 'aya_tip', 'pocket_crane', 'diary_page', 'class_photo', 'ishida_letter', 'room_73', 'aya_club', 'aya_letter', 'case_file', 'effects_receipt', 'desk_crane', 'hayama_pressure', 'hayama_sister', 'old_autopsy', 'knife_profile', 'hinako_notebook', 'last_entry', 'door_crane', 'kirishima_truth', 'bell_owner', 'cafe_bell', 'family_register', 'cafe_photo', 'crane_999', 'rooftop_bell']
const base = { stage: [], log: [], amb: 'rain', cg: null, ren: 'serious', met: ['hayama', 'mikami', 'yuki', 'kotone', 'aya', 'kirishima'] }

// [file, save, number of lines to advance, extra action]
const shots = [
  ['01_interrogation_kirishima', { ...base, scene: 'ch4_start', idx: 0, bg: 'interview_room', clues: allClues.slice(0, 24), flags: [] }, 6, 'ask'],
  ['02_annex', { ...base, scene: 'ch3_annex', idx: 0, bg: 'annex_hall', clues: allClues.slice(0, 20), flags: [] }, 3],
  ['03_rooftop', { ...base, scene: 'ch4_roof', idx: 0, bg: 'rooftop_night', clues: allClues.slice(0, 29), flags: [] }, 1],
  ['04_accusation', { ...base, scene: 'ch5_q1', idx: 0, bg: 'cafe_night', clues: allClues, flags: ['bell_lost'], stage: [{ char: 'hayama', emotion: 'serious', pos: 'left' }, { char: 'kotone', emotion: 'smug', pos: 'center' }] }, 1, 'close'],
  ['05_confession', { ...base, scene: 'ch5_confession', idx: 0, bg: 'cafe_night', clues: allClues, flags: ['bell_lost'] }, 1],
  ['06_school', { ...base, scene: 'ch2_school', idx: 0, bg: 'seiran_gate', clues: allClues.slice(0, 11), flags: [] }, 9],
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
for (const [name, save, steps, extra] of shots) {
  await page.goto(URL)
  await page.evaluate((s) => localStorage.setItem('crimson-crane:autosave', JSON.stringify(s)), save)
  await page.reload()
  await page.click('.title-buttons button:nth-child(2)')
  await sleep(700)
  // Each step: one click finishes the typewriter, the second advances.
  const tap = () => page.evaluate(() => document.querySelector('.dialogue, .card')?.click())
  for (let i = 0; i < steps; i++) {
    await tap()
    await sleep(60)
    await tap()
    await sleep(250)
  }
  await tap() // finish the current line
  if (extra === 'ask') {
    for (const q of ['Where were you', 'Who can confirm']) {
      await page.click(`.int-questions button:has-text("${q}")`)
      await sleep(2600)
    }
  }
  if (extra === 'close') await page.click('.modal .close').catch(() => {})
  await sleep(900)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('saved', name)
}
await browser.close()
