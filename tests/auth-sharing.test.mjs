import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const dir = await mkdtemp(join(tmpdir(), 'islamful-auth-'))
try {
  await build({
    entryPoints: ['utils/auth.ts', 'utils/sharing.ts'],
    outdir: dir,
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    bundle: true,
    platform: 'node',
  })
  const { safeReturnPath } = await import(pathToFileURL(join(dir, 'auth.mjs')))
  const { canonicalShareUrl, shareLinks } = await import(pathToFileURL(join(dir, 'sharing.mjs')))
  for (const path of [
    'https://evil.test',
    '//evil.test',
    '/\\evil.test',
    '/\nevil.test',
    '/auth/callback',
    '/ar/login',
    undefined,
  ])
    assert.equal(safeReturnPath(path), '/')
  assert.equal(safeReturnPath('/ar/quran/1?verse=2#read'), '/ar/quran/1?verse=2#read')
  assert.equal(safeReturnPath('//evil.test', '/ar'), '/ar')
  assert.equal(
    canonicalShareUrl('https://www.islamful.com', '/ar/zakat-calculator?amount=10000#result'),
    'https://www.islamful.com/ar/zakat-calculator'
  )
  assert.equal(
    canonicalShareUrl('https://www.islamful.com', '/en/blog/example'),
    'https://www.islamful.com/blog/example'
  )
  const link = new URL(shareLinks('https://www.islamful.com/ar/dua', 'دعاء & صلاة').WhatsApp)
  assert.equal(link.searchParams.get('text'), 'دعاء & صلاة\nhttps://www.islamful.com/ar/dua?shared=WhatsApp')
  console.log('Auth redirects and canonical sharing checks passed')
} finally {
  await rm(dir, { recursive: true, force: true })
}
