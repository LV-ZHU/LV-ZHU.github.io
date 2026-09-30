import test from 'node:test'
import assert from 'node:assert/strict'
import { leaderboard_record } from './privacy.js'

test('public summary excludes locations, account email and unrelated fields', () => {
  const result = leaderboard_record({ email: 'private@example.com', uid: '123' }, {
    china: { 上海: 'visited', 北京: 'want' }, world: { China: 'visited' }, shanghai: {},
  })
  assert.deepEqual(result, {
    displayName: '用户', photoURL: '', visitedCount: 2,
    chinaVisited: 1, worldVisited: 1, shanghaiVisited: 0,
  })
  assert.equal(JSON.stringify(result).includes('上海'), false)
})
