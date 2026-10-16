import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const base = process.env.TEST_BASE_URL || 'http://localhost:3098',
  browser = await chromium.launch({
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  timezoneId: 'America/Los_Angeles',
})
await context.addInitScript(() => {
  window.__plays = 0
  const p = HTMLMediaElement.prototype
  Object.defineProperty(p, 'currentSrc', {
    get() {
      return this.src
    },
  })
  Object.defineProperty(p, 'paused', {
    get() {
      return this.__paused !== false
    },
  })
  p.load = function () {}
  p.play = function () {
    this.__paused = false
    window.__plays++
    return Promise.resolve()
  }
  p.pause = function () {
    this.__paused = true
  }
})
await context.route('https://cdn.islamic.network/**', (r) => r.abort())
const page = await context.newPage(),
  errors = [],
  media = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('request', (r) => {
  if (r.url().includes('cdn.islamic.network')) media.push(r.url())
})
await page.goto(base + '/adhkar')
for (const route of ['morning', 'evening', 'after-prayer'])
  assert.equal(await page.locator(`a[href="/adhkar/${route}"]`).count(), 1)
await page.goto(base + '/adhkar/morning')
assert.equal(await page.getByTestId('adhkar-card').count(), 11)
assert.equal(await page.getByTestId('quran-adhkar-verse').count(), 15)
assert.deepEqual(media, [])
const ikhlas = page.locator('#dhikr-ikhlas'),
  count = ikhlas.getByTestId('count')
await ikhlas.getByRole('button', { name: 'Count Surah Al-Ikhlas', exact: true }).click()
assert.match(await count.innerText(), /1 \/ 3/)
await page.reload()
await page.waitForFunction(() =>
  document.querySelector('#dhikr-ikhlas [data-testid="count"]')?.textContent.includes('1 / 3')
)
await context.setOffline(true)
await ikhlas.getByRole('button', { name: 'Count Surah Al-Ikhlas', exact: true }).click()
assert.match(await count.innerText(), /2 \/ 3/)
await context.setOffline(false)
await ikhlas.getByRole('button', { name: 'Listen once', exact: true }).click()
await page.waitForFunction(() => window.__plays === 1)
await ikhlas.getByRole('button', { name: 'Undo Surah Al-Ikhlas', exact: true }).click()
assert.match(await count.innerText(), /1 \/ 3/)
assert.equal(
  await page.evaluate(() => window.__plays),
  1,
  'counter interaction must not restart audio'
)
await page.getByRole('button', { name: 'Stop', exact: true }).click()
await page.locator('audio').waitFor({ state: 'detached' })
await ikhlas.getByRole('button', { name: 'Mark all 3 for Surah Al-Ikhlas', exact: true }).click()
assert.match(await count.innerText(), /3 \/ 3/)
assert.equal(
  await ikhlas.getByRole('button', { name: 'Count Surah Al-Ikhlas', exact: true }).isDisabled(),
  true
)
await page.getByRole('button', { name: 'Continue where I left off', exact: true }).click()
assert.equal(await page.evaluate(() => document.activeElement.id), 'dhikr-falaq')
await page.getByRole('button', { name: 'Reset this session', exact: true }).click()
await page.getByRole('button', { name: 'Cancel', exact: true }).click()
assert.match(await count.innerText(), /3 \/ 3/)
// A second tab receives updates and updates the existing count rather than replacing it.
const second = await context.newPage()
await second.goto(base + '/adhkar/morning')
await second
  .locator('#dhikr-ikhlas')
  .getByRole('button', { name: 'Undo Surah Al-Ikhlas', exact: true })
  .click()
await page.waitForFunction(() =>
  document.querySelector('#dhikr-ikhlas [data-testid="count"]')?.textContent.includes('2 / 3')
)
await second.close()
await page.goto(base + '/adhkar/evening')
assert.match(await page.locator('#dhikr-ikhlas').getByTestId('count').innerText(), /0 \/ 3/)
await page.goto(base + '/adhkar/after-prayer')
assert.equal(await page.getByTestId('adhkar-card').count(), 10)
await page.getByLabel('Prayer session', { exact: true }).selectOption('fajr')
await page
  .locator('#dhikr-ikhlas')
  .getByRole('button', { name: 'Listen once', exact: true })
  .click()
