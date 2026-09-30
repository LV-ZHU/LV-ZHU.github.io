import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { STORAGE_KEY, defaultConfig, loadConfig, saveConfig, keyboardLayout } from './config.js';
import { normalize_href, key_target } from './links.js'

export function use_favorites(practice_open = false) {
  const navigate = useNavigate()
  const [search_params, set_search_params] = useSearchParams()
  const [editor_key, set_editor_key] = useState(null)
  const [save_message, set_save_message] = useState('')

  useEffect(() => {
    const requested_key = search_params.get('edit')?.toUpperCase()
    if (keyboardLayout.flat().some(item => item.key === requested_key && !item.static)) {
      setIsEditMode(true)
      set_editor_key(requested_key)
      const next_params = new URLSearchParams(search_params)
      next_params.delete('edit')
      set_search_params(next_params, { replace: true })
    }
  }, [search_params, set_search_params])
  const [config, setConfig] = useState(loadConfig)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const linkableKeys = keyboardLayout.flat().filter(k => k.key && !k.static && !k.spacer)
  const hotkeys = {}
  linkableKeys.forEach(k => {
    const item = config[k.key] || defaultConfig[k.key]
    hotkeys[k.key.toLowerCase()] = key_target(item)
  })

  const applyConfigToKey = (key) => {
    const item = config[key] || defaultConfig[key]
    return item || defaultConfig[key]
  }

  const setCurrent = useCallback((idx) => {
    const len = linkableKeys.length
    const next_index = ((idx % len) + len) % len
    setCurrentIndex(next_index)
    document.querySelector(`.keyboard [data-key="${linkableKeys[next_index].key}"]`)?.focus()
  }, [linkableKeys.length])

  function handleKeyClick(key) {
    if (!isEditMode) return
    set_editor_key(key)
    set_save_message('')
  }

  function save_key(key, note, input) {
    const href = normalize_href(input)
    if (href === null) return '请输入网站地址或以 / 开头的站内路径。'
    if (href && !key_target({ href })) return '这个分区还没有内容，请填写其他链接。'
    const new_config = { ...config, [key]: { note: note.trim(), href } }
    if (!saveConfig(new_config)) return '浏览器未能保存，输入已保留，请重试。'
    setConfig(new_config)
    set_editor_key(null)
    requestAnimationFrame(() => document.querySelector(`.keyboard [data-key="${key}"]`)?.focus())
    set_save_message(`${key} 键已保存`)
    return ''
  }

  function cancel_edit() {
    const key = editor_key
    set_editor_key(null)
    requestAnimationFrame(() => document.querySelector(`.keyboard [data-key="${key}"]`)?.focus())
  }

  function toggleEditMode() {
    if (practice_open) return
    setIsEditMode(prev => !prev)
    set_editor_key(null)
    set_save_message('')
  }

  function resetConfig() {
    if (!window.confirm('恢复所有默认键位？此浏览器中的自定义名称和链接会被清除。')) return
    try {
      localStorage.removeItem(STORAGE_KEY)
      setConfig({ ...defaultConfig })
      set_editor_key(null)
      setCurrentIndex(0)
      set_save_message('已恢复默认键位')
    } catch {
      set_save_message('恢复失败，现有键位未改动。')
    }
  }

  function open_key(href) {
    if (!href) return
    if (/^https?:\/\//i.test(href)) window.location.assign(href)
    else navigate(href)
  }

  // Keyboard event handler
  useEffect(() => {
    function handleKeyDown(event) {
      if (practice_open) return
      const tag = (event.target.tagName || '').toLowerCase()
      if (event.isComposing || event.repeat) return
      if (tag === 'select' || tag === 'input' || tag === 'textarea' || event.target.isContentEditable || event.ctrlKey || event.metaKey || event.altKey) return

      if (editor_key) return
      if (event.key === 'Enter' && event.target.closest('a, button')) return

      const lower = event.key.toLowerCase()
      if (Object.hasOwn(hotkeys, lower)) {
        if (isEditMode) handleKeyClick(lower.toUpperCase())
        else open_key(hotkeys[lower])
        return
      }

      if (!linkableKeys.length) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setCurrent(currentIndex + 1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setCurrent(currentIndex - 1)
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        // Build row map from linkableKeys order
        const currentKey = linkableKeys[currentIndex]?.key
        if (!currentKey) return
        // Find which row the current key is in
        let currentRowIdx = -1
        let currentColInRow = -1
        for (let r = 0; r < keyboardLayout.length; r++) {
          const linkable = keyboardLayout[r].filter(k => k.key && !k.static && !k.spacer)
          const idx = linkable.findIndex(k => k.key === currentKey)
          if (idx !== -1) {
            currentRowIdx = r
            currentColInRow = idx
            break
          }
        }
        if (currentRowIdx === -1) return
        const direction = event.key === 'ArrowUp' ? -1 : 1
        let targetRowIdx = currentRowIdx + direction
        // Skip rows with no linkable keys
        while (targetRowIdx >= 0 && targetRowIdx < keyboardLayout.length) {
          const rowLinkable = keyboardLayout[targetRowIdx].filter(k => k.key && !k.static && !k.spacer)
          if (rowLinkable.length > 0) break
          targetRowIdx += direction
        }
        if (targetRowIdx < 0 || targetRowIdx >= keyboardLayout.length) return
        const targetRowLinkable = keyboardLayout[targetRowIdx].filter(k => k.key && !k.static && !k.spacer)
        const targetCol = Math.min(currentColInRow, targetRowLinkable.length - 1)
        const targetKey = targetRowLinkable[targetCol]?.key
        const targetIdx = linkableKeys.findIndex(k => k.key === targetKey)
        if (targetIdx !== -1) setCurrent(targetIdx)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        const keyItem = linkableKeys[currentIndex]
        if (keyItem) {
          if (isEditMode) handleKeyClick(keyItem.key)
          else open_key(hotkeys[keyItem.key.toLowerCase()])
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [practice_open, editor_key, isEditMode, currentIndex, hotkeys, navigate, linkableKeys, setCurrent])

  return { editor_key, save_key, cancel_edit, save_message, isEditMode, currentIndex, linkableKeys, applyConfigToKey, handleKeyClick, toggleEditMode, resetConfig }
}
