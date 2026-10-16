import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3108'
const b = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  for (const [lang, label, heading, google, copy] of [
    ['fr', 'Appuyez pour compter', 'Compteur de dhikr', 'Continuer avec Google', 'Copier le lien'],
    ['de', 'Zum Zählen tippen', 'Dhikr-Zähler', 'Mit Google fortfahren', 'Link kopieren'],
  ]) {
    const page = await b.newPage({ viewport: { width: 390, height: 844 } })
    await page.route('**/api/engagement', (route) => route.fulfill({ json: { ok: true } }))
    assert.equal((await page.goto(`${origin}/${lang}`)).status(), 200)
    await page
      .getByRole('heading', {
        name: lang === 'fr' ? 'Vos prières aujourd’hui' : 'Deine Gebete heute',
        exact: true,
      })
      .waitFor()
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.equal((await page.goto(`${origin}/${lang}/dhikr`)).status(), 200)
    await page.getByRole('heading', { name: heading, exact: true }).waitFor()
    await page.getByRole('button', { name: label, exact: true }).click()
    assert.equal(await page.getByTestId('tasbeeh-count').textContent(), '1')
    await page.reload()
    await page.getByRole('button', { name: label, exact: true }).waitFor()
    await page.waitForFunction(
      () => document.querySelector('[data-testid=tasbeeh-count]')?.textContent === '1'
    )
    await page.locator('summary').click()
    await page.getByRole('button', { name: copy, exact: true }).waitFor()
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(await page.locator('html').getAttribute('dir'), 'ltr')
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false
    )
    assert.ok(
      !(await page.locator('body').innerText()).includes('Counts are saved in this browser')
    )
    assert.equal((await page.goto(`${origin}/${lang}/login`)).status(), 200)
    await page.getByRole('button', { name: google, exact: true }).waitFor()
    await page.goto(`${origin}/auth/callback?error=access_denied&lang=${lang}`)
    assert.ok(page.url().includes(`/${lang}/login?error=callback`))
    await page.locator('section').getByRole('alert').waitFor()
    await page.close()
  }
  console.log(
    'French/German dhikr interaction, persistence, share controls, login, callback language and mobile layout passed'
  )
} finally {
  await b.close()
}
