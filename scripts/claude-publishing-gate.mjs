import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { loadQueue, validateBundle, renderArticle, hash } from './article-publisher.mjs'

// Used by the existing Desktop lifecycle guard, in addition to its lock,
// deadline, daily quota and exact-article per-run receipt.
export async function checkCanonicalArticle(root, relative) {
  assert.match(relative, /^data\/blog\/en\/[a-z0-9-]+\.mdx$/)
  const doc = loadQueue(root)
  const item = doc.items.find((x) => x.source_file === relative && x.status === 'awaiting_release')
  assert.ok(
    item && ['new_article', 'update_article'].includes(item.action),
    'No pending reviewed article assignment'
  )
  assert.equal(item.publication?.audit_file, `data/seo/publications/${item.id}.json`)
  const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'))
  const audit = read(item.publication.audit_file)
  const context = read(`.publishing-runs/${item.id}/context.json`)
  const bundle = read(`.publishing-runs/${item.id}/bundle.json`)
  assert.equal(context.assignment.id, item.id)
  assert.equal(context.assignment.source_file, relative)
  assert.equal(context.assignment.target_path, item.target_path)
  assert.equal(context.assignment.action, item.action)
  assert.equal(context.assignment_sha256, hash(JSON.stringify(context.assignment)))
  assert.equal(context.baseline_sha256, context.existing === null ? null : hash(context.existing))
  validateBundle(bundle, context, root)
  const bytes = fs.readFileSync(path.join(root, relative))
  const meta = matter(bytes.toString()).data
  const { content, marker } = await renderArticle(
    context,
    bundle.article,
    String(meta.lastmod).slice(0, 10)
  )
  assert.equal(hash(content), hash(bytes), 'Rendered article differs from the reviewed bundle')
  assert.equal(audit.content_sha256, hash(bytes))
  assert.equal(item.publication.content_sha256, hash(bytes))
  assert.equal(audit.state, 'awaiting_release')
  assert.equal(audit.id, item.id)
  assert.equal(audit.source_file, relative)
  assert.equal(audit.assignment_sha256, context.assignment_sha256)
  assert.equal(audit.baseline_sha256, context.baseline_sha256)
  assert.deepEqual(audit.review, bundle.review)
  assert.deepEqual(audit.sources, bundle.sources)
  assert.equal(audit.marker, marker)
  assert.equal(item.publication.marker, marker)
  assert.ok(meta.draft === undefined || meta.draft === false, 'Draft article cannot publish')
  return { id: item.id, path: relative, status: 'reviewed_gate_pass' }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  checkCanonicalArticle(root, process.argv[2])
    .then((result) => console.log(JSON.stringify(result)))
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
