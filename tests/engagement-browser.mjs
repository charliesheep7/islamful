import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const events = []
  await context.route('**/api/engagement', async (route) => {
    const input = route.request().postDataJSON()
    events.push(input)
    await route.fulfill({ json: { ok: true } })
  })
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (value) => {
          window.__copied = value
        },
      },
      configurable: true,
    })
    Object.defineProperty(navigator, 'share', { value: async () => {}, configurable: true })
  })
  const page = await context.newPage()
  await page.goto(origin + '/dhikr?shared=WhatsApp&private=value')
  await page.getByText('Share this page', { exact: true }).click()
  const share = page.getByRole('region', { name: 'Share this page' })
  await share.getByRole('button', { name: 'Copy link', exact: true }).click()
  await page.getByText('Link copied', { exact: true }).waitFor()
  assert.equal(
    await page.evaluate(() => window.__copied),
    'https://www.islamful.com/dhikr?shared=copy'
  )
  await share.getByRole('button', { name: 'Share', exact: true }).click()
  await page.waitForFunction(() => true)
  const updates = page.getByRole('region', { name: 'Be the first to hear what’s new' })
  await updates.getByLabel('Email address', { exact: true }).fill('browser-check@example.com')
  await updates.getByRole('checkbox').check()
  await updates.getByRole('button', { name: 'Keep me updated' }).click()
  await updates.getByRole('status').waitFor()
  assert.ok(events.some((e) => e.event === 'share_arrival' && e.channel === 'WhatsApp'))
  assert.ok(events.some((e) => e.event === 'share_open'))
  assert.ok(events.some((e) => e.event === 'share_copy'))
  assert.ok(events.some((e) => e.event === 'share_native_complete'))
  assert.ok(events.some((e) => e.kind === 'subscribe' && e.consent === true))
  assert.ok(
    events.filter((e) => e.kind === 'share').every((e) => e.path === '/dhikr' && !('email' in e))
  )
  await page.goto(origin + '/ar/dua')
  await page.getByText('مشاركة هذه الصفحة', { exact: true }).click()
  await page.getByText('أرسل فائدة إلى أحبائك', { exact: true }).waitFor()
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  console.log(
    'Sharing attribution, action tracking, email consent, Arabic and mobile checks passed'
  )
  const dnt = await browser.newContext()
  await dnt.addInitScript(() => Object.defineProperty(navigator, 'doNotTrack', { value: '1' }))
  let calls = 0
  await dnt.route('**/api/engagement', async (route) => {
    calls++
    await route.fulfill({ json: { ok: true } })
  })
  const quiet = await dnt.newPage()
  await quiet.goto(origin + '/dhikr?shared=copy')
  await quiet.getByText('Share this page', { exact: true }).click()
  assert.equal(calls, 0)
  console.log('Do Not Track suppresses sharing analytics')
} finally {
  await browser.close()
}
