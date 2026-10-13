import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { transform } from 'esbuild'
const { code } = await transform(readFileSync('data/islamic-calendar.ts', 'utf8'), {
  loader: 'ts',
  format: 'esm',
})
const cal = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
const umm = { method: 'islamic-umalqura', adjustment: 0 }
const civil = { method: 'islamic-civil', adjustment: 0 }

test('Umm al-Qura agrees with independently published Ramadan/Eid reference dates', () => {
  // SPA N2273191 / N2290426; MUIS 9-Apr-2024 Syawal announcement.
  // These dated matches do not establish universal moon-sighting agreement.
  for (const [iso, h] of [
    ['2025-03-01', { year: 1446, month: 9, day: 1 }],
    ['2025-03-30', { year: 1446, month: 10, day: 1 }],
    ['2024-04-10', { year: 1445, month: 10, day: 1 }],
  ]) {
    assert.deepEqual(cal.gregorianToHijri(iso, umm), h)
    assert.equal(cal.hijriToGregorian(h, umm), iso)
  }
  assert.deepEqual(cal.gregorianToHijri('2025-03-30', civil), { year: 1446, month: 9, day: 30 })
})

test('civil dates agree with an independent arithmetic Julian-day reference across years', () => {
  for (const year of [1320, 1350, 1400, 1445, 1446, 1500, 1520]) {
    for (let month = 1; month <= 12; month++) {
      const day = 15
      const julianDayNumber =
        day +
        Math.ceil(29.5 * (month - 1)) +
        354 * (year - 1) +
        Math.floor((3 + 11 * year) / 30) +
        1948439
      const expected = new Date((julianDayNumber - 2440588) * cal.DAY_MS).toISOString().slice(0, 10)
      assert.equal(cal.hijriToGregorian({ year, month, day }, civil), expected)
    }
  }
})

test('round trips preserve dates and adjustment direction across the supported range', () => {
  for (const method of [umm.method, civil.method])
    for (const adjustment of [-2, -1, 0, 1, 2]) {
      const settings = { method, adjustment }
      for (const iso of [
        '1900-01-01',
        '1900-02-28',
        '2000-02-29',
        '2025-03-29',
        '2025-03-30',
        '2026-10-13',
        '2100-12-31',
      ]) {
        assert.equal(cal.hijriToGregorian(cal.gregorianToHijri(iso, settings), settings), iso)
      }
    }
  assert.deepEqual(cal.gregorianToHijri('2025-03-29', { ...umm, adjustment: 1 }), {
    year: 1446,
    month: 10,
    day: 1,
  })
  assert.equal(
    cal.hijriToGregorian({ year: 1446, month: 10, day: 1 }, { ...umm, adjustment: 1 }),
    '2025-03-29'
  )
})

test('invalid, empty, out-of-range and nonexistent month-end dates never roll over', () => {
  for (const input of [
    '',
    '2025-2-1',
    '1900-02-29',
    '2100-02-29',
    '2026-04-31',
    '1899-12-31',
    '2101-01-01',
  ])
    assert.throws(() => cal.gregorianToHijri(input))
  assert.throws(() => cal.hijriToGregorian({ year: 1446, month: 9, day: 30 }, umm))
  assert.equal(cal.hijriToGregorian({ year: 1446, month: 9, day: 30 }, civil), '2025-03-30')
  for (const h of [
    { year: 1446, month: 13, day: 1 },
    { year: 1446, month: 1, day: 0 },
    { year: NaN, month: 1, day: 1 },
  ])
    assert.throws(() => cal.hijriToGregorian(h))
  assert.throws(() => cal.gregorianToHijri('2026-01-01', { method: 'gregory', adjustment: 0 }))
  assert.throws(() => cal.gregorianToHijri('2026-01-01', { ...umm, adjustment: 0.5 }))
})

test('month lengths and weekdays remain correct across leap years and year boundaries', () => {
  for (const method of [umm.method, civil.method])
    for (const year of [1317, 1445, 1446, 1524]) {
      let days = 0
      for (let month = 1; month <= 12; month++) {
        const rows = cal.hijriMonthDays(year, month, { method, adjustment: -1 })
        assert.ok([29, 30].includes(rows.length))
        for (let i = 1; i < rows.length; i++) {
          assert.equal(new Date(rows[i].iso) - new Date(rows[i - 1].iso), cal.DAY_MS)
          assert.equal(rows[i].weekday, (rows[i - 1].weekday + 1) % 7)
        }
        days += rows.length
      }
      assert.ok([354, 355].includes(days))
    }
  assert.deepEqual(cal.moveHijriMonth(1446, 12, 1), { year: 1447, month: 1 })
  assert.deepEqual(cal.moveHijriMonth(1446, 1, -1), { year: 1445, month: 12 })
})

test('today follows the chosen time zone, including midnight and DST boundaries', () => {
  assert.equal(cal.dateInTimeZone('2026-10-13T00:30:00Z', 'America/Los_Angeles'), '2026-10-12')
  assert.equal(cal.dateInTimeZone('2026-10-13T00:30:00Z', 'Pacific/Kiritimati'), '2026-10-13')
  assert.equal(cal.dateInTimeZone('2026-10-24T23:30:00Z', 'Europe/London'), '2026-10-25')
  assert.equal(cal.dateInTimeZone('2026-10-25T23:30:00Z', 'Europe/London'), '2026-10-25')
  assert.throws(() => cal.normalizeTimeZone('Not/AZone'))
})

test('upcoming events wrap into the next Hijri year and exported Arabic ICS has valid dates and folding', () => {
  const today = cal.hijriToGregorian({ year: 1446, month: 12, day: 29 }, civil)
  const events = cal.upcomingKeyDates(today, civil)
  assert.equal(events[0].year, 1447)
  assert.equal(events[0].id, 'new-year')
  assert.ok(events.every((event) => event.iso >= today))
  const ics = cal.calendarDownload(events, civil, 'ar', '2026-10-13T01:02:03Z')
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, events.length)
  assert.match(ics, /DTSTAMP:20261013T010203Z/)
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75)
  const unfolded = ics.replace(/\r\n /g, '')
  assert.match(unfolded, /بداية السنة الهجرية/)
  assert.match(unfolded, /islamic-civil/)
  assert.match(unfolded, /DTSTART;VALUE=DATE:\d{8}/)
  assert.doesNotMatch(unfolded, /BEGIN:VALARM/)
})

test('snapshots include crawlable month data and never assert a fixed Laylat al-Qadr or white-day fast', () => {
  const data = cal.calendarSnapshot('2025-03-01', umm)
  assert.equal(data.h.month, 9)
  assert.equal(data.tonight.day, 2)
  assert.equal(data.days.length, 29)
  assert.equal(data.upcoming[0].id, 'ramadan')
  assert.equal(
    cal.KEY_DATES.some((event) => /qadr|white day/i.test(event.en)),
    false
  )
})

test('Hijri inputs accept Arabic and Persian digits but reject exponent and partial values', () => {
  assert.deepEqual(cal.parseHijriInput({ year: '١٤٤٦', month: '٩', day: '٢٩' }), {
    year: 1446,
    month: 9,
    day: 29,
  })
  assert.deepEqual(cal.parseHijriInput({ year: '۱۴۴۶', month: '۹', day: '۲۹' }), {
    year: 1446,
    month: 9,
    day: 29,
  })
  for (const day of ['', '1e1', '2.5', '31'])
    assert.throws(() => cal.parseHijriInput({ year: '1446', month: '9', day }))
})
