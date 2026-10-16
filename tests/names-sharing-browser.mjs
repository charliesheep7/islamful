import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const events = []
    await context.route('**/api/engagement', (route) => {
      events.push(route.request().postDataJSON())
      return route.fulfill({ json: { ok: true } })
    })
    await context.addInitScript(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (value) => {
            window.__copied = value
          },
        },
        configurable: true,
      })
    )
    const page = await context.newPage()
    const path = `${lang === 'en' ? '' : '/' + lang}/names-of-allah`
    await page.goto(origin + path)
    const cards = page.locator('article[id^="name-"]')
    await cards.first().waitFor()
    assert.equal(await cards.count(), 99)
    const first = page.locator('#name-1')
    await first.getByRole('button').click()
    assert.equal(await first.getByRole('button').getAttribute('aria-pressed'), 'true')
    await page.reload()
    await page.waitForFunction(
      () => document.querySelector('#name-1 button')?.getAttribute('aria-pressed') === 'true'
    )
    await first.locator('summary').click()
    const whatsapp = new URL(
      await first.getByRole('link', { name: /WhatsApp/ }).getAttribute('href')
    )
    const payload = whatsapp.searchParams.get('text')
    assert.ok(payload.includes('#name-1'))
    assert.ok(payload.includes('Ar-Rahman'))
    if (lang === 'fr') assert.ok(payload.includes('Le Tout Miséricordieux'))
    if (lang === 'de') assert.ok(payload.includes('Der Allerbarmer'))
    const copy = { en: 'Copy link', ar: 'نسخ الرابط', fr: 'Copier le lien', de: 'Link kopieren' }[
      lang
    ]
    await first.getByRole('button', { name: copy, exact: true }).click()
    assert.equal(
      await page.evaluate(() => window.__copied),
      `https://www.islamful.com${path}?shared=copy#name-1`
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    if (lang === 'fr' || lang === 'de') {
      await page
        .getByPlaceholder(
          lang === 'fr' ? 'Rechercher un nom ou un sens…' : 'Nach Name oder Bedeutung suchen…'
        )
        .fill(lang === 'fr' ? 'Miséricordieux' : 'Allerbarmer')
      assert.ok((await cards.count()) < 99)
      assert.ok((await cards.count()) > 0)
    }
    await page.waitForTimeout(100)
    assert.ok(events.some((e) => e.event === 'share_copy' && e.contentId === 'name-1'))
    assert.ok(events.some((e) => e.event === 'share_open' && e.contentId === 'name-1'))
    const arrival = page.waitForResponse(
      (r) =>
        r.url().includes('/api/engagement') && r.request().postDataJSON()?.event === 'share_arrival'
    )
    await page.goto(origin + path + '?shared=copy#name-99')
    await arrival
    assert.ok(
      events.some((e) => e.event === 'share_arrival' && e.contentId === 'name-99'),
      JSON.stringify(events)
    )
    const before = events.length
    const privateArrival = page.waitForResponse(
      (r) =>
        r.url().includes('/api/engagement') && r.request().postDataJSON()?.event === 'share_arrival'
    )
    await page.goto(origin + path + '?shared=copy#private-email@example.com')
    await privateArrival
    assert.ok(events.slice(before).some((e) => e.event === 'share_arrival' && e.contentId === null))
    assert.ok(events.every((e) => !JSON.stringify(e).includes('private-email')))
    await context.close()
  }
  console.log(
    'Four-language names, localized meaning search, learned persistence, specific-name social/copy links and mobile layout passed'
  )
} finally {
  await browser.close()
}
