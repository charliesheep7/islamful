import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
import { createRequire } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const result = await build({
  entryPoints: ['components/tools/PrayerTimesWidget.tsx'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  jsx: 'automatic',
})
const module = { exports: {} }
new Function('require', 'module', 'exports', result.outputFiles[0].text)(
  createRequire(import.meta.url),
  module,
  module.exports
)
const Widget = module.exports.default
const props = {
  cityName: 'London',
  cityCountry: 'UK',
  cityMethod: '3',
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: 'Europe/London',
}
const prayers = [
  ['Fajr', 'الفجر', '05:18'],
  ['Sunrise', 'الشروق', '06:49'],
  ['Dhuhr', 'الظهر', '12:51'],
  ['Asr', 'العصر', '15:49'],
  ['Maghrib', 'المغرب', '18:53'],
  ['Isha', 'العشاء', '20:24'],
].map(([name, nameAr, time]) => ({ name, nameAr, time }))

test('all six prayer times are present before browser effects run', () => {
  const html = renderToStaticMarkup(
    React.createElement(Widget, {
      ...props,
      prayerData: {
        date: '13 Oct 2026',
        hijriDate: '',
        location: 'London',
        prayers,
        tomorrow: [],
        dateISO: '2026-10-13',
        timezone: 'Europe/London',
        method: '3',
      },
    })
  )
  for (const prayer of prayers) assert.ok(html.includes(prayer.name), prayer.name)
  for (const time of ['05:18', '06:49', '12:51', '15:49', '18:53', '20:24'])
    assert.ok(html.includes(time), time)
  assert.ok(!html.includes('Next Prayer'), 'countdown waits for browser clock')
})

test('upstream failure has a visible localized fallback', () => {
  const en = renderToStaticMarkup(React.createElement(Widget, { ...props, prayerData: null }))
  const ar = renderToStaticMarkup(
    React.createElement(Widget, { ...props, prayerData: null, lang: 'ar' })
  )
  assert.ok(en.includes('Could not update prayer times'))
  assert.ok(ar.includes('تعذر تحديث المواقيت'))
})
