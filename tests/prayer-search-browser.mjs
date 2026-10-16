import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3098'
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
})
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  timezoneId: 'America/Los_Angeles',
})
const page = await context.newPage()
await page.clock.install({ time: new Date('2026-10-13T00:30:00Z') })
const calls = [],
  errors = []
let fail = false
page.on('pageerror', (error) => errors.push(String(error)))
await page.route('https://ipapi.co/json/', (route) =>
  route.fulfill({
    json: {
      latitude: 35.68,
      longitude: 139.69,
      timezone: 'Asia/Tokyo',
      city: 'Tokyo',
      country_name: 'Japan',
    },
  })
)
await page.route('https://api.aladhan.com/**', async (route) => {
  const url = new URL(route.request().url())
  calls.push(url)
  if (fail) return route.fulfill({ status: 503, body: '{}' })
  if (url.pathname === '/v1/timingsByCity')
    return route.fulfill({
      json: {
        code: 200,
        data: {
          meta: { latitude: 8.8888888, longitude: 7.7777777, timezone: 'Europe/London' },
          date: { gregorian: { date: '01-01-2000' } },
        },
      },
    })
  const date = url.pathname.split('/').pop(),
    [day, month, year] = date.split('-')
  const zone = url.searchParams.get('timezonestring')
  const offset = zone === 'Asia/Tokyo' ? '+09:00' : '+01:00'
  const times = {
    Fajr: '05:30',
    Sunrise: '07:00',
    Dhuhr: '12:00',
    Asr: '15:00',
    Maghrib: '18:00',
    Isha: '19:30',
  }
  const timings = Object.fromEntries(
    Object.entries(times).map(([key, time]) => [key, `${year}-${month}-${day}T${time}:00${offset}`])
  )
  return route.fulfill({
    json: {
      code: 200,
      data: {
        timings,
        date: {
          readable: date,
          gregorian: { date },
          hijri: { day: '1', month: { en: 'Test' }, year: '1448' },
        },
        meta: { timezone: zone },
      },
    },
  })
})
try {
  await page.goto(origin + '/prayer-times')
  assert.equal(calls.length, 0, 'no unsolicited location lookup')
  await page.getByLabel('City', { exact: true }).fill('London')
  await page.getByLabel('Country', { exact: true }).fill('United Kingdom')
  await page.getByRole('button', { name: 'Show prayer times', exact: true }).click()
  await page.getByRole('region', { name: 'Prayer time results' }).waitFor()
  await page.getByText('2026-10-13 · Europe/London', { exact: false }).waitFor()
  assert.ok(calls.some((url) => url.pathname === '/v1/timingsByCity/13-10-2026'))
  assert.ok(calls.some((url) => url.pathname === '/v1/timingsByCity/14-10-2026'))
  assert.ok(
    calls.every((url) => !url.searchParams.has('latitude')),
    'city placeholder coordinates never used'
  )
  await page.getByLabel('City', { exact: true }).fill('Paris')
  assert.equal(await page.getByRole('region', { name: 'Prayer time results' }).count(), 0)
  fail = true
  await page.getByRole('button', { name: 'Show prayer times', exact: true }).click()
  await page.getByRole('alert').filter({ hasText: 'Could not load' }).waitFor()
  fail = false
  await page.getByRole('button', { name: 'Use approximate location' }).click()
  await page.getByRole('heading', { name: 'Tokyo, Japan', exact: true }).waitFor()
  assert.ok(calls.some((url) => url.searchParams.get('latitude') === '35.68'))
  await page.getByText('2026-10-13 · Asia/Tokyo', { exact: false }).waitFor()
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.goto(origin + '/ar/prayer-times')
  await page.getByLabel('المدينة', { exact: true }).fill('لندن')
  await page.getByLabel('البلد', { exact: true }).fill('المملكة المتحدة')
  await page.getByRole('button', { name: 'عرض المواقيت', exact: true }).click()
  await page.getByRole('region', { name: 'نتائج مواقيت الصلاة' }).waitFor()
  assert.deepEqual(errors, [])
  console.log(
    'Prayer search browser checks passed: city-local dates, no placeholder coordinates, input invalidation, API failure, approximate location, Arabic, mobile layout and no errors.'
  )
} finally {
  await browser.close()
}
