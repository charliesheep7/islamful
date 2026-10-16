import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import fs from 'node:fs'
import ts from 'typescript'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const source = ts.transpileModule(fs.readFileSync('data/locales/salah-game.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { salahGame } = await import(
  'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
)
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
})
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.route('**/api/engagement', (route) => route.fulfill({ json: { ok: true } }))
    const prefix = lang === 'en' ? '' : `/${lang}`
    const c = salahGame[lang]
    assert.equal((await page.goto(`${origin}${prefix}/games`)).status(), 200)
    const cards = page.locator('main .grid a[href*="/games/"]')
    assert.equal(await cards.count(), 8)
    for (const href of await cards.evaluateAll((els) => els.map((el) => el.getAttribute('href'))))
      assert.ok(href.startsWith(`${prefix}/games/`))
    await page.locator(`main .grid a[href='${prefix}/games/salah-sequence']`).click()
    await page.getByText(c.instruction, { exact: true }).waitFor()
    const rows = page.locator('[data-step-id]')
    assert.equal(await rows.count(), 9)
    // Arrange a deterministic wrong answer using accessible movement controls.
    for (let id = 1; id <= 9; id++) {
      const row = page.locator(`[data-step-id="${id}"]`)
      while (
        (await rows.evaluateAll((els) => els.map((el) => Number(el.dataset.stepId)))).indexOf(id) >
        id - 1
      ) {
        await row
          .getByRole('button', { name: `${c.up}: ${c.steps[id - 1][0]}`, exact: true })
          .click()
      }
    }
    await page
      .locator('[data-step-id="1"]')
      .getByRole('button', { name: `${c.down}: ${c.steps[0][0]}`, exact: true })
      .click()
    await page.getByRole('button', { name: c.check, exact: true }).click()
    assert.equal(await page.getByText(c.success, { exact: true }).count(), 0)
    for (const [name, description] of c.steps) {
      assert.equal(await page.getByText(name, { exact: true }).count(), 1)
      assert.equal(await page.getByText(description, { exact: true }).count(), 1)
    }
    await page
      .locator('[data-step-id="1"]')
      .getByRole('button', { name: `${c.up}: ${c.steps[0][0]}`, exact: true })
      .click()
    await page.getByRole('button', { name: c.check, exact: true }).click()
    await page.getByText(c.success, { exact: true }).waitFor()
    assert.equal(await rows.locator('button').count(), 0)
    await page.getByRole('button', { name: c.again, exact: true }).click()
    assert.equal(await rows.count(), 9)
    assert.equal(await rows.locator('button').count(), 18)
    await page.getByRole('button', { name: c.shuffle, exact: true }).click()
    assert.equal(await page.getByText(c.success, { exact: true }).count(), 0)
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com${prefix}/games/salah-sequence`
    )
    for (const target of ['en', 'ar', 'fr', 'de'])
      assert.equal(await page.locator(`link[hreflang="${target}"]`).count(), 1)
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: game navigation, 9 translated steps, wrong/correct answers, movement, reset, metadata and mobile layout passed`
    )
    await page.close()
  }
} finally {
  await browser.close()
}
