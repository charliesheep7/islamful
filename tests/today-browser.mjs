import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { build } from 'esbuild'
const source = await build({
  entryPoints: ['data/adhkar.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
})
const { routineEntries } = await import(
  `data:text/javascript;base64,${Buffer.from(source.outputFiles[0].text).toString('base64')}`
)
const origin = process.env.TEST_ORIGIN || 'http://localhost:3098'
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
})
const context = await browser.newContext({
  timezoneId: 'America/Los_Angeles',
  viewport: { width: 390, height: 844 },
})
const page = await context.newPage(),
  errors = [],
  calls = []
page.on('pageerror', (e) => errors.push(String(e)))
await page.clock.install({ time: new Date('2026-10-13T22:00:00Z') })
let fail = false,
  held = []
await context.route('https://api.aladhan.com/**', async (route) => {
  const url = new URL(route.request().url())
  calls.push(url.toString())
  if (fail) return route.fulfill({ status: 503, body: '{}' })
  const [day, month, year] = url.pathname.split('/').pop().split('-')
  const zone = url.searchParams.get('timezonestring'),
    riyadh = zone === 'Asia/Riyadh'
  const offset = riyadh ? '+03:00' : '+01:00'
  const json = {
    code: 200,
    data: {
      timings: Object.fromEntries(
        Object.entries({
          Fajr: '05:47',
          Sunrise: '06:42',
          Dhuhr: '12:10',
          Asr: '15:19',
          Maghrib: '18:47',
          Isha: '20:32',
        }).map(([k, v]) => [k, `${year}-${month}-${day}T${v}:00${offset}`])
      ),
      date: {
        readable: `${day}-${month}-${year}`,
        gregorian: { date: `${day}-${month}-${year}` },
        hijri: { day: '1', month: { en: 'Test' }, year: '1448' },
      },
      meta: { timezone: zone },
    },
  }
  if (url.searchParams.get('method') === '3') {
    held.push(() => route.fulfill({ json }).catch(() => {}))
    return
  }
  await route.fulfill({ json })
})
try {
  await page.goto(origin)
  await page.getByRole('heading', { name: 'Every tool a Muslim needs.' }).waitFor()
  await page.waitForFunction(() =>
    document
      .querySelector('[data-testid="today-calendar"]')
      .textContent.includes('America/Los_Angeles')
  )
  assert.equal(calls.length, 0, 'no prayer API or location request before a choice')
  assert.equal(
    await page.evaluate(() => localStorage.length),
    0,
    'home does not create reader or adhkar records'
  )
  await page.getByLabel('Prayer city', { exact: true }).selectOption('london')
  await page.getByText('Next Prayer', { exact: true }).waitFor()
  assert.ok((await page.getByTestId('fasting-times').innerText()).includes('05:47'))
  await page.getByLabel('Calculation method', { exact: true }).selectOption('2')
  await page
    .getByText('Displayed calculation method: ISNA (North America)', { exact: true })
    .waitFor()
  assert.deepEqual(
    await page.evaluate(() => JSON.parse(localStorage.getItem('islamful.today.v1'))),
    { version: 1, city: 'london', method: '2' }
  )
  fail = true
  await page.getByLabel('Calculation method', { exact: true }).selectOption('4')
  await page.getByText('Could not update prayer times.', { exact: false }).waitFor()
  await page
    .getByText('Displayed calculation method: ISNA (North America)', { exact: true })
    .waitFor()
  fail = false
  await page.getByRole('button', { name: 'Try again', exact: true }).click()
  await page
    .getByText('Displayed calculation method: Umm Al-Qura (Saudi Arabia)', { exact: true })
    .waitFor()
  await page.getByLabel('Calculation method', { exact: true }).selectOption('3')
  await page.waitForFunction(() => document.querySelector('[aria-busy="true"]'))
  await page.getByLabel('Prayer city', { exact: true }).selectOption('mecca')
  await page.getByText('2026-10-14 · Asia/Riyadh', { exact: false }).waitFor()
  for (const release of held) await release()
  assert.ok(
    !(await page.locator('[aria-busy]').innerText()).includes('Europe/London'),
    'late request cannot replace new city'
  )
  const calendarRaw = JSON.stringify({
    method: 'islamic-civil',
    adjustment: 1,
    timeZone: 'Pacific/Honolulu',
  })
  const morning = routineEntries('morning')
  const stored = JSON.stringify({
    version: 1,
    day: '2026-10-13',
    counts: { [morning[0].id]: morning[0].target },
  })
  await page.evaluate(
    ({ calendarRaw, stored }) => {
      localStorage.setItem('islamful_calendar_v1', calendarRaw)
      localStorage.setItem('islamful.adhkar.v1.morning.daily', stored)
      localStorage.setItem(
        'islamful.quran.reader.v1',
        JSON.stringify({
          version: 1,
          place: { surah: 67, ayah: 4 },
          bookmarks: [],
          fontSize: 36,
          showTranslation: true,
        })
      )
      window.dispatchEvent(new Event('focus'))
    },
    { calendarRaw, stored }
  )
  await page.getByTestId('progress-morning').filter({ hasText: '1 / 11 cards' }).waitFor()
  await page.reload()
  await page.getByTestId('quran-resume').filter({ hasText: 'Resume Al-Mulk · verse 4' }).waitFor()
  assert.equal(await page.getByTestId('quran-resume').getAttribute('href'), '/quran/al-mulk#ayah-4')
  assert.ok((await page.getByTestId('today-calendar').innerText()).includes('Asia/Riyadh'))
  assert.ok((await page.getByTestId('today-calendar').innerText()).includes('Tabular Hijri'))
  assert.equal(
    await page.evaluate(() => localStorage.getItem('islamful_calendar_v1')),
    calendarRaw,
    'city does not overwrite calendar time zone'
  )
  await page.goto(`${origin}/ar`)
  await page.getByTestId('quran-resume').filter({ hasText: 'تابع الملك' }).waitFor()
  assert.equal(
    await page.getByTestId('quran-resume').getAttribute('href'),
    '/ar/quran/al-mulk#ayah-4'
  )
  assert.equal(await page.getByLabel('مدينة الصلاة', { exact: true }).inputValue(), 'mecca')
  assert.ok((await page.getByTestId('progress-morning').innerText()).includes('1 / 11'))
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'Arabic mobile does not overflow'
  )
  await page.screenshot({
    path: process.env.TODAY_AR_SCREENSHOT || '/tmp/islamful-today-ar.png',
    fullPage: true,
  })
  assert.equal(
    await page.getByTestId('progress-morning').locator('bdi').getAttribute('dir'),
    'ltr',
    'progress fraction has explicit numeric direction in Arabic'
  )
  const peer = await context.newPage()
  await peer.goto(origin)
  await peer.evaluate(() => {
    localStorage.setItem(
      'islamful.today.v1',
      JSON.stringify({ version: 1, city: 'london', method: '2' })
    )
    localStorage.setItem(
      'islamful.quran.reader.v1',
      JSON.stringify({ version: 1, place: { surah: 1, ayah: 3 } })
    )
  })
  await page.waitForFunction(() => document.querySelector('select').value === 'london')
  await page.getByTestId('quran-resume').filter({ hasText: 'الفاتحة' }).waitFor()
  await page.clock.setSystemTime(new Date('2026-10-14T07:00:01Z'))
  await page.clock.runFor(30000)
  await page.waitForFunction(() =>
    document.querySelector('[data-testid="progress-morning"]').textContent.includes('0 / 11')
  )
  await page.getByRole('button', { name: 'نسيان المدينة', exact: true }).click()
  assert.equal(await page.evaluate(() => localStorage.getItem('islamful.today.v1')), null)
  assert.equal(
    await page.evaluate(() => localStorage.getItem('islamful.adhkar.v1.morning.daily')),
    stored,
    'reading old-day progress does not delete it'
  )
  assert.ok((await page.getByTestId('today-calendar').innerText()).includes('Pacific/Honolulu'))
  await page.goto(origin)
  await page.getByTestId('quran-resume').filter({ hasText: 'Resume Al-Faatiha' }).waitFor()
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'English mobile does not overflow'
  )
  await page.screenshot({
    path: process.env.TODAY_EN_SCREENSHOT || '/tmp/islamful-today-en.png',
    fullPage: true,
  })
  await peer.close()
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota', 'QuotaExceededError')
    }
  })
  await page.getByLabel('Prayer city', { exact: true }).selectOption('london')
  await page.getByText('Local storage is unavailable.', { exact: false }).waitFor()
  await page.getByText('Next Prayer', { exact: true }).waitFor()
  await page.clock.runFor(30000)
  assert.equal(
    await page.getByLabel('Prayer city', { exact: true }).inputValue(),
    'london',
    'quota failure preserves current session choice'
  )
  assert.equal(await page.evaluate(() => localStorage.getItem('islamful.today.v1')), null)
  assert.deepEqual(errors, [])
  const blocked = await browser.newContext()
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked')
      },
    })
  })
  const bp = await blocked.newPage()
  await bp.goto(origin)
  await bp.getByText('Local storage is unavailable.', { exact: false }).waitFor()
  assert.equal(await bp.getByTestId('quran-resume').getAttribute('href'), '/quran')
  await blocked.close()
  const unsupported = await browser.newContext()
  await unsupported.addInitScript(() => {
    Intl.DateTimeFormat = new Proxy(Intl.DateTimeFormat, {
      construct(target, args) {
        if (args[1]?.calendar === 'islamic-umalqura') throw new RangeError('Unsupported calendar')
        return Reflect.construct(target, args)
      },
    })
  })
  const up = await unsupported.newPage()
  const unsupportedErrors = []
  up.on('pageerror', (error) => unsupportedErrors.push(String(error)))
  await up.goto(origin)
  await up
    .getByText('This browser could not calculate the date with these settings.', { exact: true })
    .waitFor()
  assert.deepEqual(unsupportedErrors, [])
  await unsupported.close()
  const nojs = await browser.newContext({ javaScriptEnabled: false })
  for (const path of ['/', '/ar']) {
    const np = await nojs.newPage()
    await np.goto(origin + path)
    assert.equal(await np.locator('h1').count(), 1)
    assert.equal(await np.locator('details').count(), 6)
    await np.locator('summary').first().click()
    assert.equal(await np.locator('details').first().getAttribute('open'), '')
    const canon = await np.locator('link[rel="canonical"]').getAttribute('href')
    assert.equal(new URL(canon).href, `https://www.islamful.com${path}`)
    const prefix = path === '/ar' ? '/ar' : ''
    for (const dest of [
      '/quran',
      '/adhkar/morning',
      '/adhkar/evening',
      '/qibla-finder',
      '/islamic-calendar',
      '/zakat-calculator',
      '/prayer-times',
    ])
      assert.ok(await np.locator(`a[href="${prefix}${dest}"]`).count())
    assert.equal(await np.locator('html').getAttribute('lang'), path === '/ar' ? 'ar' : 'en')
    const schemas = await np.locator('script[type="application/ld+json"]').allTextContents()
    const faq = schemas.map((x) => JSON.parse(x)).find((x) => x['@type'] === 'FAQPage')
    assert.equal(faq.mainEntity.length, 6)
    for (const q of faq.mainEntity)
      assert.ok((await np.locator('body').textContent()).includes(q.acceptedAnswer.text))
    await np.close()
  }
  await nojs.close()
  console.log(
    'Today browser checks passed: no unsolicited location requests/writes; saved city/method; failed method label; stale city responses; fasting boundaries; Quran/adhkar resume and cross-tab/language sync; local midnight; calendar precedence; forget only city; blocked storage; mobile EN/AR; initial HTML, FAQ, canonical and locale links.'
  )
} finally {
  await browser.close()
}
