/** Preserve full source notices in an uncompressed UTF-8 PNG iTXt chunk. */
export function pngWithNotice(dataUrl: string, notice: string): Blob {
  if (!dataUrl.startsWith('data:image/png;base64,')) throw new Error('Expected PNG')
  const png = Uint8Array.from(atob(dataUrl.slice(22)), (c) => c.charCodeAt(0))
  if (
    png.length < 33 ||
    ![137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => png[i] === n) ||
    new DataView(png.buffer).getUint32(8) !== 13 ||
    new TextDecoder().decode(png.slice(12, 16)) !== 'IHDR'
  ) {
    throw new Error('Invalid PNG header')
  }
  // Keyword, compression flag/method, language tag, translated keyword, UTF-8 text.
  const payload = new TextEncoder().encode('Source notices\0\0\0\0\0' + notice)
  const chunk = new Uint8Array(payload.length + 12)
  const view = new DataView(chunk.buffer)
  view.setUint32(0, payload.length)
  chunk.set(new TextEncoder().encode('iTXt'), 4)
  chunk.set(payload, 8)
  let crc = 0xffffffff
  for (const byte of chunk.slice(4, -4)) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  view.setUint32(chunk.length - 4, (crc ^ 0xffffffff) >>> 0)
  return new Blob([png.slice(0, 33), chunk, png.slice(33)], { type: 'image/png' })
}
