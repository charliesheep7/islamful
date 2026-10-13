import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
const { outputFiles } = await build({
  entryPoints: ['data/gold-zakat.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
})
const { calculateGold, emptyGoldDraft, GoldInputError } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`
)
const draft = (patch = {}) => ({
  ...emptyGoldDraft('2026-10-13'),
  price: '100',
  hawl: 'yes',
  lots: [{ weight: '120', karat: 18, use: 'investment' }],
  ...patch,
})
const bad = (patch, field) =>
  assert.throws(
    () => calculateGold(draft(patch)),
    (e) => e instanceof GoldInputError && e.field === field
  )

test('worked example uses pure gold and 2.5% of all included value', () => {
  const r = calculateGold(draft())
  assert.equal(r.pureGrams, 90)
  assert.equal(r.goldValue, 9000)
  assert.equal(r.nisabValue, 8500)
  assert.equal(r.potential, 225)
  assert.equal(r.status, 'estimate')
})
test('mixed purities combine before rounding; exact nisab equality qualifies', () => {
  const lots = [
    { weight: '40', karat: 24, use: 'investment' },
    { weight: '60', karat: 18, use: 'investment' },
  ]
  const r = calculateGold(draft({ lots }))
  assert.equal(r.pureGrams, 85)
  assert.equal(r.potential, 212.5)
  assert.equal(calculateGold(draft({ lots, nisab: '87.48' })).above, false)
  const split = calculateGold(
    draft({
      price: '0.01',
      nisab: 'custom',
      customNisab: '0.01',
      lots: Array.from({ length: 20 }, () => ({ weight: '1', karat: 18, use: 'investment' })),
    })
  )
  assert.equal(split.goldValue, 0.15)
  assert.equal(split.potential, 0.01)
})
test('display rounding cannot move below-nisab gold over the boundary', () => {
  const r = calculateGold(
    draft({
      price: '123.456789',
      nisab: 'custom',
      customNisab: '2469.14',
      lots: [{ weight: '20', karat: 24, use: 'investment' }],
    })
  )
  assert.equal(r.goldValue, 2469.14)
  assert.equal(r.above, false)
  assert.equal(r.potential, 0)
})
test('personal jewellery exclusion never removes investment gold', () => {
  const lots = [
    { weight: '90', karat: 24, use: 'investment' },
    { weight: '50', karat: 18, use: 'jewellery' },
  ]
  const r = calculateGold(draft({ lots, jewellery: 'exclude' }))
  assert.equal(r.goldValue, 9000)
  assert.equal(r.excludedValue, 3750)
  assert.equal(r.potential, 225)
  assert.equal(r.lots[1].included, false)
  assert.equal(calculateGold(draft({ lots })).potential, 318.75)
})
test('zero holdings and unconfirmed year have honest, separate statuses', () => {
  assert.equal(
    calculateGold(draft({ lots: [{ weight: '0', karat: 24, use: 'investment' }] })).status,
    'below'
  )
  assert.equal(calculateGold(draft({ hawl: 'no' })).status, 'not-yet')
  assert.equal(calculateGold(draft({ hawl: 'unsure' })).status, 'check-hawl')
})
test('Arabic/Persian decimal numerals work without ambiguous separators', () => {
  assert.equal(
    calculateGold(
      draft({ price: '١٠٠٫٠٠', lots: [{ weight: '۱۲۰', karat: 18, use: 'investment' }] })
    ).potential,
    225
  )
  for (const weight of ['', '-1', '1e3', '100,000', '١٬٠٠٠', '1.0001', 'NaN'])
    bad({ lots: [{ weight, karat: 24, use: 'investment' }] }, 'weight-0')
  for (const price of ['', '0', '-1', '1e5', '1.1234567']) bad({ price }, 'price')
})
test('invalid dates, unsupported options and unrealistic totals fail before results', () => {
  for (const date of ['2026-02-29', '1900-02-29', '', '2101-01-01']) bad({ date }, 'date')
  assert.equal(calculateGold(draft({ date: '2024-02-29' })).potential, 225)
  bad({ currency: 'XXX' }, 'currency')
  bad({ hawl: 'maybe' }, 'hawl')
  bad({ jewellery: 'maybe' }, 'jewellery')
  bad({ nisab: '92' }, 'nisab')
  bad({ nisab: 'custom', customNisab: '0' }, 'customNisab')
  bad({ lots: [] }, 'lots')
  bad({ lots: Array(21).fill({ weight: '1', karat: 24, use: 'investment' }) }, 'lots')
  bad({ lots: [{ weight: '100', karat: 25, use: 'investment' }] }, 'karat-0')
  bad({ lots: [{ weight: '100', karat: 24, use: 'unknown' }] }, 'use-0')
  bad(
    { price: '999999999', lots: [{ weight: '999999999', karat: 24, use: 'investment' }] },
    'price'
  )
})
test('lot order and splitting preserve exact results without mutating the draft', () => {
  const lots = [
      { weight: '43.25', karat: 22, use: 'investment' },
      { weight: '17.75', karat: 18, use: 'investment' },
      { weight: '12.5', karat: 21, use: 'jewellery' },
    ],
    d = draft({ lots, nisab: 'custom', customNisab: '1', price: '97.123456' }),
    snapshot = JSON.stringify(d)
  const a = calculateGold(d),
    b = calculateGold({ ...d, lots: [...lots].reverse() }),
    c = calculateGold({
      ...d,
      lots: [
        ...lots.slice(0, 2),
        { weight: '6.25', karat: 21, use: 'jewellery' },
        { weight: '6.25', karat: 21, use: 'jewellery' },
      ],
    })
  for (const key of ['goldValue', 'pureGrams', 'above', 'potential']) {
    assert.equal(a[key], b[key])
    assert.equal(a[key], c[key])
  }
  assert.equal(JSON.stringify(d), snapshot)
})
