// Optional network smoke: checks the real CDN and native browser playback, not mocked media.
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const base = process.env.TEST_BASE_URL || 'http://localhost:3098'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage(),
  errors = [],
  csp = [],
  results = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (/Content Security Policy|Refused to (?:load|connect)/i.test(m.text())) csp.push(m.text())
})
try {
  await page.goto(base + '/quran/al-fatihah')
  const reader = page.getByTestId('quran-reader')
  for (const reciter of ['ar.alafasy', 'ar.husary']) {
    await reader.getByLabel('Reciter', { exact: true }).selectOption(reciter)
    await page.locator('audio').waitFor({ state: 'detached' })
    await reader.getByRole('button', { name: 'Listen to verse 1', exact: true }).click()
    await page.waitForFunction(
      () => {
        const a = document.querySelector('audio')
        return (
          a &&
          a.currentTime > 0.25 &&
          Number.isFinite(a.duration) &&
          a.duration > 0 &&
          !a.paused &&
          !a.error
        )
      },
      { timeout: 20000 }
    )
    results.push(
      await page
        .locator('audio')
        .evaluate((a) => ({
          source: a.currentSrc,
          currentTime: a.currentTime,
          duration: a.duration,
          paused: a.paused,
          mediaError: a.error?.code || null,
        }))
    )
    await page.getByRole('button', { name: 'Stop', exact: true }).click()
    await page.locator('audio').waitFor({ state: 'detached' })
  }
  assert.deepEqual(errors, [])
  assert.deepEqual(csp, [])
  console.log(
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        browser: 'headless Chromium; actual native media and CDN',
        results,
        errors,
        csp,
        limitations:
          'Two opening-verse samples only. Does not verify every audio file, recitation accuracy, iOS unlock/background behavior or physical-device playback.',
      },
      null,
      2
    )
  )
} finally {
  await browser.close()
}
