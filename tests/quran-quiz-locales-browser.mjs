import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import fs from 'node:fs'
import ts from 'typescript'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const js = ts.transpileModule(fs.readFileSync('data/locales/quran-quiz.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { quranQuizReferences, quranQuizCopy } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)
const corpus = JSON.parse(fs.readFileSync('data/quran/corpus.json', 'utf8'))
const chapters = JSON.parse(fs.readFileSync('data/quran/index.json', 'utf8')).chapters
const translations = Object.fromEntries(
  ['fr', 'de'].map((lang) => [
    lang,
    JSON.parse(fs.readFileSync(`data/quran/translations/${lang}.json`, 'utf8')),
  ])
)
const expectedQuestions = Object.fromEntries(
  ['en', 'ar', 'fr', 'de'].map((lang) => {
    const name = (n) => (lang === 'ar' ? chapters[n - 1].nameAr : chapters[n - 1].name)
    return [
      lang,
      quranQuizReferences.map(([surah, start, end, options]) => ({
        answer: name(surah),
        options: options.map(name),
        verses: corpus.chapters[surah - 1].verses.slice(start - 1, end).map((v) => ({
          text:
            lang === 'ar'
              ? v.arabic
              : translations[lang]
                ? translations[lang].chapters[surah - 1][v.number - 1].translation
                : v.translation,
          footnotes: translations[lang]?.chapters[surah - 1][v.number - 1].footnotes || '',
        })),
      })),
    ]
  })
)
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
})
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => {
      let seed = 12345
      Math.random = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }
    })
    await page.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    const prefix = lang === 'en' ? '' : `/${lang}`,
      c = quranQuizCopy[lang],
      seen = new Set()
    assert.equal((await page.goto(`${origin}${prefix}/games/quran-verse-quiz`)).status(), 200)
    // Three score tiers plus further rounds as needed to see the entire 15-question bank.
    for (let round = 0; round < 12; round++) {
      let score = 0
      const roundIds = new Set()
      for (let i = 0; i < 10; i++) {
        await page.getByTestId('quiz-verse').first().waitFor()
        const id = Number(await page.locator('[data-question-id]').getAttribute('data-question-id'))
        assert.ok(!roundIds.has(id))
        roundIds.add(id)
        seen.add(id)
        const q = expectedQuestions[lang][id]
        assert.deepEqual(
          await page.getByTestId('quiz-verse').allTextContents(),
          q.verses.map((v) => v.text)
        )
        assert.deepEqual(
          await page.getByTestId('quiz-footnotes').allTextContents(),
          q.verses.filter((v) => v.footnotes).map((v) => v.footnotes)
        )
        for (const option of q.options)
          assert.equal(await page.getByRole('button', { name: option, exact: true }).count(), 1)
        const correct = round === 0 || (round === 1 && i < 7) || (round === 2 && i < 4)
        const answer = correct ? q.answer : q.options.find((o) => o !== q.answer)
        if (correct) score++
        await page.getByRole('button', { name: answer, exact: true }).click()

        for (const option of q.options)
          assert.equal(
            await page.locator('[data-option]').filter({ hasText: option }).isDisabled(),
            true
          )
        await page.getByText(`${c.score}: ${score}/${i + 1}`, { exact: true }).waitFor()
        await page.getByRole('button', { name: i === 9 ? c.results : c.next, exact: true }).click()
      }
      await page.getByRole('heading', { name: c.complete, exact: true }).waitFor()
      await page.getByText(`${score}/10`, { exact: true }).waitFor()
      await page
        .getByText(
          score === 10 ? c.perfect : score >= 7 ? c.great : score >= 4 ? c.good : c.learn,
          { exact: true }
        )
        .waitFor()
      await page.getByRole('button', { name: c.again, exact: true }).click()
      await page.getByText(`${c.score}: 0/0`, { exact: true }).waitFor()
      if (round >= 3 && seen.size === 15) break
    }
    assert.equal(seen.size, 15)
    const req = page.waitForRequest(
      (r) => r.url().includes('/api/engagement') && r.postDataJSON()?.event === 'share_open'
    )
    await page.locator('summary').first().click()
    await req
    const text = new URL(
      await page.locator('a[href*="wa.me"]').getAttribute('href')
    ).searchParams.get('text')
    assert.ok(text.includes(await page.locator('h1').innerText()))
    assert.ok(
      text.includes(`https://www.islamful.com${prefix}/games/quran-verse-quiz?shared=WhatsApp`)
    )
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com${prefix}/games/quran-verse-quiz`
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: all 15 questions, source verses/footnotes, four score tiers, replay, sharing and mobile layout passed`
    )
    await page.close()
  }
} finally {
  await browser.close()
}
