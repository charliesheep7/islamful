import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const lang of ['fr', 'de']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage(),
      errors = [],
      sent = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('request', (r) => {
      if (r.method() === 'POST') sent.push(r.postData())
    })
    const fr = lang === 'fr'
    await page.goto(`${origin}/${lang}/zakat-calculator`)
    assert.equal(
      await page
        .getByRole('navigation', { name: fr ? 'Fil d’Ariane' : 'Brotkrümelnavigation' })
        .getByRole('link', { name: fr ? 'Accueil' : 'Startseite' })
        .getAttribute('href'),
      `/${lang}`
    )
    const tool = page.getByTestId('zakat-calculator')
    const calculate = tool.getByRole('button', {
      name: fr ? 'Calculer l’estimation' : 'Schätzung berechnen',
      exact: true,
    })
    await calculate.click()
    await tool.getByRole('alert').waitFor()
    assert.ok(
      (await tool.getByRole('alert').innerText()).includes(
        fr ? 'Saisissez une valeur' : 'Geben Sie einen Wert'
      )
    )
    const cash = tool.getByLabel(fr ? 'Espèces et comptes courants' : 'Bargeld und Girokonten', {
      exact: true,
    })
    await cash.fill('10000,50')
    await tool.getByLabel(fr ? 'Montant du nisab' : 'Nisab-Betrag', { exact: true }).fill('5000')
    await tool
      .getByLabel(
        fr
          ? 'Votre année lunaire de zakat est-elle écoulée ?'
          : 'Ist Ihr Zakat-Mondjahr abgeschlossen?',
        { exact: true }
      )
      .selectOption('yes')
    await calculate.click()
    const result = tool.getByTestId('zakat-result')
    await result.waitFor()
    assert.match(await tool.getByTestId('zakat-amount').innerText(), /250,02/)
    assert.equal(await result.evaluate((e) => e === document.activeElement), true)
    const downloadPromise = page.waitForEvent('download')
    await tool
      .getByRole('button', {
        name: fr ? 'Télécharger mon résumé (.txt)' : 'Meine Zusammenfassung herunterladen (.txt)',
      })
      .click()
    const download = await downloadPromise
    const text = readFileSync(await download.path(), 'utf8')
    assert.ok(text.includes(fr ? 'Estimation de zakat Islamful' : 'Islamful-Zakat-Schätzung'))
    assert.match(text, /250,02/)
    await cash.fill('-1')
    await calculate.click()
    assert.equal(await result.count(), 0)
    await tool.getByRole('alert').waitFor()
    const faq = await page.locator('script[type="application/ld+json"]').allTextContents()
    assert.ok(
      faq.some((s) => s.includes(fr ? 'Quel nisab choisir' : 'Welchen Nisab soll ich wählen'))
    )
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com/${lang}/zakat-calculator`
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.deepEqual(errors, [])
    assert.deepEqual(sent, [])
    await context.close()
  }
  console.log(
    'French/German Zakat: decimal-comma input, unchanged cent rounding, localized validation/download/FAQ/canonical, no private amount submission, mobile layout passed'
  )
} finally {
  await browser.close()
}
