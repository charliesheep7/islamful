import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { loadQueue, verifyRelease } from './article-publisher.mjs'
const github = (route) =>
  JSON.parse(execFileSync('gh', ['api', route], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }))
export function readiness(states) {
  if (states.includes('success')) return 'ready'
  if (!states.length || states.some((s) => ['queued', 'pending', 'in_progress'].includes(s)))
    return 'awaiting_deployment'
  throw new Error(
    'Production deployment failed or became inactive; article remains awaiting_release'
  )
}
export async function verifyWhenReady() {
  const doc = loadQueue(),
    pending = doc.items.filter((x) => x.status === 'awaiting_release')
  if (!pending.length) return { state: 'nothing_pending', ids: [] }
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  const repo = doc.site === 'deenback' ? 'charliesheep7/deenback-website' : 'charliesheep7/islamful'
  const deployments = github(
    `repos/${repo}/deployments?sha=${sha}&environment=Production&per_page=100`
  ).filter((d) => d.sha === sha && d.environment === 'Production')
  const states = deployments.map(
    (d) => github(`repos/${repo}/deployments/${d.id}/statuses`)[0]?.state || 'pending'
  )
  const state = readiness(states)
  if (state !== 'ready') return { state, commit: sha, ids: pending.map((x) => x.id) }
  return { state: 'verified', commit: sha, ids: await verifyRelease(sha) }
}
if (import.meta.url === pathToFileURL(process.argv[1] || '').href)
  verifyWhenReady()
    .then((r) => console.log(JSON.stringify(r)))
    .catch((e) => {
      console.error(e.message)
      process.exitCode = 1
    })
