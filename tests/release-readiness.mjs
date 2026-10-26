import test from 'node:test'
import assert from 'node:assert/strict'
import { readiness, verifyWhenReady } from '../scripts/verify-reviewed-release.mjs'
test('queued deployment remains pending rather than falsely failing or marking live', () => {
  for (const states of [[], ['queued'], ['pending'], ['in_progress'], ['failure', 'pending']])
    assert.equal(readiness(states), 'awaiting_deployment')
})
test('only a successful deployment may enter exact-byte verification', () =>
  assert.equal(readiness(['success']), 'ready'))
test('terminal failed deployment stays an actionable failure', () => {
  for (const states of [['failure'], ['error'], ['inactive']])
    assert.throws(() => readiness(states), /failed/)
})

// Exercise the readiness-to-verifier handoff, not just readiness in isolation.
test('successful production forwards the full commit SHA in the verifier SHA argument', async () => {
  const sha = 'a'.repeat(40)
  let called = false
  const result = await verifyWhenReady({
    readQueue: () => ({ site: 'islamful', items: [{ id: 'is-test', status: 'awaiting_release' }] }),
    readHead: () => sha,
    githubRead: (route) => route.endsWith('/statuses')
      ? [{ state: 'success' }]
      : [{ id: 123, sha, environment: 'Production' }],
    verify: async (root, deploymentSha) => {
      assert.equal(root, undefined)
      assert.match(deploymentSha || '', /^[a-f0-9]{40}$/)
      assert.equal(deploymentSha, sha)
      called = true
      return ['is-test']
    },
  })
  assert.equal(called, true)
  assert.deepEqual(result, { state: 'verified', commit: sha, ids: ['is-test'] })
})
