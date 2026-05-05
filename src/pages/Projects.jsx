import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'

const projects = [
  { icon: 'fas fa-robot', path: '/projects/qq-bot', name: 'LLM聊天机器人', desc: '多平台 LLM 聊天机器人项目' },
  { icon: 'fas fa-laptop-code', path: '/projects/cpp-bighw', name: 'C++ BigHW', desc: 'C++ 大作业' },
  { icon: 'fas fa-microchip', path: '/projects/fpga', name: 'FPGA 开发', desc: '基于Verliog语言' },
  { icon: 'fas fa-server', path: '/projects/gpu', name: 'GPU', desc: 'GPU 相关项目' },
]

export default function Projects() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-code-branch" /> Projects</h1>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">项目列表</h2>
          </div>
          <FadeIn as="ul" className="folder-list">
            {projects.map((p) => (
              <li className="folder-item" key={p.path}>
                <Link to={p.path}>
                  <i className={p.icon} />
                  <div className="folder-info">
                    <span className="folder-name">{p.name}</span>
                    <span className="folder-desc">{p.desc}</span>
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
