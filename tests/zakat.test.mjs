import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { transform } from 'esbuild'
const { code } = await transform(readFileSync('data/zakat.ts', 'utf8'), {
  loader: 'ts',
  format: 'esm',
})
const { calculateZakat, emptyZakatDraft, ZakatInputError } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
)
const draft = (fields = {}) => ({
  ...emptyZakatDraft('2026-10-13'),
  nisabAmount: '5000',
  cash: '10000',
  hawl: 'yes',
  ...fields,
})
const invalid = (fields, field) =>
  assert.throws(
    () => calculateZakat(draft(fields)),
    (e) => e instanceof ZakatInputError && e.field === field
  )

test('annual calculation applies to all eligible net wealth, not only wealth above nisab', () => {
  assert.deepEqual(calculateZakat(draft()), {
    assets: 10000,
    net: 10000,
    liabilities: 0,
    gold: 0,
    silver: 0,
    nisab: 5000,
    above: true,
    potential: 250,
    status: 'estimate',
  })
  const result = calculateZakat(
    draft({
      savings: '2000',
      investments: '1000',
      business: '3000',
      receivables: '500',
      other: '200',
      liabilities: '700',
    })
  )
  assert.equal(result.assets, 16700)
  assert.equal(result.net, 16000)
  assert.equal(result.potential, 400)
})
test('nisab boundary is inclusive and fractional pennies round up without floating-point error', () => {
  assert.equal(calculateZakat(draft({ cash: '4999.99' })).potential, 0)
  assert.equal(calculateZakat(draft({ cash: '5000' })).potential, 125)
  assert.equal(calculateZakat(draft({ cash: '5000.01' })).potential, 125.01)
  assert.equal(calculateZakat(draft({ cash: '0.40', nisabAmount: '0.01' })).potential, 0.01)
  assert.equal(calculateZakat(draft({ cash: '0.41', nisabAmount: '0.01' })).potential, 0.02)
})
test('debt over assets cannot create negative wealth or negative Zakat', () => {
  const result = calculateZakat(draft({ liabilities: '12000' }))
  assert.equal(result.net, 0)
  assert.equal(result.potential, 0)
  assert.equal(result.status, 'below')
})
test('unconfirmed and incomplete hawl are distinct planning states', () => {
  assert.equal(calculateZakat(draft({ hawl: 'no' })).status, 'not-yet')
  assert.equal(calculateZakat(draft({ hawl: 'unsure' })).status, 'check-hawl')
  assert.equal(calculateZakat(draft({ hawl: 'no' })).potential, 250)
})
test('purity and metal weight use exact decimal arithmetic', () => {
  const result = calculateZakat(
    draft({
      cash: '0',
      metalMode: 'weight',
      goldWeight: '100',
      karat: 18,
      goldPrice: '100',
      silverWeight: '1000',
      silverPurity: 925,
      silverPrice: '1',
      nisabMode: 'gold',
    })
  )
  assert.equal(result.gold, 7500)
  assert.equal(result.silver, 925)
  assert.equal(result.nisab, 8748)
  assert.equal(result.above, false)
  const value = calculateZakat(
    draft({
      cash: '0',
      metalMode: 'weight',
      goldWeight: '0.001',
      karat: 24,
      goldPrice: '123.456789',
      nisabAmount: '0.01',
    })
  )
  assert.equal(value.gold, 0.12)
  assert.equal(value.potential, 0.01)
})
test('both source conventions, both metals and price units produce expected nisab', () => {
  assert.equal(
    calculateZakat(draft({ nisabMode: 'gold', goldPrice: '100', convention: '85/595' })).nisab,
    8500
  )
  assert.equal(calculateZakat(draft({ nisabMode: 'silver', silverPrice: '1' })).nisab, 612.36)
  assert.equal(
    calculateZakat(draft({ nisabMode: 'silver', silverPrice: '1', convention: '85/595' })).nisab,
    595
  )
  assert.equal(calculateZakat(draft({ nisabMode: 'silver', silverPrice: '1.234567' })).nisab, 756)
})
test('inactive modes never double-count metal weights and valuations', () => {
  const common = {
    goldValue: '500',
    silverValue: '200',
    goldWeight: '100',
    goldPrice: '100',
    silverWeight: '1000',
    silverPrice: '1',
  }
  assert.equal(calculateZakat(draft(common)).assets, 10700)
  assert.equal(calculateZakat(draft({ ...common, metalMode: 'weight' })).assets, 21000)
})
test('Western, Arabic and Persian numerals accepted; ambiguous or invalid numeric data rejected', () => {
  assert.equal(
    calculateZakat(draft({ cash: '١٠٠٠٠٫٥٠', liabilities: '۰٫۵۰', nisabAmount: '٥٠٠٠' })).potential,
    250
  )
  for (const cash of [
    '-1',
    '1e4',
    '10,000',
    '١٬٠٠٠',
    'NaN',
    'Infinity',
    '12abc',
    '0.001',
    '1000000000001',
    '1.',
  ])
    invalid({ cash }, 'cash')
  invalid({ nisabAmount: '0' }, 'nisabAmount')
  invalid({ nisabMode: 'gold', goldPrice: '' }, 'goldPrice')
  invalid({ metalMode: 'weight', goldWeight: '1', goldPrice: '0' }, 'goldPrice')
  invalid({ metalMode: 'weight', goldWeight: '-1' }, 'goldWeight')
  invalid({ metalMode: 'weight', goldWeight: '1.0001' }, 'goldWeight')
  invalid({ cash: '', savings: '' }, 'cash')
})
test('valid dates and supported options required, even if the browser form is bypassed', () => {
  for (const date of ['2026-02-29', '', '2026-13-01', '1899-12-31', '2101-01-01'])
    invalid({ date }, 'date')
  assert.equal(calculateZakat(draft({ date: '2024-02-29' })).potential, 250)
  invalid({ currency: 'XXX' }, 'currency')
  invalid({ karat: 30 }, 'karat')
  invalid({ silverPurity: 1200 }, 'silverPurity')
  invalid({ hawl: 'maybe' }, 'hawl')
  invalid({ nisabMode: 'banana' }, 'nisabMode')
})
test('empty reset does not retain wealth; unrealistic metal totals cannot overflow the display', () => {
  const reset = emptyZakatDraft('2026-10-13', 'GBP')
  assert.equal(reset.currency, 'GBP')
  assert.equal(reset.cash, '')
  assert.equal(reset.goldPrice, '')
  assert.throws(() => calculateZakat(reset), ZakatInputError)
  invalid({ metalMode: 'weight', goldWeight: '1000000000000', goldPrice: '1000000000000' }, 'cash')
})