await page.locator('audio').waitFor()
await page.evaluate(() => (window.__previousSessionAudio = document.querySelector('audio')))
await page
  .locator('#dhikr-istighfar')
  .getByRole('button', { name: 'Count Ask Allah’s forgiveness', exact: true })
  .click()
await page.getByLabel('Prayer session', { exact: true }).selectOption('isha')
await page.waitForFunction(() => window.__previousSessionAudio.paused)
await page.locator('audio').waitFor({ state: 'detached' })
assert.match(await page.locator('#dhikr-istighfar').getByTestId('count').innerText(), /0 \/ 3/)
await page.getByLabel('Prayer session', { exact: true }).selectOption('fajr')
await page.waitForFunction(() =>
  document.querySelector('#dhikr-istighfar [data-testid="count"]')?.textContent.includes('1 / 3')
)
await page.getByLabel('Tasbih sequence', { exact: true }).selectOption('34')
assert.equal(await page.getByTestId('adhkar-card').count(), 9)
assert.equal(await page.locator('#dhikr-tahlil').count(), 0)
assert.match(await page.locator('#dhikr-takbir').getByTestId('count').innerText(), /0 \/ 34/)
assert.match(await page.locator('#dhikr-istighfar').getByTestId('count').innerText(), /0 \/ 3/)
for (const card of await page.getByTestId('adhkar-card').all()) {
  const bulk = card.getByRole('button', { name: /^Mark all/ })
  if (await bulk.count()) await bulk.click()
  else await card.getByRole('button', { name: /^Count / }).click()
}
await page.getByTestId('routine-complete').waitFor()
await page.reload()
await page.getByLabel('Prayer session', { exact: true }).selectOption('fajr')
await page.getByLabel('Tasbih sequence', { exact: true }).selectOption('34')
await page.getByTestId('routine-complete').waitFor()
await page
  .locator('#dhikr-takbir')
  .getByRole('button', { name: 'Undo Allahu Akbar', exact: true })
  .click()
assert.equal(await page.getByTestId('routine-complete').count(), 0)
await page.getByRole('button', { name: 'Reset this session', exact: true }).click()
await page.getByRole('button', { name: 'Confirm reset', exact: true }).click()
assert.match(await page.getByTestId('routine-progress').innerText(), /0 \/ 9/)
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
await page.goto(base + '/dhikr')
for (let i = 0; i < 40; i++)
  await page.evaluate(() => document.querySelector('[aria-label="Tap to count"]').click())
assert.equal(await page.getByTestId('tasbeeh-count').innerText(), '33')
await page.getByRole('button', { name: 'Undo one', exact: true }).click()
assert.equal(await page.getByTestId('tasbeeh-count').innerText(), '32')
await page.getByLabel('Tasbih sequence', { exact: true }).selectOption('33-tahlil')
assert.equal(await page.getByTestId('tasbeeh-count').innerText(), '0')
assert.equal(
  await page.getByRole('button', { name: 'Complete the hundred', exact: true }).count(),
  1
)
assert.deepEqual(errors, [])
await context.close()

const timed = await browser.newContext({ timezoneId: 'America/Los_Angeles' })
const clock = await timed.newPage()
await clock.clock.install({ time: new Date('2026-10-14T06:59:58Z') })
await clock.goto(base + '/adhkar/morning')
await clock
  .locator('#dhikr-ikhlas')
  .getByRole('button', { name: 'Count Surah Al-Ikhlas', exact: true })
  .click()
assert.match(
  await clock.getByRole('region', { name: 'Routine progress' }).innerText(),
  /2026-10-13/
)
await clock.clock.runFor(4000)
await clock.waitForFunction(() =>
  document.querySelector('#dhikr-ikhlas [data-testid="count"]')?.textContent.includes('0 / 3')
)
assert.match(
  await clock.getByRole('region', { name: 'Routine progress' }).innerText(),
  /2026-10-14/
)
await timed.close()

