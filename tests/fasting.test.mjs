import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
const source = await build({
  entryPoints: ['utils/fasting.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
})
const f = await import(
  `data:text/javascript;base64,${Buffer.from(source.outputFiles[0].text).toString('base64')}`
)
const london = {
  slug: 'london',
  name: 'London',
  lat: 51.5074,
  lng: -0.1278,
  timezone: 'Europe/London',
  method: 15,
}
function day(date, offset = '+00:00', extra = {}) {
  const [y, m, d] = date.split('-')
  return {
    date: { gregorian: { date: `${d}-${m}-${y}` } },
    meta: { timezone: 'Europe/London', method: { id: 15 } },
    timings: { Fajr: `${date}T06:00:00${offset}`, Maghrib: `${date}T18:00:00${offset}`, ...extra },
  }
}
const payload = (...days) => ({ code: 200, data: days })
test('Ramadan month is contiguous, bounded, and switches to next year only after Ramadan', () => {
  for (const year of [1447, 1448, 1449]) {
    const dates = f.ramadanDates(year)
    assert.ok([29, 30].includes(dates.length))
    assert.deepEqual(dates, f.dateRange(dates[0], dates.length))
    assert.equal(f.nextRamadanYear(dates[0]), year)
    assert.equal(f.nextRamadanYear(dates.at(-1)), year)
    const next = f.dateRange(dates.at(-1), 2)[1]
    assert.equal(f.nextRamadanYear(next), year + 1)
  }
  assert.equal(f.ramadanDates(1448)[0], '2027-02-08')
  assert.throws(() => f.dateRange('2027-02-30', 2))
  assert.throws(() => f.dateRange('2100-12-31', 2))
  assert.throws(() => f.dateRange('2027-02-01', 32))
})
test('API validation rejects mismatched dates, methods, zones, duplicate rows and invalid payloads', () => {
  for (const p of [
    null,
    {},
    payload({}),
    payload(day('2027-02-01'), day('2027-02-01')),
    payload(day('2027-03-01')),
    payload({ ...day('2027-02-01'), meta: { timezone: 'UTC', method: { id: 15 } } }),
    payload({ ...day('2027-02-01'), meta: { timezone: 'Europe/London', method: { id: 3 } } }),
  ]) {
    assert.throws(() => f.parseFastingMonth(p, '2027-02', 'Europe/London', '15'))
  }
})
test('ISO offsets must match the actual timezone, including the spring DST change', () => {
  const good = f.parseFastingMonth(
    payload(day('2027-03-27'), day('2027-03-28', '+01:00')),
    '2027-03',
    'Europe/London',
    '15'
  )
  assert.equal(good.get('2027-03-28').fajr - good.get('2027-03-27').fajr, 23 * 3600000)
  const bad = f
    .parseFastingMonth(payload(day('2027-03-28')), '2027-03', 'Europe/London', '15')
    .get('2027-03-28')
  assert.equal(bad.fajr, null)
  assert.equal(bad.maghrib, null)
})
test('missing, reversed and different-day times never become invented fasting boundaries', () => {
  for (const extra of [
    { Fajr: '-----' },
    { Fajr: '2027-02-02T06:00:00+00:00' },
    { Fajr: '2027-02-01T19:00:00+00:00' },
  ]) {
    assert.equal(
      f
        .parseFastingMonth(
          payload(day('2027-02-01', '+00:00', extra)),
          '2027-02',
          'Europe/London',
          '15'
        )
        .get('2027-02-01').fajr,
      null
    )
  }
})
test('manual times reject nonexistent/ambiguous DST hours and invalid ordering', () => {
  assert.throws(() => f.manualFasting('2027-03-28', '01:30', '18:00', 'Europe/London'))
  assert.throws(() => f.manualFasting('2027-10-31', '01:30', '18:00', 'Europe/London'))
  assert.throws(() => f.manualFasting('2027-02-01', '18:00', '06:00', 'Europe/London'))
  assert.throws(() => f.manualFasting('2027-02-01', '06:00', '18:00', 'Not/AZone'))
  const row = f.manualFasting('2027-03-28', '00:30', '18:30', 'Europe/London')
  assert.equal((row.maghrib - row.fajr) / 3600000, 17)
})
test('countdown follows city-local date and precise boundaries, never a completed fast', () => {
  const row = f.manualFasting('2027-02-01', '06:00', '18:00', 'Asia/Riyadh')
  assert.equal(f.fastingPhase(row, 'Asia/Riyadh', Date.parse('2027-01-31T23:00:00Z')).kind, 'fajr')
  assert.equal(f.fastingPhase(row, 'Asia/Riyadh', row.fajr).kind, 'maghrib')
  assert.equal(f.fastingPhase(row, 'Asia/Riyadh', row.maghrib).kind, 'ended')
  assert.equal(f.fastingPhase(row, 'Asia/Riyadh', Date.parse('2027-02-01T21:00:00Z')), null)
  assert.equal(f.fastingPhase({ ...row, fajr: null }, 'Asia/Riyadh', row.maghrib), null)
})
test('two-month fetch preserves missing rows, rejects total failure and cancellation, passes date/method/zone', async () => {
  const original = globalThis.fetch,
    urls = []
  try {
    globalThis.fetch = async (url) => {
      urls.push(new URL(url))
      if (String(url).includes('/2027/3?')) return new Response('{}', { status: 503 })
      return Response.json(payload(day('2027-02-28')))
    }
    const result = await f.fetchFastingTable(london, '15', ['2027-02-28', '2027-03-01'])
    assert.equal(result.rows.length, 2)
    assert.equal(result.rows[1].fajr, null)
    assert.deepEqual(result.missingMonths, ['2027-03'])
    assert.equal(urls[0].searchParams.get('iso8601'), 'true')
    assert.equal(urls[0].searchParams.get('timezonestring'), 'Europe/London')
    assert.equal(urls[0].searchParams.get('method'), '15')
    await assert.rejects(f.fetchFastingTable(london, '15', ['2027-03-01']))
    const c = new AbortController()
    c.abort()
    await assert.rejects(f.fetchFastingTable(london, '15', ['2027-02-28'], { signal: c.signal }))
    await assert.rejects(f.fetchFastingTable(london, '__proto__', ['2027-02-28']))
  } finally {
    globalThis.fetch = original
  }
})
test('CSV preserves provenance, missing values and quoted labels in both languages', () => {
  const row = f.manualFasting('2027-02-01', '06:00', '18:00', 'Europe/London')
  const table = {
    rows: [row, { date: '2027-02-02', fajr: null, maghrib: null }],
    timezone: 'Europe/London',
    city: 'london',
    method: '15',
    preparedAt: '2026-10-13T00:00:00Z',
    missingMonths: [],
  }
  const csv = f.fastingCsv(table, 'London, "UK"', 'Estimated Ramadan 1448', 'en')
  assert.ok(csv.startsWith('\uFEFF'))
  assert.ok(csv.includes('"London, ""UK"""'))
  assert.ok(csv.includes('"06:00","18:00","Europe/London"'))
  assert.ok(csv.includes('"Incomplete"'))
  assert.ok(csv.includes('"Estimated Ramadan 1448"'))
  assert.ok(f.fastingCsv(table, 'لندن', 'تقديري', 'ar').includes('غير مكتمل'))
})

// Registry defaults must be selectable and accepted by saved-choice validation.
test('every catalog city has an English and Arabic method label', async () => {
  const compiled = await build({
    stdin: {
      contents:
        "export {default as cities} from './data/cities'; export {PRAYER_METHODS,ARABIC_PRAYER_METHODS} from './data/prayer-methods'",
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  })
  const { cities, PRAYER_METHODS, ARABIC_PRAYER_METHODS } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`
  )
  for (const city of cities) {
    assert.ok(PRAYER_METHODS[city.method], city.slug)
    assert.ok(ARABIC_PRAYER_METHODS[city.method], city.slug)
  }
  assert.equal(cities.find((c) => c.slug === 'jakarta').method, 20)
  assert.equal(cities.find((c) => c.slug === 'bali').method, 20)
})
