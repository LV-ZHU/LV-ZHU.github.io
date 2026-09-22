import '../styles/Projects.css'
import { Link } from 'react-router-dom'

import PageHeader from '../components/PageHeader'

const projects = [
  { path: '/projects/llm-bot', name: 'LLM聊天机器人', desc: '多平台接入' },
  { path: '/projects/cpp-bighw', name: 'C++ BigHW', desc: 'C++ 大作业' },
  { path: '/projects/fpga', name: 'FPGA 开发', desc: '基于 Verilog 语言' },
  { path: '/projects/gpu', name: 'GPU' },
]

export default function Projects() {
  return (
    <div className="page-wrapper projects-view">
      <PageHeader title="Projects" />
      <section className="section">
        <div className="container">
          <ol  className="project-index">
            {projects.map((p, index) => (
              <li className="project-index-item" key={p.path}>
                <Link to={p.path}>
                  <span className="project-index-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="project-index-name">{p.name}</span>
                  {p.desc && <span className="project-index-desc">{p.desc}</span>}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