const blocked = await browser.newContext()
await blocked.addInitScript(() => {
  Object.defineProperty(window, 'localStorage', {
    get() {
      throw new Error('blocked')
    },
  })
})
const bp = await blocked.newPage()
await bp.goto(base + '/adhkar/morning')
await bp.getByRole('alert').filter({ hasText: 'cannot save' }).waitFor()
await bp
  .locator('#dhikr-ikhlas')
  .getByRole('button', { name: 'Count Surah Al-Ikhlas', exact: true })
  .click()
await bp
  .locator('#dhikr-ikhlas')
  .getByRole('button', { name: 'Count Surah Al-Ikhlas', exact: true })
  .click()
assert.match(await bp.locator('#dhikr-ikhlas').getByTestId('count').innerText(), /2 \/ 3/)
await blocked.close()

const quota = await browser.newContext()
await quota.addInitScript(() => {
  Storage.prototype.setItem = function () {
    throw new DOMException('Full', 'QuotaExceededError')
  }
})
const qp = await quota.newPage()
await qp.goto(base + '/adhkar/morning')
for (let i = 0; i < 2; i++)
  await qp
    .locator('#dhikr-ikhlas')
    .getByRole('button', { name: 'Count Surah Al-Ikhlas', exact: true })
    .click()
await qp.getByRole('alert').filter({ hasText: 'cannot save' }).waitFor()
assert.match(await qp.locator('#dhikr-ikhlas').getByTestId('count').innerText(), /2 \/ 3/)
await quota.close()

const rtl = await browser.newContext({ viewport: { width: 390, height: 844 } }),
  rp = await rtl.newPage(),
  rtlErrors = []
rp.on('pageerror', (e) => rtlErrors.push(String(e)))
await rp.goto(base + '/ar/adhkar/evening')
assert.equal(await rp.locator('html').getAttribute('lang'), 'ar')
assert.equal(await rp.locator('html').getAttribute('dir'), 'rtl')
await rp
  .locator('#dhikr-ikhlas')
  .getByRole('button', { name: 'عدّ سورة الإخلاص', exact: true })
  .click()
assert.match(await rp.locator('#dhikr-ikhlas').getByTestId('count').innerText(), /١ \/ ٣/)
await rp.getByLabel('المعاني الإنجليزية', { exact: true }).check()
await rp.getByLabel('حجم النص العربي', { exact: true }).selectOption('38')
assert.ok(await rp.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
await rp.locator('#dhikr-bismillah-protection').scrollIntoViewIfNeeded()
if (process.env.TEST_SCREENSHOT) await rp.screenshot({ path: process.env.TEST_SCREENSHOT })
assert.deepEqual(rtlErrors, [])
await rtl.close()
const plain = await browser.newContext({ javaScriptEnabled: false }),
  pp = await plain.newPage()
for (const prefix of ['', '/ar', '/fr', '/de'])
  for (const id of ['morning', 'evening', 'after-prayer']) {
    const path = `${prefix}/adhkar/${id}`,
      response = await pp.goto(base + path)
    assert.equal(response.status(), 200)
    assert.equal(await pp.getByTestId('adhkar-card').count(), id === 'after-prayer' ? 10 : 11)
    assert.equal(
      await pp.locator('link[rel="canonical"]').getAttribute('href'),
      'https://www.islamful.com' + path
    )
    assert.equal(await pp.getByTestId('quran-adhkar-verse').count(), 15)
    assert.equal(await pp.locator('html').getAttribute('lang'), prefix ? prefix.slice(1) : 'en')
  }
for (const path of [
  '/adhkar/not-a-routine',
  '/ar/adhkar/not-a-routine',
  '/fr/adhkar/not-a-routine',
  '/de/adhkar/not-a-routine',
])
  assert.equal((await pp.goto(base + path)).status(), 404)
await plain.close()
await browser.close()
console.log(
  'Adhkar browser checks passed: source/text rendering, scoped saved counts, offline count, bounds/undo, resume, confirmed reset, cross-tab updates, manual prayer choice and alternative sequences, completion/reload, local-midnight rollover, blocked storage, audio does not count/restart on counter updates, Arabic mobile, no-JS content and 404s. Media playback is controlled for state testing.'
)
