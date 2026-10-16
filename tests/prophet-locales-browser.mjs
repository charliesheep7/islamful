import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import fs from 'node:fs'
import ts from 'typescript'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const js = ts.transpileModule(fs.readFileSync('data/locales/prophet-game.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { prophetQuestions, prophetGame } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
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
      c = prophetGame[lang],
      seen = new Set()
    assert.equal((await page.goto(`${origin}${prefix}/games/prophet-stories-quiz`)).status(), 200)
    // Three score tiers plus further rounds as needed to see the entire 15-question bank.
    for (let round = 0; round < 12; round++) {
      let score = 0
      const roundIds = new Set()
      for (let i = 0; i < 10; i++) {
        await page.getByTestId('quiz-question').waitFor()
        const id = Number(await page.locator('[data-question-id]').getAttribute('data-question-id'))
        assert.ok(!roundIds.has(id))
        roundIds.add(id)
        seen.add(id)
        const q = prophetQuestions[lang][id]
        assert.equal(await page.getByTestId('quiz-question').innerText(), q.question)
        for (const option of q.options)
          assert.equal(await page.getByRole('button', { name: option, exact: true }).count(), 1)
        const correct = round === 0 || (round === 1 && i < 7) || (round === 2 && i < 4)
        const answer = correct ? q.answer : q.options.find((o) => o !== q.answer)
        if (correct) score++
        await page.getByRole('button', { name: answer, exact: true }).click()
        assert.equal(await page.getByTestId('quiz-explanation').innerText(), q.explanation)
        for (const option of q.options)
          assert.equal(
            await page.getByRole('button', { name: option, exact: true }).isDisabled(),
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
    await page.locator('summary').click()
    await req
    const text = new URL(
      await page.locator('a[href*="wa.me"]').getAttribute('href')
    ).searchParams.get('text')
    assert.ok(text.includes(await page.locator('h1').innerText()))
    assert.ok(
      text.includes(`https://www.islamful.com${prefix}/games/prophet-stories-quiz?shared=WhatsApp`)
    )
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com${prefix}/games/prophet-stories-quiz`
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: all 15 questions, choices/explanations, four score tiers, replay, sharing and mobile layout passed`
    )
    await page.close()
  }
} finally {
  await browser.close()
}
