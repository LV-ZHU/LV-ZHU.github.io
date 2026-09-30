import test from 'node:test'
import assert from 'node:assert/strict'
import { normalize_href, key_target, key_label } from './links.js'

test('key links accept site paths and web addresses, reject executable or ambiguous URLs', () => {
  assert.equal(normalize_href(' example.com/a '), 'https://example.com/a')
  assert.equal(normalize_href('/study'), '/study')
  assert.equal(normalize_href(''), '')
  for (const value of ['javascript:alert(1)', 'data:text/html,hello', '//evil.test', '/\\evil.test', 'https://user:pass@example.com', 'java\nscript:alert(1)']) {
    assert.equal(normalize_href(value), null, value)
  }
})

test('empty sections cannot become live keys by merely adding a label', () => {
  assert.equal(key_target({ note: '新名称', href: '/favorites/W' }), '')
  assert.equal(key_target({ href: '/favorites/Q' }), '/favorites/Q')
  assert.equal(key_target({ href: 'https://example.com' }), 'https://example.com/')
  assert.equal(key_label({ note: '-' }), '')
  assert.equal(key_label({ note: '  我的链接  ' }), '我的链接')
})
