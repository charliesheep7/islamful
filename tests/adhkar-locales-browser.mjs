import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { chromium } from 'playwright'
function load(path) {
  const e = {}
  new Function(
    'exports',
    ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: 1 } }).outputText
  )(e)
  return e
}
const { routineEntries } = load('data/adhkar.ts')
const { localizedDhikr, adhkarRoutines } = load('data/locales/adhkar.ts')
const { adhkarUi, adhkarDynamic } = load('data/locales/adhkar-ui.ts')
const { quranAudioCopy } = load('data/locales/quran-audio.ts')
const corpus = JSON.parse(readFileSync('data/quran/corpus.json', 'utf8'))
for (const [path, copy] of [
  ['components/adhkar/AdhkarRoutine.tsx', adhkarUi],
  ['components/quran/QuranAudio.tsx', quranAudioCopy],
]) {
  const src = ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  function visit(n) {
    if (
      ts.isCallExpression(n) &&
      n.expression.getText(src) === 't' &&
      ts.isStringLiteral(n.arguments[0])
    )
      for (const l of ['fr', 'de'])
        assert.ok(copy[l][n.arguments[0].text], `${path}: ${l}: ${n.arguments[0].text}`)
    ts.forEachChild(n, visit)
  }
  visit(src)
}
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['fr', 'de']) {
    const tr = JSON.parse(readFileSync(`data/quran/translations/${lang}.json`, 'utf8')),
      ui = adhkarUi[lang],
      d = adhkarDynamic[lang]
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } }),
      page = await context.newPage(),
      errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await context.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    await context.route('https://cdn.islamic.network/**', (r) => r.abort())
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async (text) => (window.__copied = text) },
        configurable: true,
      })
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
        return Promise.resolve()
      }
      p.pause = function () {
        this.__paused = true
      }
    })
    const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
    assert.equal((await page.goto(`${origin}/${lang}/adhkar`)).status(), 200)
    for (const id of ['morning', 'evening', 'after-prayer'])
      assert.equal(await page.locator(`a[href="/${lang}/adhkar/${id}"]`).count(), 1)
    for (const id of ['morning', 'evening', 'after-prayer']) {
      const path = `/${lang}/adhkar/${id}`
      assert.equal((await page.goto(origin + path)).status(), 200)
      const entries = routineEntries(id).map((e) => localizedDhikr(e, id, lang))
      assert.equal(await page.locator('h1').innerText(), adhkarRoutines[lang][id].title)
      assert.equal(
        await page.locator('link[rel=canonical]').getAttribute('href'),
        `https://www.islamful.com${path}`
      )
      assert.equal(await page.getByTestId('adhkar-card').count(), entries.length)
      assert.deepEqual(
        await page.getByTestId('adhkar-meaning').allTextContents(),
        entries.filter((e) => e.meaning).map((e) => e.meaning)
      )
      assert.deepEqual(
        await page.getByTestId('quran-adhkar-meaning').allTextContents(),
        [111, 112, 113].flatMap((i) => tr.chapters[i].map((v) => v.translation))
      )
      assert.deepEqual(
        await page.getByTestId('quran-adhkar-verse').allTextContents(),
        [111, 112, 113].flatMap((i) => corpus.chapters[i].verses.map((v) => v.arabic))
      )
      assert.deepEqual(
        await page.getByTestId('translation-footnotes').allTextContents(),
        [111, 112, 113].flatMap((i) =>
          tr.chapters[i].filter((v) => v.footnotes).map((v) => v.footnotes)
        )
      )
      assert.ok((await page.locator('body').innerText()).includes(tr.publisher))
      const first = entries[0],
        card = page.locator(`#dhikr-${first.id}`)
      await card.getByRole('button', { name: d.count(first.title), exact: true }).click()
      assert.match(await card.getByTestId('count').innerText(), /1 \/ 3/)
      await page.reload()
      await page.waitForFunction(
        (id) =>
          document.querySelector(`#dhikr-${id} [data-testid=count]`)?.textContent.includes('1 / 3'),
        first.id
      )
      await card.getByRole('button', { name: d.undo(first.title), exact: true }).click()
      assert.match(await card.getByTestId('count').innerText(), /0 \/ 3/)
      if (id === 'morning') {
        await card.getByRole('button', { name: ui['Listen once'], exact: true }).click()
        await page
          .getByRole('region', { name: quranAudioCopy[lang]['Quran audio player'], exact: true })
          .waitFor()
        assert.match(await card.getByTestId('count').innerText(), /0 \/ 3/)
        await page.getByRole('button', { name: quranAudioCopy[lang].Stop, exact: true }).click()
        await page.locator('audio').waitFor({ state: 'detached' })
      }
      if (id === 'after-prayer') {
        await page.getByLabel(ui['Prayer session'], { exact: true }).selectOption('fajr')
        await card.getByRole('button', { name: d.count(first.title), exact: true }).click()
        await page.getByLabel(ui['Prayer session'], { exact: true }).selectOption('isha')
        assert.match(await card.getByTestId('count').innerText(), /0 \/ 3/)
        await page.getByLabel(ui['Prayer session'], { exact: true }).selectOption('fajr')
        await page.waitForFunction(() =>
          document
            .querySelector('#dhikr-istighfar [data-testid=count]')
            ?.textContent.includes('1 / 3')
        )
        await page.getByLabel(ui['Tasbih sequence'], { exact: true }).selectOption('34')
        assert.equal(await page.getByTestId('adhkar-card').count(), 9)
        assert.match(
          await page.locator('#dhikr-takbir').getByTestId('count').innerText(),
          /0 \/ 34/
        )
      }
      await page.getByRole('button', { name: ui['Reset this session'], exact: true }).click()
      await page.getByRole('button', { name: ui['Confirm reset'], exact: true }).click()
      await page
        .getByText(lang === 'fr' ? 'Partager cette page' : 'Diese Seite teilen', { exact: true })
        .click()
      await page
        .getByRole('button', {
          name: lang === 'fr' ? 'Copier le lien' : 'Link kopieren',
          exact: true,
        })
        .click()
      assert.equal(
        await page.evaluate(() => window.__copied),
        `https://www.islamful.com${path}?shared=copy`
      )
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
        false
      )
    }
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(
    'French/German adhkar: all routines/meanings, original Quran text and translated footnotes, counters/persistence/session isolation, reset, audio controls, sharing and mobile layout passed'
  )
} finally {
  await browser.close()
}
