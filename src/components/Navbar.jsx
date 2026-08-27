import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthButton from './AuthButton'
import { useTheme } from './ThemeProvider'
import { navItems, searchIndex } from '../config/site'

function SiteSearch({ className = '', query, results, onChange, onKeyDown, onSelect, searchRef }) {
  return (
    <div className={`nav-search ${className}`.trim()} ref={searchRef}>
      <i className="fas fa-magnifying-glass nav-search-icon" aria-hidden="true" />
      <input
        className="nav-search-input"
        type="search"
        placeholder="搜索页面..."
        aria-label="搜索站内页面"
        aria-expanded={results.length > 0}
        autoComplete="off"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className={`nav-search-results${results.length ? ' active' : ''}`} role="list" aria-label="站点搜索结果">
        {results.map((result) => (
          <Link
            key={result.path + result.title}
            className="nav-search-result"
            to={result.path}
            onClick={onSelect}
          >
            {result.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileGroup, setMobileGroup] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const desktopSearchRef = useRef(null)
  const mobileSearchRef = useRef(null)
  const hamburgerRef = useRef(null)

  const activeKey = (() => {
    const p = location.pathname.toLowerCase()
    if (p.startsWith('/study')) return 'study'
    if (p.startsWith('/projects')) return 'projects'
    if (p.startsWith('/jottings')) return 'jottings'
    if (p.startsWith('/favorites')) return 'favorites'
    if (p.startsWith('/acgn')) return 'acgn'
    if (p.startsWith('/music')) return 'music'
    if (p.startsWith('/travel')) return 'travel'
    if (p.startsWith('/tutoring')) return 'tutoring'
    if (p.startsWith('/account')) return 'account'
    return 'home'
  })()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setMobileGroup(null)
    setResults([])
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen)
    if (!menuOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      requestAnimationFrame(() => hamburgerRef.current?.focus())
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('nav-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  useEffect(() => {
    function handleClick(e) {
      const insideDesktop = desktopSearchRef.current?.contains(e.target)
      const insideMobile = mobileSearchRef.current?.contains(e.target)
      if (!insideDesktop && !insideMobile) setResults([])
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  function handleSearch(val) {
    setQuery(val)
    const q = val.trim().toLowerCase()
    if (!q) { setResults([]); return }
    setResults(searchIndex.filter((i) => i.searchable.includes(q)).slice(0, 8))
  }

  function handleSearchKey(e) {
    if (e.key === 'Enter') {
      const q = query.trim().toLowerCase()
      const easterEggs = { sujia: '宝宝这素什么东东呀' }
      if (easterEggs[q]) {
        e.preventDefault()
        alert(easterEggs[q])
        setQuery('')
        setResults([])
        return
      }
      if (results.length) {
        e.preventDefault()
        navigate(results[0].path)
        setQuery('')
        setResults([])
      }
    }
    if (e.key === 'Escape') {
      setResults([])
      e.target.blur()
    }
  }

  function clearSearch() {
    setQuery('')
    setResults([])
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <Link to="/"><i className="fas fa-meteor" /><span>Lv Zhu</span></Link>
        </div>
        <ul id="primary-navigation" className={`nav-menu${menuOpen ? ' active' : ''}`}>
          {navItems.map((item) => {
            const cls = item.key === activeKey ? 'nav-link active' : 'nav-link'
            if (!item.children) {
              return <li className="nav-item" key={item.key}><Link to={item.path} className={cls} aria-current={item.key === activeKey ? 'page' : undefined}>{item.label}</Link></li>
            }
            return (
              <li className={`nav-item nav-dropdown${mobileGroup === item.key ? ' mobile-expanded' : ''}`} key={item.key}>
                <div className="nav-dropdown-trigger">
                  <Link to={item.path} className={cls} aria-current={item.key === activeKey ? 'page' : undefined} aria-haspopup="true">{item.label} <i className="fas fa-chevron-down nav-caret" /></Link>
                  <button
                    type="button"
                    className="nav-dropdown-toggle"
                    aria-label={`${mobileGroup === item.key ? '收起' : '展开'} ${item.label}`}
                    aria-expanded={mobileGroup === item.key}
                    onClick={() => setMobileGroup((current) => current === item.key ? null : item.key)}
                  >
                    <i className="fas fa-chevron-down" aria-hidden="true" />
                  </button>
                </div>
                <div className="dropdown-menu">
                  {item.children.map((child) => (
                    <Link key={child.path} to={child.path} className={`dropdown-link${location.pathname === child.path ? ' active' : ''}`}>{child.label}</Link>
                  ))}
                </div>
              </li>
            )
          })}
          <li className="mobile-search-item">
            <SiteSearch
              className="nav-search-mobile"
              query={query}
              results={results}
              onChange={handleSearch}
              onKeyDown={handleSearchKey}
              onSelect={clearSearch}
              searchRef={mobileSearchRef}
            />
          </li>
        </ul>
        <SiteSearch
          className="nav-search-desktop"
          query={query}
          results={results}
          onChange={handleSearch}
          onKeyDown={handleSearchKey}
          onSelect={clearSearch}
          searchRef={desktopSearchRef}
        />
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? '切换到日间模式' : '切换到夜间模式'}
        >
          <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true" />
        </button>
        <div id="auth-section" className="auth-section"><AuthButton /></div>
        <button
          type="button"
          className="hamburger"
          ref={hamburgerRef}
          id="hamburger"
          aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
