// A static export renders the root layout's <html lang dir> once, as English,
// because the layout can't see the request path. On Vercel the middleware set
// them from the URL's locale prefix; this writes the same into every exported
// page under /<locale>.
// usage: node scripts/cloudflare-locale-html.mjs ar:rtl fr de
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? htmlFiles(join(dir, e.name))
      : e.name.endsWith('.html')
        ? [join(dir, e.name)]
        : []
  )

let count = 0
for (const arg of process.argv.slice(2)) {
  const [lang, dir = 'ltr'] = arg.split(':')
  const files = [`out/${lang}.html`].filter(existsSync)
  if (existsSync(`out/${lang}`)) files.push(...htmlFiles(`out/${lang}`))
  for (const file of files) {
    const html = readFileSync(file, 'utf8')
    const next = html.replace(/<html lang="en" dir="ltr"/, `<html lang="${lang}" dir="${dir}"`)
    if (next !== html) {
      writeFileSync(file, next)
      count++
    }
  }
}
console.log(`cloudflare-locale-html: set lang/dir on ${count} page(s)`)
