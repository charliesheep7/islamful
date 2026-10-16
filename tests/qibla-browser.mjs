import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3098'
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
})
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await context.newPage()
const errors = [],
  requests = []
page.on('pageerror', (e) => errors.push(String(e)))
await page.addInitScript(() => {
  window.compassGrant = false
  window.compassAbsolute = null
  Object.defineProperty(DeviceOrientationEvent, 'requestPermission', {
    configurable: true,
    value: async (absolute) => {
      window.compassAbsolute = absolute
      return window.compassGrant ? 'granted' : 'denied'
    },
  })
  window.geoCalls = []
  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition: (success, error) => window.geoCalls.push({ success, error }) },
  })
})
let ipReply
await page.route('https://ipapi.co/json/', async (route) => {
  requests.push('ip')
  await new Promise((resolve) => (ipReply = resolve))
  await route
    .fulfill({
      json: { latitude: 40.7128, longitude: -74.006, city: 'New York', country_name: 'USA' },
    })
    .catch(() => {})
})
await page.route('https://api.bigdatacloud.net/**', (route) => {
  requests.push(new URL(route.request().url()).searchParams.get('localityLanguage'))
  return route.fulfill({ json: { city: 'Test city', countryName: 'Test country' } })
})
const tool = page.getByTestId('qibla-tool')
async function manual(lat, lng, ar = false) {
  await page.getByLabel(ar ? 'خط العرض' : 'Latitude', { exact: true }).fill(lat)
  await page.getByLabel(ar ? 'خط الطول' : 'Longitude', { exact: true }).fill(lng)
  await page.getByRole('button', { name: ar ? 'حدد القبلة' : 'Find Qibla', exact: true }).click()
}
await page.goto(origin + '/qibla-finder')
await page.getByLabel('Latitude', { exact: true }).waitFor()
assert.equal(await page.evaluate(() => window.geoCalls.length), 0)
assert.deepEqual(requests, [])
await page
  .getByRole('button', { name: 'Suggest approximate internet location', exact: true })
  .click()
await page.waitForFunction(() => document.body.innerText.includes('Detecting your location'))
await manual('51.5074', '-0.1278')
await tool.getByText('Coordinates used:', { exact: false }).waitFor()
assert.match(await tool.innerText(), /119\.0°/)
ipReply()
await page.waitForTimeout(150)
assert.match(await tool.innerText(), /51\.50740, -0\.12780/)
assert.doesNotMatch(await tool.innerText(), /40\.71280/)
// A device request cannot override a later manual submission.
await page.getByRole('button', { name: 'Use device location', exact: true }).first().click()
await manual('-33.8688', '151.2093')
await page.evaluate(() =>
  window.geoCalls[0].success({ coords: { latitude: 40.7128, longitude: -74.006, accuracy: 25 } })
)
assert.match(await tool.innerText(), /277\.5°/)
// Denial clears the previous result, then retry recovers.
await page.getByRole('button', { name: 'Use device location', exact: true }).first().click()
await page.evaluate(() => window.geoCalls[1].error({ code: 1 }))
await tool.getByRole('alert').waitFor()
assert.doesNotMatch(await tool.innerText(), /277\.5°/)
await page.getByRole('button', { name: 'Use device location', exact: true }).first().click()
await page.evaluate(() =>
  window.geoCalls[2].success({ coords: { latitude: 51.5074, longitude: -0.1278, accuracy: 25 } })
)
await tool.getByText('Device-reported location accuracy: about 25 m', { exact: true }).waitFor()
await page.getByRole('button', { name: 'Enable Compass', exact: true }).click()
assert.match(await tool.getByRole('alert').innerText(), /Compass permission denied/)
await page.evaluate(() => {
  window.compassGrant = true
})
await page.getByRole('button', { name: 'Enable Compass', exact: true }).click()
assert.equal(await page.evaluate(() => window.compassAbsolute), true)
// Relative headings must never activate a geographic compass.
await page.evaluate(() =>
  window.dispatchEvent(
    new DeviceOrientationEvent('deviceorientation', {
      alpha: 90,
      beta: 0,
      gamma: 0,
      absolute: false,
    })
  )
)
assert.equal(await tool.getByText('Device heading available.', { exact: false }).count(), 0)
await page.evaluate(() =>
  window.dispatchEvent(
    new DeviceOrientationEvent('deviceorientationabsolute', {
      alpha: 90,
      beta: 0,
      gamma: 0,
      absolute: true,
    })
  )
)
await tool.getByText('Device heading available.', { exact: false }).waitFor()
await page.waitForTimeout(5200)
assert.equal(await tool.getByText('Device heading available.', { exact: false }).count(), 0)
await manual('21.4225', '39.8262')
await tool.getByText('A useful bearing is undefined', { exact: false }).waitFor()
assert.doesNotMatch(await tool.innerText(), /0\.0°/)
await manual('', '')
await tool.getByRole('alert').waitFor()
assert.match(await tool.getByRole('alert').innerText(), /valid coordinates/)
await page.goto(origin + '/ar/qibla-finder')
await manual('51.5074', '-0.1278', true)
assert.equal(await tool.getAttribute('dir'), 'rtl')
assert.match(await tool.innerText(), /119\.0°/)
assert.ok(requests.includes('ar'), 'Arabic place-name lookup')
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
const faq = await page
  .locator('script[type="application/ld+json"]')
  .evaluateAll((nodes) =>
    nodes.map((n) => JSON.parse(n.textContent)).find((j) => j['@type'] === 'FAQPage')
  )
assert.equal(faq.mainEntity.length, 6)
for (const q of faq.mainEntity)
  assert.ok((await page.locator('body').innerText()).includes(q.acceptedAnswer.text))
await page.screenshot({
  path: '/Users/sihancheng/Documents/ChatGPT/网站中台/reports/search-strategy-execution-2026-10-13/qibla-ar-mobile.png',
})
assert.deepEqual(errors, [])
await context.close()
await browser.close()
console.log(
  'Qibla browser checks passed: explicit lookup, IP/device races, denial/retry, relative and stale headings, singular input, Arabic, matching FAQs and mobile width.'
)
