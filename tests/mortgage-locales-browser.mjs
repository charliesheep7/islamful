import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import fs from 'node:fs'
import ts from 'typescript'
async function source(path) {
  const js = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
}
const { mortgageUi } = await source('data/locales/mortgage-ui.ts'),
  { mortgagePages } = await source('data/locales/mortgage-page.ts')
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108',
  b = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
try {
  for (const lang of ['fr', 'de']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } }),
      errors = []
    p.on('pageerror', (e) => errors.push(e.message))
    await p.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    const c = mortgageUi[lang],
      page = mortgagePages[lang]
    assert.equal((await p.goto(`${origin}/${lang}/islamic-mortgage`)).status(), 200)
    await p.getByRole('heading', { name: page.title, exact: true }).waitFor()
    for (const [h, t] of [...page.sections, ...page.questions]) {
      await p.getByRole('heading', { name: h, exact: true }).waitFor()
      await p.getByText(t, { exact: true }).waitFor()
    }
    await p.getByLabel(c['Property Value'], { exact: true }).fill('500000')
    await p.getByLabel(c['Down Payment'], { exact: true }).fill('100000')
    await p.getByLabel(c['Term (years)'], { exact: true }).fill('20')
    await p.getByLabel(c['Profit/Markup Rate (%)'], { exact: true }).fill('5')
    const amount = (n) =>
      '$' + n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'de-DE', { maximumFractionDigits: 0 })
    await p.getByText(amount(800000), { exact: true }).waitFor()
    await p.getByText(amount(800000 / 240), { exact: true }).waitFor()
    await p.getByRole('button', { name: c.Ijara, exact: true }).click()
    await p.getByText(c['Monthly Purchase Contribution'], { exact: true }).waitFor()
    assert.equal(await p.getByText(amount(400000 / 240), { exact: true }).count(), 2)
    await p.getByRole('button', { name: c.Musharaka, exact: true }).click()
    await p.locator('thead').getByText(c['Bank Share %'], { exact: true }).waitFor()
    assert.ok((await p.locator('tbody tr').count()) > 1)
    await p.getByRole('button', { name: c['Compare All'], exact: true }).click()
    await p.getByLabel(c['Conventional Interest Rate (%)'], { exact: true }).fill('6')
    await p.getByText(c['Total Cost Comparison'], { exact: true }).waitFor()
    await p.getByText(c.Conventional, { exact: true }).waitFor()
    const rate = 0.06 / 12,
      monthly = (400000 * rate * (1 + rate) ** 240) / ((1 + rate) ** 240 - 1)
    await p.getByText(amount(monthly * 240), { exact: true }).waitFor()
    await p.getByLabel(c.Currency, { exact: true }).selectOption('EUR')
    await p
      .getByText(
        '€' +
          (monthly * 240).toLocaleString(lang === 'fr' ? 'fr-FR' : 'de-DE', {
            maximumFractionDigits: 0,
          }),
        { exact: true }
      )
      .waitFor()
    const req = p.waitForRequest(
      (r) => r.url().includes('/api/engagement') && r.postDataJSON()?.event === 'share_open'
    )
    await p.locator('summary').first().click()
    await req
    const text = new URL(await p.locator('a[href*="wa.me"]').getAttribute('href')).searchParams.get(
      'text'
    )
    assert.ok(text.includes(page.title))
    assert.ok(text.includes(`/${lang}/islamic-mortgage?shared=WhatsApp`))
    assert.ok(!text.includes('500000'))
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.equal(
      await p.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com/${lang}/islamic-mortgage`
    )
    await p.getByRole('button', { name: c['Clear all'], exact: true }).click()
    assert.equal(await p.getByLabel(c['Property Value'], { exact: true }).inputValue(), '')
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: complete guide/FAQ, all four modes, reference amounts, currency, reset, private-input-free sharing and mobile passed`
    )
    await p.close()
  }
} finally {
  await b.close()
}
