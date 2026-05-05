import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthButton from './AuthButton'

const studySections = [
  { label: '数据结构', path: '/study/data-structure', keywords: '数据结构 data structure 408' },
  { label: '计组', path: '/study/computer-organization', keywords: '计组 CPU 408' },
  { label: '操作系统', path: '/study/os', keywords: '操作系统 os 408' },
  { label: '计网', path: '/study/computer-network', keywords: '计网 网络 408' },
  { label: '数分高数', path: '/study/math-analysis', keywords: '数分 高数 微积分 数学分析 极限 导数' },
  { label: '高代线代', path: '/study/linear-algebra', keywords: '高代 线代 线性代数 矩阵 行列式' },
  { label: '离散数学', path: '/study/discrete-math', keywords: '离散数学 discrete math' },
  { label: '大学物理', path: '/study/physics', keywords: '大学物理 物理 电磁学 光学 量子力学' },
  { label: '电路理论', path: '/study/circuit-theory', keywords: '电路理论 电路' },
  { label: '汇编语言', path: '/study/assembly_language_programming', keywords: '汇编 汇编语言 8086 指令 x86' },
  { label: '数据库', path: '/study/database', keywords: '数据库 database sql oceanbase' },
  { label: '密码学', path: '/study/cryptography', keywords: '密码学 cryptography 信安 信息安全' },
]

const navItems = [
  { key: 'home', label: 'Home', path: '/' },
  {
    key: 'study', label: 'Study', path: '/study',
    children: studySections.map((s) => ({ label: s.label, path: s.path })),
  },
  {
    key: 'projects', label: 'Projects', path: '/projects',
    children: [
      { label: 'C++ BigHW', path: '/projects/cpp-bighw' },
      { label: 'FPGA', path: '/projects/fpga' },
      { label: 'GPU', path: '/projects/gpu' },
      { label: 'LLM聊天机器人', path: '/projects/qq-bot' },
    ],
  },
  { key: 'jottings', label: 'Jottings', path: '/jottings' },
  { key: 'favorites', label: 'Favorites', path: '/favorites' },
  { key: 'acgn', label: 'ACGN', path: '/acgn' },
  { key: 'music', label: 'Music', path: '/music' },
  { key: 'travel', label: 'Travel', path: '/travel' },
  { key: 'tutoring', label: 'Tutoring', path: '/tutoring' },
]

const searchIndex = [
  { title: 'Home', path: '/', keywords: '主页 首页 home' },
  { title: 'Study', path: '/study', keywords: '学习 study 课程 408' },
  ...studySections.map((s) => ({ title: 'Study / ' + s.label, path: s.path, keywords: s.keywords })),
  { title: 'Projects', path: '/projects', keywords: '项目 projects' },
  { title: 'Projects / C++ BigHW', path: '/projects/cpp-bighw', keywords: 'cpp c++ bighw 程序设计 程设 高程 oop 沈坚 sj' },
  { title: 'Projects / FPGA', path: '/projects/fpga', keywords: 'fpga 数字逻辑 verilog oled mp3 zdd mips246' },
  { title: 'Projects / GPU', path: '/projects/gpu', keywords: 'gpu 并行 gunrock 图' },
  { title: 'Projects / LLM聊天机器人', path: '/projects/qq-bot', keywords: 'llm 聊天机器人 chatbot astrbot 多平台' },
  { title: 'Music', path: '/music', keywords: '音乐 music 歌单 eason jj' },
  { title: 'Favorites', path: '/favorites', keywords: '收藏 favorites 网址' },
  { title: 'Favorites', path: '/favorites/T', keywords: 't 同济' },
  { title: 'Jottings', path: '/jottings', keywords: '随笔 jottings' },
  { title: 'Jottings', path: '/jottings/jiqin-fenliu', keywords: '济勤 分流' },
  { title: 'ACGN', path: '/acgn', keywords: '二次元 动画 游戏 小说 acgn animation game novel 植物大战僵尸 wanna 洲 舟 农 瓦 崩 原 go 铁 绝 劫 铲 穿 斗 鸣 尘 柚 ow 杀 邦 轨 mc 谷 ut 空 茶 蔚 脑 死 以 塞' },
  { title: 'Travel', path: '/travel', keywords: '旅行 旅游 travel 开元心 行夫 世界' },
  { title: 'Tutoring', path: '/tutoring', keywords: '家教 tutoring' },
  { title: 'Account', path: '/account', keywords: '账号 account 个人 昵称 profile 设置' },
].map((item) => ({
  ...item,
  searchable: (item.title + ' ' + item.keywords).toLowerCase(),
}))

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const searchRef = useRef(null)

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
  }, [location.pathname])

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([])
      }
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

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <Link to="/"><i className="fas fa-meteor" /><span>Lv Zhu</span></Link>
        </div>
        <ul className={`nav-menu${menuOpen ? ' active' : ''}`}>
          {navItems.map((item) => {
            const cls = item.key === activeKey ? 'nav-link active' : 'nav-link'
            if (!item.children) {
              return (
                <li className="nav-item" key={item.key}>
                  <Link to={item.path} className={cls}>{item.label}</Link>
                </li>
              )
            }
            return (
              <li className="nav-item nav-dropdown" key={item.key}>
                <Link to={item.path} className={cls}>
                  {item.label} <i className="fas fa-chevron-down nav-caret" />
                </Link>
                <div className="dropdown-menu">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`dropdown-link${location.pathname === child.path ? ' active' : ''}`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
        <div className="nav-search" id="nav-search" ref={searchRef}>
          <i className="fas fa-magnifying-glass nav-search-icon" aria-hidden="true" />
          <input
            id="nav-search-input"
            className="nav-search-input"
            type="search"
            placeholder="搜索页面..."
            autoComplete="off"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleSearchKey}
          />
          <div id="nav-search-results" className={`nav-search-results${results.length ? ' active' : ''}`} role="listbox" aria-label="站点搜索结果">
            {results.map((r) => (
              <Link key={r.path + r.title} className="nav-search-result" to={r.path}>{r.title}</Link>
            ))}
          </div>
        </div>
        <div id="auth-section" className="auth-section">
          <AuthButton />
        </div>
        <div className="hamburger" id="hamburger" onClick={toggleMenu}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
        </div>
      </div>
    </nav>
  )
}
