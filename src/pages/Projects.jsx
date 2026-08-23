import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'

const projects = [
  { path: '/projects/llm-bot', name: 'LLM聊天机器人', desc: '多平台 LLM 聊天机器人项目' },
  { path: '/projects/cpp-bighw', name: 'C++ BigHW', desc: 'C++ 大作业' },
  { path: '/projects/fpga', name: 'FPGA 开发', desc: '基于Verliog语言' },
  { path: '/projects/gpu', name: 'GPU', desc: 'GPU 相关项目' },
]

export default function Projects() {
  return (
    <div className="page-wrapper page-direct">
      <section className="section">
        <div className="container">
          <FadeIn as="ol" className="project-index">
            {projects.map((p, index) => (
              <li className="project-index-item" key={p.path}>
                <Link to={p.path}>
                  <span className="project-index-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="project-index-name">{p.name}</span>
                  <span className="project-index-desc">{p.desc}</span>
                </Link>
              </li>
            ))}
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
