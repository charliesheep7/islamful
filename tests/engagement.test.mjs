import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
const dir = await mkdtemp(join(tmpdir(), 'islamful-engagement-'))
try {
  await build({
    entryPoints: ['utils/engagement.ts', 'data/engagement-copy.ts'],
    outdir: dir,
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    bundle: true,
    platform: 'node',
  })
  const { publicPath, publicContentId, engagementLocale } = await import(
    pathToFileURL(join(dir, 'utils/engagement.mjs'))
  )
  assert.equal(publicContentId('/dua', 'dua-77'), 'dua-77')
  assert.equal(publicContentId('/ar/dua', 'dua-1'), 'dua-1')
  for (const invalid of ['dua-0', 'dua-78', 'dua-01', 'name-1', 'private@email.test'])
    assert.equal(publicContentId('/dua', invalid), null)
  assert.equal(publicContentId('/names-of-allah', 'name-99'), 'name-99')
  assert.equal(publicContentId('/de/names-of-allah', 'name-1'), 'name-1')
  for (const value of [
    'name-0',
    'name-100',
    'name-01',
    'dua-1',
    'email@example.com',
    'name-1?secret=yes',
    null,
  ])
    assert.equal(publicContentId('/names-of-allah', value), null)
  assert.equal(publicContentId('/zakat-calculator', 'name-1'), null)
  const { engagementCopy } = await import(pathToFileURL(join(dir, 'data/engagement-copy.mjs')))
  for (const value of [
    'https://evil.test',
    '//evil.test',
    '/auth/callback',
    '/ar/login',
    '/path\\name',
    '/path\nname',
    null,
    '/' + 'x'.repeat(501),
  ])
    assert.equal(publicPath(value), null)
  assert.equal(publicPath('/ar/zakat-calculator?wealth=1000#result'), '/ar/zakat-calculator')
  for (const locale of ['en', 'ar', 'fr', 'de']) {
    assert.equal(engagementLocale(`/${locale}/dua`), locale)
    assert.deepEqual(
      Object.keys(engagementCopy[locale]).sort(),
      Object.keys(engagementCopy.en).sort()
    )
    assert.ok(Object.values(engagementCopy[locale]).every((value) => value.trim().length))
  }
  console.log('Engagement privacy boundaries and four-language copy checks passed')
} finally {
  await rm(dir, { recursive: true, force: true })
}
