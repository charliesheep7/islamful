import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { chromium } from 'playwright'
const e = {}
new Function(
  'exports',
  ts.transpileModule(readFileSync('data/locales/night.ts', 'utf8'), {
    compilerOptions: { module: 1 },
  }).outputText
)(e)
const { nightTranslations, nightPages } = e
const source = ts.createSourceFile(
  'NightPlanner.tsx',
  readFileSync('components/tools/NightPlanner.tsx', 'utf8'),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
)
function visit(node) {
  if (
    ts.isCallExpression(node) &&
    node.expression.getText(source) === 't' &&
    ts.isStringLiteral(node.arguments[0])
  ) {
    for (const lang of ['fr', 'de'])
      assert.ok(
        nightTranslations[lang][node.arguments[0].text],
        `${lang}: ${node.arguments[0].text}`
      )
  }
  ts.forEachChild(node, visit)
}
visit(source)
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['fr', 'de']) {
    const c = nightTranslations[lang],
      t = (s) => c[s]
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      timezoneId: 'America/Los_Angeles',
    })
    const page = await context.newPage(),
      errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await context.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    await context.addInitScript(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async (text) => (window.__copied = text) },
        configurable: true,
      })
    )
    let fail = false
    await page.route('https://api.aladhan.com/**', async (route) => {
      if (fail) return route.fulfill({ status: 503, body: '{}' })
      const date = new URL(route.request().url()).pathname.split('/').pop(),
        [day, month, year] = date.split('-')
      const offset = day === '24' ? '+01:00' : '+00:00'
      const timings = Object.fromEntries(
        Object.entries({
          Fajr: '06:00',
          Sunrise: '07:00',
          Dhuhr: '12:00',
          Asr: '15:00',
          Maghrib: '18:00',
          Isha: '19:30',
        }).map(([key, value]) => [key, `${year}-${month}-${day}T${value}:00${offset}`])
      )
      return route.fulfill({
        json: {
          code: 200,
          data: {
            timings,
            date: {
              readable: date,
              gregorian: { date },
              hijri: { day: '1', month: { en: 'Test' }, year: '1448' },
            },
            meta: { timezone: 'Europe/London' },
          },
        },
      })
    })
    await page.clock.install({ time: new Date('2026-10-25T00:30:00Z') })
    const path = `/${lang}/last-third-of-night`
    assert.equal(
      (await page.goto((process.env.TEST_ORIGIN || 'http://localhost:3108') + path)).status(),
      200
    )
    assert.equal(await page.locator('h1').innerText(), nightPages[lang].title)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com${path}`
    )
    await page.getByLabel(t('Input method'), { exact: true }).selectOption('manual')
    await page.getByLabel(t('Time zone'), { exact: true }).fill('Europe/London')
    await page.getByLabel(t('Night beginning on'), { exact: true }).fill('2026-10-24')
    await page.getByLabel(t('Maghrib'), { exact: true }).fill('18:00')
    await page.getByLabel(t('Next morning Fajr'), { exact: true }).fill('06:00')
    const calculate = page.getByRole('button', { name: t('Calculate my night'), exact: true })
    await calculate.click()
    const result = page.getByRole('region', { name: t('Your night results'), exact: true })
    await result.waitFor()
    assert.ok((await result.innerText()).includes('01:40'))
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: t('Download calendar event'), exact: true }).click()
    const download = await downloadPromise
    const raw = readFileSync(await download.path(), 'utf8'),
      ics = raw.replace(/\r\n /g, '')
    assert.ok(
      ics.includes(
        lang === 'fr' ? 'SUMMARY:Dernier tiers de la nuit' : 'SUMMARY:Letztes Drittel der Nacht'
      )
    )
    assert.ok(ics.includes('DTSTART:20261025T014000Z'))
    assert.ok(raw.split('\r\n').every((line) => Buffer.byteLength(line) <= 75))
    await page.getByLabel(t('Time zone'), { exact: true }).fill('Invalid/Zone')
    assert.equal(await result.count(), 0)
    await calculate.click()
    await page
      .getByRole('alert')
      .filter({ hasText: lang === 'fr' ? 'Impossible de calculer' : 'Diese Nacht konnte' })
      .waitFor()
    await page.getByLabel(t('Input method'), { exact: true }).selectOption('city')
    await calculate.click()
    await result.waitFor()
    assert.ok((await result.innerText()).includes(`${t('Next prayer')}: Fajr`))
    assert.ok((await result.innerText()).includes(lang === 'fr' ? 'Londres' : 'London'))
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    fail = true
    await calculate.click()
    await page
      .getByRole('alert')
      .filter({ hasText: lang === 'fr' ? 'Impossible de calculer' : 'Diese Nacht konnte' })
      .waitFor()
    assert.equal(await result.count(), 0)
    for (const key of ['calculation', 'example', 'tahajjud', 'limits'])
      assert.ok((await page.locator('body').innerText()).includes(nightPages[lang][key]))
    await page
      .getByText(lang === 'fr' ? 'Partager cette page' : 'Diese Seite teilen', { exact: true })
      .click()
    await page
      .getByRole('button', {
        name: lang === 'fr' ? 'Copier le lien' : 'Link kopieren',
        exact: true,
      })
      .click()
    assert.equal(
      await page.evaluate(() => window.__copied),
      `https://www.islamful.com${path}?shared=copy`
    )
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(
    'French/German night planner: all control translations, manual/city DST calculations, invalid input/API recovery, localized ICS, guide, canonical URLs, sharing and mobile layout passed'
  )
} finally {
  await browser.close()
}
