import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { chromium } from 'playwright'
function load(path) {
  const e = {}
  new Function(
    'exports',
    ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: 1 } }).outputText
  )(e)
  return e
}
const { quranUi } = load('data/locales/quran-ui.ts'),
  { chapterMeanings } = load('data/locales/quran-chapters.ts')
const index = JSON.parse(readFileSync('data/quran/index.json', 'utf8')),
  corpus = JSON.parse(readFileSync('data/quran/corpus.json', 'utf8'))
for (const file of ['components/quran/QuranIndex.tsx', 'components/quran/QuranReader.tsx']) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  function visit(n) {
    if (
      ts.isCallExpression(n) &&
      n.expression.getText(source) === 't' &&
      ts.isStringLiteral(n.arguments[0])
    )
      for (const lang of ['fr', 'de'])
        assert.ok(quranUi[lang][n.arguments[0].text], `${lang}: ${n.arguments[0].text}`)
    ts.forEachChild(n, visit)
  }
  visit(source)
}
const browser = await chromium.launch({ headless: true, channel: 'chrome' }),
  origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
try {
  for (const lang of ['fr', 'de']) {
    const t = (s) => quranUi[lang][s],
      tr = JSON.parse(readFileSync(`data/quran/translations/${lang}.json`, 'utf8'))
    assert.equal(chapterMeanings[lang].length, 114)
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } }),
      page = await context.newPage(),
      errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await context.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    await context.route('https://cdn.islamic.network/**', (r) => r.abort())
    await context.addInitScript(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async (text) => (window.__copied = text) },
        configurable: true,
      })
    )
    await page.goto(`${origin}/${lang}/quran`)
    assert.equal(await page.getByTestId('surah-list').locator('li').count(), 114)
    const search = page.getByLabel(t('Find a surah or verse reference'), { exact: true })
    await search.fill(chapterMeanings[lang][1])
    assert.equal(await page.getByTestId('surah-list').locator('li').count(), 1)
    await search.fill('٢:٢٥٥')
    assert.equal(
      await page.getByTestId('surah-list').locator('a').getAttribute('href'),
      `/${lang}/quran/al-baqarah#ayah-255`
    )
    await page.goto(`${origin}/${lang}/quran/al-ikhlaas`)
    const reader = page.getByTestId('quran-reader')
    assert.deepEqual(
      await reader.getByTestId('translation-verse').allTextContents(),
      tr.chapters[111].map((v) => v.translation)
    )
    await reader.getByRole('button', { name: `${t('Save place at verse')} 2`, exact: true }).click()
    await reader.getByRole('button', { name: `${t('Bookmark verse')} 3`, exact: true }).click()
    await page.reload()
    await reader.getByTestId('reader-resume').waitFor()
    assert.equal(
      await reader.getByTestId('reader-resume').getAttribute('href'),
      `/${lang}/quran/al-ikhlaas#ayah-2`
    )
    assert.equal(
      await reader
        .getByRole('button', { name: `${t('Bookmark verse')} 3`, exact: true })
        .getAttribute('aria-pressed'),
      'true'
    )
    await reader
      .getByLabel(t('Find words in this surah'), { exact: true })
      .fill(lang === 'fr' ? 'engendré' : 'gezeugt')
    assert.equal(await reader.locator('article[data-verse]').count(), 1)
    await reader.getByLabel(t('Go to verse'), { exact: true }).fill('4')
    await reader.getByRole('button', { name: t('Go'), exact: true }).click()
    await page.waitForFunction(() => document.activeElement.id === 'ayah-4')
    assert.equal(await reader.locator('article[data-verse]').count(), 4)
    await reader.getByLabel(t('Go to verse'), { exact: true }).fill('99')
    await reader.getByRole('button', { name: t('Go'), exact: true }).click()
    await reader
      .getByText(
        lang === 'fr' ? 'Saisissez un verset de 1 à 4.' : 'Gib einen Vers von 1 bis 4 ein.',
        { exact: true }
      )
      .waitFor()
    await reader.getByText(t('Memorization practice'), { exact: true }).click()
    await reader.getByLabel(t('Hide verse text until I reveal it'), { exact: true }).check()
    assert.equal(await reader.getByTestId('arabic-verse').count(), 0)
    await reader.getByRole('button', { name: `${t('Reveal verse')} 1`, exact: true }).click()
    assert.equal(await reader.getByTestId('arabic-verse').count(), 1)
    await reader.getByLabel(t('Hide verse text until I reveal it'), { exact: true }).uncheck()
    await reader.getByLabel(t('English translation'), { exact: true }).uncheck()
    assert.equal(await reader.getByTestId('translation-verse').count(), 0)
    assert.equal(await reader.getByTestId('translation-footnotes').count(), 0)
    await reader.getByLabel(t('English translation'), { exact: true }).check()
    await reader
      .getByRole('button', { name: t('Clear saved place, bookmarks and preferences'), exact: true })
      .click()
    assert.equal(await reader.getByTestId('reader-resume').count(), 0)
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
      `https://www.islamful.com/${lang}/quran/al-ikhlaas?shared=copy`
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      false
    )
    assert.deepEqual(errors, [])
    // Inspect every server-rendered chapter without executing its scripts. Check all text, not just headings/counts.
    for (let offset = 0; offset < 114; offset += 6) {
      const batch = await Promise.all(
        index.chapters.slice(offset, offset + 6).map(async (c) => {
          const path = `/${lang}/quran/${c.slug}`,
            res = await context.request.get(origin + path)
          assert.equal(res.status(), 200, path)
          return { path, number: c.number, html: await res.text() }
        })
      )
      const rendered = await page.evaluate(
        (items) =>
          items.map((item) => {
            const doc = new DOMParser().parseFromString(item.html, 'text/html'),
              texts = (id) =>
                Array.from(doc.querySelectorAll(`[data-testid="${id}"]`)).map((n) => n.textContent)
            return {
              path: item.path,
              number: item.number,
              arabic: texts('arabic-verse'),
              translation: texts('translation-verse'),
              footnotes: texts('translation-footnotes'),
              canonical: doc.querySelector('link[rel=canonical]')?.getAttribute('href'),
              language: doc.documentElement.lang,
            }
          }),
        batch
      )
      for (const r of rendered) {
        const i = r.number - 1
        assert.deepEqual(
          r.arabic,
          corpus.chapters[i].verses.map((v) => v.arabic),
          r.path
        )
        assert.deepEqual(
          r.translation,
          tr.chapters[i].map((v) => v.translation),
          r.path
        )
        assert.deepEqual(
          r.footnotes,
          tr.chapters[i].filter((v) => v.footnotes).map((v) => v.footnotes),
          r.path
        )
        assert.equal(r.canonical, `https://www.islamful.com${r.path}`)
        assert.equal(r.language, lang)
      }
    }
    console.log(
      `${lang}: all 114 rendered chapters/6236 verses, original Arabic, exact translation/footnotes, canonicals, localized search and reader interactions passed`
    )
    await context.close()
  }
} finally {
  await browser.close()
}
