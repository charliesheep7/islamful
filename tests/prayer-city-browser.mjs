import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ timezoneId: 'America/Los_Angeles' })
const page = await context.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(String(error)))
await page.clock.install({ time: new Date('2026-10-24T22:00:00Z') })
let failMethod = false
const calls = []
await page.route('https://api.aladhan.com/**', async (route) => {
  const url = new URL(route.request().url())
  calls.push(url.pathname)
  if (failMethod) return route.fulfill({ status: 503, body: '{}' })
  const date = url.pathname.split('/').pop()
  const [day, month, year] = date.split('-')
  const offset = day === '24' ? '+01:00' : '+00:00'
  const times = {
    Fajr: day === '24' ? '05:47' : '04:49',
    Sunrise: '06:42',
    Dhuhr: '11:45',
    Asr: '14:19',
    Maghrib: '16:47',
    Isha: '18:32',
  }
  const timings = Object.fromEntries(
    Object.entries(times).map(([name, time]) => [
      name,
      `${year}-${month}-${day}T${time}:00${offset}`,
    ])
  )
  await route.fulfill({
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
  await page.goto('http://localhost:3098/prayer-times/london')
  await page.getByText('Tomorrow', { exact: true }).waitFor()
  await page.getByText('04:49', { exact: true }).first().waitFor()
  assert.ok(
    (await page.locator('body').innerText()).match(/06:4[89]:\d{2}/),
    'countdown uses London tomorrow across DST, independent of browser timezone'
  )
  failMethod = true
  await page.getByLabel('Calculation method', { exact: true }).selectOption('2')
  await page.getByText('Could not update prayer times.', { exact: false }).waitFor()
  assert.ok(
    (await page.locator('body').innerText()).includes(
      'Displayed calculation method: Moonsighting Committee Worldwide'
    ),
    'failed request does not relabel old results'
  )
  failMethod = false
  await page.getByRole('button', { name: 'Try again' }).click()
  await page
    .getByText('Displayed calculation method: ISNA (North America)', { exact: true })
    .waitFor()
  await page.clock.setSystemTime(new Date('2026-10-25T00:00:05Z'))
  await page.clock.runFor(1000)
  await page.getByText('2026-10-25 · Europe/London', { exact: false }).waitFor()
  assert.ok(
    calls.some((path) => path.endsWith('/26-10-2026')),
    'midnight fetches the next local day too'
  )
  await page.goto('http://localhost:3098/ar/prayer-times/london')
  await page.getByLabel('طريقة الحساب', { exact: true }).waitFor()
  await page.getByText('الصلاة القادمة', { exact: true }).waitFor()
  assert.deepEqual(errors, [])
  console.log(
    'Browser checks passed: cross-timezone countdown, DST next Fajr, method failure/retry, midnight refresh, Arabic controls, no page errors.'
  )
} finally {
  await browser.close()
}
