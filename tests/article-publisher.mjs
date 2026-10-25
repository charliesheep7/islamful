import { checkCanonicalArticle } from '../scripts/claude-publishing-gate.mjs'
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
function addHero(f) {
  const bytes = fs.readFileSync(
    new URL('../public/static/images/gold-zakat-hero.webp', import.meta.url)
  )
  const src = '/static/images/test-hero.webp'
  fs.mkdirSync(path.join(f.root, 'public/static/images'), { recursive: true })
  fs.writeFileSync(path.join(f.root, 'public', src), bytes)
  f.bundle.article.hero = { src, alt: 'A gold object on a warm stone surface', sha256: hash(bytes) }
  f.bundle.review.article_sha256 = hash(JSON.stringify(f.bundle.article))
  return bytes
}
test('reviewed hero appears in article and metadata; unsafe, stale and update heroes fail', async () => {
  const f = fixture()
  addHero(f)
  assert.equal(validateBundle(f.bundle, f.context, f.root), true)
  const rendered = await renderArticle(f.context, f.bundle.article)
  assert.deepEqual(matter(rendered.content).data.images, [f.bundle.article.hero.src])
  assert.ok(
    rendered.content.includes(`![${f.bundle.article.hero.alt}](${f.bundle.article.hero.src})`)
  )
  for (const change of [
    { src: '/static/images/../private.webp' },
    { src: 'https://example.com/hero.webp' },
    { src: '/static/images/hero.svg' },
    { alt: 'Image](https://example.com)' },
    { sha256: hash('unreviewed replacement') },
  ]) {
    const invalid = structuredClone(f.bundle)
    Object.assign(invalid.article.hero, change)
    invalid.review.article_sha256 = hash(JSON.stringify(invalid.article))
    assert.throws(() => validateBundle(invalid, f.context, f.root))
  }
  const update = fixture('update_article')
  addHero(update)
  assert.throws(() => validateBundle(update.bundle, update.context, update.root), /preserve/)
})
test('hero release needs reviewed local, committed and public image bytes', async () => {
  const f = fixture(),
    bytes = addHero(f)
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
    verifyRelease(f.root, sha, { githubRead, fetcher: async () => new Response('stale image') }),
    /hero is not yet live/
  )
  assert.equal(loadQueue(f.root).items[0].status, 'awaiting_release')
  const heroFile = path.join(f.root, 'public', f.bundle.article.hero.src)
  fs.writeFileSync(heroFile, 'changed locally')
  await assert.rejects(verifyRelease(f.root, sha, { githubRead }), /Hero changed/)
  git(['add', 'public'])
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'wrong image'])
  const wrongSha = git(['rev-parse', 'HEAD'])
  fs.writeFileSync(heroFile, bytes)
  await assert.rejects(
    verifyRelease(f.root, wrongSha, {
      githubRead: async (route) =>
        route.endsWith('/statuses')
          ? [{ state: 'success' }]
          : [{ id: 2, sha: wrongSha, environment: 'Production' }],
    }),
    /deployed hero differs/
  )
  assert.deepEqual(
    await verifyRelease(f.root, sha, {
      githubRead,
      fetcher: async (url) =>
        new Response(
          url.endsWith('.webp') ? bytes : `<span data-publication-id="${marker}"></span>`
        ),
    }),
    ['is-999']
  )
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

test('Desktop canonical gate accepts reviewed new and update articles and rejects tampered bytes or review', async () => {
  for (const action of ['new_article', 'update_article']) {
    const f = fixture(action)
    const run = path.join(f.root, '.publishing-runs', f.item.id)
    fs.mkdirSync(run, { recursive: true })
    fs.writeFileSync(path.join(run, 'context.json'), JSON.stringify(f.context))
    fs.writeFileSync(path.join(run, 'bundle.json'), JSON.stringify(f.bundle))
    await applyBundle(f.bundle, f.root)
    assert.equal(
      (await checkCanonicalArticle(f.root, f.item.source_file)).status,
      'reviewed_gate_pass'
    )
    const file = path.join(f.root, f.item.source_file),
      original = fs.readFileSync(file)
    fs.appendFileSync(file, '\nUnreviewed edit')
    await assert.rejects(checkCanonicalArticle(f.root, f.item.source_file))
    fs.writeFileSync(file, original)
    f.bundle.review.passed = false
    fs.writeFileSync(path.join(run, 'bundle.json'), JSON.stringify(f.bundle))
    await assert.rejects(checkCanonicalArticle(f.root, f.item.source_file))
  }
})

test('bounded draft helper writes only a validated explicitly reviewed bundle', async () => {
  const { buildBundle } = await import('../scripts/build-reviewed-bundle.mjs')
  const { root, context, bundle } = fixture()
  try {
    const dir = path.join(root, '.publishing-runs', bundle.id)
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true })
    fs.writeFileSync(path.join(dir, 'context.json'), JSON.stringify(context))
    const sources = bundle.sources.map((s, n) => {
      fs.writeFileSync(
        path.join(dir, `src/${n}.json`),
        JSON.stringify({ ...s, text: 'Synthetic source text, never evidence. '.repeat(20) })
      )
      return { capture: `src/${n}.json`, title: s.title, supports: s.supports }
    })
    const spec = { id: bundle.id, article: bundle.article, sources, review: bundle.review }
    assert.throws(
      () => buildBundle({ ...spec, review: { ...spec.review, passed: false } }, root),
      /review did not pass/
    )
    assert.ok(!fs.existsSync(path.join(dir, 'bundle.json')))
    assert.equal(buildBundle(spec, root).status, 'validated_bundle')
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'bundle.json'))), bundle)
    assert.throws(() => buildBundle(spec, root), /already exists/)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
