import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3098'
const report = process.env.TEST_REPORT_DIR || '../../reports/search-strategy-execution-2026-10-13/'
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
})
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  timezoneId: 'America/Los_Angeles',
})
const page = await ctx.newPage(),
  errors = [],
  calls = [],
  held = []
page.on('pageerror', (e) => errors.push(String(e)))
await page.clock.install({ time: new Date('2027-02-08T04:00:00Z') })
await page.clock.setFixedTime(new Date('2027-02-08T04:00:00Z'))
let fail = false,
  partial = false
await ctx.route('https://api.aladhan.com/**', async (route) => {
  const url = new URL(route.request().url())
  calls.push(url.toString())
  if (fail || (partial && url.pathname.endsWith('/3')))
    return route.fulfill({ status: 503, body: '{}' })
  const [, y, m] = url.pathname.match(/calendar\/(\d+)\/(\d+)$/) || []
  const zone = url.searchParams.get('timezonestring'),
    method = Number(url.searchParams.get('method'))
  const offset =
    zone === 'Asia/Riyadh' ? '+03:00' : Number(m) >= 4 && Number(m) <= 9 ? '+01:00' : '+00:00'
  const days = new Date(Date.UTC(Number(y), Number(m), 0)).getUTCDate()
  const data = Array.from({ length: days }, (_, i) => {
    const d = String(i + 1).padStart(2, '0'),
      mon = m.padStart(2, '0'),
      date = `${y}-${mon}-${d}`
    return {
      date: { gregorian: { date: `${d}-${mon}-${y}` } },
      meta: { timezone: zone, method: { id: method } },
      timings: { Fajr: `${date}T06:00:00${offset}`, Maghrib: `${date}T18:00:00${offset}` },
    }
  })
  const json = { code: 200, data }
  if (method === 3) {
    held.push(() => route.fulfill({ json }).catch(() => {}))
    return
  }
  return route.fulfill({ json })
})
const result = page.getByTestId('fasting-result')
async function show() {
  await page.getByRole('button', { name: 'Show timetable', exact: true }).click()
  await result.waitFor()
}
try {
  await page.goto(`${origin}/fasting-times`)
  await page.waitForFunction(() => document.querySelector('form') !== null)
  assert.equal(calls.length, 0)
  await page.getByLabel('Timetable source', { exact: true }).selectOption('manual')
  await page.getByLabel('Timezone (IANA)').fill('Asia/Riyadh')
  await page.getByLabel('Fajr (24-hour)').fill('06:00')
  await page.getByLabel('Maghrib (24-hour)').fill('18:00')
  await page.getByLabel('Date', { exact: true }).fill('2027-02-08')
  await show()
  assert.ok((await result.innerText()).includes('Until Maghrib'))
  assert.ok((await result.innerText()).includes('11:00:00'))
  assert.ok((await result.innerText()).includes('12h 0m'))
  assert.equal(calls.length, 0)
  await page.clock.setFixedTime(new Date('2027-02-08T15:00:00Z'))
  await page.clock.runFor(1000)
  assert.ok((await result.innerText()).includes('has passed'))
  await page.clock.setFixedTime(new Date('2027-02-08T21:00:00Z'))
  await page.clock.runFor(1000)
  assert.equal(await page.getByTestId('fasting-countdown').count(), 0)
  await page.getByLabel('Date', { exact: true }).fill('2027-02-09')
  assert.equal(await result.count(), 0)
  await page.getByLabel('Maghrib (24-hour)').fill('05:00')
  await page.getByRole('button', { name: 'Show timetable', exact: true }).click()
  await page.locator('form').getByRole('alert').waitFor()
  assert.equal(await result.count(), 0)
  await page.getByLabel('Timetable source', { exact: true }).selectOption('city')
  await page.getByLabel('City', { exact: true }).selectOption('london')
  await page.getByLabel('Date', { exact: true }).fill('2027-02-08')
  await show()
  assert.ok((await result.innerText()).includes('London'))
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('islamful.fasting.settings.v1'))
  )
  assert.deepEqual(saved, { version: 1, city: 'london', method: '15' })
  // A settings change clears the old result immediately, even if the next request fails.
  fail = true
  await page.getByLabel('Prayer calculation method', { exact: true }).selectOption('2')
  assert.equal(await result.count(), 0)
  await page.getByRole('button', { name: 'Show timetable', exact: true }).click()
  await page.locator('form').getByRole('alert').waitFor()
  assert.equal(await result.count(), 0)
  fail = false
  // Late result from a previous method cannot overwrite the new city.
  await page.getByLabel('Prayer calculation method', { exact: true }).selectOption('3')
  await page.getByRole('button', { name: 'Show timetable', exact: true }).click()
  await page.waitForTimeout(200)
  await page.getByLabel('City', { exact: true }).selectOption('mecca')
  await show()
  for (const release of held.splice(0)) await release()
  assert.ok((await result.innerText()).includes('Mecca'))
  assert.ok((await result.innerText()).includes('Asia/Riyadh'))
  // Saved city is reusable on the other tool, while explicit city URLs retain their location.
  await page.goto(`${origin}/ramadan-calendar`)
  await page.waitForFunction(
    () => document.querySelector('select[aria-label="City"]').value === 'mecca'
  )
  await page.getByLabel('City', { exact: true }).selectOption('london')
  await page.getByLabel('Hijri year', { exact: true }).fill('1448')
  await show()
  assert.equal(await result.locator('tbody tr').count(), 29)
  assert.ok((await result.innerText()).includes('2027-02-08'))
  assert.ok((await result.innerText()).includes('2027-03-08'))
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download CSV', exact: true }).click()
  const csv = await download
  const content = await fs.readFile(await csv.path(), 'utf8')
  assert.ok(content.includes('Estimated Ramadan 1448'))
  assert.ok(content.includes('Europe/London'))
  assert.equal(content.trim().split('\r\n').length, 30)
  await page.evaluate(() => {
    window.print = () => {
      window.__printed = true
    }
  })
  await page.getByRole('button', { name: 'Print timetable', exact: true }).click()
  assert.equal(await page.evaluate(() => window.__printed), true)
  await page.emulateMedia({ media: 'print' })
  assert.equal(await page.locator('form').isVisible(), false)
  assert.equal(await result.isVisible(), true)
  await page.emulateMedia({ media: 'screen' })
  // Local dates and partial upstream outage keep dates explicit and missing times blank.
  await page.getByLabel('Ramadan date basis', { exact: true }).selectOption('local')
  await page.getByLabel('First fasting day', { exact: true }).fill('2027-02-09')
  await page.getByLabel('Number of days', { exact: true }).selectOption('29')
  partial = true
  await show()
  assert.equal(await result.locator('tbody tr').count(), 29)
  assert.ok((await result.innerText()).includes('Locally entered'))
  assert.ok((await result.innerText()).includes('2027-03-09'))
  assert.equal((await result.locator('tbody tr').last().innerText()).match(/—/g).length, 3)
  partial = false
  await page.getByLabel('Number of days', { exact: true }).selectOption('30')
  await show()
  assert.equal(await result.locator('tbody tr').count(), 30)
  assert.ok((await result.innerText()).includes('2027-03-10'))
  // Arabic input and display; no page-wide horizontal overflow at 320 px.
  await page.goto(`${origin}/ar/ramadan-calendar`)
  await page.getByLabel('المدينة', { exact: true }).selectOption('london')
  await page.getByLabel('السنة الهجرية', { exact: true }).fill('١٤٤٨')
  await page.getByRole('button', { name: 'عرض الجدول', exact: true }).click()
  await result.waitFor()
  assert.equal(await result.locator('tbody tr').count(), 29)
  assert.ok((await result.innerText()).includes('12س 0د'))
  assert.equal(await page.locator('html').getAttribute('lang'), 'ar')
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl')
  await page.setViewportSize({ width: 320, height: 780 })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: report + 'islamful-fasting-ar-mobile.png', fullPage: true })
  await page.screenshot({ path: report + 'islamful-fasting-ar-top.png' })
  await ctx.setOffline(true)
  const offline = page.waitForEvent('download')
  await page.getByRole('button', { name: 'تنزيل CSV', exact: true }).click()
  await offline
  await ctx.setOffline(false)
  // Storage failure doesn't prevent a useful timetable.
  const blocked = await browser.newContext()
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked')
      },
    })
  })
  const b = await blocked.newPage()
  await b.goto(`${origin}/fasting-times`)
  await b.getByText('Browser storage is unavailable; the timetable still works.').waitFor()
  await b.getByLabel('Timetable source', { exact: true }).selectOption('manual')
  await b.getByLabel('Timezone (IANA)').fill('UTC')
  await b.getByLabel('Fajr (24-hour)').fill('06:00')
  await b.getByLabel('Maghrib (24-hour)').fill('18:00')
  await b.getByRole('button', { name: 'Show timetable', exact: true }).click()
  await b.getByTestId('fasting-result').waitFor()
  await blocked.close()
  const nojs = await browser.newContext({ javaScriptEnabled: false })
  const n = await nojs.newPage()
  await n.goto(`${origin}/ramadan-calendar/london`)
  assert.ok((await n.locator('h1').innerText()).includes('London'))
  assert.ok((await n.locator('tbody tr').count()) >= 29)
  assert.ok((await n.locator('noscript').allTextContents()).join(' ').includes('Enable JavaScript'))
  assert.equal(
    await n.locator('link[rel="canonical"]').getAttribute('href'),
    'https://www.islamful.com/ramadan-calendar/london'
  )
  assert.equal((await n.goto(`${origin}/ramadan-calendar/no-such-city`)).status(), 404)
  assert.equal((await n.goto(`${origin}/fr/ramadan-calendar`)).status(), 404)
  await nojs.close()
  assert.deepEqual(errors, [])
  console.log(
    JSON.stringify(
      {
        passed: true,
        apiRequests: calls.length,
        checks: [
          'manual/no network',
          'city-local countdown and midnight',
          'invalid ordering',
          'saved city/method only',
          'stale result clearing',
          'API failure',
          'late response isolation',
          '29-day calculated Ramadan',
          'local 29/30-day dates',
          'partial-month outage',
          'CSV and offline download',
          'print',
          'Arabic numerals and RTL',
          '320px overflow',
          'blocked storage',
          'no-JS server timetable',
          'canonical',
          '404s',
        ],
      },
      null,
      2
    )
  )
} finally {
  await browser.close()
}
