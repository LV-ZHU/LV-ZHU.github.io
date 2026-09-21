import { read_record, write_record } from '../storage.js'
export const STORAGE_CHINA = 'lv-zhu-travel-map'

export const STORAGE_WORLD = 'lv-zhu-travel-map-world'

export const STORAGE_SHANGHAI = 'lv-zhu-travel-map-shanghai'

export const STATES = ['unvisited', 'visited', 'want']

export const colorMap = {
  visited: '#557fa3',
  want: '#629a87',
  unvisited: '#d1d5db',
}

export function loadData(key) {
  return Object.fromEntries(Object.entries(read_record(key)).filter(([, value]) => STATES.includes(value)))
}

export function saveData(key, data) {
  return write_record(key, data)
}

export function getStorageKey(mapType) {
  if (mapType === 'china') return STORAGE_CHINA
  if (mapType === 'world') return STORAGE_WORLD
  return STORAGE_SHANGHAI
}

export function countVisited(data) {
  if (!data) return 0
  return Object.values(data).filter((v) => v === 'visited').length
}

export function escapeHtml(str) {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(str || ''))
  return div.innerHTML
}

export function next_map_state(current) {
  return STATES[(STATES.indexOf(current) + 1) % STATES.length]
}
