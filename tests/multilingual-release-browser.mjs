import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { build } from 'esbuild'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const { outputFiles } = await build({
  stdin: {
    contents: `export { haramTranslations, haramEntries } from './data/locales/haram'; export { fastingTranslations } from './data/locales/fasting'; export { blogCopy } from './data/locales/blog'; export { navigation } from './data/locales/navigation'; export { authTranslations } from './data/locales/auth';`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
})
const {
  haramTranslations,
  haramEntries,
  fastingTranslations,
  blogCopy,
  navigation,
  authTranslations,
} = await import(
  'data:text/javascript;base64,' + Buffer.from(outputFiles[0].text).toString('base64')
)
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const p = await context.newPage(),
      errors = []
    p.on('pageerror', (e) => {
      errors.push({ url: p.url(), message: e.message })
      console.error('PAGE ERROR', p.url(), e.message)
    })
    await p.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    const prefix = lang === 'en' ? '' : `/${lang}`,
      t = (x) => haramTranslations[lang]?.[x] || x,
      blog = blogCopy[lang]
    assert.equal((await p.goto(origin + prefix + '/haram-check')).status(), 200)
    const labels = {
      en: ['Home', 'More Islamic Tools'],
      ar: ['الرئيسية', 'أدوات إسلامية أخرى'],
      fr: ['Accueil', 'Autres outils islamiques'],
      de: ['Startseite', 'Weitere islamische Tools'],
    }[lang]
    await p.getByRole('heading', { name: labels[1], exact: true }).waitFor()
    await p.locator('main nav').getByRole('link', { name: labels[0], exact: true }).waitFor()
    await p.getByRole('button', { name: t('Music'), exact: true }).click()
    if (lang !== 'en') {
      const entry = haramEntries[lang].find((e) => e.index === 0)
      // Results use translated prose, not the English database fallback.
      const text = await p.locator('main').innerText()
      assert.ok(!text.includes('Music is a debated topic'))
      assert.ok(text.length > 500)
    }
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.equal((await p.goto(origin + prefix + '/blog')).status(), 200)
    await p.getByRole('heading', { level: 1, name: blog.all, exact: true }).waitFor()
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await p.getByRole('link', { name: blog.next, exact: true }).click()
    await p.waitForURL('**/blog/page/2')
    assert.ok(new URL(p.url()).pathname.startsWith(prefix + '/blog/'))
    assert.equal((await p.goto(origin + prefix + '/blog/how-to-pray-tahajjud')).status(), 200)
    assert.equal(await p.locator('html').getAttribute('lang'), lang)
    assert.equal(await p.locator('html').getAttribute('dir'), lang === 'ar' ? 'rtl' : 'ltr')
    assert.ok((await p.locator('article').innerText()).length > 4000)
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await p.getByRole('button', { name: navigation[lang].language, exact: true }).click()
    await p.getByRole('menuitem', { name: lang === 'de' ? 'Français' : 'Deutsch' }).click()
    await p.waitForURL(`**/${lang === 'de' ? 'fr' : 'de'}/blog/how-to-pray-tahajjud`)
    assert.equal((await p.goto(origin + prefix + '/login')).status(), 200)
    assert.equal(await p.locator('input[type="password"]').count(), 0)
    const google =
      authTranslations[lang]?.['Continue with Google'] ||
      (lang === 'ar' ? 'المتابعة باستخدام Google' : 'Continue with Google')
    const oauth = p.waitForRequest((r) => r.url().includes('/auth/v1/authorize'))
    await p.route('**/auth/v1/authorize**', (r) => r.fulfill({ body: 'OAuth redirect reached' }))
    await p.getByRole('button', { name: google, exact: true }).click()
    const request = await oauth,
      u = new URL(request.url())
    assert.equal(u.searchParams.get('provider'), 'google')
    assert.ok(u.searchParams.get('code_challenge'))
    assert.equal(new URL(u.searchParams.get('redirect_to')).searchParams.get('lang'), lang)
    if (lang === 'fr' || lang === 'de') {
      const f = (x) => fastingTranslations[lang][x] || x
      await p.goto(origin + prefix + '/fasting-times')
      await p.getByLabel(f('Timetable source'), { exact: true }).selectOption('manual')
      await p.getByLabel(f('Timezone (IANA)')).fill('Asia/Riyadh')
      await p.getByLabel(f('Fajr (24-hour)')).fill('06:00')
      await p.getByLabel(f('Maghrib (24-hour)')).fill('18:00')
      await p.getByRole('button', { name: f('Show timetable'), exact: true }).click()
      await p.getByTestId('fasting-result').waitFor()
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    }
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: topic checker, articles/pagination/language switch, Google PKCE, fasting, mobile width and browser errors passed`
    )
    await context.close()
  }
} finally {
  await browser.close()
}
