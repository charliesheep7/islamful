import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const page = await browser.newPage(),
      errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (e) => {
      if (e.type() === 'error' && /same key|NaN/.test(e.text())) errors.push(e.text())
    })
    await page.goto(
      `${process.env.TEST_ORIGIN || 'http://localhost:3108'}/${lang === 'en' ? '' : lang + '/'}islamic-mortgage`
    )
    await page.locator('#mortgage-property').fill('500000')
    await page.locator('#mortgage-down').fill('100000')
    await page.locator('#mortgage-term').fill('20')
    await page.locator('#mortgage-profit').fill('0')
    const locale = { en: 'en-US', ar: 'ar-SA', fr: 'fr-FR', de: 'de-DE' }[lang]
    const amount = (n) => '$' + n.toLocaleString(locale, { maximumFractionDigits: 0 })
    await page.getByText(amount(400000 / 240), { exact: true }).waitFor()
    const root = page.locator('#mortgage-currency').locator('..').locator('..')
    await root.locator('button').nth(2).click()
    await page.locator('tbody tr').last().waitFor()
    assert.equal(await page.locator('tbody tr').count(), 20)
    assert.equal(await page.getByRole('columnheader').count(), 5)
    const percent = (v) =>
      new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(v)
    assert.equal(
      await page.locator('tbody tr').first().locator('td').nth(3).textContent(),
      percent(0.76)
    )
    assert.equal(
      await page.locator('tbody tr').last().locator('td').nth(4).textContent(),
      percent(1)
    )
    await page.locator('#mortgage-profit').fill('5')
    await page.waitForFunction(() => document.querySelectorAll('tbody tr').length < 20)
    const cells = await page.locator('tbody tr td:first-child').allTextContents()
    assert.equal(new Set(cells).size, cells.length)
    for (const [id, value] of [
      ['term', ''],
      ['term', '0'],
      ['term', '51'],
      ['term', '1.5'],
      ['profit', '-1'],
      ['down', '500000'],
    ]) {
      await page.locator('#mortgage-term').fill('20')
      await page.locator('#mortgage-profit').fill('5')
      await page.locator('#mortgage-down').fill('100000')
      await page.locator(`#mortgage-${id}`).fill(value)
      await root.getByRole('status').waitFor()
      assert.equal(await page.locator('tbody tr').count(), 0)
    }
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: zero rate, localized ownership, payoff, headers and invalid inputs passed`
    )
    await page.close()
  }
} finally {
  await browser.close()
}
