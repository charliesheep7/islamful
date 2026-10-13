import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
const o = await build({
  entryPoints: ['utils/today.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
})
const t = await import(
  `data:text/javascript;base64,${Buffer.from(o.outputFiles[0].text).toString('base64')}`
)
test('homepage accepts only known cities and calculation methods, discarding other stored data', () => {
  for (const raw of [
    '{broken',
    'null',
    '{}',
    JSON.stringify({ version: 1, city: 'london', method: '__proto__' }),
    JSON.stringify({ version: 2, city: 'london', method: '2' }),
    JSON.stringify({ version: 1, city: 'fake', method: '2' }),
    JSON.stringify({ version: 1, city: 'london', method: 2 }),
  ])
    assert.equal(t.todayChoice(raw), null)
  assert.deepEqual(
    t.todayChoice(JSON.stringify({ version: 1, city: 'london', method: '2', ignored: 'secret' })),
    { version: 1, city: 'london', method: '2' }
  )
})
test('date uses the selected time zone across midnight, including separate after-Maghrib date', () => {
  const settings = { method: 'islamic-umalqura', adjustment: 0, timeZone: 'Asia/Riyadh' }
  const a = t.todayDate('2026-10-13T22:30:00Z', settings, 'en')
  const b = t.todayDate(
    '2026-10-13T22:30:00Z',
    { ...settings, timeZone: 'America/Los_Angeles' },
    'en'
  )
  assert.equal(a.iso, '2026-10-14')
  assert.equal(b.iso, '2026-10-13')
  assert.equal(b.tonight, a.hijri)
})
test('saved calendar settings retain method and adjustment without silently accepting invalid values', () => {
  assert.deepEqual(
    t.todayCalendar(
      JSON.stringify({ method: 'islamic-civil', adjustment: -2, timeZone: 'Europe/London' }),
      'Asia/Riyadh'
    ),
    { method: 'islamic-civil', adjustment: -2, timeZone: 'Europe/London' }
  )
  for (const v of [
    { method: 'fake', adjustment: 0, timeZone: 'UTC' },
    { method: 'islamic-civil', adjustment: 3, timeZone: 'UTC' },
    { method: 'islamic-civil', adjustment: 0, timeZone: 'nonsense' },
  ])
    assert.deepEqual(t.todayCalendar(JSON.stringify(v), 'Asia/Riyadh'), {
      method: 'islamic-umalqura',
      adjustment: 0,
      timeZone: 'Asia/Riyadh',
    })
  assert.equal(t.todayCalendar(null, 'bad').timeZone, 'UTC')
})
