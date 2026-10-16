import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
})
const base = process.env.TEST_BASE_URL || 'http://localhost:3098'
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  timezoneId: 'America/Los_Angeles',
})
const page = await context.newPage()
const errors = [],
  apiCalls = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('request', (r) => {
  if (/api\.aladhan\.com/.test(r.url())) apiCalls.push(r.url())
})
await page.clock.install({ time: new Date('2025-03-29T23:59:50Z') })
await page.goto(base + '/islamic-calendar')
const tool = page.getByTestId('islamic-calendar')
await tool
  .getByText('Your method, adjustment and time zone are saved in this browser.', { exact: true })
  .waitFor({ state: 'attached' })
assert.equal(await tool.getByLabel('Gregorian date', { exact: true }).inputValue(), '2025-03-29')
await tool.getByText('Calendar settings', { exact: true }).click()
await tool.getByLabel('Time zone for today', { exact: true }).fill('Europe/London')
await tool.getByRole('button', { name: 'Apply time zone', exact: true }).click()
assert.match(await tool.getByTestId('hijri-today').innerText(), /29 Ramadan 1446/)
await page.clock.fastForward(35000)
await page.waitForFunction(() =>
  document.querySelector('[data-testid="hijri-today"]').textContent.includes('1 Shawwal')
)
assert.equal(await tool.getByLabel('Gregorian date', { exact: true }).inputValue(), '2025-03-30')

await tool.getByLabel('Conversion direction', { exact: true }).selectOption('hg')
await tool.getByLabel('Hijri year', { exact: true }).fill('1446')
await tool.getByLabel('Hijri month', { exact: true }).selectOption('9')
await tool.getByLabel('Hijri day', { exact: true }).fill('30')
await tool.getByRole('button', { name: 'Convert date', exact: true }).click()
await tool.getByRole('alert').filter({ hasText: 'does not exist' }).waitFor()
assert.equal(await tool.getByTestId('calendar-result').count(), 0)
await tool.getByLabel('Calculation method', { exact: true }).selectOption('islamic-civil')
await tool.getByRole('button', { name: 'Convert date', exact: true }).click()
assert.equal(
  await tool.getByTestId('calendar-result').locator('time').getAttribute('datetime'),
  '2025-03-30'
)
assert.match(await tool.getByTestId('hijri-today').innerText(), /30 Ramadan/)

// Changes invalidate a prior result, and the adjustment works symmetrically.
await tool.getByLabel('Calculation method', { exact: true }).selectOption('islamic-umalqura')
assert.equal(await tool.getByTestId('calendar-result').count(), 0)
await tool.getByLabel('Local date adjustment', { exact: true }).selectOption('1')
await tool.getByLabel('Hijri month', { exact: true }).selectOption('10')
await tool.getByLabel('Hijri day', { exact: true }).fill('1')
await tool.getByRole('button', { name: 'Convert date', exact: true }).click()
assert.equal(
  await tool.getByTestId('calendar-result').locator('time').getAttribute('datetime'),
  '2025-03-29'
)
await tool.getByLabel('Conversion direction', { exact: true }).selectOption('gh')
await tool.getByLabel('Gregorian date', { exact: true }).fill('2025-03-29')
await tool.getByRole('button', { name: 'Convert date', exact: true }).click()
assert.match(await tool.getByTestId('calendar-result').innerText(), /1 Shawwal 1446/)
await tool.getByLabel('Gregorian date', { exact: true }).fill('')
assert.equal(await tool.getByTestId('calendar-result').count(), 0)
await tool.getByRole('button', { name: 'Convert date', exact: true }).click()
await tool.getByRole('alert').filter({ hasText: 'complete, valid date' }).waitFor()

await tool.getByLabel('Time zone for today', { exact: true }).fill('Not/AZone')
await tool.getByRole('button', { name: 'Apply time zone', exact: true }).click()
await tool.getByRole('alert').filter({ hasText: 'valid IANA' }).waitFor()
assert.match(await tool.locator('section').first().innerText(), /Europe\/London/)
await page.reload()
await tool.getByText('Calendar settings', { exact: true }).click()
await tool
  .getByText('Your method, adjustment and time zone are saved in this browser.', { exact: true })
  .waitFor({ state: 'attached' })
assert.equal(await tool.getByLabel('Local date adjustment', { exact: true }).inputValue(), '1')
assert.equal(
  await tool.getByLabel('Time zone for today', { exact: true }).inputValue(),
  'Europe/London'
)
await tool.getByLabel('Local date adjustment', { exact: true }).selectOption('0')
await tool.getByLabel('Calendar Hijri year', { exact: true }).selectOption('1446')
await tool.getByLabel('Calendar Hijri month', { exact: true }).selectOption('9')
assert.equal(await tool.getByTestId('hijri-month-grid').locator('td[data-date]').count(), 29)
assert.equal(
  await tool
    .getByTestId('hijri-month-grid')
    .locator('td[data-date]')
    .first()
    .getAttribute('data-date'),
  '2025-03-01'
)
await tool.getByLabel('Calendar Hijri month', { exact: true }).selectOption('12')
await tool.getByRole('button', { name: 'Next month', exact: true }).click()
assert.equal(await tool.getByLabel('Calendar Hijri year', { exact: true }).inputValue(), '1447')
assert.equal(await tool.getByLabel('Calendar Hijri month', { exact: true }).inputValue(), '1')

