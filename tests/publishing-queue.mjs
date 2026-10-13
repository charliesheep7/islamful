import assert from 'node:assert/strict'
import { test } from 'node:test'
import fs from 'node:fs'
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
