import { useParams } from 'react-router-dom'

import { CppBigHW, FPGA, GPU, QQBot } from '../features/projects/ProjectArticles'
import '../styles/ProjectDetail.css'
import GitHubLink from '../components/GitHubLink'
import { repository_projects } from '../features/projects/project_catalog'

const projectComponents = {
  'cpp-bighw': CppBigHW,
  'fpga': FPGA,
  'gpu': GPU,
  'llm-bot': QQBot,
  'qq-bot': QQBot,
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const ProjectComponent = projectComponents[slug]
  const repository_project = repository_projects.find((project) => project.slug === slug)
  if (repository_project) {
    return (
      <div className="page-wrapper project-detail-view page-direct">
        <section className="section">
          <div className="container">
            <header className="project-heading">
              <h1>{repository_project.name}</h1>
            </header>
            <div className="section-header">
              <h2 className="section-title">{repository_project.subject}</h2>
              <p className="section-desc">{repository_project.summary}</p>
            </div>
            <GitHubLink href={`https://github.com/LV-ZHU/${repository_project.repo}`} title={`LV-ZHU/${repository_project.repo}`} meta="代码仓库" />
          </div>
        </section>
      </div>
    )
  }
  if (!ProjectComponent) {
    return (
      <div className="page-wrapper project-detail-view page-direct">
        <section className="section">
          <div className="container">
            <div className="empty-state"><p>项目未找到</p></div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-wrapper project-detail-view page-direct">
      <ProjectComponent />
    </div>
  )
}
