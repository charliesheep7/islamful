import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const base = process.env.TEST_BASE_URL || 'http://localhost:3098'
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await context.newPage(),
  errors = [],
  media = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('request', (r) => {
  if (r.url().includes('cdn.islamic.network')) media.push(r.url())
})
await page.goto(base + '/quran')
assert.equal(await page.locator('[data-testid="surah-list"] li').count(), 114)
await page.getByLabel('Find a surah or verse reference', { exact: true }).fill('٢:٢٥٥')
assert.equal(await page.locator('[data-testid="surah-list"] li').count(), 1)
assert.equal(
  await page.locator('[data-testid="surah-list"] a').getAttribute('href'),
  '/quran/al-baqarah#ayah-255'
)
await page.goto(base + '/quran/al-mulk#ayah-5')
const reader = page.getByTestId('quran-reader')
assert.equal(await reader.locator('article[data-verse]').count(), 30)
assert.equal(await reader.getByTestId('arabic-verse').count(), 30)
assert.equal(await reader.getByTestId('translation-verse').count(), 30)
assert.equal(await reader.getByTestId('surah-bismillah').count(), 1)
assert.deepEqual(media, [])
await reader.getByRole('button', { name: 'Save place at verse 5', exact: true }).click()
await reader.getByRole('button', { name: 'Bookmark verse 8', exact: true }).click()
await page.reload()
assert.match(await page.getByTestId('reader-resume').getAttribute('href'), /#ayah-5$/)
assert.equal(
  await reader
    .getByRole('button', { name: 'Bookmark verse 8', exact: true })
    .getAttribute('aria-pressed'),
  'true'
)
await reader.getByLabel('Find words in this surah', { exact: true }).fill('thisstringdoesnotoccur')
assert.equal(await reader.locator('article[data-verse]').count(), 0)
await page.getByTestId('reader-resume').click()
assert.equal(await reader.locator('article[data-verse]').count(), 30)
await reader.getByLabel('Go to verse', { exact: true }).fill('٣٠')
await reader.getByRole('button', { name: 'Go', exact: true }).click()
await page.waitForFunction(() => document.activeElement?.id === 'ayah-30')
assert.ok(page.url().endsWith('#ayah-30'))
await reader.getByLabel('Arabic text size', { exact: true }).selectOption('44')
await reader.getByLabel('English translation', { exact: true }).uncheck()
assert.equal(await reader.getByTestId('translation-verse').count(), 0)
await reader.getByText('Memorization practice', { exact: true }).click()
await reader.getByLabel('Hide verse text until I reveal it', { exact: true }).check()
assert.equal(await reader.getByTestId('arabic-verse').count(), 0)
await reader.getByRole('button', { name: 'Reveal verse 1', exact: true }).click()
assert.equal(await reader.getByTestId('arabic-verse').count(), 1)
await reader.getByLabel('Hide verse text until I reveal it', { exact: true }).uncheck()
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
await context.setOffline(true)
await reader.getByLabel('Find words in this surah', { exact: true }).fill('تبارك')
assert.ok((await reader.locator('article[data-verse]').count()) > 0)
await context.setOffline(false)
await page.goto(base + '/quran')
assert.equal(await page.getByTestId('resume-quran').getAttribute('href'), '/quran/al-mulk#ayah-5')
await page
  .getByRole('button', { name: 'Clear saved place, bookmarks and preferences', exact: true })
  .click()
assert.equal(await page.getByTestId('resume-quran').count(), 0)
assert.equal(await page.evaluate(() => localStorage.getItem('islamful.quran.reader.v1')), null)
assert.deepEqual(errors, [])
await context.close()

// Controlled media events verify sequences and promise cancellation without depending on network timing.
const audioContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
await audioContext.addInitScript(() => {
  window.__audioPlays = []
  window.__audioPending = []
  window.__audioMode = 'ok'
  const proto = HTMLMediaElement.prototype
  Object.defineProperty(proto, 'currentSrc', {
    get() {
      return this.src
    },
  })
  Object.defineProperty(proto, 'paused', {
    get() {
      return this.__paused !== false
    },
  })
  Object.defineProperty(proto, 'ended', {
    get() {
      return this.__ended === true
    },
  })
  Object.defineProperty(proto, 'error', {
    get() {
      return this.__error || null
    },
  })
  proto.load = function () {
    this.__ended = false
    this.__error = null
  }
  proto.pause = function () {
    this.__paused = true
    this.dispatchEvent(new Event('pause'))
  }
  proto.play = function () {
    window.__audioPlays.push(this.src)
    this.__ended = false
    this.__paused = false
    if (window.__audioMode === 'defer')
      return new Promise((resolve, reject) => window.__audioPending.push({ resolve, reject }))
    this.dispatchEvent(new Event('play'))
    return Promise.resolve()
  }
  window.__finishAudio = () => {
    const audio = document.querySelector('audio')
    audio.__ended = true
    audio.__paused = true
    audio.dispatchEvent(new Event('ended'))
  }
})
await audioContext.route('https://cdn.islamic.network/**', (r) => r.abort())
const ap = await audioContext.newPage(),
  audioErrors = []
ap.on('pageerror', (e) => audioErrors.push(String(e)))
await ap.goto(base + '/quran/al-fatihah')
const ar = ap.getByTestId('quran-reader')
await ar.getByLabel('Repeat each verse', { exact: true }).selectOption('2')
await ar.getByLabel('From verse', { exact: true }).fill('2')
await ar.getByLabel('To verse', { exact: true }).fill('3')
await ar.getByRole('button', { name: 'Play selected range', exact: true }).click()
await ap.waitForFunction(() => window.__audioPlays.length === 1)
await ap.evaluate(() => (window.__firstAudio = document.querySelector('audio')))
for (let i = 2; i <= 4; i++) {
  await ap.evaluate(() => window.__finishAudio())
  await ap.waitForFunction((n) => window.__audioPlays.length === n, i)
}
assert.deepEqual(await ap.evaluate(() => window.__audioPlays.map((s) => s.split('/').at(-1))), [
  '2.mp3',
  '2.mp3',
  '3.mp3',
  '3.mp3',
])
assert.equal(await ap.evaluate(() => window.__firstAudio === document.querySelector('audio')), true)
await ap.evaluate(() => window.__finishAudio())
await ap.getByTestId('quran-audio').getByRole('status').filter({ hasText: 'Finished' }).waitFor()
assert.equal(await ap.evaluate(() => window.__audioPlays.length), 4)
await ap.getByRole('button', { name: 'Stop', exact: true }).click()
assert.equal(await ap.locator('audio').count(), 0)
await ap.evaluate(() => (window.__audioMode = 'defer'))
await ar.getByRole('button', { name: 'Listen to verse 2', exact: true }).click()
await ap.waitForFunction(() => window.__audioPending.length === 1)
await ap.evaluate(() => (window.__audioMode = 'ok'))
await ar.getByRole('button', { name: 'Listen to verse 4', exact: true }).click()
await ap.waitForFunction(() => document.querySelector('audio')?.src.endsWith('/4.mp3'))
await ap.evaluate(() => window.__audioPending[0].reject(new Error('stale failure')))
assert.equal(await ap.getByTestId('quran-audio').getByRole('alert').count(), 0)
await ap.evaluate(() => {
  const a = document.querySelector('audio')
  a.__error = { code: 2 }
  a.dispatchEvent(new Event('error'))
})
await ap.getByTestId('quran-audio').getByRole('alert').waitFor()
await ap.getByRole('button', { name: 'Retry audio', exact: true }).click()
await ap.getByTestId('quran-audio').getByRole('status').filter({ hasText: 'Playing' }).waitFor()
await ar.getByLabel('Find words in this surah', { exact: true }).fill('zzzz')
await ap.getByRole('button', { name: 'Read this verse', exact: true }).click()
assert.equal(await ar.locator('article[data-verse]').count(), 7)
await ar.getByLabel('Reciter', { exact: true }).selectOption('ar.husary')
await ap.locator('audio').waitFor({ state: 'detached' })
assert.equal(await ap.locator('audio').count(), 0)
await ar.getByRole('button', { name: 'Listen to verse 1', exact: true }).click()
await ap.waitForFunction(() => document.querySelector('audio')?.src.includes('/ar.husary/'))
await ap.evaluate(() => (window.__oldAudio = document.querySelector('audio')))
await ap.getByRole('link', { name: 'Next: Al-Baqara', exact: true }).click()
await ap.waitForURL('**/quran/al-baqarah')
await ap.waitForFunction(() => window.__oldAudio.paused)
assert.equal(await ap.evaluate(() => window.__oldAudio.paused), true)
assert.equal(await ap.locator('audio').count(), 0)
assert.deepEqual(audioErrors, [])
await audioContext.close()

const rtl = await browser.newContext({ viewport: { width: 390, height: 844 } })
const arabic = await rtl.newPage(),
  rtlErrors = []
arabic.on('pageerror', (e) => rtlErrors.push(String(e)))
await arabic.goto(base + '/ar/quran/al-kahf')
assert.equal(await arabic.locator('html').getAttribute('lang'), 'ar')
assert.equal(await arabic.locator('html').getAttribute('dir'), 'rtl')
assert.equal(await arabic.getByTestId('arabic-verse').count(), 110)
assert.equal(await arabic.getByTestId('translation-verse').count(), 0)
await arabic.getByLabel('الترجمة الإنجليزية', { exact: true }).check()
assert.equal(await arabic.getByTestId('translation-verse').count(), 110)
await arabic.getByLabel('انتقل إلى الآية', { exact: true }).fill('١١٠')
await arabic.getByRole('button', { name: 'انتقل', exact: true }).click()
await arabic.waitForFunction(() => document.activeElement?.id === 'ayah-110')
assert.ok(await arabic.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
await arabic.locator('#ayah-1').scrollIntoViewIfNeeded()
if (process.env.TEST_SCREENSHOT) await arabic.screenshot({ path: process.env.TEST_SCREENSHOT })
assert.deepEqual(rtlErrors, [])
await rtl.close()

const unavailable = await browser.newContext()
await unavailable.addInitScript(() => {
  Object.defineProperty(window, 'localStorage', {
    get() {
      throw new Error('storage blocked')
    },
  })
})
const unavailablePage = await unavailable.newPage()
await unavailablePage.goto(base + '/quran/al-mulk')
await unavailablePage.getByRole('alert').filter({ hasText: 'cannot save' }).waitFor()
await unavailablePage.getByRole('button', { name: 'Save place at verse 2', exact: true }).click()
assert.match(await unavailablePage.getByTestId('reader-resume').getAttribute('href'), /#ayah-2$/)
await unavailable.close()

const nojs = await browser.newContext({ javaScriptEnabled: false })
const plain = await nojs.newPage()
for (const [path, count, lang] of [
  ['/quran/al-baqarah', 286, 'en'],
  ['/ar/quran/at-tawba', 129, 'ar'],
]) {
  const response = await plain.goto(base + path)
  assert.equal(response.status(), 200)
  assert.equal(await plain.locator('article[data-verse]').count(), count)
  assert.equal(await plain.locator('html').getAttribute('lang'), lang)
  assert.equal(
    await plain.locator('link[rel="canonical"]').getAttribute('href'),
    'https://www.islamful.com' + path
  )
  if (count === 129) assert.equal(await plain.getByTestId('surah-bismillah').count(), 0)
}
for (const path of ['/quran/not-a-surah', '/ar/quran/115'])
  assert.equal((await plain.goto(base + path)).status(), 404)
await nojs.close()
await browser.close()
console.log(
  'Quran browser checks passed: 114-surah discovery, native references, complete verses, saved places/bookmarks/reset, search/jump, offline text, memorization reveal, range/repeat sequence, media element reuse, stale rejection/error/retry, reciter switch/route cleanup, Arabic mobile, storage failure, no-JS text and 404s. Media sequence test uses controlled events; live-media smoke is separate.'
)
