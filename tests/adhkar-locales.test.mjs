import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
function load(file) {
  const e = {}
  new Function(
    'exports',
    ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: 1 } }).outputText
  )(e)
  return e
}
const { routineEntries, routines } = load('data/adhkar.ts')
const { adhkarEntries, adhkarRoutines, localizedDhikr } = load('data/locales/adhkar.ts')
for (const lang of ['fr', 'de']) {
  test(`${lang}: all routine and entry translations cover both tasbih variants without changing Arabic or source data`, () => {
    const used = new Set()
    for (const routine of routines) {
      assert.ok(adhkarRoutines[lang][routine.id].title)
      assert.ok(adhkarRoutines[lang][routine.id].description)
      for (const variant of ['33-tahlil', '34']) {
        for (const entry of routineEntries(routine.id, variant)) {
          const key = ['by-you', 'sovereignty'].includes(entry.id)
            ? `${entry.id}-${routine.id}`
            : entry.id
          used.add(key)
          assert.ok(adhkarEntries[lang][key]?.title, `${routine.id}/${key}`)
          const localized = localizedDhikr(entry, routine.id, lang)
          if (entry.meaning) {
            assert.ok(localized.meaning)
            assert.notEqual(localized.meaning, entry.meaning)
          }
          for (const field of [
            'id',
            'arabic',
            'surah',
            'target',
            'countedInSource',
            'href',
            'source',
            'sourceAr',
            'grade',
            'gradeAr',
            'titleAr',
          ])
            assert.equal(localized[field], entry[field], `${key}/${field}`)
        }
      }
    }
    assert.deepEqual([...used].sort(), Object.keys(adhkarEntries[lang]).sort())
    for (const id of ['by-you', 'sovereignty'])
      assert.notEqual(
        adhkarEntries[lang][`${id}-morning`].meaning,
        adhkarEntries[lang][`${id}-evening`].meaning
      )
  })
}
