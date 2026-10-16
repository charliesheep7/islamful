import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import fs from 'node:fs'
import ts from 'typescript'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const source = ts.transpileModule(fs.readFileSync('data/locales/pillar-game.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { pillarGame, pillarArabic } = await import(
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
    const c = pillarGame[lang]
    assert.equal((await page.goto(`${origin}${prefix}/games/pillar-builder`)).status(), 200)
    await page.getByText(c.instruction, { exact: true }).waitFor()
    const check = page.getByRole('button', { name: c.check, exact: true })
    assert.equal(await check.isDisabled(), true)
    for (let id = 1; id <= 5; id++) {
      const pillar = page.locator(`[data-pillar-id="${id}"]`)
      assert.ok((await pillar.innerText()).includes(c.items[id - 1][0]))
      assert.equal(await pillar.locator('[lang=ar]').innerText(), pillarArabic[id - 1])
      assert.equal(
        await page.locator(`[data-description-id="${id}"]`).innerText(),
        c.items[id - 1][1]
      )
    }
    // Reassigning a used description must leave the former pillar unmatched.
    await page.locator('[data-pillar-id="1"]').click()
    assert.equal(await page.locator('[data-pillar-id="1"]').getAttribute('aria-pressed'), 'true')
    await page.locator('[data-description-id="1"]').click()
    await page.locator('[data-pillar-id="2"]').click()
    await page.locator('[data-description-id="1"]').click()
    for (const id of [3, 4, 5]) {
      await page.locator(`[data-pillar-id="${id}"]`).click()
      await page.locator(`[data-description-id="${id}"]`).click()
    }
    assert.equal(await check.isDisabled(), true)
    await page.locator('[data-pillar-id="1"]').click()
    await page.locator('[data-description-id="2"]').click()
    await check.click()
    assert.equal(await page.getByText(c.success, { exact: true }).count(), 0)
    assert.equal(await page.locator('[data-pillar-id]:disabled').count(), 5)
    assert.equal(await page.locator('[data-pillar-id].border-red-400').count(), 2)
    await page.getByRole('button', { name: c.reset, exact: true }).click()
    for (let id = 1; id <= 5; id++) {
      await page.locator(`[data-pillar-id="${id}"]`).click()
      await page.locator(`[data-description-id="${id}"]`).click()
    }
    await check.click()
    await page.getByText(c.success, { exact: true }).waitFor()
    await page.getByRole('button', { name: c.again, exact: true }).click()
    assert.equal(await check.isDisabled(), true)
    assert.equal(await page.locator('[data-pillar-id]:disabled').count(), 0)
    const request = page.waitForRequest(
      (r) => r.url().includes('/api/engagement') && r.postDataJSON()?.event === 'share_open'
    )
    await page.locator('summary').click()
    await request
    const shareText = new URL(
      await page.locator('a[href*="wa.me"]').getAttribute('href')
    ).searchParams.get('text')
    assert.ok(shareText.includes(await page.locator('h1').innerText()))
    assert.ok(
      shareText.includes(`https://www.islamful.com${prefix}/games/pillar-builder?shared=WhatsApp`)
    )
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com${prefix}/games/pillar-builder`
    )
    for (const target of ['en', 'ar', 'fr', 'de'])
      assert.equal(await page.locator(`link[hreflang="${target}"]`).count(), 1)
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: all pillar descriptions, reassignment, incorrect/correct matching, replay, sharing and mobile layout passed`
    )
    await page.close()
  }
} finally {
  await browser.close()
}
