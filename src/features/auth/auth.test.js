import test from 'node:test'
import assert from 'node:assert/strict'
import { public_name } from './public_name.js'
import { create_provider, login_error } from './providers.js'

test('public name prefers nickname and never falls back to email', () => {
  assert.equal(public_name({ displayName: '名字', email: 'me@example.com' }, '昵称'), '昵称')
  assert.equal(public_name({ displayName: '', email: 'me@example.com' }), '用户')
  assert.equal(public_name({ displayName: 'me@example.com' }), '用户')
  assert.equal(public_name(null), '用户')
})

test('provider selection supports Google and GitHub without repository scope', () => {
  assert.equal(create_provider('google').providerId, 'google.com')
  const github = create_provider('github')
  assert.equal(github.providerId, 'github.com')
  assert.deepEqual(github.scopes, [])
  assert.throws(() => create_provider('unexpected'))
  assert.match(login_error('auth/account-exists-with-different-credential'), /原来的方式/)
})
