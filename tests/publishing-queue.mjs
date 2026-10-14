import assert from 'node:assert/strict'
import { test } from 'node:test'
import fs from 'node:fs'
import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { validateQueue, selectAssignments, describePlan } from '../scripts/publishing-queue.mjs'
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'publishing-queue-'))
const item = () => ({
  id: 'de-1',
  priority: 1,
  locale: 'en',
  primary_keyword: 'quit example',
  secondary_keywords: [],
  brief: 'Evidence-based guide',
  next_step: 'Review sources and publish',
  target_path: '/blog/quit-example',
  source_file: 'data/blog/en/quit-example.mdx',
  action: 'new_article',
  status: 'queued',
  observations: [
    {
      source_row: 2,
      keyword: 'quit example',
      monthly_volume: 100,
      kd_percent: 20,
      status: 'complete',
    },
  ],
  existing_overlap_candidates: [],
})
const doc = (items) => ({ schema_version: 1, site: 'deenback', items })
const check = (d) => validateQueue(d, root, { verifyResearch: false })
test('existing content cannot be selected as a new article and updates require an existing file', () => {
  const x = item()
  assert.deepEqual(check(doc([x])), [])
  fs.mkdirSync(path.dirname(path.join(root, x.source_file)), { recursive: true })
  fs.writeFileSync(path.join(root, x.source_file), 'Existing user content')
  assert.match(check(doc([x])).join(' '), /already exists/)
  x.action = 'update_article'
  assert.deepEqual(check(doc([x])), [])
  fs.unlinkSync(path.join(root, x.source_file))
  assert.match(check(doc([x])).join(' '), /missing/)
})
test('default planning skips live, research and unselected work; no fallback when empty', () => {
  const a = item(),
    b = { ...item(), id: 'de-2', priority: 2, status: 'live_reviewed', action: 'live' },
    c = { ...item(), id: 'de-3', status: 'needs_sources', action: 'research' }
  assert.deepEqual(
    selectAssignments(doc([b, c, a])).map((x) => x.id),
    ['de-1']
  )
  assert.deepEqual(selectAssignments(doc([b, c])), [])
  assert.equal(describePlan(doc([a]), [a]).mode, 'planning_only')
})
test('locale/action filters keep tools out of new-article selection', () => {
  const a = item(),
    b = { ...item(), id: 'de-2', locale: 'ar', action: 'new_tool', priority: 2 }
  assert.deepEqual(
    selectAssignments(doc([b, a]), { action: 'new_article', next: true }).map((x) => x.id),
    ['de-1']
  )
  assert.deepEqual(
    selectAssignments(doc([a, b]), { locale: 'ar' }).map((x) => x.id),
    ['de-2']
  )
  assert.throws(() => selectAssignments(doc([a]), { status: 'done' }))
})
test('missing KD is preserved as uncertainty, while explicit zero stays zero', () => {
  const a = item()
  a.observations[0] = {
    ...a.observations[0],
    monthly_volume: 0,
    kd_percent: null,
    status: 'partial_refresh_required',
  }
  assert.deepEqual(check(doc([a])), [])
  const result = describePlan(doc([a]), [a])
  assert.equal(result.assignments[0].observations[0].monthly_volume, 0)
  assert.match(result.assignments[0].warnings.join(' '), /partial/)
  a.observations[0].status = 'complete'
  assert.match(check(doc([a])).join(' '), /missing metrics/)
})
test('invalid source paths, duplicate evidence and duplicate new targets are rejected', () => {
  const a = item()
  a.source_file = '../outside.mdx'
  assert.match(check(doc([a])).join(' '), /outside/)
  const b = item(),
    c = { ...item(), id: 'de-2' }
  assert.match(check(doc([b, c])).join(' '), /Duplicate.*research/)
  assert.match(check(doc([b, c])).join(' '), /Duplicate new destination/)
  c.observations = [{ ...c.observations[0], source_row: 3 }]
  c.source_file = 'data/blog/ar/quit-example.mdx'
  assert.match(check(doc([c])).join(' '), /mismatch/)
})
process.on('exit', () => fs.rmSync(root, { recursive: true, force: true }))

