import { useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import '../styles/Study.css'

/* ---------- Node data ---------- */
const nodes = [
  { id: 'n-math',     text: '数学分析/高等数学',     link: '/study/math-analysis',                       is408: false, cls: 'km-n-math' },
  { id: 'n-linear',   text: '高等代数/线性代数',     link: '/study/linear-algebra',                      is408: false, cls: 'km-n-linear' },
  { id: 'n-physics',  text: '大学物理',              link: '/study/physics',                             is408: false, cls: 'km-n-physics' },
  { id: 'n-discrete', text: '离散数学',              link: '/study/discrete-math',                       is408: false, cls: 'km-n-discrete' },
  { id: 'n-circuit',  text: '电路理论',              link: '/study/circuit-theory',                      is408: false, cls: 'km-n-circuit' },
  { id: 'n-program',  text: '程序设计',              link: '/projects/cpp-bighw',                        is408: false, cls: 'km-n-program' },
  { id: 'n-crypto',   text: '密码学',                link: '/study/cryptography',                        is408: false, cls: 'km-n-crypto' },
  { id: 'n-assembly', text: '汇编语言',              link: '/study/assembly_language_programming',       is408: false, cls: 'km-n-assembly' },
  { id: 'n-ds',       text: '数据结构',              link: '/study/data-structure',                      is408: true,  cls: 'km-n-ds' },
  { id: 'n-logic',    text: '数字逻辑',              link: '/projects/fpga',                             is408: false, cls: 'km-n-logic' },
  { id: 'n-db',       text: '数据库',                link: '/study/database',                            is408: false, cls: 'km-n-db' },
  { id: 'n-co',       text: '计算机组成原理',        link: '/study/computer-organization',               is408: true,  cls: 'km-n-co' },
  { id: 'n-os',       text: '操作系统',              link: '/study/os',                                  is408: true,  cls: 'km-n-os' },
  { id: 'n-net',      text: '计算机网络',            link: '/study/computer-network',                    is408: true,  cls: 'km-n-net' },
]

/* ---------- Connections ---------- */
const connections = [
  ['n-math',    'n-physics',  'soft'],
  ['n-math',    'n-discrete', 'soft'],
  ['n-math',    'n-circuit',  'soft'],
  ['n-linear',  'n-crypto',   'soft'],
  ['n-linear',  'n-circuit',  'soft'],
  ['n-discrete','n-crypto',   'soft'],
  ['n-discrete','n-ds',       'strong'],
  ['n-program', 'n-ds',       'strong'],
  ['n-program', 'n-db',       'soft'],
  ['n-ds',      'n-db',       'strong'],
  ['n-logic',   'n-co',       'strong'],
  ['n-assembly','n-co',       'strong'],
  ['n-ds',      'n-os',       'strong'],
  ['n-co',      'n-os',       'strong'],
  ['n-co',      'n-net',      'strong'],
]

/* ---------- Component ---------- */
export default function Study() {
  const boardRef = useRef(null)
  const svgRef   = useRef(null)

  /* Draw SVG bezier curves between connected nodes */
  const drawLines = useCallback(() => {
    const svg   = svgRef.current
    const board = boardRef.current
    if (!svg || !board) return

    const ns = 'http://www.w3.org/2000/svg'
    const container = board.closest('.knowledge-map')
    if (!container) return

    const svgRect = svg.getBoundingClientRect()

    function nodeInfo(id) {
      const el = board.querySelector(`[data-node-id="${id}"]`)
      if (!el) return null
      const rect = el.getBoundingClientRect()
      return {
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top  - svgRect.top  + rect.height / 2,
        left:   rect.left - svgRect.left,
        right:  rect.left - svgRect.left + rect.width,
        top:    rect.top  - svgRect.top,
        bottom: rect.top  - svgRect.top + rect.height,
        width:  rect.width,
        height: rect.height,
      }
    }

    function anchorPoint(source, target) {
      const dx = target.x - source.x
      const dy = target.y - source.y
      const horizontalBias = Math.abs(dx) * source.height > Math.abs(dy) * source.width * 1.5

      if (horizontalBias) {
        return {
          x: dx >= 0 ? source.right : source.left,
          y: source.y,
        }
      }
      return {
        x: source.x,
        y: dy >= 0 ? source.bottom : source.top,
      }
    }

    function buildPath(a, b) {
      const lift = Math.max(20, Math.min(80, Math.abs(b.y - a.y) * 0.5))
      const cp1x = a.x
      const cp1y = a.y + (b.y >= a.y ? lift : -lift)
      const cp2x = b.x
      const cp2y = b.y - (b.y >= a.y ? lift : -lift)
      return `M ${a.x} ${a.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${b.x} ${b.y}`
    }

    /* Set SVG dimensions */
    const width  = container.scrollWidth
    const height = container.scrollHeight
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.innerHTML = ''

    connections.forEach(([fromId, toId, type]) => {
      const src = nodeInfo(fromId)
      const dst = nodeInfo(toId)
      if (!src || !dst) return

      const start = anchorPoint(src, dst)
      const end   = anchorPoint(dst, src)

      const path = document.createElementNS(ns, 'path')
      path.setAttribute('d', buildPath(start, end))
      path.setAttribute('class', type)

      svg.appendChild(path)
    })
  }, [])

  /* Debounced resize handler */
  useEffect(() => {
    let timer = null

    const handleResize = () => {
      clearTimeout(timer)
      timer = setTimeout(drawLines, 120)
    }

    /* Small delay to ensure true layout calculation (matches original) */
    const initTimer = setTimeout(drawLines, 50)

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(initTimer)
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [drawLines])

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-book" /> Study</h1>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">学习分区</h2>
          </div>

          <FadeIn>
            <div className="knowledge-map">
              {/* SVG overlay for connection lines */}
              <svg ref={svgRef} className="km-svg" />

              {/* Node grid */}
              <div className="km-board" ref={boardRef}>
                {nodes.map(({ id, text, link, is408, cls }) => (
                  <Link
                    key={id}
                    to={link}
                    data-node-id={id}
                    className={`km-node ${cls}${is408 ? ' km-node-408' : ''}`}
                  >
                    {text}
                    {is408 && <span className="km-badge">408</span>}
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