// Once loaded, conversion and export work offline.
await context.setOffline(true)
await tool.getByLabel('Gregorian date', { exact: true }).fill('2024-04-10')
await tool.getByRole('button', { name: 'Convert date', exact: true }).click()
assert.match(await tool.getByTestId('calendar-result').innerText(), /1 Shawwal 1445/)
const pendingDownload = page.waitForEvent('download')
await tool.getByRole('button', { name: 'Download these dates (.ics)', exact: true }).click()
const download = await pendingDownload
assert.match(download.suggestedFilename(), /^islamful-key-dates-2025-03-30-en\.ics$/)
const ics = readFileSync(await download.path(), 'utf8')
assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 8)
assert.match(ics, /DTSTART;VALUE=DATE:20250330/)
assert.deepEqual(apiCalls, [])
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
assert.deepEqual(errors, [])
await context.close()

const arContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  timezoneId: 'Asia/Riyadh',
})
const ar = await arContext.newPage()
const arErrors = []
ar.on('pageerror', (e) => arErrors.push(String(e)))
await ar.clock.install({ time: new Date('2025-03-30T09:00:00Z') })
await ar.goto(base + '/ar/islamic-calendar')
const arTool = ar.getByTestId('islamic-calendar')
await arTool.getByLabel('التاريخ الميلادي', { exact: true }).fill('2025-03-30')
await arTool.getByRole('button', { name: 'تحويل التاريخ', exact: true }).click()
assert.match(await arTool.getByTestId('calendar-result').innerText(), /١ شوال ١٤٤٦/)
await arTool.getByLabel('اتجاه التحويل', { exact: true }).selectOption('hg')
await arTool.getByLabel('السنة الهجرية', { exact: true }).fill('١٤٤٦')
await arTool.getByLabel('الشهر الهجري', { exact: true }).selectOption('10')
await arTool.getByLabel('اليوم الهجري', { exact: true }).fill('١')
await arTool.getByRole('button', { name: 'تحويل التاريخ', exact: true }).click()
assert.equal(
  await arTool.getByTestId('calendar-result').locator('time').getAttribute('datetime'),
  '2025-03-30'
)
assert.equal(await arTool.getAttribute('dir'), 'rtl')
assert.equal(await arTool.getAttribute('lang'), 'ar')
assert.ok(await ar.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
await arTool.getByTestId('hijri-month-grid').scrollIntoViewIfNeeded()
if (process.env.TEST_SCREENSHOT) await ar.screenshot({ path: process.env.TEST_SCREENSHOT })
const faq = await ar
  .locator('script[type="application/ld+json"]')
  .evaluateAll((nodes) =>
    nodes.map((n) => JSON.parse(n.textContent)).find((j) => j['@type'] === 'FAQPage')
  )
assert.equal(faq.mainEntity.length, 6)
for (const q of faq.mainEntity)
  assert.ok((await ar.locator('body').innerText()).includes(q.acceptedAnswer.text))
assert.deepEqual(arErrors, [])
await arContext.close()

// Silent calendar fallback must show an error and allow another method without hydration failure.
const unsupported = await browser.newContext()
await unsupported.addInitScript(() => {
  const original = Intl.DateTimeFormat
  Intl.DateTimeFormat = function (locale, options) {
    return new original(
      locale,
      options?.calendar === 'islamic-umalqura' ? { ...options, calendar: 'gregory' } : options
    )
  }
  Intl.DateTimeFormat.prototype = original.prototype
})
const fallback = await unsupported.newPage()
const fallbackErrors = []
fallback.on('pageerror', (e) => fallbackErrors.push(String(e)))
await fallback.goto(base + '/islamic-calendar')
await fallback
  .getByTestId('islamic-calendar')
  .getByRole('alert')
  .filter({ hasText: 'unavailable' })
  .waitFor()
await fallback.getByText('Calendar settings', { exact: true }).click()
await fallback.getByLabel('Calculation method', { exact: true }).selectOption('islamic-civil')
await fallback.getByTestId('hijri-month-grid').waitFor()
assert.deepEqual(fallbackErrors, [])
await unsupported.close()

const noJs = await browser.newContext({ javaScriptEnabled: false })
const rendered = await noJs.newPage()
await rendered.goto(base + '/islamic-calendar')
assert.match(await rendered.getByTestId('hijri-today').innerText(), /AH/)
assert.ok((await rendered.getByTestId('hijri-month-grid').locator('td[data-date]').count()) >= 29)
assert.equal(
  await rendered.locator('link[rel="canonical"]').getAttribute('href'),
  'https://www.islamful.com/islamic-calendar'
)
assert.equal(await rendered.locator('html').getAttribute('lang'), 'en')
assert.equal(await rendered.locator('html').getAttribute('dir'), 'ltr')
await rendered.goto(base + '/ar/islamic-calendar')
assert.equal(await rendered.locator('html').getAttribute('lang'), 'ar')
assert.equal(await rendered.locator('html').getAttribute('dir'), 'rtl')
assert.ok((await rendered.getByTestId('hijri-month-grid').locator('td[data-date]').count()) >= 29)
assert.equal(
  await rendered.locator('link[rel="canonical"]').getAttribute('href'),
  'https://www.islamful.com/ar/islamic-calendar'
)
// Locale headers must survive server rendering on the rest of the Arabic tree.
await rendered.goto(base + '/ar/qibla-finder')
assert.equal(await rendered.locator('html').getAttribute('lang'), 'ar')
assert.equal(await rendered.locator('html').getAttribute('dir'), 'rtl')
for (const path of ['/pricing', '/ar/not-a-real-tool']) {
  const response = await rendered.goto(base + path)
  assert.equal(response.status(), 404, path)
}
await noJs.close()
await browser.close()
console.log(
  'Calendar browser checks passed: both directions, invalid month-end, methods/adjustments, city-zone midnight, invalid timezone, saved settings, monthly/year navigation, offline conversion and ICS, Arabic mobile/FAQ, SSR without JS, unsupported-method recovery without hydration errors.'
)
