import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['en', 'ar']) {
    const ar = lang === 'ar',
      context = await browser.newContext({ viewport: { width: 390, height: 844 } }),
      events = []
    await context.route('**/api/engagement', (route) => {
      events.push(route.request().postDataJSON())
      return route.fulfill({ json: { ok: true } })
    })
    await context.addInitScript(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (value) => {
            if (window.__denyCopy) throw new Error('unavailable')
            window.__copied = value
          },
        },
        configurable: true,
      })
    )
    const page = await context.newPage(),
      errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    const path = ar ? '/ar/dua' : '/dua'
    await page.goto(origin + path)
    const cards = page.locator('[id^="dua-"]'),
      first = page.locator('#dua-1')
    await first.waitFor()
    assert.equal(await cards.count(), 77)
    const save = first.getByRole('button', { name: ar ? 'حفظ' : 'Save', exact: true })
    await save.click()
    assert.equal(await save.getAttribute('aria-pressed'), 'true')
    await page.reload()
    await page.waitForFunction(
      () =>
        document.querySelector('#dua-1 button[aria-pressed]')?.getAttribute('aria-pressed') ===
        'true'
    )
    await first
      .getByRole('button', { name: ar ? 'نسخ النص العربي' : 'Copy Arabic text', exact: true })
      .click()
    assert.match(await page.evaluate(() => window.__copied), /أَصْبَحْنَا/)
    await page.evaluate(() => (window.__denyCopy = true))
    await first
      .getByRole('button', { name: ar ? 'نسخ النص العربي' : 'Copy Arabic text', exact: true })
      .click()
    await first.locator('textarea').waitFor()
    assert.match(await first.locator('textarea').inputValue(), /أَصْبَحْنَا/)
    await page.evaluate(() => (window.__denyCopy = false))
    await first.locator('summary').click()
    const social = new URL(await first.getByRole('link', { name: /WhatsApp/ }).getAttribute('href'))
    assert.ok(social.searchParams.get('text').includes('#dua-1'))
    assert.ok(social.searchParams.get('text').includes('Abu Dawud'))
    assert.ok(social.searchParams.get('text').includes('أَصْبَحْنَا'))
    const copied = page.waitForResponse(
      (r) =>
        r.url().includes('/api/engagement') && r.request().postDataJSON()?.event === 'share_copy'
    )
    await first.getByRole('button', { name: ar ? 'نسخ الرابط' : 'Copy link', exact: true }).click()
    await copied
    assert.equal(
      await page.evaluate(() => window.__copied),
      `https://www.islamful.com${path}?shared=copy#dua-1`
    )
    assert.ok(events.some((e) => e.event === 'share_copy' && e.contentId === 'dua-1'))
    const arrival = page.waitForResponse(
      (r) =>
        r.url().includes('/api/engagement') && r.request().postDataJSON()?.event === 'share_arrival'
    )
    await page.goto(origin + path + '?shared=copy#dua-77')
    await arrival
    assert.ok(events.some((e) => e.event === 'share_arrival' && e.contentId === 'dua-77'))
    await page.locator('#dua-77').waitFor()
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(
    'English/Arabic dua sharing: all 77 anchors, favorites persistence, Arabic copy/fallback, rich social text, targeted copy/arrival analytics and mobile layout passed'
  )
} finally {
  await browser.close()
}
