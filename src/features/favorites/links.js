import { letterData } from '../../data/favorites.js'

export function normalize_href(input) {
  const value = typeof input === 'string' ? input.trim() : ''
  if (!value) return ''
  if (/[\u0000-\u0020\u007f\\]/.test(value)) return null
  if (value.startsWith('/') && !value.startsWith('//')) return value
  const candidate = /^[\w.-]+\.[a-z]{2,}(?::\d+)?(?:[/?#]|$)/i.test(value) ? `https://${value}` : value
  try {
    const url = new URL(candidate)
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null
  } catch {
    return null
  }
}

export function key_target(item) {
  const href = normalize_href(item?.href)
  if (!href) return ''
  const section = /^\/favorites\/([a-z0-9])\/?(?:[?#].*)?$/i.exec(href)
  return section && !letterData[section[1].toUpperCase()] ? '' : href
}

export function key_label(item) {
  return typeof item?.note === 'string' && item.note.trim() !== '-' ? item.note.trim() : ''
}
