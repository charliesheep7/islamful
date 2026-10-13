import assert from 'node:assert/strict'
import test from 'node:test'
import { execFileSync } from 'node:child_process'
import { build } from 'esbuild'
const output = await build({
  entryPoints: ['data/quran.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
})
const q = await import(
  `data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`
)
test('all source text and verse/metadata relationships are preserved', () => {
  assert.match(execFileSync('python3', ['scripts/verify-quran.py'], { encoding: 'utf8' }), /6,236/)
})
test('all 114 route keys are unique with complete counts and exact boundary references', () => {
  assert.equal(q.chapters.length, 114)
  assert.equal(new Set(q.chapters.map((c) => c.slug)).size, 114)
  assert.equal(
    q.chapters.reduce((sum, c) => sum + c.count, 0),
    6236
  )
  assert.deepEqual(
    q.chapters.filter((c) => [1, 2, 9, 18, 67, 114].includes(c.number)).map((c) => c.count),
    [7, 286, 129, 110, 30, 6]
  )
  for (const c of q.chapters) {
    assert.equal(q.reference(`${c.number}:${c.count}`).ayah, c.count)
    assert.equal(q.reference(`${c.number}:${c.count + 1}`), null)
    assert.match(q.quranPath(c, 'ar', c.count), /^\/ar\/quran\/[a-z-]+#ayah-\d+$/)
  }
})
test('verse references accept native digits but reject partial, negative, zero and out-of-range input', () => {
  assert.equal(q.reference('٢:٢٥٥').chapter.number, 2)
  assert.equal(q.reference('۲:۲۵۵').ayah, 255)
  for (const bad of ['0', '115', '1:8', '2:0', '2:-1', '2:255oops', '2.5', '2e2', '-2', ''])
    assert.equal(q.reference(bad), null)
  assert.equal(q.verseNumber('٣٠', 30), 30)
  assert.equal(q.verseNumber('31', 30), null)
})
test('normalization is confined to search keys and tolerates Arabic diacritics and name punctuation', () => {
  assert.equal(q.searchKey('ٱلْكَهْف'), q.searchKey('الكهف'))
  assert.equal(q.searchKey('Al-Mulk'), q.searchKey('al mulk'))
  assert.equal(q.searchKey('آية ٢٥٥'), q.searchKey('اية255'))
  assert.equal(q.searchKey('تَبَـٰرَكَ'), q.searchKey('تبارك'))
  assert.equal(q.searchKey('ٱلرَّحْمَـٰنِ'), q.searchKey('الرحمن'))
  assert.equal(q.searchKey('هَـٰذَا'), q.searchKey('هذا'))
  assert.equal(q.searchKey('ذَٰلِكَ'), q.searchKey('ذلك'))
})
test('audio sequence repeats exactly N times and never crosses its selected end', () => {
  let step = { verse: 3, pass: 1 },
    seen = []
  while (step) {
    seen.push([step.verse, step.pass])
    step = q.nextAudioStep(step.verse, step.pass, 4, 3, true)
  }
  assert.deepEqual(seen, [
    [3, 1],
    [3, 2],
    [3, 3],
    [4, 1],
    [4, 2],
    [4, 3],
  ])
  assert.equal(q.nextAudioStep(7, 1, 7, 1, false), null)
  assert.deepEqual(q.nextAudioStep(7, 1, 7, 2, false), { verse: 7, pass: 2 })
})
test('audio sources use validated global ayah numbers and an allowlisted reciter', () => {
  assert.equal(
    q.audioSource(1, 'ar.alafasy'),
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
  )
  for (const n of [0, 6237, -1, 1.5, NaN]) assert.throws(() => q.audioSource(n, 'ar.alafasy'))
  assert.throws(() => q.audioSource(1, 'https://other.example'))
})
test('stored reading data is validated, bounded and excludes unrelated input', () => {
  assert.equal(q.readerData('{bad', 'ar').showTranslation, false)
  assert.equal(q.readerData(null, 'en').place, null)
  const data = q.readerData(
    JSON.stringify({
      version: 1,
      place: { surah: 2, ayah: 255, extra: 'drop' },
      bookmarks: [
        { surah: 2, ayah: 255 },
        { surah: 2, ayah: 255 },
        { surah: 115, ayah: 1 },
      ],
      fontSize: 999,
      showTranslation: false,
      email: 'drop',
    }),
    'en'
  )
  assert.deepEqual(data, {
    version: 1,
    place: { surah: 2, ayah: 255 },
    bookmarks: [{ surah: 2, ayah: 255 }],
    fontSize: 36,
    showTranslation: false,
  })
  assert.equal(
    q.readerData(JSON.stringify({ version: 9, place: { surah: 1, ayah: 1 } }), 'en').place,
    null
  )
  assert.equal(
    q.readerData(
      JSON.stringify({
        version: 1,
        bookmarks: Array.from({ length: 200 }, (_, i) => ({ surah: 2, ayah: i + 1 })),
      }),
      'en'
    ).bookmarks.length,
    100
  )
})
