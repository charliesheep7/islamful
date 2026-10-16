import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const lang of ['fr', 'de']) {
    const fr = lang === 'fr',
      context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage(),
      errors = [],
      sent = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('request', (r) => {
      if (r.method() === 'POST') sent.push(r.postData())
    })
    await page.goto(`${origin}/${lang}/zakat-calculator/gold`)
    const tool = page.getByTestId('gold-zakat-calculator'),
      result = tool.getByTestId('gold-zakat-result')
    const calc = tool.getByRole('button', {
      name: fr ? 'Calculer la zakat sur l’or' : 'Goldzakat berechnen',
      exact: true,
    })
    await calc.click()
    await tool.getByRole('alert').waitFor()
    await tool
      .getByLabel(
        fr ? 'Prix du gramme d’or 24 carats (USD)' : 'Preis je Gramm 24-Karat-Gold (USD)',
        { exact: true }
      )
      .fill('100,00')
    await tool
      .getByLabel(fr ? 'Poids (grammes)' : 'Gewicht (Gramm)', { exact: true })
      .fill('120,000')
    await tool
      .getByLabel(fr ? 'Pureté (carats)' : 'Feinheit (Karat)', { exact: true })
      .selectOption('18')
    await tool
      .getByLabel(
        fr
          ? 'Votre année lunaire de zakat est-elle achevée ?'
          : 'Ist Ihr Zakat-Mondjahr abgeschlossen?',
        { exact: true }
      )
      .selectOption('yes')
    await calc.click()
    assert.match(await tool.getByTestId('gold-zakat-amount').innerText(), /225,00/)
    await tool
      .getByRole('button', {
        name: fr ? 'Ajouter une autre pièce' : 'Weiteren Posten hinzufügen',
        exact: true,
      })
      .click()
    const second = tool.getByTestId('gold-lot').nth(1)
    await second.getByLabel(fr ? 'Poids (grammes)' : 'Gewicht (Gramm)', { exact: true }).fill('50')
    await second.getByLabel(fr ? 'Usage' : 'Verwendung', { exact: true }).selectOption('jewellery')
    await calc.click()
    assert.match(await tool.getByTestId('gold-zakat-amount').innerText(), /350,00/)
    await tool
      .getByLabel(fr ? 'Règle pour les bijoux personnels' : 'Regel für persönlichen Schmuck', {
        exact: true,
      })
      .selectOption('exclude')
    await calc.click()
    assert.match(await tool.getByTestId('gold-zakat-amount').innerText(), /225,00/)
    const downloadPromise = page.waitForEvent('download')
    await tool
      .getByRole('button', {
        name: fr ? 'Télécharger le résumé' : 'Zusammenfassung herunterladen',
        exact: true,
      })
      .click()
    const download = await downloadPromise,
      text = readFileSync(await download.path(), 'utf8')
    assert.ok(
      text.includes(
        fr ? 'Estimation Islamful de la zakat sur l’or' : 'Islamful-Schätzung der Goldzakat'
      )
    )
    assert.match(text, /225,00/)
    assert.equal(await result.getByRole('link').getAttribute('href'), `/${lang}/zakat-calculator`)
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      `https://www.islamful.com/${lang}/zakat-calculator/gold`
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    assert.ok(
      schemas.some((s) =>
        s.includes(fr ? 'Comment le calcul fonctionne-t-il' : 'Wie funktioniert die Berechnung')
      )
    )
    assert.deepEqual(errors, [])
    assert.deepEqual(sent, [])
    await context.close()
  }
  console.log(
    'French/German gold calculator: mixed purity, jewellery exclusion, decimal input, translated downloads, FAQ, canonical/return links and mobile privacy checks passed'
  )
} finally {
  await browser.close()
}