function capturedFixture() {
  const record = {
    evidence_id: 'capture-hash:1',
    source_row: 1,
    keyword: 'quit example',
    country: 'UK',
    monthly_volume: 100,
    kd_percent: null,
    metric_status: 'partial',
    observed_at: '2026-10-13T10:30:00Z',
  }
  const file = 'capture.json'
  fs.mkdirSync(path.join(root, 'data/seo'), { recursive: true })
  const bytes = JSON.stringify({ schema_version: 1, records: [record] })
  fs.writeFileSync(path.join(root, 'data/seo', file), bytes)
  const x = item()
  x.observations = [
    {
      research_source: file,
      evidence_id: record.evidence_id,
      source_row: 1,
      keyword: record.keyword,
      database: record.country,
      monthly_volume: 100,
      kd_percent: null,
      status: 'partial',
      observed_date: record.observed_at,
    },
  ]
  const d = {
    ...doc([x]),
    schema_version: 2,
    research_sources: [
      {
        file,
        format: 'semrush-evidence-v1',
        sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      },
    ],
  }
  return { d, x, file }
}
test('captured evidence supports row one, preserves missing KD and rejects fabricated metrics or markets', () => {
  const { d, x } = capturedFixture()
  assert.deepEqual(check(d), [])
  x.observations[0].monthly_volume = 9999
  assert.match(check(d).join(' '), /differs from captured/)
  x.observations[0].monthly_volume = 100
  x.observations[0].database = 'US'
  assert.match(check(d).join(' '), /differs from captured/)
})
test('capture checksum, source identity and path are enforced', () => {
  const { d, file } = capturedFixture()
  fs.appendFileSync(path.join(root, 'data/seo', file), ' ')
  assert.match(check(d).join(' '), /checksum/)
  d.research_sources[0].file = '../capture.json'
  assert.match(check(d).join(' '), /Invalid.*research source/)
  assert.match(check(d).join(' '), /Missing.*research evidence/)
})
test('one captured observation cannot silently feed two page assignments', () => {
  const { d, x } = capturedFixture()
  d.items.push({
    ...x,
    id: 'de-2',
    target_path: '/blog/another-topic',
    source_file: 'data/blog/en/another-topic.mdx',
  })
  assert.match(check(d).join(' '), /duplicate captured research/)
})

test('reviewed tools remain pending, skip article selection and reject changed files', () => {
  const x = {
    ...item(),
    source_file: 'app/gold/page.tsx',
    target_path: '/gold',
    action: 'new_tool',
    status: 'awaiting_tool_release',
  }
  fs.mkdirSync(path.join(root, 'app/gold'), { recursive: true })
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true })
  fs.writeFileSync(path.join(root, x.source_file), 'reviewed tool')
  fs.writeFileSync(path.join(root, 'docs/gold-sources.md'), 'checked sources')
  assert.match(check(doc([x])).join(' '), /Invalid pending tool/)
  x.tool_publication = {
    version: 'gold-v1',
    source_review: 'docs/gold-sources.md',
    files: [
      {
        path: x.source_file,
        sha256: crypto.createHash('sha256').update('reviewed tool').digest('hex'),
      },
    ],
  }
  assert.deepEqual(check(doc([x])), [])
  fs.mkdirSync(path.join(root, 'utils'), { recursive: true })
  fs.writeFileSync(path.join(root, 'utils/dates.ts'), 'reviewed calculation')
  x.tool_publication.files.push({
    path: 'utils/dates.ts',
    sha256: crypto.createHash('sha256').update('reviewed calculation').digest('hex'),
  })
  assert.deepEqual(check(doc([x])), [])
  fs.writeFileSync(path.join(root, 'utils/dates.ts'), 'changed calculation')
  assert.match(check(doc([x])).join(' '), /changed after review/)
  fs.writeFileSync(path.join(root, 'utils/dates.ts'), 'reviewed calculation')
  assert.deepEqual(selectAssignments(doc([x])), [])
  assert.deepEqual(selectAssignments(doc([x]), { action: 'new_article', status: 'all' }), [])
  fs.writeFileSync(path.join(root, x.source_file), 'unreviewed change')
  assert.match(check(doc([x])).join(' '), /changed after review/)
  x.tool_publication.files[0].path = '../outside'
  assert.match(check(doc([x])).join(' '), /Invalid pending tool/)
})
