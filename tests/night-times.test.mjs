import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
const { outputFiles } = await build({
  entryPoints: ['utils/night-times.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
})
const { manualNight, nightTimes, zonedTime, nightCalendar } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`
)
const iso = (value) => new Date(value).toISOString()

test('ordinary overnight interval uses next morning and thirds of elapsed time', () => {
  const result = manualNight('2026-10-13', '18:00', '06:00', 'Etc/UTC')
  assert.equal(iso(result.midpoint), '2026-10-14T00:00:00.000Z')
  assert.equal(iso(result.lastThird), '2026-10-14T02:00:00.000Z')
  assert.equal(iso(result.fajr), '2026-10-14T06:00:00.000Z')
})
test('autumn clock change adds an elapsed hour, spring subtracts one', () => {
  const autumn = manualNight('2026-10-24', '18:00', '06:00', 'Europe/London')
  assert.equal(autumn.fajr - autumn.maghrib, 13 * 3600000)
  assert.equal(iso(autumn.midpoint), '2026-10-24T23:30:00.000Z')
  assert.equal(iso(autumn.lastThird), '2026-10-25T01:40:00.000Z')
  const spring = manualNight('2026-03-28', '18:00', '06:00', 'Europe/London')
  assert.equal(spring.fajr - spring.maghrib, 11 * 3600000)
})
test('half-hour timezone and year rollover work', () => {
  const result = manualNight('2026-12-31', '18:00', '06:00', 'Asia/Kolkata')
  assert.equal(iso(result.lastThird), '2026-12-31T20:30:00.000Z')
  assert.equal(iso(result.fajr), '2027-01-01T00:30:00.000Z')
})
test('invalid, missing and ambiguous local times are rejected', () => {
  assert.throws(() => zonedTime('2026-02-30', '18:00', 'Europe/London'))
  assert.throws(() => zonedTime('2026-03-29', '01:30', 'Europe/London'))
  assert.throws(() => zonedTime('2026-10-25', '01:30', 'Europe/London'))
  assert.throws(() => zonedTime('2026-10-13', '25:00', 'Etc/UTC'))
  assert.throws(() => zonedTime('2026-10-13', '18:00', 'Not/AZone'))
  assert.throws(() => nightTimes(NaN, Date.now()))
  assert.throws(() => nightTimes(1000, 1000))
  assert.throws(() => nightTimes(0, 25 * 3600000))
})
test('calendar export has absolute UTC boundaries and no recurrence/alarm', () => {
  const result = manualNight('2026-10-24', '18:00', '06:00', 'Europe/London')
  const calendar = nightCalendar(result.lastThird, result.fajr, Date.parse('2026-10-24T12:00:00Z'))
  assert.ok(calendar.includes('DTSTART:20261025T014000Z\r\n'))
  assert.ok(calendar.includes('DTEND:20261025T060000Z\r\n'))
  assert.ok(calendar.includes('DTSTAMP:20261024T120000Z'))
  assert.ok(!calendar.includes('RRULE') && !calendar.includes('VALARM'))
})
