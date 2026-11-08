// Writes out/_headers and out/_redirects for Cloudflare from next.config's
// headers() and redirects(), which `output: 'export'` does not apply.
import { createRequire } from 'module'
import { readdirSync, writeFileSync } from 'fs'
import { join, relative } from 'path'

const require = createRequire(import.meta.url)
let config = require('../next.config.js')
if (typeof config === 'function')
  config = await config('phase-production-build', { defaultConfig: {} })

// Next path patterns -> Cloudflare: `/(.*)` and `:name*` become splats
function toCloudflare(pattern) {
  return pattern.replace(/\/\(\.\*\)$/, '/*').replace(/\/:(\w+)\*$/, '/*')
}

function splatTarget(source, destination) {
  const m = source.match(/\/:(\w+)\*$/)
  return m ? destination.replace(`:${m[1]}*`, ':splat').replace(`:${m[1]}`, ':splat') : destination
}

const headerRules = config.headers ? await config.headers() : []
const headerLines = headerRules.flatMap(({ source, headers }) => [
  toCloudflare(source),
  ...headers.map(({ key, value }) => `  ${key}: ${value}`),
  '',
])
headerLines.push('/_next/static/*', '  Cache-Control: public, max-age=31536000, immutable', '')

// Generated metadata images are exported without an extension, so name their type
const metadataImages = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? metadataImages(join(dir, e.name))
      : /^(opengraph-image|twitter-image)$/.test(e.name)
        ? ['/' + relative('out', join(dir, e.name))]
        : []
  )
for (const path of metadataImages('out')) headerLines.push(path, '  Content-Type: image/png', '')
writeFileSync('out/_headers', headerLines.join('\n'))

const redirectRules = config.redirects ? await config.redirects() : []
const redirectLines = redirectRules.map(({ source, destination, permanent, statusCode }) => {
  const code = statusCode ?? (permanent ? 308 : 307)
  return `${toCloudflare(source)} ${splatTarget(source, destination)} ${code}`
})
writeFileSync('out/_redirects', redirectLines.join('\n') + '\n')

console.log(
  `cloudflare-routes: ${headerRules.length} header rule(s), ${redirectRules.length} redirect(s)`
)
