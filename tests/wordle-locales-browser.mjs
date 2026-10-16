import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import fs from 'node:fs'
import ts from 'typescript'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const js = ts.transpileModule(fs.readFileSync('data/locales/wordle-game.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { wordleWords, wordleHints, wordleCopy } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)
for (const lang of ['en', 'ar', 'fr', 'de']) {
  assert.equal(wordleHints[lang].length, wordleWords.length)
  assert.ok(wordleHints[lang].every((h) => h.length > 0))
}
assert.ok(wordleWords.every((w) => /^[A-Z]{5}$/.test(w)))
const b = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
})
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const p = await b.newPage({
      viewport: { width: 390, height: 844 },
      timezoneId: lang === 'ar' ? 'Asia/Riyadh' : 'America/Los_Angeles',
    })
    const errors = []
    p.on('pageerror', (e) => errors.push(e.message))
    await p.clock.install({ time: new Date('2025-01-01T12:00:00Z') })
    await p.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    const prefix = lang === 'en' ? '' : `/${lang}`,
      c = wordleCopy[lang]
    await p.goto(`${origin}${prefix}/games/islamic-wordle`)
    await p.getByText(c.instruction, { exact: true }).waitFor()
    await p.getByRole('button', { name: c.hint, exact: true }).click()
    await p.getByText(wordleHints[lang][0], { exact: true }).waitFor()
    const grid = p.getByTestId('wordle-grid')
    assert.equal(await grid.getAttribute('dir'), 'ltr')
    await p.locator('input[type=email]').pressSequentially('test@example.com')
    assert.equal((await grid.textContent()).trim(), '')
    await p.getByRole('button', { name: c.enter, exact: true }).click()
    await p.getByText(c.short, { exact: true }).waitFor()
    const guess = async (word) => {
      for (const key of word) await p.getByRole('button', { name: key, exact: true }).click()
      await p.getByRole('button', { name: c.enter, exact: true }).click()
    }
    await p.getByRole('button', { name: 'Z', exact: true }).click()
    await p.getByRole('button', { name: c.delete, exact: true }).click()
    assert.equal((await grid.textContent()).trim(), '')
    await guess('AAAAA')
    assert.deepEqual(
      await grid
        .locator('[data-row="0"] [data-status]')
        .evaluateAll((e) => e.map((x) => x.dataset.status)),
      ['absent', 'correct', 'absent', 'absent', 'correct']
    )
    await guess('TAQWA')
    await p.getByText(c.win.replace('{count}', '2'), { exact: true }).waitFor()
    assert.equal(await p.getByRole('button', { name: 'A', exact: true }).isDisabled(), true)
    // Advancing UTC midnight resets the puzzle, independent of browser timezone.
    await p.clock.setSystemTime(new Date('2025-01-02T00:01:00Z'))
    await p.evaluate(() => window.dispatchEvent(new Event('focus')))
    await p.getByRole('button', { name: c.hint, exact: true }).click()
    await p.getByText(wordleHints[lang][1], { exact: true }).waitFor()
    assert.equal((await grid.textContent()).trim(), '')
    for (let i = 0; i < 6; i++) await guess('ZZZZZ')
    await p.getByText(c.lose.replace('{word}', 'UMMAH'), { exact: true }).waitFor()
    const req = p.waitForRequest(
      (r) => r.url().includes('/api/engagement') && r.postDataJSON()?.event === 'share_open'
    )
    await p.locator('summary').first().click()
    await req
    const text = new URL(await p.locator('a[href*="wa.me"]').getAttribute('href')).searchParams.get(
      'text'
    )
    assert.ok(text.includes(await p.locator('h1').innerText()))
    assert.ok(text.includes(`${prefix}/games/islamic-wordle?shared=WhatsApp`))
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: hints, email isolation, duplicate-letter scoring, win/loss, UTC rollover, sharing and mobile width passed`
    )
    await p.close()
  }
} finally {
  await b.close()
}
