import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const ACTIONS = new Set([
  'update_article',
  'new_article',
  'new_tool',
  'improve_tool',
  'live',
  'reference',
  'research',
])
const STATUSES = new Set([
  'queued',
  'live_reviewed',
  'needs_data',
  'needs_keyword_refresh',
  'needs_sources',
  'needs_product_design',
  'needs_licensed_data',
  'needs_product_fit',
  'not_selected',
])
const IMPLEMENTABLE = new Set(['update_article', 'new_article', 'new_tool', 'improve_tool'])
const EXISTING = new Set(['update_article', 'improve_tool', 'live', 'reference'])
const NEW = new Set(['new_article', 'new_tool'])

export function validateQueue(doc, root, { verifyResearch = true } = {}) {
  const errors = [],
    ids = new Set(),
    rows = new Set(),
    newTargets = new Set()
  if (
    doc.schema_version !== 1 ||
    !['deenback', 'islamful'].includes(doc.site) ||
    !Array.isArray(doc.items)
  )
    return ['Invalid queue envelope']
  if (verifyResearch) {
    const file = path.join(root, 'data/seo', doc.research_source || '')
    if (
      !fs.existsSync(file) ||
      crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') !==
        doc.research_sha256
    )
      errors.push('Research CSV does not match the recorded checksum')
  }
  for (const item of doc.items) {
    const fail = (message) => errors.push(`${item.id || 'missing-id'}: ${message}`)
    if (!item.id || ids.has(item.id)) fail('Missing or duplicate assignment ID')
    ids.add(item.id)
    if (!ACTIONS.has(item.action) || !STATUSES.has(item.status)) fail('Unknown action/status')
    if (
      !['en', 'ar'].includes(item.locale) ||
      !Number.isInteger(item.priority) ||
      item.priority < 1
    )
      fail('Invalid locale/priority')
    if (item.status === 'queued' && !IMPLEMENTABLE.has(item.action))
      fail('Only implementable work can be queued')
    if (!item.primary_keyword || !item.brief || !item.next_step)
      fail('Keyword, brief and next step are required')
    if (!Array.isArray(item.observations) || !item.observations.length)
      fail('Search evidence is required')
    for (const o of item.observations || []) {
      if (!Number.isInteger(o.source_row) || o.source_row < 2 || rows.has(o.source_row))
        fail('Duplicate or invalid research source row')
      rows.add(o.source_row)
      if (![item.primary_keyword, ...(item.secondary_keywords || [])].includes(o.keyword))
        fail('Observation does not match assigned keywords')
      if (
        ![null, undefined].includes(o.monthly_volume) &&
        (!Number.isInteger(o.monthly_volume) || o.monthly_volume < 0)
      )
        fail('Invalid search volume')
      if (
        ![null, undefined].includes(o.kd_percent) &&
        (!Number.isInteger(o.kd_percent) || o.kd_percent < 0 || o.kd_percent > 100)
      )
        fail('Invalid keyword difficulty')
      if (o.status === 'complete' && (o.monthly_volume == null || o.kd_percent == null))
        fail('Complete evidence cannot have missing metrics')
    }
    if (IMPLEMENTABLE.has(item.action) || EXISTING.has(item.action)) {
      if (!item.target_path || !item.source_file) {
        fail('Target path and source file required')
        continue
      }
    }
    if (
      item.target_path &&
      (!item.target_path.startsWith('/') ||
        item.target_path.includes('..') ||
        item.target_path.includes('?') ||
        item.target_path.startsWith('//'))
    )
      fail('Unsafe/noncanonical target path')
    if (item.target_path && (item.locale === 'ar') !== item.target_path.startsWith('/ar/'))
      fail('Target locale mismatch')
    if (item.source_file) {
      const resolved = path.resolve(root, item.source_file)
      if (
        !resolved.startsWith(path.resolve(root) + path.sep) ||
        !/^(data\/blog\/|app\/)/.test(item.source_file)
      ) {
        fail('Source file outside site content')
        continue
      }
      const exists = fs.existsSync(resolved)
      if (EXISTING.has(item.action) && !exists) fail('Existing target file is missing')
      if (NEW.has(item.action) && exists)
        fail('New destination already exists: reconcile as an update before writing')
      if (['new_article', 'update_article'].includes(item.action)) {
        const prefix = item.locale === 'ar' ? '/ar/blog/' : '/blog/'
        if (!item.target_path.startsWith(prefix) || item.target_path.includes('#'))
          fail('Article must have its own canonical blog path')
        const expected = `data/blog/${item.locale}/${item.target_path.slice(prefix.length)}.mdx`
        if (item.source_file !== expected) fail('Article path/file mismatch')
      }
    }
    if (NEW.has(item.action)) {
      if (newTargets.has(item.target_path)) fail('Duplicate new destination')
      newTargets.add(item.target_path)
    }
  }
  return errors
}

