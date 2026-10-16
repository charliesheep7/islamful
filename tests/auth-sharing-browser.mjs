import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
const origin = process.env.TEST_ORIGIN || 'http://localhost:3107'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US' })
const page = await context.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
const requests = []
await context.route('https://islamful-auth-test.supabase.co/**', async (route) => {
  const request = route.request(),
    url = new URL(request.url())
  requests.push({
    path: url.pathname,
    query: url.searchParams.toString(),
    body: request.postDataJSON(),
  })
  if (url.pathname.endsWith('/signup'))
    return route.fulfill({
      json: { user: { id: 'test', email: 'reader@example.com' }, session: null },
    })
  if (url.pathname.endsWith('/recover')) return route.fulfill({ json: {} })
  if (url.pathname.endsWith('/authorize'))
    return route.fulfill({ contentType: 'text/plain', body: 'Mock Google authorization reached' })
  return route.fulfill({
    status: 400,
    headers: {
      'x-supabase-api-version': '2024-01-01',
      'access-control-expose-headers': 'X-Supabase-Api-Version',
    },
    json: {
      code: 'invalid_credentials',
      error_code: 'invalid_credentials',
      message: 'Invalid login credentials',
    },
  })
})
await context.addInitScript(() => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async (text) => {
        window.__copied = text
      },
    },
  })
  Object.defineProperty(navigator, 'share', {
    configurable: true,
    value: async (data) => {
      window.__shared = data
    },
  })
})
try {
  await page.goto(`${origin}/login?next=/ar/dua`)
  await page.getByLabel('Email address', { exact: true }).fill('reader@example.com')
  await page.getByLabel('Password', { exact: true }).fill('wrong-password')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await page.getByRole('alert').filter({ hasText: 'Email or password is incorrect' }).waitFor()
  await page.getByRole('button', { name: 'Create an account', exact: true }).click()
  await page.getByLabel('Password', { exact: true }).fill('strong-example-password')
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Check your email' }).waitFor()
  assert.match(requests.find((r) => r.path.endsWith('/signup')).query, /redirect_to=/)
  await page.getByRole('button', { name: 'Back to sign in' }).click()
  await page.getByRole('button', { name: 'Forgot password?' }).click()
  await page.getByRole('button', { name: 'Send reset link' }).click()
  await page.getByRole('status').filter({ hasText: 'If an account exists' }).waitFor()
  assert.match(requests.find((r) => r.path.endsWith('/recover')).query, /recovery%3D1/)
  await page.getByRole('button', { name: 'Back to sign in' }).click()
  await page.getByRole('button', { name: 'Continue with Google' }).click()
  await page.waitForURL('https://islamful-auth-test.supabase.co/**')
  const google = requests.find((r) => r.path.endsWith('/authorize'))
  assert.match(google.query, /provider=google/)
  assert.match(google.query, /code_challenge=/)
  assert.match(google.query, /next%3D%252Far%252Fdua/)
  await page.goto(`${origin}/ar/login`)
  await page.getByRole('heading', { name: 'مرحبًا بعودتك' }).waitFor()
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl')
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await fs.mkdir('../../reports/islamful-auth-sharing-2026-10-14', { recursive: true })
  await page.screenshot({
    path: '../../reports/islamful-auth-sharing-2026-10-14/login-ar-mobile.png',
    fullPage: true,
  })
  await page.goto(`${origin}/auth/callback?code=&next=https://evil.test&lang=ar`, {
    waitUntil: 'domcontentloaded',
  })
  assert.match(page.url(), /\/ar\/login\?error=callback/)
  await page.getByRole('alert').waitFor()
  for (const path of ['/dhikr?private=1', '/ar/dua', '/quran/al-fatihah']) {
    assert.equal((await page.goto(origin + path)).status(), 200)
    await page
      .locator('summary')
      .filter({ hasText: /Share this page|مشاركة هذه الصفحة/ })
      .click()
    const share = page.getByRole('region', { name: /Share this page|مشاركة هذه الصفحة/ })
    await share.waitFor()
    await share.getByRole('button', { name: /Copy link|نسخ الرابط/ }).click()
    assert.equal(
      await page.evaluate(() => window.__copied),
      'https://www.islamful.com' + path.split('?')[0] + '?shared=copy'
    )
    await share.getByRole('button', { name: /^(Share|مشاركة)$/ }).click()
    assert.equal(
      await page.evaluate(() => window.__shared.url),
      'https://www.islamful.com' + path.split('?')[0] + '?shared=native'
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true
    )
  }
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('Denied')
    }
  })
  await page.getByRole('button', { name: 'Copy link' }).click()
  await page.getByRole('textbox', { name: 'Page link' }).waitFor()
  await page.screenshot({
    path: '../../reports/islamful-auth-sharing-2026-10-14/share-mobile.png',
    fullPage: true,
  })
  const files = await fs.readdir('data/blog/en')
  const slug = files.find((f) => f.endsWith('.mdx')).replace(/\.mdx$/, '')
  await page.goto(`${origin}/blog/${slug}`)
  assert.equal(await page.getByRole('region', { name: 'Share this page' }).count(), 2)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`${origin}/login`)
  await page.getByRole('heading', { name: 'Welcome back' }).waitFor()
  await page.screenshot({
    path: '../../reports/islamful-auth-sharing-2026-10-14/login-desktop.png',
    fullPage: true,
  })
  // Seed a browser-only test session after the document request, then verify logout.
  const signed = await browser.newContext()
  const testUser = {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'reader@example.com',
    aud: 'authenticated',
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
  }
  const exp = Math.floor(Date.now() / 1000) + 3600
  const token = [
    Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
    Buffer.from(JSON.stringify({ sub: testUser.id, exp, aud: 'authenticated' })).toString(
      'base64url'
    ),
    'testsignature',
  ].join('.')
  const cookie =
    'base64-' +
    Buffer.from(
      JSON.stringify({
        access_token: token,
        refresh_token: 'test-refresh',
        token_type: 'bearer',
        expires_at: exp,
        expires_in: 3600,
        user: testUser,
      })
    ).toString('base64url')
  await signed.addInitScript((value) => {
    if (!sessionStorage.getItem('seeded')) {
      document.cookie = 'sb-islamful-auth-test-auth-token=' + value + '; path=/'
      sessionStorage.setItem('seeded', '1')
    }
  }, cookie)
  await signed.route('https://islamful-auth-test.supabase.co/**', (route) =>
    route.request().url().includes('/logout')
      ? route.fulfill({ status: 204 })
      : route.fulfill({ json: testUser })
  )
  const account = await signed.newPage()
  await account.goto(origin + '/login')
  await account.getByRole('heading', { name: 'Your account' }).waitFor()
  await account.getByRole('button', { name: 'Sign out', exact: true }).click()
  await account.getByRole('heading', { name: 'Welcome back' }).waitFor()
  assert.equal(
    (await signed.cookies()).some((c) => c.name === 'sb-islamful-auth-test-auth-token' && c.value),
    false
  )
  await signed.close()
  assert.deepEqual(errors, [])
  console.log(
    'Browser checks passed: auth requests, Google PKCE, recovery, callback safety, Arabic RTL, tool/blog sharing, clipboard fallback, mobile overflow.'
  )
} catch (error) {
  console.log(
    'Failure details:',
    await page
      .locator('main')
      .innerText()
      .catch(() => 'navigated'),
    JSON.stringify(requests)
  )
  throw error
} finally {
  await browser.close()
}
