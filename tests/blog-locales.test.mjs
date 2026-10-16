import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { build } from 'esbuild'
const root = 'data/blog', sources = fs.readdirSync(path.join(root, 'en')).filter(f=>f.endsWith('.mdx'))
const references = text => [...text.matchAll(/https?:\/\/[^\s<>)\]"']+/g)].map(m=>m[0]).sort()
for (const lang of ['ar','fr','de']) {
 assert.deepEqual(fs.readdirSync(path.join(root, lang)).filter(f=>f.endsWith('.mdx')).sort(), [...sources].sort())
 for (const file of sources) {
  const original = matter(fs.readFileSync(path.join(root, 'en', file), 'utf8'))
  const translated = matter(fs.readFileSync(path.join(root, lang, file), 'utf8'))
  assert.ok(translated.data.title && translated.data.summary, `${lang}/${file} metadata`)
  assert.equal(translated.data.faqs?.length, original.data.faqs?.length, `${lang}/${file} FAQs`)
  assert.equal(translated.data.tags?.length, original.data.tags?.length, `${lang}/${file} tags`)
  for(const key of ['date','lastmod','authors','images','draft','layout']) assert.deepEqual(translated.data[key],original.data[key], `${lang}/${file} ${key}`)
  assert.deepEqual(references(translated.content),references(original.content), `${lang}/${file} reference URLs`)
  assert.equal((translated.content.match(/^#{1,6} /gm)||[]).length,(original.content.match(/^#{1,6} /gm)||[]).length, `${lang}/${file} sections`)
  assert.ok(!translated.content.includes('ZXQKEEP'),`${lang}/${file} unresolved placeholder`)
  for(const quote of original.content.match(/[\u0600-\u06ff][\u0600-\u06ff\s،؛؟]*[\u0600-\u06ff]/g)||[]) assert.ok(translated.content.includes(quote),`${lang}/${file} Arabic quotation`)
 }
}
const output=await build({entryPoints:['utils/blog-date.ts'],bundle:true,write:false,format:'esm',platform:'node'})
const {formatBlogDate}=await import('data:text/javascript;base64,'+Buffer.from(output.outputFiles[0].text).toString('base64'))
assert.equal(formatBlogDate('2026-10-16T00:00:00Z','ar'),'١٦ أكتوبر ٢٠٢٦')
assert.equal(formatBlogDate('2026-10-16T00:00:00Z','de'),'16. Oktober 2026')
assert.equal(formatBlogDate('2026-10-15T23:00:00-02:00','fr'),'16 octobre 2026')
assert.equal(formatBlogDate('invalid','en'),'')
console.log(`${sources.length*3} translated articles: coverage, metadata, references, Arabic quotations, section counts and stable dates passed`)
