import test from 'node:test'
import assert from 'node:assert/strict'
import { crc32 } from 'node:zlib'
import { build } from 'esbuild'
const r = await build({
  entryPoints: ['utils/png-notice.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
})
const { pngWithNotice } = await import(
  'data:text/javascript;base64,' + Buffer.from(r.outputFiles[0].text).toString('base64')
)
const png =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6rZsAAAAASUVORK5CYII='
test('embeds complete UTF-8 notice with valid chunk CRC without changing original pixels', async () => {
  const notice = 'Copyright © Tanzil\nالقرآن · français · Deutsch'
  const result = Buffer.from(
    await pngWithNotice('data:image/png;base64,' + png, notice).arrayBuffer()
  )
  const original = Buffer.from(png, 'base64')
  const length = result.readUInt32BE(33)
  assert.equal(result.subarray(37, 41).toString(), 'iTXt')
  const content = result.subarray(41, 41 + length)
  assert.equal(content.toString(), 'Source notices\0\0\0\0\0' + notice)
  assert.equal(result.readUInt32BE(41 + length), crc32(result.subarray(37, 41 + length)))
  assert.deepEqual(Buffer.concat([result.subarray(0, 33), result.subarray(45 + length)]), original)
})
test('rejects non-PNG and truncated headers', () => {
  assert.throws(() => pngWithNotice('data:image/jpeg;base64,AA==', 'x'))
  assert.throws(() => pngWithNotice('data:image/png;base64,AA==', 'x'))
})
