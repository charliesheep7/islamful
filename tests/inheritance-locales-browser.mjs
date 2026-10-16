import assert from 'node:assert/strict'
import fs from 'node:fs'
import { build } from 'esbuild'
import { chromium } from 'playwright'
const load = async (path) => {
  const r = await build({
    entryPoints: [path],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  })
  return import(
    'data:text/javascript;base64,' + Buffer.from(r.outputFiles[0].text).toString('base64')
  )
}
const {
  inheritanceUi: ui,
  inheritanceHelp: help,
  inheritanceModel: model,
} = await load('data/locales/inheritance-ui.ts')
const { inheritancePages: pages } = await load('data/locales/inheritance-page.ts')
const ar = {
  Male: 'ذكر',
  Female: 'أنثى',
  Wife: 'الزوجة',
  Husband: 'الزوج',
  Father: 'الأب',
  Mother: 'الأم',
  Sons: 'الأبناء',
  Daughters: 'البنات',
  'Full Brothers': 'الإخوة الأشقاء',
  'Full Sisters': 'الأخوات الشقيقات',
  'Clear all': 'مسح الكل',
}
const b = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const lang of ['en', 'ar', 'fr', 'de']) {
    const c = (key) => (lang === 'ar' ? ar[key] || key : ui[lang]?.[key] || key)
    const locale = { en: 'en-US', ar: 'ar-SA', fr: 'fr-FR', de: 'de-DE' }[lang]
    const money = (n) => '$' + n.toLocaleString(locale, { maximumFractionDigits: 2 })
    const path = `${lang === 'en' ? '' : '/' + lang}/inheritance-calculator`
    const p = await b.newPage({ viewport: { width: 390, height: 844 } }),
      errors = []
    p.on('pageerror', (e) => errors.push(e.message))
    await p.route('**/api/engagement', (r) => r.fulfill({ json: { ok: true } }))
    assert.equal(
      (await p.goto(`${process.env.TEST_ORIGIN || 'http://localhost:3108'}${path}`)).status(),
      200
    )
    assert.equal(
      await p.locator('link[rel=canonical]').getAttribute('href'),
      'https://www.islamful.com' + path
    )
    if (pages[lang]) {
      for (const [h, text] of [...pages[lang].sections, ...pages[lang].questions]) {
        await p.getByRole('heading', { name: h, exact: true }).waitFor()
        await p.getByText(text, { exact: true }).waitFor()
      }
      for (const ayah of [11, 12, 176])
        assert.equal(
          await p.getByRole('link', { name: `4:${ayah}`, exact: true }).getAttribute('href'),
          `${lang === 'en' ? '' : '/' + lang}/quran/an-nisaa#ayah-${ayah}`
        )
    }
    const add = (key) => p.getByRole('button', { name: `${c(key)} +`, exact: true }).click()
    const reset = () => p.getByRole('button', { name: c('Clear all'), exact: true }).click()
    await p.locator('#inheritance-estate').fill('120000')
    await add('Sons')
    await add('Sons')
    await add('Daughters')
    await p.locator('table').waitFor()
    let amounts = await p.locator('tbody tr td:last-child').allTextContents()
    assert.deepEqual(amounts.sort(), [money(96000), money(24000)].sort())
    assert.equal(await p.getByRole('columnheader').count(), 5)
    await p.getByText(help[lang].group, { exact: true }).waitFor()
    assert.ok((await p.locator('tbody').textContent()).includes(help[lang].residual))
    await p.locator('#inheritance-debts').fill('-1')
    await p.getByText(help[lang].invalid, { exact: true }).waitFor()
    assert.equal(await p.locator('table').count(), 0)
    await p.locator('#inheritance-debts').fill('0')
    await reset()
    assert.equal(await p.locator('#inheritance-estate').inputValue(), '')
    await p.getByRole('button', { name: c('Female'), exact: true }).click()
    assert.equal(
      await p.getByRole('button', { name: c('Female'), exact: true }).getAttribute('aria-pressed'),
      'true'
    )
    await p.locator('#inheritance-estate').fill('120000')
    for (const key of ['Husband', 'Father', 'Mother'])
      await p.getByRole('checkbox', { name: c(key), exact: true }).check()
    await add('Daughters')
    await add('Daughters')
    amounts = await p.locator('tbody tr td:last-child').allTextContents()
    assert.deepEqual(amounts.sort(), [24000, 16000, 16000, 64000].map(money).sort())
    if (ui[lang])
      await p
        .getByText(ui[lang]['Shares exceeded 100% and were proportionally reduced (Awl)'], {
          exact: true,
        })
        .waitFor()
    await reset()
    await p.locator('#inheritance-estate').fill('120000')
    await p.getByRole('checkbox', { name: c('Father'), exact: true }).check()
    await add('Daughters')
    assert.deepEqual(await p.locator('tbody tr td:last-child').allTextContents(), [
      money(60000),
      money(60000),
    ])
    await p
      .locator('tbody')
      .getByText(model[lang].mixed + ' (1/2)', { exact: true })
      .waitFor()
    await reset()
    await p.locator('#inheritance-estate').fill('120000')
    await p.locator('#inheritance-debts').fill('60000')
    await p.locator('#inheritance-bequests').fill('60000')
    await add('Sons')
    await p.getByText(model[lang].cap, { exact: true }).waitFor()
    assert.deepEqual(await p.locator('tbody tr td:last-child').allTextContents(), [money(40000)])
    await reset()
    await p.locator('#inheritance-estate').fill('120000')
    await p.getByRole('checkbox', { name: c('Wife'), exact: true }).check()
    await p.getByText(model[lang].unallocated + ': ' + money(90000), { exact: true }).waitFor()
    assert.deepEqual(await p.locator('tbody tr td:last-child').allTextContents(), [money(30000)])
    await reset()
    await p.locator('#inheritance-estate').fill('90000')
    await add('Full Brothers')
    await add('Full Sisters')
    assert.deepEqual(
      (await p.locator('tbody tr td:last-child').allTextContents()).sort(),
      [60000, 30000].map(money).sort()
    )
    await p.locator('#inheritance-currency').selectOption('EUR')
    await p
      .locator('tbody')
      .getByText('€' + (60000).toLocaleString(locale, { maximumFractionDigits: 2 }), {
        exact: true,
      })
      .waitFor()
    await p.locator('summary').first().click()
    const shared = decodeURIComponent(
      await p.locator('a[href*="wa.me"]').first().getAttribute('href')
    )
    assert.ok(shared.includes(path + '?shared=WhatsApp'))
    assert.ok(!shared.includes('90000'))
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.deepEqual(errors, [])
    console.log(
      `${lang}: children group amounts, awl, siblings, invalid inputs, currency, reset, guide and private-input-free sharing passed`
    )
    await p.close()
  }
} finally {
  await b.close()
}
