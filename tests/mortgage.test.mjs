import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
const source = await build({
  entryPoints: ['utils/mortgage.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
})
const { parseMortgageInputs: parse, diminishingSchedule: schedule } = await import(
  `data:text/javascript;base64,${Buffer.from(source.outputFiles[0].text).toString('base64')}`
)
test('zero rates remain zero; blank deposit means zero, blank required fields stay invalid', () => {
  const result = parse('500000', '', '20', '0', '0')
  assert.equal(result.valid, true)
  assert.equal(result.rate, 0)
  assert.equal(result.convRate, 0)
  assert.equal(result.principal, 500000)
  for (const i of [0, 2, 3]) {
    const inputs = ['500000', '100000', '20', '5', '6']
    inputs[i] = ''
    assert.equal(parse(...inputs).valid, false)
  }
  assert.equal(parse('500000', '', '20', '0', '').comparisonValid, false)
})
test('invalid and unbounded inputs cannot enter the calculation loop', () => {
  for (const [i, values] of [
    [0, ['-1', 'Infinity', '1e13']],
    [1, ['-1', '500000', 'Infinity']],
    [2, ['0', '-1', '1.5', '51', '1e300']],
    [3, ['-1', '101', 'Infinity']],
  ]) {
    for (const value of values) {
      const inputs = ['500000', '100000', '20', '5', '6']
      inputs[i] = value
      assert.equal(parse(...inputs).valid, false, inputs.join(','))
    }
  }
  assert.throws(() => schedule(400000, 1e100, 0.05), RangeError)
})
test('zero-rate repayment preserves principal and finishes exactly at term', () => {
  const r = schedule(400000, 240, 0)
  assert.equal(r.totalCost, 400000)
  assert.equal(r.totalRent, 0)
  assert.equal(r.schedule.length, 20)
  assert.equal(r.schedule.at(-1).month, 240)
  assert.equal(r.schedule.at(-1).bankShare, 0)
})
test('fixed payment pays off early, with one final row and consistent rent totals', () => {
  for (const rate of [0.000000001, 0.05, 1]) {
    const p = 400000,
      months = 240,
      r = schedule(p, months, rate)
    let balance = p,
      rent = 0,
      paid = 0,
      m = 0
    while (balance > 1e-7 && m < months) {
      m++
      const charge = (balance * rate) / 12
      const purchase = Math.min(r.fixedMonthly - charge, balance)
      balance -= purchase
      rent += charge
      paid += purchase
    }
    assert.ok(Math.abs(paid - p) < 1e-6)
    assert.ok(Math.abs(r.totalRent - rent) < 1e-6)
    assert.equal(r.schedule.at(-1).month, m)
    assert.equal(r.schedule.at(-1).bankShare, 0)
    assert.equal(new Set(r.schedule.map((x) => x.month)).size, r.schedule.length)
    assert.ok(r.schedule.slice(0, -1).every((x) => x.bankShare > 0))
    assert.ok(r.schedule.at(-1).equity + r.schedule.at(-1).rent <= r.fixedMonthly + 1e-6)
  }
})
