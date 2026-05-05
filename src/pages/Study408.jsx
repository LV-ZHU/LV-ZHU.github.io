import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'

const subjects = [
  { icon: 'fas fa-sitemap', path: '/study/408/data-structure', name: '数据结构', desc: '线性表、树、图、排序、查找' },
  { icon: 'fas fa-memory', path: '/study/408/computer-organization', name: '计算机组成原理', desc: 'CPU、存储器、总线、I/O' },
  { icon: 'fas fa-desktop', path: '/study/408/os', name: '操作系统', desc: '进程、内存、文件、设备管理' },
  { icon: 'fas fa-network-wired', path: '/study/408/computer-network', name: '计算机网络', desc: 'TCP/IP、HTTP、DNS、路由' },
]

export default function Study408() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-microchip" /> 408 全家桶</h1>
        <p>数据结构 · 计算机组成原理· 操作系统 · 计算机网络</p>
      </div>
      <section className="section">
        <div className="container">
          <FadeIn as="ul" className="folder-list">
            {subjects.map((s) => (
              <li className="folder-item" key={s.path}>
                <Link to={s.path}>
                  <i className={s.icon} />
                  <div className="folder-info">
                    <span className="folder-name">{s.name}</span>
                    <span className="folder-desc">{s.desc}</span>
                  </div>
                </Link>
              </li>
            ))}
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
