import test from 'node:test'
import assert from 'node:assert/strict'
import { catalog, filter_catalog, random_pool, music_platforms, platform_url } from './catalog.js'
import { matches_search } from './search.js'

const all_enabled = Object.fromEntries(catalog.map(category => [category.id, true]))

test('filtering keeps a song identity and source position for jump targets', () => {
  const original = catalog[0].data.find(song => song.name === '爱情转移')
  const filtered = filter_catalog('爱情转移', all_enabled)[0].data
  assert.equal(filtered.length, 1)
  assert.equal(filtered[0].id, original.id)
  assert.equal(filtered[0].source_index, original.source_index)
})

test('disabled categories are excluded from search and random selection', () => {
  const enabled = { cantonese: true }
  assert.ok(filter_catalog('', enabled).filter(category => category.id !== 'cantonese').every(category => !category.data.length))
  assert.deepEqual(random_pool(enabled), catalog.find(category => category.id === 'cantonese').data)
  assert.deepEqual(random_pool({}), [])
})

test('contributor aliases and multiword searches remain available', () => {
  const song = catalog[0].data.find(song => song.name === '北京欢迎你')
  assert.equal(matches_search(song, 'Leehom 2008'), true)
  assert.equal(matches_search(song, 'Leehom 不存在的歌词'), false)
})

test('full-width search and short-year aliases keep their existing meaning', () => {
  assert.equal(matches_search({ name: 'ABC', comment: '24年毕业季', searchKeywords: '' }, 'ＡＢＣ 2024 校园'), true)
})

test('platform query encodes punctuation without changing the service suffix', () => {
  const song = { name: 'A & B?', artist: '甲/乙' }
  const netease = music_platforms.find(platform => platform.id === 'netease')
  assert.equal(platform_url(netease, song), 'https://music.163.com/#/search/m/?s=A%20%26%20B%3F%20%E7%94%B2%2F%E4%B9%99&type=1')
})
