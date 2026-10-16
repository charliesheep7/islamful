import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import fs from 'node:fs'
import ts from 'typescript'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const js = ts.transpileModule(fs.readFileSync('data/locales/scramble-game.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { scrambleReferences, scrambleCopy } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)
const corpus = JSON.parse(fs.readFileSync('data/quran/corpus.json', 'utf8'))
const translations = Object.fromEntries(
  ['fr', 'de'].map((l) => [
    l,
    JSON.parse(fs.readFileSync(`data/quran/translations/${l}.json`, 'utf8')),
  ])
)
const b = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
})
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } }),
      errors = []
    p.on('pageerror', (e) => errors.push(e.message))
    await p.addInitScript(() => {
      let seed = 12345
      Math.random = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }
    })
    await p.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    const prefix = lang === 'en' ? '' : `/${lang}`,
      c = scrambleCopy[lang],
      seen = new Set()
    await p.goto(`${origin}${prefix}/games/ayah-scramble`)
    for (let round = 0; round < 12; round++) {
      let score = 0
      for (let i = 0; i < 8; i++) {
        const available = p.getByTestId('available-words'),
          placed = p.getByTestId('placed-words')
        await available.locator('button').first().waitFor()
        const id = Number(await p.locator('[data-verse-id]').getAttribute('data-verse-id'))
        seen.add(id)
        const [surah, start, end] = scrambleReferences[id]
        const verses = corpus.chapters[surah - 1].verses.slice(start - 1, end)
        const texts = verses.map((v) =>
          lang === 'ar'
            ? v.arabic
            : translations[lang]
              ? translations[lang].chapters[surah - 1][v.number - 1].translation
              : v.translation
        )
        const words = texts.flatMap((t) => t.split(/\s+/))
        assert.deepEqual(
          (await available.locator('button').allTextContents()).sort(),
          [...words].sort()
        )
        assert.deepEqual(
          await p.getByTestId('scramble-footnotes').allTextContents(),
          translations[lang]
            ? verses
                .map((v) => translations[lang].chapters[surah - 1][v.number - 1].footnotes)
                .filter(Boolean)
            : []
        )
        assert.equal(await p.getByRole('button', { name: c.check, exact: true }).isDisabled(), true)
        if (i === 0) {
          await available.locator('button').first().click()
          await placed.locator('button').first().click()
          assert.equal(await available.locator('button').count(), words.length)
          await available.locator('button').first().click()
          await p.getByRole('button', { name: c.clear, exact: true }).click()
          assert.equal(await placed.locator('button').count(), 0)
        }
        const ordered = round === 0 ? words : [...words].reverse()
        // DOM clicks still exercise the actual React selection handlers; wait for each render.
        let remaining = ordered.length
        for (const word of ordered) {
          await available.getByRole('button', { name: word, exact: true }).first().click()
          remaining--
          await p.waitForFunction(
            (n) => document.querySelectorAll('[data-testid="available-words"] button').length === n,
            remaining
          )
        }
        await p.getByRole('button', { name: c.check, exact: true }).click()
        if (round === 0) score++
        else assert.deepEqual(await p.getByTestId('original-verse').allTextContents(), texts)
        assert.equal(await placed.locator('button:enabled').count(), 0)
        await p.getByText(`${c.score}: ${score}/${i + 1}`, { exact: true }).waitFor()
        await p.getByRole('button', { name: i === 7 ? c.results : c.next, exact: true }).click()
      }
      await p.getByRole('heading', { name: c.complete, exact: true }).waitFor()
      await p.getByText(`${score}/8`, { exact: true }).waitFor()
      await p.getByText(round === 0 ? c.perfect : c.learn, { exact: true }).waitFor()
      await p.getByRole('button', { name: c.again, exact: true }).click()
      if (round >= 1 && seen.size === 12) break
    }
    assert.equal(seen.size, 12)
    const req = p.waitForRequest(
      (r) => r.url().includes('/api/engagement') && r.postDataJSON()?.event === 'share_open'
    )
    await p.locator('summary').first().click()
    await req
    const text = new URL(await p.locator('a[href*="wa.me"]').getAttribute('href')).searchParams.get(
      'text'
    )
    assert.ok(text.includes(await p.locator('h1').innerText()))
    assert.ok(text.includes(`${prefix}/games/ayah-scramble?shared=WhatsApp`))
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: all 12 source references, word multisets, notes, undo/clear, correct/incorrect answers, replay, sharing and mobile passed`
    )
    await p.close()
  }
} finally {
  await b.close()
}
