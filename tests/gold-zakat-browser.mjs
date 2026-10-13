import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'
const base = process.env.TEST_BASE_URL || 'http://localhost:3098'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
const context = await browser.newContext({ viewport: { width: 390, height: 844 } }),
  page = await context.newPage()
const errors = [],
  sent = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('request', (r) => {
  if (r.method() !== 'GET') sent.push(r.url())
})
const response = await page.goto(base + '/zakat-calculator/gold')
assert.equal(response.status(), 200)
const tool = page.getByTestId('gold-zakat-calculator'),
  calculate = tool.getByRole('button', { name: 'Calculate gold Zakat', exact: true }),
  result = tool.getByTestId('gold-zakat-result')
await calculate.click()
await tool.getByRole('alert').waitFor()
assert.equal(
  await tool
    .getByLabel('24K gold price per gram (USD)', { exact: true })
    .evaluate((e) => e === document.activeElement),
  true
)
await tool.getByLabel('24K gold price per gram (USD)', { exact: true }).fill('100')
await tool.getByLabel('Weight (grams)', { exact: true }).fill('120')
await tool.getByLabel('Purity (karat)', { exact: true }).selectOption('18')
await calculate.click()
assert.match(await result.innerText(), /Potential amount/)
await tool.getByLabel('Has your lunar Zakat year completed?', { exact: true }).selectOption('yes')
assert.equal(await result.count(), 0)
await calculate.click()
assert.match(await result.innerText(), /225\.00/)
assert.equal(await result.evaluate((e) => e === document.activeElement), true)
await tool.getByRole('button', { name: 'Add another item', exact: true }).click()
assert.equal(await result.count(), 0)
const second = tool.getByTestId('gold-lot').nth(1)
await second.getByLabel('Weight (grams)', { exact: true }).fill('50')
await second.getByLabel('Use', { exact: true }).selectOption('jewellery')
await calculate.click()
assert.match(await tool.getByTestId('gold-zakat-amount').innerText(), /350\.00/)
await tool.getByLabel('Personal jewellery rule', { exact: true }).selectOption('exclude')
await calculate.click()
assert.match(await tool.getByTestId('gold-zakat-amount').innerText(), /225\.00/)
assert.match(await result.innerText(), /5,000\.00/)
await tool.getByLabel('Currency', { exact: true }).selectOption('GBP')
assert(await calculate.isDisabled())
await tool.getByRole('button', { name: 'Apply currency and clear prices', exact: true }).click()
assert.equal(
  await tool.getByLabel('24K gold price per gram (GBP)', { exact: true }).inputValue(),
  ''
)
assert.equal(await tool.getByLabel('Weight (grams)', { exact: true }).first().inputValue(), '120')
await tool.getByLabel('24K gold price per gram (GBP)', { exact: true }).fill('100')
await tool.getByLabel('Nisab basis', { exact: true }).selectOption('custom')
await tool.getByLabel('Local nisab (GBP)', { exact: true }).fill('10000')
await calculate.click()
assert.match(await result.innerText(), /below your selected nisab/)
await tool.getByLabel('Local nisab (GBP)', { exact: true }).fill('8500')
await tool.getByLabel('Has your lunar Zakat year completed?', { exact: true }).selectOption('no')
await calculate.click()
assert.match(await result.innerText(), /Planning amount/)
await tool.getByLabel('24K gold price per gram (GBP)', { exact: true }).fill('-1')
await calculate.click()
assert.equal(await result.count(), 0)
await tool.getByRole('alert').waitFor()
await tool.getByLabel('24K gold price per gram (GBP)', { exact: true }).fill('100')
await context.setOffline(true)
await calculate.click()
const promise = page.waitForEvent('download')
await tool.getByRole('button', { name: 'Download summary', exact: true }).click()
const download = await promise
const text = readFileSync(await download.path(), 'utf8')
assert.match(text, /225\.00/)
assert.match(text, /Personal jewellery: Excluded/)
assert.match(text, /Planning amount/)
assert.match(text, /GBP/)
assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
await context.setOffline(false)
if (process.env.REPORT_DIR)
  await page.screenshot({ path: process.env.REPORT_DIR + '/gold-result-en.png', fullPage: true })
await page.reload()
assert.equal(await tool.getByLabel('Weight (grams)', { exact: true }).first().inputValue(), '')
assert.equal(await result.count(), 0)
await page.goto(base + '/ar/zakat-calculator/gold')
assert.equal(await page.locator('html').getAttribute('lang'), 'ar')
assert.equal(await page.locator('html').getAttribute('dir'), 'rtl')
await tool.getByLabel('سعر غرام الذهب عيار ٢٤ (SAR)', { exact: true }).fill('١٠٠')
await tool.getByLabel('الوزن بالغرام', { exact: true }).fill('۱۲۰')
await tool.getByLabel('العيار', { exact: true }).selectOption('18')
await tool.getByLabel('هل اكتمل حول الزكاة القمري؟', { exact: true }).selectOption('yes')
await tool.getByRole('button', { name: 'احسب زكاة الذهب', exact: true }).click()
assert.match(await tool.getByTestId('gold-zakat-amount').innerText(), /٢٢٥/)
assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
if (process.env.REPORT_DIR)
  await page.screenshot({ path: process.env.REPORT_DIR + '/gold-result-ar.png', fullPage: true })
await tool.getByRole('button', { name: 'مسح الكل', exact: true }).click()
assert.equal(await result.count(), 0)
assert.equal(await tool.getByLabel('الوزن بالغرام', { exact: true }).inputValue(), '')
const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
const faq = schemas.map((s) => JSON.parse(s)).find((x) => x['@type'] === 'FAQPage')
assert.equal(faq.mainEntity.length, 4)
for (const q of faq.mainEntity) {
  assert(await page.getByText(q.name, { exact: true }).count())
  assert(await page.getByText(q.acceptedAnswer.text, { exact: true }).count())
}
const sitemap = await (await page.request.get(base + '/sitemap.xml')).text()
assert(sitemap.includes('https://www.islamful.com/zakat-calculator/gold'))
assert(sitemap.includes('https://www.islamful.com/ar/zakat-calculator/gold'))
const nojs = await browser.newContext({ javaScriptEnabled: false }),
  p = await nojs.newPage()
await p.goto(base + '/zakat-calculator/gold')
assert.equal(await p.locator('h1').count(), 1)
assert.match(await p.locator('noscript').innerText(), /Enable JavaScript/)
assert.match(await p.locator('article').innerText(), /120 g of 18K/)
await nojs.close()
assert.deepEqual(errors, [])
assert.deepEqual(sent, [])
const report = {
  base,
  passed: true,
  checked: [
    'mixed purities',
    'jewellery exclusion',
    'manual nisab',
    'currency reset',
    'stale result clearing',
    'Arabic/Persian numerals',
    'no-JS guidance',
    'offline calculation and download',
    'no submitted amounts',
    'no horizontal overflow',
    'FAQ/schema match',
    'sitemap',
  ],
  date: new Date().toISOString(),
}
if (process.env.REPORT_DIR)
  writeFileSync(process.env.REPORT_DIR + '/browser.json', JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report))
await browser.close()
