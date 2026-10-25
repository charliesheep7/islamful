// Bounded CLI for Claude-authored JSON. No model/API, dynamic imports or implicit approvals.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hash, loadQueue, prepare, validateBundle } from './article-publisher.mjs'
export function buildBundle(spec, root) {
  if (!/^is-\d+$/.test(spec.id)) throw new Error('Invalid assignment ID')
  const doc = loadQueue(root)
  const context = prepare(
    doc,
    doc.items.find((x) => x.id === spec.id),
    root
  )
  const dir = path.join(root, '.publishing-runs', spec.id)
  const saved = JSON.parse(fs.readFileSync(path.join(dir, 'context.json'), 'utf8'))
  if (
    saved.assignment_sha256 !== context.assignment_sha256 ||
    saved.baseline_sha256 !== context.baseline_sha256
  )
    throw new Error('Stale prepared context')
  const article = structuredClone(spec.article)
  if (article.hero) {
    if (!/^\/static\/images\/[a-z0-9/_-]+\.(webp|png|jpg|jpeg)$/.test(article.hero.src))
      throw new Error('Invalid hero path')
    article.hero.sha256 = hash(fs.readFileSync(path.join(root, 'public', article.hero.src)))
  }
  const sources = spec.sources.map((s) => {
    if (!/^src\/[a-zA-Z0-9_.-]+\.json$/.test(s.capture))
      throw new Error('Invalid source capture path')
    const capture = JSON.parse(fs.readFileSync(path.join(dir, s.capture), 'utf8'))
    if (!capture.text || capture.text.length < 300) throw new Error('Missing captured source text')
    return {
      url: capture.url,
      title: s.title,
      supports: s.supports,
      checked_at: capture.checked_at,
      content_sha256: capture.content_sha256,
    }
  })
  // Explicit human/model review decisions are retained, never manufactured here.
  const bundle = {
    id: spec.id,
    assignment_sha256: context.assignment_sha256,
    baseline_sha256: context.baseline_sha256,
    article,
    sources,
    review: { ...spec.review, article_sha256: hash(JSON.stringify(article)) },
  }
  validateBundle(bundle, context, root)
  const file = path.join(dir, 'bundle.json')
  if (fs.existsSync(file))
    throw new Error('Bundle already exists; inspect/reuse it rather than overwriting')
  fs.writeFileSync(file, JSON.stringify(bundle, null, 2) + '\n', { flag: 'wx' })
  return { id: spec.id, bundle: path.relative(root, file), status: 'validated_bundle' }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const input = fs.readFileSync(0, 'utf8')
    if (Buffer.byteLength(input) > 200000) throw new Error('Spec too large')
    console.log(
      JSON.stringify(
        buildBundle(
          JSON.parse(input),
          path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
        )
      )
    )
  } catch (e) {
    console.error(e.message)
    process.exitCode = 1
  }
}
