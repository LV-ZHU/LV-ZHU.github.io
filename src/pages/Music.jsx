import { useEffect, useMemo, useRef, useState } from 'react'
import { catalog, filter_catalog, random_pool } from '../features/music/catalog'
import SongItem from '../features/music/SongItem'
import '../styles/Music.css'

const category_names = { mandarin: '国语', cantonese: '粤语', foreign: '外语', instrumental: '纯音乐', other: '其他' }

export default function Music() {
  const [search_query, set_search_query] = useState('')
  const [enabled_categories, set_enabled_categories] = useState(() => Object.fromEntries(catalog.map(category => [category.id, true])))
  const [show_comments, set_show_comments] = useState(false)
  const [random_result, set_random_result] = useState(null)
  const [highlighted_id, set_highlighted_id] = useState(null)
  const [active_category, set_active_category] = useState(catalog[0].id)
  const highlight_timer = useRef(null)
  const filtered_categories = useMemo(() => filter_catalog(search_query, enabled_categories), [search_query, enabled_categories])
  const available_songs = useMemo(() => random_pool(enabled_categories), [enabled_categories])

  useEffect(() => () => clearTimeout(highlight_timer.current), [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible.length) set_active_category(visible[0].target.dataset.category)
    }, { rootMargin: '-90px 0px -65% 0px' })
    document.querySelectorAll('.music-category').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [filtered_categories])

  function toggle_category(category_id) {
    set_enabled_categories(previous => ({ ...previous, [category_id]: !previous[category_id] }))
    set_random_result(null)
  }

  function choose_random() {
    if (!available_songs.length) return
    set_search_query('')
    set_random_result(available_songs[Math.floor(Math.random() * available_songs.length)])
  }

  function jump_to_song() {
    if (!random_result) return
    const target = document.getElementById(random_result.id)
    if (!target) return
    target.focus({ preventScroll: true })
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
    set_highlighted_id(random_result.id)
    clearTimeout(highlight_timer.current)
    highlight_timer.current = setTimeout(() => set_highlighted_id(null), 2000)
  }

  return (
    <div className={show_comments ? 'music-page show-all-comments' : 'music-page'}>
      <div className="container music-layout">
        <aside className="music-sidebar">
          <h1>Music</h1>
          <nav aria-label="音乐类别">
            {catalog.map(category => (
              <a key={category.id} href={'#category-' + category.id} aria-current={active_category === category.id ? 'location' : undefined} onClick={() => set_active_category(category.id)}>{category.label}</a>
            ))}
          </nav>
        </aside>
        <div className="music-content">
          <p className="music-intro">音乐像是时空的存档点，总能让你想起生命中的一些瞬间</p>
          <div className="music-controls-panel">
            <div className="music-toolbar">
              <div className="music-search">
                <i className="fas fa-search search-icon" aria-hidden="true" />
                <input type="search" className="music-search-input" placeholder="搜索歌曲名称、歌手、短评..." aria-label="搜索歌曲名称、歌手、短评" autoComplete="off" value={search_query} onChange={event => set_search_query(event.target.value)} />
                {search_query && <button className="clear-btn" onClick={() => set_search_query('')} title="清除搜索"><span aria-hidden="true">×</span></button>}
              </div>
              <button className="btn-random" onClick={choose_random} disabled={!available_songs.length}>随机一首</button>
              <label className="toggle-comments-label"><input type="checkbox" checked={show_comments} onChange={event => set_show_comments(event.target.checked)} /><span>显示所有评论</span></label>
            </div>
            <div className="random-filters">
              <span className="random-help">支持多选类别</span>
              {catalog.map(category => <label key={category.id}><input type="checkbox" checked={enabled_categories[category.id]} onChange={() => toggle_category(category.id)} /><span>{category_names[category.id]}</span></label>)}
            </div>
            {random_result && <div className="random-result" aria-live="polite">
              <div className="random-result-info"><strong>{random_result.name}</strong><span>{random_result.artist}</span>{random_result.comment && <p>{random_result.comment}</p>}</div>
              <button className="btn-jump" onClick={jump_to_song}><i className="fas fa-location-arrow" aria-hidden="true" /> 跳转播放</button>
            </div>}
          </div>
          {filtered_categories.map(category => <section className="music-category" id={'category-' + category.id} data-category={category.id} key={category.id} aria-labelledby={'heading-' + category.id}>
            <h2 className="music-category-title" id={'heading-' + category.id}>{category.label}</h2>
            <ul className="music-list">{category.data.map(song => <SongItem key={song.id} song={song} highlighted={highlighted_id === song.id} />)}</ul>
            <p className="music-summary-count">共 {category.data.length} 首。</p>
          </section>)}
        </div>
      </div>
    </div>
  )
}
