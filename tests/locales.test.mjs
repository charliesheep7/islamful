import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
const dir = await mkdtemp(join(tmpdir(), 'islamful-locales-'))
try {
  await build({
    entryPoints: [
      'utils/locale.ts',
      'utils/auth.ts',
      'data/locales/auth.ts',
      'data/locales/dhikr.ts',
      'data/locales/dashboard.ts',
      'data/locales/prayer.ts',
      'data/locales/qibla.ts',
      'data/locales/zakat.ts',
      'data/locales/gold.ts',
    ],
    outdir: dir,
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    bundle: true,
    platform: 'node',
  })
  const { localeFromPath, localizedPath } = await import(
    pathToFileURL(join(dir, 'utils/locale.mjs'))
  )
  const { safeReturnPath } = await import(pathToFileURL(join(dir, 'utils/auth.mjs')))
  for (const locale of ['en', 'ar', 'fr', 'de']) {
    assert.equal(localeFromPath(`/${locale}/dhikr`), locale)
    assert.equal(
      localizedPath('/ar/dhikr', locale),
      locale === 'en' ? '/dhikr' : `/${locale}/dhikr`
    )
    assert.equal(
      localizedPath('/updates/unsubscribe?token=abc', locale),
      '/updates/unsubscribe?token=abc'
    )
    assert.equal(safeReturnPath(`/${locale}/login`), '/')
  }
  assert.equal(localeFromPath('/archive'), 'en')
  assert.equal(localizedPath('/archive', 'fr'), '/fr/archive')
  assert.equal(localizedPath('https://example.com', 'de'), 'https://example.com')
  for (const [source, module, key] of [
    ['components/auth/AuthForm.tsx', 'auth', 'authTranslations'],
    ['components/tools/DhikrCounter.tsx', 'dhikr', 'dhikrTranslations'],
    ['components/landing/TodayDashboard.tsx', 'dashboard', 'dashboardTranslations'],
    ['components/tools/PrayerTimesWidget.tsx', 'dashboard', 'dashboardTranslations'],
    ['components/tools/PrayerTimes.tsx', 'prayer', 'prayerTranslations'],
    ['components/tools/QiblaFinder.tsx', 'qibla', 'qiblaTranslations'],
    ['components/tools/ZakatCalculator.tsx', 'zakat', 'zakatTranslations'],
    ['components/tools/GoldZakatCalculator.tsx', 'gold', 'goldTranslations'],
  ]) {
    const translations = (await import(pathToFileURL(join(dir, `data/locales/${module}.mjs`))))[key]
    const tree = ts.createSourceFile(
      source,
      await readFile(source, 'utf8'),
      ts.ScriptTarget.Latest,
      true
    )
    const strings = []
    const walk = (node) => {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(tree) === 't' &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      )
        strings.push(node.arguments[0].text)
      ts.forEachChild(node, walk)
    }
    walk(tree)
    for (const locale of ['fr', 'de'])
      for (const text of strings)
        assert.ok(translations[locale][text], `${source}: missing ${locale}: ${text}`)
  }
  const en = JSON.parse(await readFile('dictionaries/en.json', 'utf8'))
  function shape(value) {
    return Array.isArray(value)
      ? value.map(shape)
      : typeof value === 'object'
        ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]))
        : typeof value
  }
  for (const locale of ['ar', 'fr', 'de'])
    assert.deepEqual(
      shape(JSON.parse(await readFile(`dictionaries/${locale}.json`, 'utf8'))),
      shape(en)
    )
  console.log(
    'Four-language routing, auth redirect safety, dictionary shape and auth/dhikr translation coverage passed'
  )
} finally {
  await rm(dir, { recursive: true, force: true })
}
