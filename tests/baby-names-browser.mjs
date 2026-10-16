import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { chromium } from 'playwright'
function load(file) {
  const e = {}
  new Function(
    'exports',
    ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: 1 } }).outputText
  )(e)
  return e
}
const { muslimNames } = load('data/muslim-names.ts'),
  { babyNameMeaningsAr, babyNameMeanings } = load('data/locales/baby-name-meanings.ts')
assert.deepEqual(
  Object.keys(babyNameMeaningsAr),
  muslimNames.map((n) => n.name)
)
const { babyNamesUi, babyNamesPages } = load('data/locales/baby-names.ts')
for (const lang of ['fr', 'de'])
  assert.deepEqual(
    Object.keys(babyNameMeanings[lang]),
    muslimNames.map((n) => n.name)
  )
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108',
  browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const ar = lang === 'ar',
      copy = babyNamesUi[lang],
      translatedMeaning = (n) =>
        ar
          ? babyNameMeaningsAr[n.name]
          : lang === 'en'
            ? n.meaning
            : babyNameMeanings[lang][n.name],
      context = await browser.newContext({ viewport: { width: 390, height: 844 } }),
      page = await context.newPage(),
      errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await context.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    await context.addInitScript(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async (value) => (window.__copied = value) },
        configurable: true,
      })
    )
    const path = lang === 'en' ? '/muslim-names' : `/${lang}/muslim-names`
    assert.equal((await page.goto(origin + path)).status(), 200)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com${path}`
    )
    if (lang !== 'en')
      assert.equal(await page.locator('h1').innerText(), babyNamesPages[lang].title)
    const tool = page.getByTestId('baby-names')
    await tool.locator('[data-name]').first().waitFor()
    assert.equal(await tool.locator('[data-name]').count(), 48)
    await tool
      .getByRole('button', {
        name: copy.more(217),
        exact: true,
      })
      .click()
    assert.equal(await tool.locator('[data-name]').count(), 265)
    assert.deepEqual(
      await tool.getByTestId('baby-name-meaning').allTextContents(),
      muslimNames.map(translatedMeaning)
    )
    const search = tool.getByRole('textbox', {
      name: copy.search,
    })
    await search.fill({ en: 'Light', ar: 'الضوء', fr: 'Lumière', de: 'Licht' }[lang])
    assert.ok((await tool.locator('[data-name]').count()) > 0)
    await search.fill('Muhammad')
    await tool.locator('[data-name="Muhammad"]').click()
    const dialog = page.getByRole('dialog')
    await dialog.waitFor()
    assert.ok((await dialog.innerText()).includes(translatedMeaning(muslimNames[0])))
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    assert.equal(
      await tool.locator('[data-name="Muhammad"]').evaluate((e) => e === document.activeElement),
      true
    )
    await search.fill('')
    await tool.getByRole('button', { name: copy.female, exact: true }).click()
    assert.ok((await tool.locator('[data-name]').count()) > 0)
    const names = await tool
      .locator('[data-name]')
      .evaluateAll((elements) => elements.map((e) => e.getAttribute('data-name')))
    assert.ok(names.every((name) => muslimNames.find((n) => n.name === name).gender === 'female'))
    await page
      .getByText(
        {
          en: 'Share this page',
          ar: 'مشاركة هذه الصفحة',
          fr: 'Partager cette page',
          de: 'Diese Seite teilen',
        }[lang],
        { exact: true }
      )
      .click()
    await page
      .getByRole('button', {
        name: { en: 'Copy link', ar: 'نسخ الرابط', fr: 'Copier le lien', de: 'Link kopieren' }[
          lang
        ],
        exact: true,
      })
      .click()
    assert.equal(
      await page.evaluate(() => window.__copied),
      `https://www.islamful.com${path}?shared=copy`
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(
    'All four languages: all 265 meanings, search, gender filters, accessible detail dialog/Escape/focus return, page sharing and mobile layout passed'
  )
} finally {
  await browser.close()
}
