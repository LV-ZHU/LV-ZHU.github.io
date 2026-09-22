import test from 'node:test'
import assert from 'node:assert/strict'
import { read_record, write_record } from './storage.js'
import { advance_typing, is_typing_key } from './favorites/typing.js'
import { next_map_state, getStorageKey } from './travel/state.js'

test('malformed saved content is preserved rather than overwritten', () => {
  let raw = '{broken'
  const storage = { getItem: () => raw, setItem: (_, value) => { raw = value } }
  assert.deepEqual(read_record('key', {}, storage), {})
  assert.equal(write_record('key', { updated: true }, storage), false)
  assert.equal(raw, '{broken')
})

test('storage failure does not prevent in-memory use; valid records round trip', () => {
  const blocked = { getItem() { throw Error('blocked') } }
  assert.deepEqual(read_record('key', {}, blocked), {})
  assert.equal(write_record('key', {}, blocked), false)
  let raw = null
  const storage = { getItem: () => raw, setItem: (_, value) => { raw = value } }
  assert.equal(write_record('key', { A: { note: 'A', href: '/favorites/A' } }, storage), true)
  assert.equal(read_record('key', {}, storage).A.href, '/favorites/A')
})

test('typing skips spaces, keeps combo scoring, and awards completion once', () => {
  assert.deepEqual(advance_typing('a b', 0, 5, 'A'), { index: 2, combo: 6, score: 15, complete: false, correct: true })
  assert.equal(advance_typing('a b', 2, 6, 'b').score, 65)
  assert.deepEqual(advance_typing('abc', 1, 8, 'x'), { index: 1, combo: 0, score: 0, complete: false, correct: false })
})

test('map cycle and persisted map keys remain compatible', () => {
  assert.equal(next_map_state('unvisited'), 'visited')
  assert.equal(next_map_state('visited'), 'want')
  assert.equal(next_map_state('want'), 'unvisited')
  assert.equal(getStorageKey('china'), 'lv-zhu-travel-map')
  assert.equal(getStorageKey('world'), 'lv-zhu-travel-map-world')
  assert.equal(getStorageKey('shanghai'), 'lv-zhu-travel-map-shanghai')
})

test('typing accepts game characters without capturing navigation keys', () => {
  for (const key of ['a', 'Z', '0', '9']) assert.equal(is_typing_key(key), true)
  for (const key of ['Tab', 'Enter', 'ArrowLeft', 'Shift', 'Dead', '中']) assert.equal(is_typing_key(key), false)
})
