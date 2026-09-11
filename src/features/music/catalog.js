import { music_categories } from '../../data/music.js'
import { matches_search } from './search.js'

// Keep source positions across filtering so React keys and jump targets agree.
export const catalog = music_categories.map(category => ({
  ...category,
  data: category.data.map((song, source_index) => ({
    ...song,
    source_index,
    id: `song-${category.id}-${source_index}`,
  })),
}))

export function filter_catalog(query, enabled_categories) {
  return catalog.map(category => ({
    ...category,
    data: enabled_categories[category.id]
      ? category.data.filter(song => matches_search(song, query))
      : [],
  }))
}

export function random_pool(enabled_categories) {
  return catalog.flatMap(category => enabled_categories[category.id] ? category.data : [])
}

export const music_platforms = [
  { id: 'bilibili', label: 'Bilibili', base: 'https://search.bilibili.com/all?keyword=' },
  { id: 'youtube', label: 'YouTube', base: 'https://www.youtube.com/results?search_query=' },
  { id: 'netease', label: '网易云', base: 'https://music.163.com/#/search/m/?s=', suffix: '&type=1' },
  { id: 'qq', label: 'QQ', base: 'https://y.qq.com/n/ryqq/search?w=' },
  { id: 'kugou', label: '酷狗', base: 'https://www.kugou.com/yy/html/search.html#searchType=song&searchKeyWord=' },
  { id: 'apple', label: 'Apple Music', base: 'https://music.apple.com/cn/search?term=' },
]

export function platform_url(platform, song) {
  return platform.base + encodeURIComponent(`${song.name} ${song.artist}`) + (platform.suffix || '')
}
