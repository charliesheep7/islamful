import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
const corpus = JSON.parse(readFileSync('data/quran/corpus.json', 'utf8'))
for (const lang of ['fr', 'de']) {
  test(`${lang}: imported Quran translation aligns all 6236 verses and retains source attribution`, () => {
    const data = JSON.parse(readFileSync(`data/quran/translations/${lang}.json`, 'utf8'))
    assert.equal(data.locale, lang)
    assert.equal(data.chapters.length, 114)
    assert.match(data.sourceSha256, /^[a-f0-9]{64}$/)
    assert.ok(data.notice.includes(data.key))
    assert.ok(data.notice.includes(`v${data.version}`))
    assert.ok(data.notice.includes("PLEASE DON'T REMOVE THIS IMPORTANT INFORMATION!"))
    assert.equal(data.source, 'https://quranenc.com')
    let count = 0
    for (let index = 0; index < 114; index++) {
      assert.equal(data.chapters[index].length, corpus.chapters[index].verses.length)
      for (let i = 0; i < data.chapters[index].length; i++) {
        const verse = data.chapters[index][i]
        assert.equal(verse.number, corpus.chapters[index].verses[i].number)
        assert.ok(verse.translation.trim())
        assert.equal(typeof verse.footnotes, 'string')
        assert.equal('arabic' in verse, false, 'Arabic stays in the unchanged source corpus')
        count++
      }
    }
    assert.equal(count, 6236)
    assert.ok(
      data.chapters.flat().some((v) => v.footnotes.length > 0),
      'Source footnotes retained'
    )
  })
}
