import { read_record, write_record } from '../storage.js'
export const STORAGE_KEY = 'lv-zhu-favorites-keymap'

export const defaultConfig = {
  1: { note: '-', href: '/favorites/1' },
  2: { note: '-', href: '/favorites/2' },
  3: { note: '-', href: '/favorites/3' },
  4: { note: '-', href: '/favorites/4' },
  5: { note: '-', href: '/favorites/5' },
  6: { note: '-', href: '/favorites/6' },
  7: { note: '-', href: '/favorites/7' },
  8: { note: '-', href: '/favorites/8' },
  9: { note: '-', href: '/favorites/9' },
  0: { note: '-', href: '/favorites/0' },
  Q: { note: 'QQ群号', href: '/favorites/Q' },
  W: { note: '-', href: '/favorites/W' },
  E: { note: '-', href: '/favorites/E' },
  R: { note: '-', href: '/favorites/R' },
  T: { note: '同济网站', href: '/favorites/T' },
  Y: { note: '-', href: '/favorites/Y' },
  U: { note: '实用工具', href: '/favorites/U' },
  I: { note: '-', href: '/favorites/I' },
  O: { note: '其他网站', href: '/favorites/O' },
  P: { note: '项目资源', href: '/favorites/P' },
  A: { note: '代码练习', href: '/favorites/A' },
  S: { note: '学习资源', href: '/favorites/S' },
  D: { note: '-', href: '/favorites/D' },
  F: { note: '-', href: '/favorites/F' },
  G: { note: '游戏网站', href: '/favorites/G' },
  H: { note: '-', href: '/favorites/H' },
  J: { note: '-', href: '/favorites/J' },
  K: { note: '-', href: '/favorites/K' },
  L: { note: '-', href: '/favorites/L' },
  Z: { note: '-', href: '/favorites/Z' },
  X: { note: '-', href: '/favorites/X' },
  C: { note: 'CSDN 系列', href: '/favorites/C' },
  V: { note: '-', href: '/favorites/V' },
  B: { note: '学长博客', href: '/favorites/B' },
  N: { note: '-', href: '/favorites/N' },
  M: { note: '-', href: '/favorites/M' },
}

export function loadConfig() {
  const saved = read_record(STORAGE_KEY)
  const valid = Object.fromEntries(Object.entries(saved).filter(([, value]) => value && typeof value.note === 'string' && typeof value.href === 'string'))
  return { ...defaultConfig, ...valid }
}

export function saveConfig(config) {
  return write_record(STORAGE_KEY, config)
}

export const keyboardLayout = [
  [
    { key: 'Q' }, { key: 'W' }, { key: 'E' }, { key: 'R' }, { key: 'T' },
    { key: 'Y' }, { key: 'U' }, { key: 'I' }, { key: 'O' }, { key: 'P' },
  ],
  [
    { key: null, spacer: true }, { key: 'A' }, { key: 'S' }, { key: 'D' }, { key: 'F' },
    { key: 'G' }, { key: 'H' }, { key: 'J' }, { key: 'K' }, { key: 'L' },
    { key: ';', static: true }, { key: null, spacer: true },
  ],
  [
    { key: null, spacer: true }, { key: 'Z' }, { key: 'X' }, { key: 'C' }, { key: 'V' },
    { key: 'B' }, { key: 'N' }, { key: 'M' }, { key: ',', static: true }, { key: '.', static: true },
  ],
  [
    { key: null, spacer: true }, { key: null, spacer: true }, { key: null, spacer: true },
    { key: null, spacer: true }, { key: null, spacer: true }, { key: null, spacer: true },
    { key: '↑', static: true }, { key: null, spacer: true }, { key: null, spacer: true }, { key: null, spacer: true },
  ],
  [
    { key: null, spacer: true }, { key: null, spacer: true }, { key: null, spacer: true },
    { key: null, spacer: true }, { key: null, spacer: true },
    { key: '←', static: true }, { key: '↓', static: true }, { key: '→', static: true },
    { key: null, spacer: true }, { key: null, spacer: true },
  ],
]

export const rowClasses = ['key-row', 'key-row row-mid', 'key-row row-bottom', 'key-row row-arrows', 'key-row row-arrows']
