import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['fr', 'de']) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      timezoneId: 'Europe/London',
    })
    const page = await context.newPage(),
      requests = [],
      errors = []
    page.on('pageerror', (error) => errors.push(String(error)))
    await page.route('**/api/engagement', (route) => route.fulfill({ json: { ok: true } }))
    await page.route('https://api.aladhan.com/**', async (route) => {
      const url = new URL(route.request().url())
      requests.push(url.pathname)
      if (url.pathname === '/v1/timingsByCity')
        return route.fulfill({ json: { code: 200, data: { meta: { timezone: 'Europe/London' } } } })
      const date = url.pathname.split('/').pop(),
        [day, month, year] = date.split('-')
      const times = {
        Fajr: '05:30',
        Sunrise: '07:00',
        Dhuhr: '12:00',
        Asr: '15:00',
        Maghrib: '18:00',
        Isha: '19:30',
      }
      await route.fulfill({
        json: {
          code: 200,
          data: {
            timings: Object.fromEntries(
              Object.entries(times).map(([key, time]) => [
                key,
                `${year}-${month}-${day}T${time}:00+01:00`,
              ])
            ),
            date: {
              readable: date,
              gregorian: { date },
              hijri: { day: '1', month: { en: 'Test' }, year: '1448' },
            },
            meta: { timezone: 'Europe/London' },
          },
        },
      })
    })
    assert.equal((await page.goto(`${origin}/${lang}/prayer-times`)).status(), 200)
    const city = lang === 'fr' ? 'Ville' : 'Stadt',
      country = lang === 'fr' ? 'Pays' : 'Land'
    await page.getByLabel(city, { exact: true }).waitFor()
    assert.equal(requests.length, 0)
    await page.getByLabel(city, { exact: true }).fill('London')
    await page.getByLabel(country, { exact: true }).fill('United Kingdom')
    await page
      .getByRole('button', {
        name: lang === 'fr' ? 'Afficher les horaires' : 'Gebetszeiten anzeigen',
        exact: true,
      })
      .click()
    const result = page.getByRole('region', {
      name: lang === 'fr' ? 'Résultats des horaires de prière' : 'Ergebnisse der Gebetszeitensuche',
    })
    await result.waitFor()
    await result
      .getByText(lang === 'fr' ? 'Lever du soleil' : 'Sonnenaufgang', { exact: true })
      .waitFor()
    assert.ok(requests.some((path) => path.startsWith('/v1/timingsByCity/')))
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      console.error(
        await page.evaluate(() =>
          [...document.querySelectorAll('body *')]
            .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
            .map((e) => ({
              tag: e.tagName,
              text: e.textContent.slice(0, 50),
              width: e.getBoundingClientRect().width,
            }))
            .slice(-12)
        )
      )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    await page.goto(`${origin}/${lang}/prayer-times/london`)
    await page
      .getByRole('heading', {
        name: lang === 'fr' ? 'Horaires de prière à Londres' : 'Gebetszeiten in London',
        exact: true,
      })
      .waitFor()
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com/${lang}/prayer-times/london`
    )
    assert.ok(await page.locator(`a[href="/${lang}/prayer-times"]`).count())
    const places = []
    await page.route('https://api.bigdatacloud.net/**', (route) => {
      places.push(new URL(route.request().url()).searchParams.get('localityLanguage'))
      return route.fulfill({
        json: {
          city: lang === 'fr' ? 'Londres' : 'London',
          countryName: lang === 'fr' ? 'Royaume-Uni' : 'Vereinigtes Königreich',
        },
      })
    })
    await page.goto(`${origin}/${lang}/qibla-finder`)
    const tool = page.getByTestId('qibla-tool')
    await tool.waitFor()
    assert.equal(places.length, 0)
    await page
      .getByLabel(lang === 'fr' ? 'Latitude' : 'Breitengrad', { exact: true })
      .fill('51.5074')
    await page
      .getByLabel(lang === 'fr' ? 'Longitude' : 'Längengrad', { exact: true })
      .fill('-0.1278')
    await page
      .getByRole('button', {
        name: lang === 'fr' ? 'Trouver la Qibla' : 'Qibla finden',
        exact: true,
      })
      .click()
    await tool
      .getByText(lang === 'fr' ? 'Coordonnées utilisées :' : 'Verwendete Koordinaten:', {
        exact: false,
      })
      .waitFor()
    assert.match(await tool.innerText(), /119\.0°/)
    assert.equal(places[0], lang)
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(
    'French/German prayer search, localized results, city routes, canonical links, manual Qibla, place-name language and mobile layout passed'
  )
} finally {
  await browser.close()
}
