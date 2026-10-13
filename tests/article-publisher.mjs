import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'
import {
  hash,
  prepare,
  validateBundle,
  renderArticle,
  applyBundle,
  loadQueue,
  readSource,
  verifyRelease,
} from '../scripts/article-publisher.mjs'
function fixture(action = 'new_article') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'article-publisher-'))
  for (const folder of ['data/seo', 'data/blog/en', 'app/prayer-times'])
    fs.mkdirSync(path.join(root, folder), { recursive: true })
  fs.writeFileSync(path.join(root, 'app/prayer-times/page.tsx'), 'test')
  fs.writeFileSync(path.join(root, 'data/seo/evidence.csv'), 'evidence')
  const item = {
    id: 'is-999',
    priority: 1,
    locale: 'en',
    primary_keyword: 'example',
    brief: 'Specific reviewed task',
    brief_addenda: [{ questions: ['A real specific question'] }],
    next_step: 'Publish after review',
    target_path: '/blog/example',
    source_file: 'data/blog/en/example.mdx',
    action,
    status: 'queued',
    observations: [
      { source_row: 2, keyword: 'example', status: 'complete', monthly_volume: 100, kd_percent: 2 },
    ],
    existing_overlap_candidates: [],
  }
  const doc = {
    schema_version: 1,
    site: 'islamful',
    research_source: 'evidence.csv',
    research_sha256: hash('evidence'),
    items: [item],
  }
  fs.writeFileSync(path.join(root, 'data/seo/publishing-queue.json'), JSON.stringify(doc))
  if (action === 'update_article')
    fs.writeFileSync(
      path.join(root, item.source_file),
      "---\ntitle: Original title\ndate: '2024-01-02'\nauthors: ['original-author']\nimages: ['/original.webp']\ncustom: preserve this too\n---\nOriginal body\n"
    )
  const context = prepare(doc, item, root)
  const sources = ['https://quran.com/5/6', 'https://sunnah.com/bukhari:159'].map((url) => ({
    url,
    title: 'Primary source',
    supports: 'This source supports a carefully scoped claim in the example.',
    checked_at: new Date().toISOString(),
    content_sha256: hash('source'),
  }))
  const article = {
    title: 'Example article with specific title',
    summary:
      'A specific educational overview of the reader question and its relevant distinctions.',
    tags: ['prayer'],
    faqs: [],
    body:
      '## A specific answer\n\n' +
      'This is synthetic test content, never published as a research result. '.repeat(12) +
      '\n\n[Evidence](https://quran.com/5/6) and [method](https://sunnah.com/bukhari:159).\n\n[Prayer times](/prayer-times).',
  }
  const review = {
    passed: true,
    method: 'agent_source_review',
    notes: 'Synthetic fixture only; used to test safety gates, never published.',
    issues: [],
    article_sha256: hash(JSON.stringify(article)),
    claim_checks: sources.map((s) => ({
      claim: 'A specific source-supported claim',
      source_url: s.url,
      supported: true,
      explanation: 'The referenced primary source directly supports this scoped claim.',
    })),
  }
  return {
    root,
    doc,
    context,
    item,
    bundle: {
      id: item.id,
      assignment_sha256: context.assignment_sha256,
      baseline_sha256: context.baseline_sha256,
      article,
      review,
      sources,
    },
  }
}
test('failed review, fabricated link, stale sources and executable MDX cannot pass', () => {
  for (const mutate of [
    (b) => {
      b.review.passed = false
    },
    (b) => {
      b.review.article_sha256 = hash('different')
    },
    (b) => {
      b.sources[0].checked_at = '2020-01-01'
    },
    (b) => {
      b.article.body += '\n<script>bad</script>'
    },
    (b) => {
      b.article.body += '\n[Missing](/not-real)'
    },
    (b) => {
      b.article.body += '\n[Fake](https://example.com/fake)'
    },
  ]) {
    const f = fixture()
    mutate(f.bundle)
    if (f.bundle.article.body !== undefined && f.bundle.review.article_sha256 !== hash('different'))
      f.bundle.review.article_sha256 = hash(JSON.stringify(f.bundle.article))
    assert.throws(() => validateBundle(f.bundle, f.context, f.root))
  }
})
test('updates preserve identity metadata and new article gets no invented individual byline', async () => {
  const f = fixture('update_article'),
    { content } = await renderArticle(f.context, f.bundle.article)
  const before = matter(f.context.existing).data,
    after = matter(content).data
  for (const key of ['title', 'date', 'authors', 'images', 'custom'])
    assert.deepEqual(after[key], before[key])
  const n = fixture(),
    rendered = await renderArticle(n.context, n.bundle.article)
  assert.deepEqual(matter(rendered.content).data.authors, ['editorial'])
})
test('late destination creation or edits cannot be overwritten', async () => {
  for (const action of ['new_article', 'update_article']) {
    const f = fixture(action),
      file = path.join(f.root, f.item.source_file)
    fs.writeFileSync(file, 'Concurrent editor content')
    await assert.rejects(applyBundle(f.bundle, f.root))
    assert.equal(fs.readFileSync(file, 'utf8'), 'Concurrent editor content')
  }
})
test('applied new article is pending, cannot run twice, and post-review mutations are detected', async () => {
  const f = fixture()
  await applyBundle(f.bundle, f.root)
  assert.equal(loadQueue(f.root).items[0].status, 'awaiting_release')
  await assert.rejects(applyBundle(f.bundle, f.root))
  fs.appendFileSync(path.join(f.root, f.item.source_file), '\nChanged')
  assert.throws(() => loadQueue(f.root), /changed after review/)
})
test('tools and live work never enter the prose generator; assignments retain addenda', () => {
  const f = fixture()
  assert.deepEqual(f.context.assignment.brief_addenda, f.item.brief_addenda)
  for (const item of [
    { ...f.item, action: 'new_tool' },
    { ...f.item, status: 'live_reviewed' },
  ])
    assert.throws(() => prepare(f.doc, item, f.root))
})
test('source redirects outside approved domains and unavailable sources fail closed', async () => {
  await assert.rejects(
    readSource(
      'https://quran.com/5/6',
      async () =>
        new Response('', { status: 302, headers: { location: 'http://127.0.0.1/private' } })
    ),
    /approved/
  )
  await assert.rejects(
    readSource('https://quran.com/5/6', async () => new Response('', { status: 403 })),
    /403/
  )
})
test('completion requires successful exact-commit production deployment AND exact live marker', async () => {
  const f = fixture()
  await applyBundle(f.bundle, f.root)
  const git = (args) => execFileSync('git', args, { cwd: f.root, encoding: 'utf8' }).trim()
  git(['init', '-q'])
  git(['add', '.'])
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'fixture'])
  const sha = git(['rev-parse', 'HEAD']),
    marker = loadQueue(f.root).items[0].publication.marker
  const githubRead = async (route) =>
    route.endsWith('/statuses')
      ? [{ state: 'success' }]
      : [{ id: 1, sha, environment: 'Production' }]
  await assert.rejects(
    verifyRelease(f.root, sha, {
      githubRead: async () => [],
      fetcher: async () => new Response(''),
    }),
    /No successful/
  )
  await assert.rejects(
    verifyRelease(f.root, sha, { githubRead, fetcher: async () => new Response('old article') }),
    /not yet live/
  )
  assert.equal(loadQueue(f.root).items[0].status, 'awaiting_release')
  assert.deepEqual(
    await verifyRelease(f.root, sha, {
      githubRead,
      fetcher: async () => new Response(`<span data-publication-id="${marker}"></span>`),
    }),
    ['is-999']
  )
  assert.equal(loadQueue(f.root).items[0].status, 'live_reviewed')
})

test('concurrent queue edits during live verification cannot be overwritten', async () => {
  const f = fixture()
  await applyBundle(f.bundle, f.root)
  const git = (args) => execFileSync('git', args, { cwd: f.root, encoding: 'utf8' }).trim()
  git(['init', '-q'])
  git(['add', '.'])
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'fixture'])
  const sha = git(['rev-parse', 'HEAD']),
    marker = loadQueue(f.root).items[0].publication.marker
  await assert.rejects(
    verifyRelease(f.root, sha, {
      githubRead: async (route) =>
        route.endsWith('/statuses')
          ? [{ state: 'success' }]
          : [{ id: 1, sha, environment: 'Production' }],
      fetcher: async () => {
        const q = loadQueue(f.root)
        q.items[0].brief = 'A concurrent editorial correction'
        fs.writeFileSync(path.join(f.root, 'data/seo/publishing-queue.json'), JSON.stringify(q))
        return new Response(`<span data-publication-id="${marker}"></span>`)
      },
    }),
    /Queue changed/
  )
  assert.equal(loadQueue(f.root).items[0].brief, 'A concurrent editorial correction')
  assert.equal(loadQueue(f.root).items[0].status, 'awaiting_release')
})
