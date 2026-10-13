import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { transform } from 'esbuild'
const { code } = await transform(readFileSync('utils/prayer-schedule.ts', 'utf8'), {
  loader: 'ts',
  format: 'esm',
})
const { localDateISO, followingDate, scheduledPrayers, upcomingPrayer, fetchPrayerSchedule } =
  await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
const instant = (s) => new Date(s).getTime()

test('local dates follow city timezone across the international date boundary', () => {
  const now = new Date('2026-10-13T00:30:00Z')
  assert.equal(localDateISO('America/Los_Angeles', now), '2026-10-12')
  assert.equal(localDateISO('Asia/Tokyo', now), '2026-10-13')
  assert.equal(followingDate('2026-12-31'), '2027-01-01')
  assert.equal(followingDate('2028-02-28'), '2028-02-29')
})

test('dated API offsets handle DST and do not depend on the visitor timezone', () => {
  const first = scheduledPrayers({ Fajr: '2026-10-24T05:47:00+01:00' })[0]
  const next = scheduledPrayers({ Fajr: '2026-10-25T04:49:00+00:00' })[0]
  assert.equal(first.time, '05:47')
  assert.equal(next.at - first.at, (24 * 60 + 2) * 60000)
  const schedule = {
    dateISO: '2026-10-24',
    timezone: 'Europe/London',
    prayers: [first],
    tomorrow: [next],
  }
  assert.equal(upcomingPrayer(schedule, instant('2026-10-24T22:00:00Z')), next)
  assert.equal(
    upcomingPrayer(schedule, instant('2026-10-25T00:00:00Z')),
    null,
    'expired daily data does not drive countdown'
  )
})

test('sunrise is excluded and unavailable high-latitude times are not invented', () => {
  const prayers = scheduledPrayers({
    Fajr: '-----',
    Sunrise: '2026-10-13T06:00:00+00:00',
    Dhuhr: '2026-10-13T12:00:00+00:00',
  })
  assert.equal(prayers[0].at, null)
  assert.equal(prayers[0].time, '—')
  assert.equal(scheduledPrayers({ Fajr: '05:30' })[0].at, null)
  assert.equal(
    upcomingPrayer(
      { dateISO: '2026-10-13', timezone: 'Etc/UTC', prayers, tomorrow: [] },
      instant('2026-10-13T05:00:00Z')
    ).name,
    'Dhuhr'
  )
})

test('fetch uses city coordinates, timezone and two exact calendar dates', async () => {
  const original = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url) => {
    const parsed = new URL(url)
    calls.push(parsed)
    const date = parsed.pathname.split('/').pop()
    return {
      ok: true,
      json: async () => ({
        code: 200,
        data: {
          timings: {
            Fajr: date.startsWith('24') ? '2026-10-24T05:47:00+01:00' : '2026-10-25T04:49:00+00:00',
          },
          date: {
            readable: date,
            gregorian: { date },
            hijri: { day: '1', month: { en: 'test' }, year: '1448' },
          },
          meta: { timezone: 'Europe/London' },
        },
      }),
    }
  }
  try {
    const result = await fetchPrayerSchedule(
      { lat: 51.5, lng: -0.12, timezone: 'Europe/London', name: 'London' },
      '3',
      new Date('2026-10-24T22:00:00Z')
    )
    assert.deepEqual(
      calls.map((url) => url.pathname),
      ['/v1/timings/24-10-2026', '/v1/timings/25-10-2026']
    )
    assert.equal(calls[0].searchParams.get('iso8601'), 'true')
    assert.equal(calls[0].searchParams.get('timezonestring'), 'Europe/London')
    assert.equal(result.tomorrow[0].time, '04:49')
    assert.equal(result.dateISO, '2026-10-24')
  } finally {
    globalThis.fetch = original
  }
})

test('wrong-date responses fail, while a missing tomorrow preserves today', async () => {
  const original = globalThis.fetch
  const location = { lat: 51.5, lng: -0.12, timezone: 'Europe/London', name: 'London' }
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      code: 200,
      data: {
        timings: {},
        date: { gregorian: { date: '01-01-2000' } },
        meta: { timezone: 'Europe/London' },
      },
    }),
  })
  try {
    await assert.rejects(fetchPrayerSchedule(location, '3', new Date('2026-10-24T22:00:00Z')))
    globalThis.fetch = async (url) => {
      if (String(url).includes('/25-')) throw new Error('offline')
      return {
        ok: true,
        json: async () => ({
          code: 200,
          data: {
            timings: {},
            date: {
              gregorian: { date: '24-10-2026' },
              hijri: { day: '1', month: { en: 'test' }, year: '1448' },
            },
            meta: { timezone: 'Europe/London' },
          },
        }),
      }
    }
    const data = await fetchPrayerSchedule(location, '3', new Date('2026-10-24T22:00:00Z'))
    assert.deepEqual(data.tomorrow, [])
  } finally {
    globalThis.fetch = original
  }
})
