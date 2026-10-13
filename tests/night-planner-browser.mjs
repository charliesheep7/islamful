import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  timezoneId: 'America/Los_Angeles',
  acceptDownloads: true,
})
const page = await context.newPage()
await page.clock.install({ time: new Date('2026-10-25T00:30:00Z') })
const errors = []
page.on('pageerror', (error) => errors.push(String(error)))
let fail = false
await page.route('https://api.aladhan.com/**', async (route) => {
  if (fail) return route.fulfill({ status: 503, body: '{}' })
  const date = new URL(route.request().url()).pathname.split('/').pop()
  const [day, month, year] = date.split('-')
  const times = {
    Fajr: '06:00',
    Sunrise: '07:00',
    Dhuhr: '12:00',
    Asr: '15:00',
    Maghrib: '18:00',
    Isha: '19:30',
  }
  const offset = day === '24' ? '+01:00' : '+00:00'
  const timings = Object.fromEntries(
    Object.entries(times).map(([key, value]) => [
      key,
      `${year}-${month}-${day}T${value}:00${offset}`,
    ])
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
        meta: { timezone: 'Europe/London' },
      },
    },
  })
})
try {
  await page.goto('http://localhost:3098/last-third-of-night')
  await page.getByLabel('Input method', { exact: true }).selectOption('manual')
  await page.getByLabel('Time zone', { exact: true }).fill('Europe/London')
  await page.getByLabel('Night beginning on', { exact: true }).fill('2026-10-24')
  await page.getByLabel('Maghrib', { exact: true }).fill('18:00')
  await page.getByLabel('Next morning Fajr', { exact: true }).fill('06:00')
  await page.getByRole('button', { name: 'Calculate my night', exact: true }).click()
  const result = page.getByRole('region', { name: 'Your night results' })
  await result.waitFor()
  assert.ok((await result.innerText()).includes('01:40'), 'DST-adjusted last third in London')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download calendar event' }).click()
  assert.equal((await downloadPromise).suggestedFilename(), 'islamful-night-2026-10-24.ics')
  await page.getByLabel('Maghrib', { exact: true }).fill('17:30')
  assert.equal(await result.count(), 0, 'changing input invalidates prior result')
  await page.getByLabel('Time zone', { exact: true }).fill('Invalid/Zone')
  await page.getByRole('button', { name: 'Calculate my night', exact: true }).click()
  await page.getByRole('alert').filter({ hasText: 'We could not calculate' }).waitFor()
  assert.equal(await result.count(), 0)
  await page.getByLabel('Input method', { exact: true }).selectOption('city')
  await page.getByLabel('Night beginning on', { exact: true }).fill('2026-10-24')
  await page.getByRole('button', { name: 'Calculate my night', exact: true }).click()
  await result.waitFor()
  assert.ok((await result.innerText()).includes('01:40'))
  assert.ok(
    (await result.innerText()).includes('Next prayer: Fajr'),
    'selected night keeps next Fajr after local midnight'
  )
  assert.equal(
    JSON.parse(await page.evaluate(() => localStorage.getItem('islamful-night-settings'))).city,
    'london'
  )
  await page.screenshot({ path: '/tmp/islamful-night-mobile.png', fullPage: true })
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'no horizontal overflow'
  )
  fail = true
  await page.getByRole('button', { name: 'Calculate my night', exact: true }).click()
  await page.getByRole('alert').filter({ hasText: 'We could not calculate' }).waitFor()
  assert.equal(await result.count(), 0, 'failed fresh request does not leave a stale result')
  fail = false
  await page.goto('http://localhost:3098/ar/last-third-of-night')
  await page.getByLabel('الليلة التي تبدأ في', { exact: true }).fill('2026-10-24')
  await page.getByRole('button', { name: 'احسب مواقيت ليلتي', exact: true }).click()
  await page.getByRole('region', { name: 'نتائج ليلتك' }).waitFor()
  assert.deepEqual(errors, [])
  console.log(
    'Night planner browser checks passed: manual/city results, DST, invalid input, download, settings, failure recovery, Arabic, mobile overflow and no page errors.'
  )
} finally {
  await browser.close()
}
