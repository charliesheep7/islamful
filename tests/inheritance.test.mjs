import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
const r = await build({
  entryPoints: ['data/inheritance-rules.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
})
const { calculateInheritance: calculate } = await import(
  'data:text/javascript;base64,' + Buffer.from(r.outputFiles[0].text).toString('base64')
)
const base = {
  spouse: false,
  father: false,
  mother: false,
  sons: 0,
  daughters: 0,
  fullBrothers: 0,
  fullSisters: 0,
}
const calc = (heirs, gender = 'male', estate = 120000, debt = 0, bequest = 0) =>
  calculate(gender, estate, debt, bequest, { ...base, ...heirs })
const amounts = (r) => Object.fromEntries(r.shares.map((s) => [s.heir, s.amount]))
test('father with daughters receives fixed share and residue', () => {
  assert.deepEqual(amounts(calc({ father: true, daughters: 1 })), {
    Father: 60000,
    Daughter: 60000,
  })
  assert.deepEqual(amounts(calc({ father: true, daughters: 2 })), {
    Father: 40000,
    Daughters: 80000,
  })
  assert.deepEqual(amounts(calc({ father: true, mother: true, spouse: true, daughters: 1 })), {
    Wife: 15000,
    Father: 25000,
    Mother: 20000,
    Daughter: 60000,
  })
})
test('both spouse-and-parents cases give mother one third of post-spouse remainder', () => {
  assert.deepEqual(amounts(calc({ father: true, mother: true, spouse: true }, 'female')), {
    Husband: 60000,
    Mother: 20000,
    Father: 40000,
  })
  assert.deepEqual(amounts(calc({ father: true, mother: true, spouse: true })), {
    Wife: 30000,
    Mother: 30000,
    Father: 60000,
  })
  // Two siblings reduce the mother even when the father excludes them.
  assert.equal(
    amounts(calc({ father: true, mother: true, spouse: true, fullBrothers: 2 })).Mother,
    20000
  )
})
test('full siblings take residue with daughters but are excluded by a son or father', () => {
  assert.deepEqual(amounts(calc({ daughters: 1, fullSisters: 1 })), {
    Daughter: 60000,
    'Full Sister': 60000,
  })
  assert.deepEqual(amounts(calc({ daughters: 1, fullBrothers: 1, fullSisters: 1 })), {
    Daughter: 60000,
    'Full Brother': 40000,
    'Full Sister': 20000,
  })
  assert.ok(!Object.keys(amounts(calc({ sons: 1, fullSisters: 1 }))).includes('Full Sister'))
  assert.ok(
    !Object.keys(amounts(calc({ father: true, daughters: 1, fullSisters: 1 }))).includes(
      'Full Sister'
    )
  )
})
test('bequest cap uses net estate and reports reductions', () => {
  const r = calc({ sons: 1 }, 'male', 120000, 60000, 60000)
  assert.equal(r.bequests, 20000)
  assert.equal(r.distributableEstate, 40000)
  assert.equal(r.bequestLimited, true)
  assert.equal(calc({ sons: 1 }, 'male', 100, 200, 30).distributableEstate, 0)
})
test('awl, non-spouse radd and sole spouse remainder are distinct', () => {
  const awl = calc({ spouse: true, father: true, mother: true, daughters: 2 }, 'female')
  assert.equal(awl.hasAwl, true)
  assert.deepEqual(amounts(awl), { Husband: 24000, Father: 16000, Mother: 16000, Daughters: 64000 })
  const radd = calc({ spouse: true, daughters: 1 })
  assert.equal(radd.hasRadd, true)
  assert.deepEqual(amounts(radd), { Wife: 15000, Daughter: 105000 })
  const wife = calc({ spouse: true })
  assert.equal(wife.hasRadd, false)
  assert.equal(wife.unallocatedEstate, 90000)
  assert.deepEqual(amounts(wife), { Wife: 30000 })
})
test('all supported small-family combinations conserve cents and stay finite/non-negative', () => {
  for (const gender of ['male', 'female'])
    for (let flags = 0; flags < 8; flags++)
      for (let sons = 0; sons <= 2; sons++)
        for (let daughters = 0; daughters <= 2; daughters++)
          for (let fullBrothers = 0; fullBrothers <= 2; fullBrothers++)
            for (let fullSisters = 0; fullSisters <= 2; fullSisters++) {
              for (const estate of [0.01, 100.01, 120000]) {
                const r = calc(
                  {
                    spouse: !!(flags & 1),
                    father: !!(flags & 2),
                    mother: !!(flags & 4),
                    sons,
                    daughters,
                    fullBrothers,
                    fullSisters,
                  },
                  gender,
                  estate
                )
                const cents =
                  r.shares.reduce((n, s) => n + Math.round(s.amount * 100), 0) +
                  Math.round(r.unallocatedEstate * 100)
                assert.equal(
                  cents,
                  Math.round(estate * 100),
                  JSON.stringify({ gender, flags, sons, daughters, fullBrothers, fullSisters, r })
                )
                assert.ok(
                  r.shares.every(
                    (s) =>
                      Number.isFinite(s.amount) &&
                      s.amount >= 0 &&
                      s.sharePercent >= 0 &&
                      s.sharePercent <= 100
                  )
                )
              }
            }
})
test('invalid or unbounded numerical input is rejected', () => {
  for (const bad of [NaN, Infinity, -1, 1e20])
    assert.throws(() => calc({}, 'male', bad), RangeError)
  for (const sons of [-1, 1.5, 101, Infinity]) assert.throws(() => calc({ sons }), RangeError)
})
