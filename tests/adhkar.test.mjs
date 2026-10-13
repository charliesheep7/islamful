import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
async function load(path) {
  const o = await build({
    entryPoints: [path],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  })
  return import(
    `data:text/javascript;base64,${Buffer.from(o.outputFiles[0].text).toString('base64')}`
  )
}
const p = await load('utils/adhkar-progress.ts'),
  d = await load('data/adhkar.ts')
test('the two separately sourced tasbih alternatives each total 100 without combining them', () => {
  assert.deepEqual(
    d.tasbihEntries('34').map((e) => e.target),
    [33, 33, 34]
  )
  assert.deepEqual(
    d.tasbihEntries('33-tahlil').map((e) => e.target),
    [33, 33, 33, 1]
  )
  assert.ok(d.tasbihEntries('34').every((e) => e.href.endsWith('596a')))
  assert.ok(d.tasbihEntries('33-tahlil').every((e) => e.href.endsWith('597a')))
})
test('daily routines preserve sourced occasions, repetition counts and selected collection boundaries', () => {
  const morning = d.routineEntries('morning'),
    evening = d.routineEntries('evening'),
    after = d.routineEntries('after-prayer')
  for (const list of [morning, evening, after, d.routineEntries('after-prayer', '34')]) {
    assert.equal(new Set(list.map((e) => e.id)).size, list.length)
    for (const e of list) {
      assert.ok(e.target > 0 && Number.isInteger(e.target))
      assert.match(e.href, /^https:\/\/sunnah.com\//)
      assert.ok(e.surah || e.arabic)
      assert.ok(e.surah || e.meaning)
      if (!e.countedInSource) assert.equal(e.target, 1)
    }
  }
  assert.equal(morning.find((e) => e.id === 'creation').target, 3)
  assert.equal(
    evening.some((e) => e.id === 'creation'),
    false
  )
  assert.equal(evening.find((e) => e.id === 'perfect-words').target, 3)
  assert.equal(
    morning.some((e) => e.id === 'perfect-words'),
    false
  )
  for (const list of [morning, evening]) {
    assert.deepEqual(
      list.filter((e) => e.surah).map((e) => e.target),
      [3, 3, 3]
    )
    assert.equal(list.find((e) => e.id === 'subhan-bihamdih').target, 100)
  }
  assert.deepEqual(
    after.filter((e) => e.surah).map((e) => e.target),
    [1, 1, 1]
  )
  assert.equal(after.find((e) => e.id === 'istighfar').target, 3)
  assert.match(morning.find((e) => e.id === 'by-you').arabic, /النُّشُورُ/)
  assert.match(evening.find((e) => e.id === 'by-you').arabic, /الْمَصِيرُ/)
  assert.ok(!morning.find((e) => e.id === 'sovereignty').arabic.includes('بَعْدَهَا'))
})
test('stored counts reject corrupt, future/old-day, unknown, non-integer and out-of-range values', () => {
  const targets = [
      { id: 'a', target: 3 },
      { id: 'b', target: 100 },
    ],
    day = '2026-10-13'
  for (const raw of [
    '{bad',
    'null',
    '[]',
    JSON.stringify({ version: 2, day, counts: { a: 2 } }),
    JSON.stringify({ version: 1, day: '2026-10-12', counts: { a: 2 } }),
  ])
    assert.deepEqual(p.parseProgress(raw, targets, day).counts, { a: 0, b: 0 })
  for (const value of [-1, 4, 2.5, '2', null])
    assert.equal(
      p.parseProgress(
        JSON.stringify({ version: 1, day, counts: { a: value, b: 23, other: 10 } }),
        targets,
        day
      ).counts.a,
      0
    )
  assert.deepEqual(
    p.parseProgress(
      JSON.stringify({ version: 1, day, counts: { a: 2, b: 23, other: 10 }, secret: 'discard' }),
      targets,
      day
    ),
    { version: 1, day, counts: { a: 2, b: 23 } }
  )
})
test('rapid counts clamp, undo remains available at completion, and a new local day starts at zero', () => {
  const targets = [{ id: 'a', target: 3 }],
    day = '2026-10-13'
  let s = p.emptyProgress(targets, day)
  for (let i = 0; i < 30; i++) s = p.changeCount(s, targets, 'a', 'increment', day)
  assert.equal(s.counts.a, 3)
  assert.equal(p.summary(s, targets).complete, true)
  s = p.changeCount(s, targets, 'a', 'undo', day)
  assert.equal(s.counts.a, 2)
  assert.equal(p.summary(s, targets).complete, false)
  s = p.changeCount(s, targets, 'a', 'increment', '2026-10-14')
  assert.equal(s.counts.a, 1)
  s = p.changeCount(s, targets, 'a', 'complete', '2026-10-14')
  assert.equal(s.counts.a, 3)
  assert.deepEqual(p.changeCount(s, targets, 'unknown', 'increment', '2026-10-14').counts, { a: 3 })
})
test('date keys use device-local calendar components rather than UTC serialization', () => {
  assert.equal(
    p.localDay({
      getFullYear: () => 2026,
      getMonth: () => 9,
      getDate: () => 3,
      toISOString: () => {
        throw new Error('must not use UTC')
      },
    }),
    '2026-10-03'
  )
})
