import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        timezoneId: 'America/Los_Angeles',
      }),
      requests = []
    let fail = false
    await context.route('https://api.aladhan.com/**', (route) => {
      const url = route.request().url()
      requests.push(url)
      if (fail) return route.fulfill({ json: { code: 500 } })
      if (url.includes('/hToG/'))
        return route.fulfill({ json: { code: 200, data: { gregorian: { date: '15-01-2027' } } } })
      const birth = url.endsWith('/1-1-1980')
      return route.fulfill({
        json: {
          code: 200,
          data: {
            hijri: {
              day: '1',
              month: { number: birth ? 1 : 10, en: 'test', ar: 'اختبار' },
              year: birth ? '1400' : '1448',
              weekday: { en: 'Tuesday', ar: 'الثلاثاء' },
            },
          },
        },
      })
    })
    await context.route('**/api/engagement', (route) => route.fulfill({ json: { ok: true } }))
    await context.addInitScript(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async (value) => (window.__copied = value) },
        configurable: true,
      })
    )
    const page = await context.newPage(),
      errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    const path = `${lang === 'en' ? '' : '/' + lang}/hijri-birthday`
    assert.equal((await page.goto(origin + path + '?private=birthday')).status(), 200)
    const tool = page.getByTestId('hijri-birthday'),
      input = tool.locator('input[type=date]'),
      button = tool.getByRole('button')
    await input.waitFor()
    assert.equal(requests.length, 0)
    await input.fill('1980-01-01')
    await button.click()
    const result = page.getByTestId('birthday-result')
    await result.waitFor()
    assert.match(await result.innerText(), /48/)
    assert.match(await result.innerText(), /2027|٢٠٢٧/)
    assert.ok(requests.some((url) => url.endsWith('/hToG/1-1-1449')))
    const shareLabel = {
      en: 'Share this page',
      ar: 'مشاركة هذه الصفحة',
      fr: 'Partager cette page',
      de: 'Diese Seite teilen',
    }[lang]
    await page.getByText(shareLabel, { exact: true }).click()
    await page
      .getByRole('button', {
        name: { en: 'Copy link', ar: 'نسخ الرابط', fr: 'Copier le lien', de: 'Link kopieren' }[
          lang
        ],
        exact: true,
      })
      .click()
    assert.equal(
      await page.evaluate(() => window.__copied),
      `https://www.islamful.com${path}?shared=copy`
    )
    await input.fill('1980-01-02')
    assert.equal(await result.count(), 0)
    fail = true
    await button.click()
    await tool.getByRole('alert').waitFor()
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com${path}`
    )
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(
    'Four-language birthday routes: explicit conversion only, lunar age, Gregorian date formatting, stale-result clearing, API errors, private-data-free sharing and mobile layout passed'
  )
} finally {
  await browser.close()
}
