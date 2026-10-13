import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { transform } from 'esbuild'
const { code } = await transform(readFileSync('data/qibla.ts', 'utf8'), {
  loader: 'ts',
  format: 'esm',
})
const { calculateQiblaBearing, distanceToKaaba, validCoordinates, KAABA_LAT, KAABA_LNG } =
  await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
test('bearing agrees with independently retrieved Aladhan values in three hemispheres', () => {
  for (const [lat, lng, expected] of [
    [51.5074, -0.1278, 118.9872425],
    [40.7128, -74.006, 58.481712],
    [-33.8688, 151.2093, 277.4995894],
  ])
    assert.ok(Math.abs(calculateQiblaBearing(lat, lng) - expected) < 0.02)
})
test('invalid and geometrically undefined bearings do not masquerade as north', () => {
  for (const [lat, lng] of [
    [NaN, 1],
    [1, Infinity],
    [91, 0],
    [0, 181],
    [90, 0],
    [-90, 0],
    [KAABA_LAT, KAABA_LNG],
    [-KAABA_LAT, KAABA_LNG - 180],
  ])
    assert.equal(calculateQiblaBearing(lat, lng), null)
  assert.equal(validCoordinates(0, 0), true)
  assert.equal(validCoordinates(0, 180), true)
  assert.equal(validCoordinates(91, 0), false)
})
test('distance remains finite at antipode despite floating point rounding', () => {
  assert.equal(distanceToKaaba(KAABA_LAT, KAABA_LNG), 0)
  assert.ok(Math.abs(distanceToKaaba(-KAABA_LAT, KAABA_LNG - 180) - Math.PI * 6371) < 0.01)
})
