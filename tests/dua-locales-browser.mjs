import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { chromium } from 'playwright'
function load(path) {
  const out = {}
  new Function(
    'exports',
    ts.transpileModule(readFileSync(path, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText
  )(out)
  return out
}
const { duaMeanings } = load('data/locales/dua-meanings.ts'),
  { default: duas } = load('data/duas.ts')
for (const lang of ['fr', 'de'])
  assert.deepEqual(
    Object.keys(duaMeanings[lang]).map(Number),
    duas.map((d) => d.id)
  )
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108',
  browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['fr', 'de']) {
    const fr = lang === 'fr',
      context = await browser.newContext({ viewport: { width: 390, height: 844 } }),
      events = []
    await context.route('**/api/engagement', (route) => {
      events.push(route.request().postDataJSON())
      return route.fulfill({ json: { ok: true } })
    })
    await context.addInitScript(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async (text) => (window.__copied = text) },
        configurable: true,
      })
    )
    const page = await context.newPage(),
      errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    assert.equal((await page.goto(`${origin}/${lang}/dua`)).status(), 200)
    await page.locator('#dua-77').waitFor()
    const rendered = await page.getByTestId('dua-meaning').allTextContents()
    assert.deepEqual(
      rendered,
      duas.map((d) => duaMeanings[lang][d.id])
    )
    for (const id of [1, 10, 61, 77])
      assert.equal(
        await page.locator(`#dua-${id} p[dir=rtl]`).innerText(),
        duas.find((d) => d.id === id).arabic
      )
    const first = page.locator('#dua-1')
    await first.locator('summary').click()
    const social = new URL(await first.getByRole('link', { name: /WhatsApp/ }).getAttribute('href'))
    assert.ok(social.searchParams.get('text').includes(duaMeanings[lang][1]))
    assert.ok(social.searchParams.get('text').includes(`/${lang}/dua?shared=WhatsApp#dua-1`))
    const copied = page.waitForResponse(
      (r) =>
        r.url().includes('/api/engagement') && r.request().postDataJSON()?.event === 'share_copy'
    )
    await first
      .getByRole('button', { name: fr ? 'Copier le lien' : 'Link kopieren', exact: true })
      .click()
    await copied
    assert.equal(
      await page.evaluate(() => window.__copied),
      `https://www.islamful.com/${lang}/dua?shared=copy#dua-1`
    )
    assert.ok(
      events.some((e) => e.locale === lang && e.contentId === 'dua-1' && e.event === 'share_copy')
    )
    const search = page.getByRole('textbox', {
      name: fr ? 'Rechercher une invocation…' : 'Bittgebete suchen…',
    })
    await search.fill(fr ? 'accrois mon savoir' : 'mehre mein Wissen')
    assert.equal(await page.getByTestId('dua-meaning').count(), 1)
    assert.equal(await page.locator('#dua-68').count(), 1)
    await search.fill('')
    await page.getByRole('button', { name: fr ? 'Voyage' : 'Reise', exact: false }).click()
    assert.equal(
      await page.getByTestId('dua-meaning').count(),
      duas.filter((d) => d.category === 'travel').length
    )
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com/${lang}/dua`
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(
    'All 77 French/German dua meanings rendered; original Arabic preserved; translated search, categories, social/copy payloads, analytics, canonical URLs and mobile layout passed'
  )
} finally {
  await browser.close()
}
