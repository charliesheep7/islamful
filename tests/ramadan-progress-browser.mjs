import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3098'
const report = process.env.TEST_REPORT_DIR
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
})
const context = await browser.newContext({
  viewport: { width: 390, height: 900 },
  timezoneId: 'America/Los_Angeles',
})
const page = await context.newPage(),
  errors = [],
  requests = []
page.on('pageerror', (e) => errors.push(e.message))
await context.route('https://api.aladhan.com/**', (route) => {
  requests.push(route.request().url())
  return route.fulfill({ status: 503, body: '{}' })
})
await page.clock.install({ time: new Date('2027-02-07T21:30:00Z') })
await page.clock.setFixedTime(new Date('2027-02-07T21:30:00Z'))
const card = page.getByTestId('ramadan-progress')
async function time(value) {
  await page.clock.setFixedTime(new Date(value))
  await page.clock.runFor(1000)
}
try {
  await page.goto(origin + '/ramadan-calendar')
  await page.getByLabel('Hijri year', { exact: true }).fill('1448')
  await page.getByLabel('City', { exact: true }).selectOption('london')
  assert.equal(await card.getAttribute('data-state'), 'before')
  assert.match(await card.innerText(), /1 day until the first fast/)
  assert.match(await card.innerText(), /2027-02-08/)
  for (const [city, state, zone] of [
    ['dubai', 'during', 'Asia/Dubai'],
    ['mecca', 'during', 'Asia/Riyadh'],
    ['casablanca', 'before', 'Africa/Casablanca'],
  ]) {
    await page.getByLabel('City', { exact: true }).selectOption(city)
    assert.equal(await card.getAttribute('data-state'), state)
    assert((await card.innerText()).includes(zone))
  }
  assert.equal(requests.length, 0, 'Date-only result must not require prayer API requests')
  await page.getByLabel('City', { exact: true }).selectOption('dubai')
  await time('2027-02-08T19:59:59Z')
  assert.match(await card.innerText(), /Fasting day 1 of 29/)
  await time('2027-02-08T20:00:00Z')
  assert.match(await card.innerText(), /Fasting day 2 of 29/)
  await page.getByLabel('Hijri day adjustment', { exact: true }).selectOption('1')
  assert.match(await card.innerText(), /Fasting day 3 of 29/)
  await page.getByLabel('Hijri year', { exact: true }).fill('1449')
  assert.equal(await card.getAttribute('data-state'), 'before')
  assert.match(await card.innerText(), /1449/)
  await page.getByLabel('Hijri year', { exact: true }).fill('')
  assert.equal(await card.getAttribute('data-state'), 'invalid')
  assert.equal(await card.locator('h2').count(), 0)
  await page.getByLabel('Ramadan date basis', { exact: true }).selectOption('local')
  await page.getByLabel('First fasting day', { exact: true }).fill('2027-02-09')
  await page.getByLabel('Number of days', { exact: true }).selectOption('29')
  assert.match(await card.innerText(), /Fasting day 1 of 29/)
  assert.match(await card.innerText(), /Your entered dates/)
  await time('2027-03-09T12:00:00Z')
  assert.match(await card.innerText(), /Fasting day 29 of 29/)
  await time('2027-03-10T12:00:00Z')
  assert.equal(await card.getAttribute('data-state'), 'after')
  await page.getByLabel('Number of days', { exact: true }).selectOption('30')
  assert.match(await card.innerText(), /Fasting day 30 of 30/)
  await page.getByRole('button', { name: 'Show timetable', exact: true }).click()
  await page.locator('form').getByRole('alert').waitFor()
  assert.match(await card.innerText(), /Fasting day 30 of 30/)
  assert.equal(await page.getByTestId('fasting-result').count(), 0)
  await page.getByLabel('First fasting day', { exact: true }).fill('')
  assert.equal(await card.getAttribute('data-state'), 'invalid')
  await page.getByLabel('First fasting day', { exact: true }).fill('2027-03-28')
  await page.getByLabel('City', { exact: true }).selectOption('london')
  await time('2027-03-27T23:30:00Z')
  assert.match(await card.innerText(), /1 day until/)
  await time('2027-03-28T23:30:00Z')
  assert.match(await card.innerText(), /Fasting day 2 of 30/)
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  if (report) await page.screenshot({ path: report + 'countdown-en.png' })
  await page.goto(origin + '/ar/ramadan-calendar')
  await page.getByLabel('السنة الهجرية', { exact: true }).fill('١٤٤٨')
  await page.getByLabel('المدينة', { exact: true }).selectOption('mecca')
  await time('2027-02-08T04:00:00Z')
  assert.match(await card.innerText(), /يوم الصيام ١ من ٢٩/)
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl')
  await page.setViewportSize({ width: 320, height: 900 })
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  if (report) await page.screenshot({ path: report + 'countdown-ar.png' })
  await page.goto(origin + '/fasting-times')
  assert.equal(await card.count(), 0)
  const nojs = await browser.newContext({ javaScriptEnabled: false })
  const snapshot = await nojs.newPage()
  for (const route of [
    '/ramadan-calendar',
    '/ramadan-calendar/dubai',
    '/ar/ramadan-calendar/casablanca',
    '/ramadan-calendar/mecca',
  ]) {
    const response = await snapshot.goto(origin + route)
    assert.equal(response.status(), 200)
    const result = snapshot.getByTestId('ramadan-progress')
    assert.equal(await result.count(), 1)
    assert.match(await result.innerText(), /As of|بتاريخ/)
    assert.equal(await result.getAttribute('data-version'), 'ramadan-progress-v1')
    assert.equal(
      await snapshot.locator('link[rel="canonical"]').getAttribute('href'),
      'https://www.islamful.com' + route
    )
  }
  await nojs.close()
  assert.deepEqual(errors, [])
  const evidence = {
    passed: true,
    api_failure_keeps_progress: true,
    city_midnight: true,
    date_overrides: true,
    boundary_days: true,
    future_year: true,
    invalid_inputs: true,
    dst: true,
    arabic_mobile: true,
    dated_server_snapshots: true,
    daily_tool_unaffected: true,
    errors,
  }
  if (report)
    await fs.writeFile(report + 'countdown-checks.json', JSON.stringify(evidence, null, 2))
  console.log(evidence)
} finally {
  await browser.close()
}
