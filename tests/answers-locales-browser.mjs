import assert from 'node:assert/strict'
import fs from 'node:fs'
import { chromium } from 'playwright'
import { build } from 'esbuild'
const load = async (path) => {
  const r = await build({
    entryPoints: [path],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  })
  return import(
    'data:text/javascript;base64,' + Buffer.from(r.outputFiles[0].text).toString('base64')
  )
}
const { answersCopy } = await load('data/locales/answers.ts')
const { engagementCopy } = await load('data/engagement-copy.ts')
const { answerReferences: refs } = await load('data/quran/answer-references.ts')
const corpus = JSON.parse(fs.readFileSync('data/quran/corpus.json'))
const translations = Object.fromEntries(
  ['fr', 'de'].map((l) => [l, JSON.parse(fs.readFileSync(`data/quran/translations/${l}.json`))])
)
const questions = new Map()
for (let n = 0; questions.size < refs.length && n < 100000; n++) {
  const q = `private reflection ${n}`
  let hash = 0
  for (const c of q) hash = ((hash << 5) - hash + c.charCodeAt(0)) | 0
  questions.set(Math.abs(hash) % refs.length, q)
}
assert.equal(questions.size, refs.length)
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const c = answersCopy[lang],
      events = [],
      errors = []
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      acceptDownloads: true,
    })
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (e) => {
      if (e.type() === 'error' && /hydration|same key|did not match/i.test(e.text()))
        errors.push(e.text())
    })
    await page.route('**/api/engagement', (r) => {
      events.push(r.request().postDataJSON())
      return r.fulfill({ json: { ok: true } })
    })
    const path = `${lang === 'en' ? '' : '/' + lang}/answers`
    assert.equal(
      (await page.goto(`${process.env.TEST_ORIGIN || 'http://localhost:3108'}${path}`)).status(),
      200
    )
    await page.getByRole('heading', { name: c.title, exact: true }).waitFor()
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      'https://www.islamful.com' + path
    )
    for (const [q, a] of c.questions) {
      await page.getByRole('heading', { name: q, exact: true }).waitFor()
      await page.getByText(a, { exact: true }).waitFor()
    }
    await page.clock.install()
    for (const [index, q] of questions) {
      await page.getByLabel(c.prompt, { exact: true }).fill(q)
      await page.getByRole('button', { name: c.submit, exact: true }).click()
      await page.clock.fastForward(1000)
      const card = page.getByTestId('verse-card')
      await card.waitFor()
      const [surah, start, end] = refs[index]
      const verses = corpus.chapters[surah - 1].verses.slice(start - 1, end)
      assert.deepEqual(
        await card.locator('[data-verse-arabic]').allTextContents(),
        verses.map((v) => v.arabic)
      )
      assert.deepEqual(
        await card.locator('[data-verse-translation]').allTextContents(),
        lang === 'ar'
          ? []
          : verses.map((v) =>
              translations[lang]
                ? translations[lang].chapters[surah - 1][v.number - 1].translation
                : v.translation
            )
      )
      const notes = translations[lang]
        ? verses
            .map((v) => translations[lang].chapters[surah - 1][v.number - 1].footnotes)
            .filter(Boolean)
        : []
      assert.deepEqual(await card.locator('[data-verse-footnotes]').allTextContents(), notes)
      assert.ok(!(await card.textContent()).includes(q))
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false
      )
      if (index === 0) {
        await page.getByLabel(c.include).check()
        assert.ok((await card.textContent()).includes(q))
        await page.getByLabel(c.include).uncheck()
        const href = await page.locator('a[href*="wa.me"]').last().getAttribute('href')
        assert.ok(!decodeURIComponent(href).includes(q))
        assert.ok(decodeURIComponent(href).includes(`${path}?shared=WhatsApp`))
        await page.evaluate(() => {
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async (value) => {
                window.copiedAnswerUrl = value
              },
            },
          })
        })
        const copied = page.waitForRequest(
          (r) => r.url().includes('/api/engagement') && r.postDataJSON()?.event === 'share_copy'
        )
        await page
          .getByRole('button', { name: engagementCopy[lang].copy, exact: true })
          .last()
          .click()
        assert.equal((await copied).postDataJSON().path, path)
        assert.equal(
          await page.evaluate(() => window.copiedAnswerUrl),
          `https://www.islamful.com${path}?shared=copy`
        )
        await page.evaluate(() => {
          window.originalCanvasExport = HTMLCanvasElement.prototype.toDataURL
          HTMLCanvasElement.prototype.toDataURL = () => {
            throw new Error('Test unavailable canvas')
          }
        })
        await page.getByRole('button', { name: c.save, exact: true }).click()
        await page.getByText(c.error, { exact: true }).waitFor()
        await page.evaluate(() => {
          HTMLCanvasElement.prototype.toDataURL = window.originalCanvasExport
        })
        const pending = page.waitForEvent('download')
        await page.getByRole('button', { name: c.save, exact: true }).click()
        const download = await pending
        assert.equal(await download.failure(), null)
        const bytes = fs.readFileSync(await download.path())
        assert.equal(bytes.subarray(1, 4).toString(), 'PNG')
        assert.ok(bytes.length > 10000)
        assert.ok(bytes.includes(Buffer.from(corpus.arabicNotice)))
        if (translations[lang]) assert.ok(bytes.includes(Buffer.from(translations[lang].notice)))
        await page.getByText(c.saved, { exact: true }).waitFor()
      }
      await page.getByRole('button', { name: c.again, exact: true }).click()
      assert.equal(await page.getByLabel(c.prompt, { exact: true }).inputValue(), '')
    }
    assert.ok(!JSON.stringify(events).includes('private reflection'))
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: all ${refs.length} source selections, notes, private question opt-in, PNG download, reset, localized share URL and mobile passed`
    )
    await page.close()
  }
} finally {
  await browser.close()
}
