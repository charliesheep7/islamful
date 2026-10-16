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
const { calendarTranslations, calendarPages } = load('data/locales/calendar.ts')
const { calendarGuides } = load('data/locales/calendar-guide.ts')
const { KEY_DATES } = load('data/islamic-calendar.ts')
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const lang of ['fr', 'de']) {
    const c = calendarTranslations[lang]
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      timezoneId: 'Europe/Paris',
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
    await page.clock.install({ time: new Date('2025-03-30T09:00:00Z') })
    const path = `/${lang}/islamic-calendar`
    assert.equal(
      (await page.goto((process.env.TEST_ORIGIN || 'http://localhost:3108') + path)).status(),
      200
    )
    const tool = page.getByTestId('islamic-calendar')
    await tool.getByText(c.saved, { exact: true }).waitFor({ state: 'attached' })
    assert.equal(await page.locator('h1').innerText(), calendarPages[lang].title)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com${path}`
    )
    await tool.getByLabel(c.gregorian, { exact: true }).fill('2025-03-30')
    await tool.getByRole('button', { name: c.convert, exact: true }).click()
    assert.equal(
      await tool.getByTestId('calendar-result').locator('time').getAttribute('datetime'),
      '2025-03-30'
    )
    await tool.getByLabel(c.direction, { exact: true }).selectOption('hg')
    await tool.getByLabel(c.year, { exact: true }).fill('1446')
    await tool.getByLabel(c.month, { exact: true }).selectOption('9')
    await tool.getByLabel(c.day, { exact: true }).fill('30')
    await tool.getByRole('button', { name: c.convert, exact: true }).click()
    await tool.getByRole('alert').filter({ hasText: c.errors.hijri }).waitFor()
    await tool.getByText(c.settings, { exact: true }).click()
    await tool.getByLabel(c.method, { exact: true }).selectOption('islamic-civil')
    await tool.getByRole('button', { name: c.convert, exact: true }).click()
    assert.equal(
      await tool.getByTestId('calendar-result').locator('time').getAttribute('datetime'),
      '2025-03-30'
    )
    await tool.getByLabel(c.zone, { exact: true }).fill('Not/AZone')
    await tool.getByRole('button', { name: c.apply, exact: true }).click()
    await tool.getByRole('alert').filter({ hasText: c.errors.zone }).waitFor()
    await tool.getByLabel(c.method, { exact: true }).selectOption('islamic-umalqura')
    await tool.getByLabel(c.calendarYear, { exact: true }).selectOption('1446')
    await tool.getByLabel(c.calendarMonth, { exact: true }).selectOption('9')
    assert.equal(await tool.getByTestId('hijri-month-grid').locator('td[data-date]').count(), 29)
    const downloadPromise = page.waitForEvent('download')
    await tool.getByRole('button', { name: c.download, exact: true }).click()
    const download = await downloadPromise
    const ics = readFileSync(await download.path(), 'utf8').replace(/\r\n /g, '')
    assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 8)
    assert.ok(ics.includes(`SUMMARY:${KEY_DATES.find((e) => e.id === 'eid-fitr')[lang]}`))
    assert.ok(
      ics.includes(
        lang === 'fr' ? 'Consultez les annonces locales.' : 'Prüfe örtliche Bekanntgaben.'
      )
    )
    const faq = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
        nodes.map((n) => JSON.parse(n.textContent)).find((j) => j['@type'] === 'FAQPage')
      )
    assert.equal(faq.inLanguage, lang)
    assert.equal(faq.mainEntity.length, 6)
    for (const [, answer] of calendarGuides[lang].questions)
      assert.ok((await page.locator('body').innerText()).includes(answer))
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
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      false
    )
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(
    'French/German calendar: conversion, invalid dates/timezones, methods, monthly grid, translated ICS, six FAQs, canonical URLs, sharing and mobile layout passed'
  )
} finally {
  await browser.close()
}
