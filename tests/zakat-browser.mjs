import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
const base = process.env.TEST_BASE_URL || 'http://localhost:3098'
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
})
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await context.newPage()
const errors = [],
  submissions = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('request', (r) => {
  if (r.method() !== 'GET') submissions.push({ url: r.url(), body: r.postData() })
})
await page.goto(base + '/zakat-calculator')
const tool = page.getByTestId('zakat-calculator')
const button = tool.getByRole('button', { name: 'Calculate estimate', exact: true })
const result = tool.getByTestId('zakat-result')
const amount = tool.getByTestId('zakat-amount')
assert.equal(await result.count(), 0)
await button.click()
await tool.getByRole('alert').waitFor()
await tool.getByLabel('Cash and current accounts', { exact: true }).fill('10000')
await tool.getByLabel('Nisab amount', { exact: true }).fill('5000')
await button.click()
assert.match(await result.innerText(), /Confirm your lunar-year position/)
assert.match(await amount.innerText(), /250\.00/)
await tool.getByLabel('Has your lunar Zakat year completed?', { exact: true }).selectOption('yes')
assert.equal(await result.count(), 0)
await button.click()
assert.match(await result.innerText(), /Estimated annual Zakat/)
assert.equal(await result.evaluate((e) => e === document.activeElement), true)
await tool.getByLabel('Has your lunar Zakat year completed?', { exact: true }).selectOption('no')
await button.click()
assert.match(await result.innerText(), /planning amount, not a payment due now/)
await tool.getByLabel('Currency', { exact: true }).selectOption('GBP')
assert.equal(await button.isDisabled(), true)
await tool.getByRole('button', { name: 'Apply currency and clear', exact: true }).click()
assert.equal(await result.count(), 0)
assert.equal(await tool.getByLabel('Cash and current accounts', { exact: true }).inputValue(), '')
await tool.getByLabel('Cash and current accounts', { exact: true }).fill('100')
await tool.getByLabel('Nisab basis', { exact: true }).selectOption('gold')
await tool.getByLabel('Nisab weights', { exact: true }).selectOption('85/595')
await tool.getByLabel('How to enter gold and silver', { exact: true }).selectOption('weight')
await tool.getByLabel('Gold weight (grams)', { exact: true }).fill('100')
await tool.getByLabel('Gold purity (karat)', { exact: true }).selectOption('18')
await tool.getByLabel('Pure gold price per gram', { exact: true }).fill('100')
await tool.getByLabel('Silver weight (grams)', { exact: true }).fill('1000')
await tool.getByLabel('Silver purity (parts per thousand)', { exact: true }).selectOption('925')
await tool.getByLabel('Pure silver price per gram', { exact: true }).fill('1')
await tool.getByLabel('Has your lunar Zakat year completed?', { exact: true }).selectOption('yes')
await button.click()
assert.match(await amount.innerText(), /213\.13/)
assert.match(await result.innerText(), /8,525\.00/)
assert.match(await result.innerText(), /8,500\.00/)
await tool.getByLabel('Pure gold price per gram', { exact: true }).fill('-1')
await button.click()
await tool.getByRole('alert').waitFor()
assert.equal(await result.count(), 0)
assert.equal(
  await tool.getByLabel('Pure gold price per gram', { exact: true }).getAttribute('aria-invalid'),
  'true'
)
await tool.getByLabel('Pure gold price per gram', { exact: true }).fill('100')
await context.setOffline(true)
await button.click()
assert.match(await amount.innerText(), /213\.13/)
const promise = page.waitForEvent('download')
await tool.getByRole('button', { name: 'Download my summary (.txt)', exact: true }).click()
const download = await promise
assert.match(download.suggestedFilename(), /^islamful-zakat-\d{4}-\d{2}-\d{2}-GBP\.txt$/)
const report = readFileSync(await download.path(), 'utf8')
assert.match(report, /213\.13/)
assert.match(report, /Gold purity \(karat\): 18/)
assert.match(report, /85\/595/)
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
assert.deepEqual(submissions, [])
assert.deepEqual(errors, [])
await context.setOffline(false)
await page.reload()
assert.equal(await tool.getByLabel('Cash and current accounts', { exact: true }).inputValue(), '')
assert.equal(await result.count(), 0)
await context.close()

const arContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
const ar = await arContext.newPage(),
  arErrors = []
ar.on('pageerror', (e) => arErrors.push(String(e)))
await ar.goto(base + '/ar/zakat-calculator')
const arTool = ar.getByTestId('zakat-calculator')
assert.equal(await ar.locator('html').getAttribute('lang'), 'ar')
assert.equal(await arTool.getAttribute('dir'), 'rtl')
await arTool.getByLabel('النقد والحسابات الجارية', { exact: true }).fill('١٠٠٠٠٫٥٠')
await arTool.getByLabel('قيمة النصاب', { exact: true }).fill('٥٠٠٠')
await arTool.getByLabel('الالتزامات القابلة للخصم', { exact: true }).fill('۰٫۵۰')
await arTool.getByLabel('هل اكتمل حول الزكاة القمري؟', { exact: true }).selectOption('yes')
await arTool.getByRole('button', { name: 'احسب التقدير', exact: true }).click()
assert.match(await arTool.getByTestId('zakat-amount').innerText(), /٢٥٠٫٠٠/)
await arTool.getByTestId('zakat-result').scrollIntoViewIfNeeded()
assert.ok(await ar.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
if (process.env.TEST_SCREENSHOT) await ar.screenshot({ path: process.env.TEST_SCREENSHOT })
const faq = await ar
  .locator('script[type="application/ld+json"]')
  .evaluateAll((nodes) =>
    nodes.map((n) => JSON.parse(n.textContent)).find((x) => x['@type'] === 'FAQPage')
  )
assert.equal(faq.mainEntity.length, 6)
for (const q of faq.mainEntity)
  assert.ok((await ar.locator('body').innerText()).includes(q.acceptedAnswer.text))
await arTool.getByRole('button', { name: 'مسح الكل', exact: true }).click()
assert.equal(await arTool.getByTestId('zakat-result').count(), 0)
assert.equal(await arTool.getByLabel('النقد والحسابات الجارية', { exact: true }).inputValue(), '')
assert.deepEqual(arErrors, [])
await arContext.close()

const noJs = await browser.newContext({ javaScriptEnabled: false })
const server = await noJs.newPage()
for (const [route, lang] of [
  ['/zakat-calculator', 'en'],
  ['/ar/zakat-calculator', 'ar'],
]) {
  await server.goto(base + route)
  assert.equal(await server.locator('html').getAttribute('lang'), lang)
  assert.equal(
    await server.locator('link[rel="canonical"]').getAttribute('href'),
    'https://www.islamful.com' + route
  )
  assert.equal(await server.getByTestId('zakat-calculator').count(), 1)
  assert.ok(
    (await server.locator('noscript').allTextContents()).some((text) =>
      text.includes(lang === 'en' ? 'Enable JavaScript' : 'فعّل جافاسكربت')
    )
  )
}
await server.goto(base + '/blog/how-to-calculate-zakat')
assert.equal(
  await server.locator('link[rel="canonical"]').getAttribute('href'),
  'https://www.islamful.com/blog/how-to-calculate-zakat'
)
assert.ok((await server.locator('body').innerText()).includes('The net balance reaches nisab.'))
await noJs.close()
await browser.close()
console.log(
  'Zakat production browser checks passed: annual/planning states, currency reset, gold/silver purity, exact nisab, invalid inputs, stale-result clearing, offline calculation and export, no submitted data, no saved balances, Arabic/Persian numerals, RTL mobile, matching FAQ schema and no-JS guidance/canonicals.'
)
