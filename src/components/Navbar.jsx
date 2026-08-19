import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthButton from './AuthButton'
import { useTheme } from './ThemeProvider'

const studySections = [
  { label: '数据结构', path: '/study/data-structure', keywords: '数据结构 data structure 408' },
  { label: '计组', path: '/study/computer-organization', keywords: '计组 CPU 408' },
  { label: '操作系统', path: '/study/os', keywords: '操作系统 os 408' },
  { label: '计网', path: '/study/computer-network', keywords: '计网 网络 408' },
  { label: '数分高数', path: '/study/math-analysis', keywords: '数分 高数 微积分 数学分析 极限 导数' },
  { label: '高代线代', path: '/study/linear-algebra', keywords: '高代 线代 线性代数 矩阵 行列式' },
  { label: '离散数学', path: '/study/discrete-math', keywords: '离散数学 discrete math' },
  { label: '算法设计', path: '/study/algorithm-design', keywords: '算法设计 算法分析与设计 algorithm design 分治 动态规划 贪心 回溯 分支限界 线性规划' },
  { label: '人工智能', path: '/study/artificial-intelligence', keywords: '人工智能 人工智能原理与应用 AI artificial intelligence 机器学习 深度学习 强化学习' },
  { label: '信安数基', path: '/study/security-math-foundations', keywords: '信安数基 信息安全数学基础 数论 有限域 椭圆曲线' },
  { label: '大学物理', path: '/study/physics', keywords: '大学物理 物理 电磁学 光学 量子力学' },
  { label: '电路理论', path: '/study/circuit-theory', keywords: '电路理论 电路' },
  { label: '汇编语言', path: '/study/assembly_language_programming', keywords: '汇编 汇编语言 8086 指令 x86' },
  { label: '数据库', path: '/study/database', keywords: '数据库 database sql oceanbase' },
  { label: '密码学', path: '/study/cryptography', keywords: '密码学 cryptography 信安 信息安全' },
]

const projectSections = [
  { label: 'LLM 聊天机器人', path: '/projects/llm-bot' },
  { label: 'C++ BigHW', path: '/projects/cpp-bighw' },
  { label: 'FPGA', path: '/projects/fpga' },
  { label: 'GPU', path: '/projects/gpu' },
]

const navGroups = [
  { key: 'home', label: '首页', path: '/' },
  { key: 'study', label: '学习', path: '/study', children: [{ label: '知识地图', path: '/study' }, ...studySections] },
  { key: 'projects', label: '项目', path: '/projects', children: [{ label: '项目总览', path: '/projects' }, ...projectSections] },
  { key: 'records', label: '记录', path: '/jottings', children: [
    { label: '随笔', path: '/jottings' },
    { label: '音乐档案', path: '/music' },
    { label: '旅行足迹', path: '/travel' },
  ] },
  { key: 'collections', label: '收藏', path: '/favorites', children: [
    { label: 'Favorites', path: '/favorites' },
    { label: 'ACGN', path: '/acgn' },
    { label: 'Tutoring', path: '/tutoring' },
  ] },
]

const searchIndex = [
  { title: 'Home', path: '/', keywords: '主页 首页 home personal space' },
  { title: 'Study', path: '/study', keywords: '学习 study 课程 408 知识地图' },
  ...studySections.map((item) => ({ title: `Study / ${item.label}`, path: item.path, keywords: item.keywords })),
  { title: 'Projects', path: '/projects', keywords: '项目 projects' },
  { title: 'Projects / C++ BigHW', path: '/projects/cpp-bighw', keywords: 'cpp c++ bighw 程序设计 程设 高程 oop 沈坚 sj' },
  { title: 'Projects / FPGA', path: '/projects/fpga', keywords: 'fpga 数字逻辑 verilog oled mp3 zdd mips246' },
  { title: 'Projects / GPU', path: '/projects/gpu', keywords: 'gpu 并行 gunrock 图' },
  { title: 'Projects / LLM聊天机器人', path: '/projects/llm-bot', keywords: 'llm 聊天机器人 chatbot astrbot 多平台 qq bot' },
  { title: 'Jottings', path: '/jottings', keywords: '随笔 jottings' },
  { title: '同济济勤巨类大一生存指北', path: '/jottings/jiqin-fenliu', keywords: '济勤 分流 同济 生存指北' },
  { title: '面试合集', path: '/jottings/interview', keywords: '面试 答辩 interview' },
  { title: 'Favorites', path: '/favorites', keywords: '收藏 favorites 网址 键盘 打字 问答' },
  { title: 'Favorites / T', path: '/favorites/T', keywords: 't 同济' },
  { title: 'Music', path: '/music', keywords: '音乐 music 歌单 eason jj' },
  { title: 'Travel', path: '/travel', keywords: '旅行 旅游 travel 开元心 行夫 世界 地图' },
  { title: 'ACGN', path: '/acgn', keywords: '二次元 动画 游戏 小说 acgn animation game novel 植物大战僵尸 wanna' },
  { title: 'Tutoring', path: '/tutoring', keywords: '家教 tutoring 原创试题' },
  { title: 'Account', path: '/account', keywords: '账号 account 个人 昵称 profile 设置' },
].map((item) => ({ ...item, searchable: `${item.title} ${item.keywords}`.toLowerCase() }))