export function selectAssignments(doc, { locale, action, status = 'queued', next = false } = {}) {
  if (locale && !['en', 'ar'].includes(locale)) throw new Error('locale must be en or ar')
  if (action && !ACTIONS.has(action)) throw new Error('Unknown action filter')
  if (status !== 'all' && !STATUSES.has(status)) throw new Error('Unknown status filter')
  const selected = doc.items
    .filter(
      (x) =>
        (!locale || x.locale === locale) &&
        (!action || x.action === action) &&
        (status === 'all' || x.status === status)
    )
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
  return next ? selected.slice(0, 1) : selected
}

export function describePlan(doc, selected) {
  return {
    mode: 'planning_only',
    site: doc.site,
    goal: doc.goal,
    note: 'This command selects work; it never generates, overwrites or publishes content. Queued is not source-approved. There is no fallback to legacy keyword lists.',
    remaining_assignments: selected.length,
    assignments: selected.map((x) => ({
      ...x,
      warnings: [
        ...(x.observations.some((o) => o.status !== 'complete')
          ? ['Some market observations are partial; keep missing values unknown.']
          : []),
        ...(x.action === 'update_article'
          ? [
              'Revise the exact existing file; preserve URL, title, publication date, authors and images.',
            ]
          : []),
        ...(x.existing_overlap_candidates.length
          ? [
              'Inspect related existing pages before writing; this list is a lexical overlap screen, not proof of cannibalization. No automatic redirects.',
            ]
          : []),
        ...(x.action.includes('tool')
          ? [
              'This assignment requires working utility and behavioral verification, not a generated blog substitute.',
            ]
          : []),
      ],
    })),
  }
}

export function main(
  argv = process.argv.slice(2),
  root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
) {
  const { values } = parseArgs({
    args: argv,
    options: {
      locale: { type: 'string' },
      action: { type: 'string' },
      status: { type: 'string', default: 'queued' },
      next: { type: 'boolean', default: false },
      validate: { type: 'boolean', default: false },
      format: { type: 'string', default: 'json' },
    },
    strict: true,
    allowPositionals: false,
  })
  if (!['json', 'markdown'].includes(values.format))
    throw new Error('format must be json or markdown')
  const doc = JSON.parse(fs.readFileSync(path.join(root, 'data/seo/publishing-queue.json'), 'utf8'))
  const errors = validateQueue(doc, root)
  if (errors.length) throw new Error(errors.join('\n'))
  if (values.validate) {
    console.log(
      JSON.stringify(
        {
          valid: true,
          site: doc.site,
          assignments: doc.items.length,
          observations: doc.items.reduce((n, x) => n + x.observations.length, 0),
        },
        null,
        2
      )
    )
    return
  }
  const plan = describePlan(doc, selectAssignments(doc, values))
  if (values.format === 'json') console.log(JSON.stringify(plan, null, 2))
  else {
    console.log(`# ${doc.site} publishing queue\n\n${plan.note}\n`)
    if (!plan.assignments.length)
      console.log('No assignments match these filters. No legacy fallback was selected.')
    for (const x of plan.assignments) {
      console.log(
        `## ${x.id} · ${x.primary_keyword}\n\nPriority ${x.priority} · ${x.locale} · ${x.action} · ${x.status}\n\nTarget: ${x.target_path || 'Research before choosing a route'}\n\n${x.brief}\n`
      )
      for (const w of x.warnings) console.log(`- ${w}`)
      console.log('')
    }
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (e) {
    console.error(e.message)
    process.exitCode = 1
  }
}
