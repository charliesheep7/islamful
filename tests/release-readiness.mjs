import test from 'node:test'
import assert from 'node:assert/strict'
import { readiness } from '../scripts/verify-reviewed-release.mjs'
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