function getActiveKey(pathname) {
  if (pathname.startsWith('/study')) return 'study'
  if (pathname.startsWith('/projects')) return 'projects'
  if (pathname.startsWith('/jottings') || pathname.startsWith('/music') || pathname.startsWith('/travel')) return 'records'
  if (pathname.startsWith('/favorites') || pathname.startsWith('/acgn') || pathname.startsWith('/tutoring')) return 'collections'
  return 'home'
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeResult, setActiveResult] = useState(0)
  const searchInputRef = useRef(null)
  const activeKey = getActiveKey(location.pathname.toLowerCase())

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return searchIndex.slice(0, 7)
    return searchIndex.filter((item) => item.searchable.includes(normalized)).slice(0, 9)
  }, [query])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenGroup(null)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
        setOpenGroup(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    setActiveResult(0)
    requestAnimationFrame(() => searchInputRef.current?.focus())
  }, [searchOpen])

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen || searchOpen)
    return () => document.body.classList.remove('nav-open')
  }, [menuOpen, searchOpen])

  function goToResult(item) {
    if (!item) return
    navigate(item.path)
    setQuery('')
    setSearchOpen(false)
  }

  function handleSearchKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveResult((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveResult((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      const normalized = query.trim().toLowerCase()
      if (normalized === 'sujia') {
        event.preventDefault()
        alert('宝宝这素什么东东呀')
        setQuery('')
        return
      }
      event.preventDefault()
      goToResult(results[activeResult])
    }
  }

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="主导航">
        <div className="container nav-container">
          <Link to="/" className="brand" aria-label="LV-ZHU 首页">
            <span className="brand-mark" aria-hidden="true">LZ</span>
            <span className="brand-copy"><strong>LV—ZHU</strong><small>PERSONAL SPACE</small></span>
          </Link>

          <div className={`nav-menu${menuOpen ? ' active' : ''}`} id="site-menu">
            {navGroups.map((group) => {
              const isActive = group.key === activeKey
              if (!group.children) {
                return <Link key={group.key} to={group.path} className={`nav-link${isActive ? ' active' : ''}`} aria-current={isActive ? 'page' : undefined}>{group.label}</Link>
              }

              const expanded = openGroup === group.key
              return (
                <div className={`nav-cluster${expanded ? ' expanded' : ''}`} key={group.key} onMouseEnter={() => setOpenGroup(group.key)} onMouseLeave={() => setOpenGroup(null)}>
                  <div className="nav-cluster-trigger">
                    <Link to={group.path} className={`nav-link${isActive ? ' active' : ''}`} aria-current={isActive ? 'page' : undefined}>{group.label}</Link>
                    <button type="button" className="nav-cluster-toggle" aria-label={`展开${group.label}菜单`} aria-expanded={expanded} onClick={() => setOpenGroup(expanded ? null : group.key)}>
                      <i className="fas fa-chevron-down" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="dropdown-menu" hidden={!expanded}>
                    {group.children.map((child) => <Link key={child.path} to={child.path} className={`dropdown-link${location.pathname === child.path ? ' active' : ''}`}>{child.label}</Link>)}
                  </div>
                </div>
              )
            })}
            <button type="button" className="mobile-search-entry" onClick={() => setSearchOpen(true)}><i className="fas fa-magnifying-glass" aria-hidden="true" />搜索全站内容</button>
          </div>

          <div className="nav-actions">
            <button type="button" className="nav-action search-trigger" onClick={() => setSearchOpen(true)} aria-label="搜索全站内容">
              <i className="fas fa-magnifying-glass" aria-hidden="true" /><span>搜索</span><kbd>⌘K</kbd>
            </button>
            <button type="button" className="nav-action icon-action" onClick={toggleTheme} aria-label={isDark ? '切换到浅色主题' : '切换到深色主题'}>
              <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true" />
            </button>
            <div className="auth-section"><AuthButton /></div>
            <button type="button" className="hamburger" aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen((open) => !open)}>
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div className="command-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false) }}>
          <section className="command-panel" role="dialog" aria-modal="true" aria-labelledby="command-title">
            <div className="command-heading">
              <div><span className="command-kicker">SEARCH</span><h2 id="command-title">搜索</h2></div>
              <button type="button" className="command-close" onClick={() => setSearchOpen(false)} aria-label="关闭搜索"><i className="fas fa-times" aria-hidden="true" /></button>
            </div>
            <label className="command-search">
              <i className="fas fa-magnifying-glass" aria-hidden="true" /><span className="sr-only">搜索页面、课程、项目或收藏</span>
              <input ref={searchInputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActiveResult(0) }} onKeyDown={handleSearchKeyDown} placeholder="搜索页面、课程、项目或收藏…" role="combobox" aria-expanded="true" aria-controls="command-results" aria-autocomplete="list" />
            </label>
            <div className="command-results" id="command-results" role="listbox" aria-label="搜索结果">
              {results.length ? results.map((item, index) => (
                <button type="button" key={`${item.path}-${item.title}`} className={`command-result${index === activeResult ? ' active' : ''}`} role="option" aria-selected={index === activeResult} onMouseEnter={() => setActiveResult(index)} onClick={() => goToResult(item)}>
                  <span className="command-result-icon"><i className="fas fa-arrow-right" aria-hidden="true" /></span>
                  <span><strong>{item.title}</strong><small>{item.path}</small></span>
                </button>
              )) : <div className="command-empty">没有找到对应内容</div>}
            </div>
            <div className="command-help"><span>↑↓ 选择</span><span>Enter 前往</span><span>Esc 关闭</span></div>
          </section>
        </div>
      )}
    </>
  )
}
