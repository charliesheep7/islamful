import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'
import { imageSize } from 'image-size'
import { format } from 'prettier'
import { remark } from 'remark'
import { validateQueue, selectAssignments } from './publishing-queue.mjs'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const QUEUE = 'data/seo/publishing-queue.json'
const AUDITS = 'data/seo/publications'
const ARTICLES = new Set(['new_article', 'update_article'])
export const SOURCE_DOMAINS = [
  'daruliftabirmingham.co.uk',
  'quran.com',
  'sunnah.com',
  'dar-alifta.org',
  'alifta.gov.sa',
  'diyanet.gov.tr',
  'nhs.uk',
  'smokefree.gov',
  'nida.nih.gov',
  'cdc.gov',
  'who.int',
  'gamcare.org.uk',
  'begambleaware.org',
  'muis.gov.sg',
  'zakat.org',
  'islamic-relief.org.uk',
]
const STORE_URLS = [
  'https://apps.apple.com/app/id6755876142',
  'https://play.google.com/store/apps/details?id=com.tahirapp.development',
]
export const hash = (value) => crypto.createHash('sha256').update(value).digest('hex')
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const temp = `${file}.tmp`
  fs.writeFileSync(temp, JSON.stringify(value, null, 2) + '\n')
  fs.renameSync(temp, file)
}
const assert = (ok, message) => {
  if (!ok) throw new Error(message)
}
export function loadQueue(root = ROOT) {
  const doc = json(path.join(root, QUEUE)),
    errors = validateQueue(doc, root)
  assert(!errors.length, errors.join('\n'))
  return doc
}
export function sourceURL(value) {
  const u = new URL(value)
  assert(
    u.protocol === 'https:' &&
      !u.username &&
      !u.password &&
      !u.port &&
      SOURCE_DOMAINS.some((d) => u.hostname === d || u.hostname.endsWith('.' + d)),
    'Source URL must use an approved public primary-source domain'
  )
  return u.href
}
export function prepare(doc, item, root = ROOT) {
  assert(
    item && ARTICLES.has(item.action) && item.status === 'queued',
    'Only queued article assignments can be authored'
  )
  assert(/^(de|is)-[0-9]+$/.test(item.id), 'Invalid assignment ID')
  const file = path.resolve(root, item.source_file)
  assert(file.startsWith(path.resolve(root) + path.sep), 'Unsafe article path')
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
  assert(
    item.action === 'update_article' ? existing !== null : existing === null,
    'Assignment destination conflicts with existing content'
  )
  return {
    schema_version: 1,
    site: doc.site,
    assignment: item,
    assignment_sha256: hash(JSON.stringify(item)),
    baseline_sha256: existing === null ? null : hash(existing),
    existing,
  }
}
export function internalExists(root, value, item) {
  if (!value.startsWith('/') || value.startsWith('//') || /[?#]|\.\.|\\/.test(value)) return false
  if (value === item.target_path) return false
  const article = value.match(/^\/(ar\/)?blog\/(.+)$/)
  if (article)
    return fs.existsSync(path.join(root, `data/blog/${article[1] ? 'ar' : 'en'}/${article[2]}.mdx`))
  const route = value.startsWith('/ar/') ? value.replace('/ar/', '/[lang]/') : value
  return ['page.tsx', 'page.js', 'page.mdx'].some((f) =>
    fs.existsSync(path.join(root, 'app', route, f))
  )
}
function checkHero(hero, root) {
  assert(
    /^\/static\/images\/[a-z0-9/_-]+\.(webp|png|jpg|jpeg)$/.test(hero?.src || '') &&
      typeof hero.alt === 'string' &&
      hero.alt.length >= 8 &&
      hero.alt.length <= 200 &&
      !/[{}<>\\\r\n]/.test(hero.alt) &&
      !hero.alt.includes('[') &&
      !hero.alt.includes(']') &&
      /^[a-f0-9]{64}$/.test(hero.sha256 || ''),
    'Hero requires a local raster path, plain descriptive alt text and reviewed SHA-256'
  )
  const publicRoot = fs.realpathSync(path.join(root, 'public'))
  const file = fs.realpathSync(path.join(publicRoot, hero.src))
  assert(file.startsWith(publicRoot + path.sep), 'Hero must remain inside public assets')
  const bytes = fs.readFileSync(file)
  assert(bytes.length <= 5_000_000 && hash(bytes) === hero.sha256, 'Hero changed after review')
  const dimensions = imageSize(bytes)
  assert(
    ['webp', 'png', 'jpg'].includes(dimensions.type) &&
      dimensions.width >= 600 &&
      dimensions.height >= 300,
    'Hero must be a readable raster image at least 600 by 300'
  )
}

export function validateBundle(bundle, context, root = ROOT) {
  const { assignment: item, site } = context
  assert(
    bundle.id === item.id &&
      bundle.assignment_sha256 === context.assignment_sha256 &&
      bundle.baseline_sha256 === context.baseline_sha256,
    'Stale or mismatched assignment/baseline'
  )
  const { article, review, sources } = bundle
  if (article?.hero) {
    assert(item.action === 'new_article', 'Updates must preserve their existing hero metadata')
    checkHero(article.hero, root)
  }
  assert(
    article && typeof article.body === 'string' && article.body.trim().length > 500,
    'Missing substantive article'
  )
  assert(article.summary?.length >= 50 && article.summary.length <= 350, 'Invalid article summary')
  assert(
    typeof article.title === 'string' && article.title.length >= 10 && article.title.length <= 180,
    'Invalid title'
  )
  assert(
    Array.isArray(article.tags) &&
      article.tags.length > 0 &&
      article.tags.every((x) => typeof x === 'string'),
    'Missing tags'
  )
  assert(
    Array.isArray(article.faqs) &&
      article.faqs.every((x) => x.question?.length > 8 && x.answer?.length > 20),
    'Invalid FAQs; omit irrelevant questions instead of filler'
  )
  assert(
    !/[{}<>]|^import\s|^export\s|^---\s*$|```/m.test(article.body),
    'Article body must be plain Markdown without executable MDX, frontmatter or code'
  )
  assert(
    !/Additional question|dQw4w9WgXcQ|AI Content Review|Fapulous|guaranteed cure|dopamine reset/i.test(
      JSON.stringify(article)
    ),
    'Placeholder or unsupported content'
  )
  assert(
    Array.isArray(sources) && sources.length >= 2,
    'At least two checked primary sources required'
  )
  const urls = new Set()
  for (const source of sources) {
    const url = sourceURL(source.url)
    assert(!urls.has(url), 'Duplicate source')
    urls.add(url)
    const age = Date.now() - Date.parse(source.checked_at)
    assert(
      source.title?.length > 3 &&
        source.supports?.length > 20 &&
        /^[a-f0-9]{64}$/.test(source.content_sha256 || '') &&
        age >= -60000 &&
        age <= 7 * 86400000,
      'Source evidence missing or older than seven days'
    )
  }
  assert(
    review?.passed === true &&
      ['model_source_review', 'agent_source_review'].includes(review.method) &&
      review.issues?.length === 0 &&
      review.notes?.length > 40,
    'Source/content review did not pass'
  )
  assert(
    review.article_sha256 === hash(JSON.stringify(article)),
    'Review does not cover this exact article'
  )
  assert(
    Array.isArray(review.claim_checks) &&
      review.claim_checks.length >= 2 &&
      review.claim_checks.every(
        (c) =>
          c.supported === true &&
          c.claim?.length > 10 &&
          urls.has(c.source_url) &&
          c.explanation?.length > 20
      ),
    'Missing supported claim checks'
  )
  const tree = remark().parse(article.body),
    links = []
  function visit(node) {
    assert(
      !['html', 'code', 'image', 'imageReference', 'linkReference', 'definition'].includes(
        node.type
      ),
      'Only plain inline Markdown links are supported'
    )
    if (node.type === 'link') links.push(node.url)
    for (const child of node.children || []) visit(child)
  }
  visit(tree)
  for (const link of links) {
    if (link.startsWith('/'))
      assert(
        internalExists(root, link, item),
        `Missing or self-referencing internal destination: ${link}`
      )
    else
      assert(
        urls.has(link) || (site === 'deenback' && STORE_URLS.includes(link)),
        `Unchecked external link: ${link}`
      )
  }
  assert(
    [...urls].every((u) => links.includes(u)),
    'Every listed source must be cited in the article'
  )
  assert(
    links.some((u) => u.startsWith('/')),
    'Include a useful existing internal next step'
  )
  if (site === 'islamful')
    assert(
      !/apps\.apple|play\.google|download (the |our )?app/i.test(article.body),
      'Islamful has no app'
    )
  return true
}
export async function renderArticle(
  context,
  article,
  date = new Date().toISOString().slice(0, 10)
) {
  const old = context.existing ? matter(context.existing).data : null
  const meta = old
    ? { ...old, summary: article.summary, lastmod: date, faqs: article.faqs }
    : {
        title: article.title,
        date,
        lastmod: date,
        summary: article.summary,
        tags: article.tags,
        authors: ['editorial'],
        draft: false,
        images: article.hero ? [article.hero.src] : [],
        layout: 'PostLayout',
        faqs: article.faqs,
      }
  const hero = old?.images?.[0] || (!old && article.hero?.src)
  let body = article.body.trim()
  if (hero)
    body = `![${!old && article.hero ? article.hero.alt : String(meta.title).replaceAll('[', '').replaceAll(']', '')}](${hero})\n\n${body}`
  if (context.site === 'deenback')
    body += `\n\n<AppDownloadCTA lang="${context.assignment.locale}" placement="final" title="${context.assignment.locale === 'ar' ? 'ابدأ خطوة عملية اليوم' : 'Take one practical step today'}" blurb="${context.assignment.locale === 'ar' ? 'اختر هدفًا واستعن بدعم التعامل مع الرغبات وتابع تقدمك مع DeenBack.' : 'Choose a habit goal, use urge support, and follow your progress with DeenBack.'}" />`
  const marker = hash(matter.stringify(body, meta)).slice(0, 24)
  const content = matter.stringify(
    `${body}\n\n<span data-publication-id="${marker}" aria-hidden="true" />\n`,
    meta
  )
  return {
    content: await format(content, {
      parser: 'mdx',
      semi: false,
      singleQuote: true,
      printWidth: 100,
      tabWidth: 2,
      trailingComma: 'es5',
    }),
    marker,
  }
}
export async function applyBundle(bundle, root = ROOT) {
  const doc = loadQueue(root),
    item = doc.items.find((x) => x.id === bundle.id),
    context = prepare(doc, item, root)
  validateBundle(bundle, context, root)
  const queueHash = hash(fs.readFileSync(path.join(root, QUEUE)))
  const { content, marker } = await renderArticle(context, bundle.article)
  if (bundle.article.hero) checkHero(bundle.article.hero, root)
  assert(
    hash(fs.readFileSync(path.join(root, QUEUE))) === queueHash,
    'Queue changed during authoring'
  )
  const file = path.join(root, item.source_file),
    auditFile = path.join(root, AUDITS, `${item.id}.json`)
  assert(!fs.existsSync(auditFile), 'An audit already exists for this assignment')
  const audit = {
    schema_version: 1,
    id: item.id,
    action: item.action,
    target_path: item.target_path,
    source_file: item.source_file,
    assignment_sha256: context.assignment_sha256,
    baseline_sha256: context.baseline_sha256,
    content_sha256: hash(content),
    marker,
    ...(bundle.article.hero ? { hero: bundle.article.hero } : {}),
    sources: bundle.sources,
    review: bundle.review,
    prepared_at: new Date().toISOString(),
    state: 'awaiting_release',
  }
  // No asynchronous work between baseline check and writes. The workflow also serializes all publishers.
  if (context.existing === null) fs.writeFileSync(file, content, { flag: 'wx' })
  else {
    assert(
      hash(fs.readFileSync(file)) === context.baseline_sha256,
      'Article changed during authoring'
    )
    fs.writeFileSync(file, content)
  }
  try {
    item.status = 'awaiting_release'
    item.publication = {
      content_sha256: audit.content_sha256,
      marker,
      audit_file: `${AUDITS}/${item.id}.json`,
      ...(audit.hero ? { hero: audit.hero } : {}),
    }
    item.source_review_status = bundle.review.method
    write(auditFile, audit)
    write(path.join(root, QUEUE), doc)
  } catch (error) {
    if (context.existing === null) fs.unlinkSync(file)
    else fs.writeFileSync(file, context.existing)
    if (fs.existsSync(auditFile)) fs.unlinkSync(auditFile)
    throw error
  }
  return audit
}
export async function readSource(url, fetcher = fetch) {
  let current = sourceURL(url)
  for (let redirect = 0; redirect <= 5; redirect++) {
    const r = await fetcher(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(30000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; editorial source verification)' },
    })
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      current = sourceURL(new URL(r.headers.get('location'), current).href)
      continue
    }
    assert(r.ok, `Primary source returned HTTP ${r.status}: ${current}`)
    const raw = await r.text()
    assert(
      raw.length < 5000000 && /text\/(html|plain)/.test(r.headers.get('content-type') || ''),
      'Unsupported source response'
    )
    const text = raw
      .replace(/<(script|style|nav|footer)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    assert(
      text.length > 300 &&
        !/just a moment|verify you are human|access denied/i.test(text.slice(0, 300)),
      'Source content unavailable'
    )
    return {
      url,
      final_url: current,
      checked_at: new Date().toISOString(),
      content_sha256: hash(raw),
      text: text.slice(0, 45000),
    }
  }
  throw new Error('Source redirected too many times')
}
async function github(route) {
  const headers = { Accept: 'application/vnd.github+json' }
  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}`
  const r = await fetch(`https://api.github.com/${route}`, {
    headers,
    signal: AbortSignal.timeout(30000),
  })
  assert(r.ok, `GitHub evidence returned HTTP ${r.status}`)
  return r.json()
}
export async function verifyRelease(
  root = ROOT,
  sha,
  { githubRead = github, fetcher = fetch } = {}
) {
  assert(/^[a-f0-9]{40}$/.test(sha || ''), 'A full deployment commit SHA is required')
  const doc = loadQueue(root),
    repo = doc.site === 'deenback' ? 'charliesheep7/deenback-website' : 'charliesheep7/islamful'
  const queueSnapshot = hash(fs.readFileSync(path.join(root, QUEUE)))
  const pending = doc.items.filter((x) => x.status === 'awaiting_release')
  if (!pending.length) return []
  const deployments = await githubRead(
    `repos/${repo}/deployments?sha=${sha}&environment=Production&per_page=100`
  )
  let deployment
  for (const d of deployments.filter((d) => d.sha === sha && d.environment === 'Production')) {
    const statuses = await githubRead(`repos/${repo}/deployments/${d.id}/statuses`)
    if (statuses[0]?.state === 'success') {
      deployment = d
      break
    }
  }
  assert(deployment, 'No successful Production deployment for this exact commit')
  const verified = []
  for (const item of pending) {
    const hero = item.publication.hero
    if (hero) {
      checkHero(hero, root)
      const deployedHero = execFileSync('git', ['show', `${sha}:public${hero.src}`], { cwd: root })
      assert(
        hash(deployedHero) === hero.sha256,
        `${item.id}: deployed hero differs from reviewed image`
      )
      const heroResponse = await fetcher(
        `https://www.${doc.site === 'deenback' ? 'deenback.com' : 'islamful.com'}${hero.src}`,
        {
          signal: AbortSignal.timeout(30000),
          headers: { 'Cache-Control': 'no-cache' },
        }
      )
      assert(
        heroResponse.ok && hash(Buffer.from(await heroResponse.arrayBuffer())) === hero.sha256,
        `${item.id}: reviewed hero is not yet live`
      )
    }
    const deployedBytes = execFileSync('git', ['show', `${sha}:${item.source_file}`], { cwd: root })
    assert(
      hash(deployedBytes) === item.publication.content_sha256,
      `${item.id}: deployed content differs from reviewed content`
    )
    const url = `https://www.${doc.site === 'deenback' ? 'deenback.com' : 'islamful.com'}${item.target_path}`
    const r = await fetcher(url, {
      signal: AbortSignal.timeout(30000),
      headers: { 'Cache-Control': 'no-cache' },
    })
    assert(
      r.ok && new URL(r.url || url).pathname.replace(/\/$/, '') === item.target_path,
      `${item.id}: live destination failed`
    )
    const html = await r.text()
    assert(
      html.includes(`data-publication-id="${item.publication.marker}"`),
      `${item.id}: reviewed version is not yet live`
    )
    verified.push({
      item,
      release: { date: new Date().toISOString(), commit: sha, deployment_id: deployment.id, url },
    })
  }
  assert(
    hash(fs.readFileSync(path.join(root, QUEUE))) === queueSnapshot,
    'Queue changed during live verification'
  )
  for (const { item } of verified) {
    if (item.publication.hero) checkHero(item.publication.hero, root)
    assert(
      hash(fs.readFileSync(path.join(root, item.source_file))) === item.publication.content_sha256,
      'Article changed during live verification'
    )
    assert(item.publication.audit_file === `${AUDITS}/${item.id}.json`, 'Invalid audit destination')
  }
  for (const { item, release } of verified) {
    const auditPath = path.join(root, item.publication.audit_file),
      audit = json(auditPath)
    audit.state = 'live_reviewed'
    audit.release = release
    write(auditPath, audit)
    item.action = 'live'
    item.status = 'live_reviewed'
    item.release = release
    item.next_step =
      'Measure search performance and the relevant next-step events after sufficient exposure.'
  }
  write(path.join(root, QUEUE), doc)
  return verified.map((x) => x.item.id)
}
export async function main(argv = process.argv.slice(2), root = ROOT) {
  const { values } = parseArgs({
    args: argv,
    options: {
      prepare: { type: 'boolean' },
      apply: { type: 'string' },
      verify: { type: 'string' },
      id: { type: 'string' },
      retry: { type: 'string' },
      limit: { type: 'string', default: '2' },
    },
  })
  if (values.verify) {
    console.log(JSON.stringify({ verified: await verifyRelease(root, values.verify) }))
    return
  }
  if (values.apply) {
    console.log(JSON.stringify(await applyBundle(json(path.resolve(values.apply)), root)))
    return
  }
  assert(values.prepare, 'Choose --prepare, --apply bundle.json or --verify commit')
  const doc = loadQueue(root),
    limit = Number(values.limit)
  if (values.retry) {
    const failed = doc.items.find((x) => x.id === values.retry)
    assert(
      failed &&
        ARTICLES.has(failed.action) &&
        failed.status === 'needs_sources' &&
        failed.publisher_failure,
      'Not a failed publisher assignment'
    )
    failed.status = 'queued'
    delete failed.publisher_failure
    write(path.join(root, QUEUE), doc)
    values.id = failed.id
  }
  assert(Number.isInteger(limit) && limit > 0, 'limit must be a positive integer')
  const items = selectAssignments(doc)
    .filter((x) => ARTICLES.has(x.action) && (!values.id || x.id === values.id))
    .slice(0, limit)
  if (values.id) assert(items.length === 1, 'Assignment is not a queued article')
  for (const item of items) {
    const context = prepare(doc, item, root),
      runDir = path.join(root, '.publishing-runs', item.id)
    write(path.join(runDir, 'context.json'), context)
    console.log(JSON.stringify({ id: item.id, context: path.join(runDir, 'context.json') }))
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch((e) => {
    console.error(e.message)
    process.exitCode = 1
  })
