import { useParams, Link } from 'react-router-dom'

import { CppBigHW, FPGA, GPU, QQBot } from '../features/projects/ProjectArticles'
import '../styles/ProjectDetail.css'
import GitHubLink from '../components/GitHubLink'
import { repository_projects } from '../features/projects/project_catalog'

/* ============================================================
   C++ BigHW
   ============================================================ */


/* ============================================================
   FPGA
   ============================================================ */


/* ============================================================
   GPU
   ============================================================ */


/* ============================================================
   QQ Bot  --  Architecture SVG connection drawing
   ============================================================ */


/* ============================================================
   QQ Bot  --  Main component
   ============================================================ */


/* ============================================================
   Project detail mapping
   ============================================================ */
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
            <Link to="/projects" className="article-back">← 返回项目列表</Link>
            <header className="project-heading">
              <h1>{repository_project.name}</h1>
            </header>
            <div className="repository-overview">
              <p>{repository_project.summary}</p>
              <h2>项目内容</h2>
              <ul>{repository_project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </div>
            <GitHubLink href={`https://github.com/LV-ZHU/${repository_project.repo}`} title={`LV-ZHU/${repository_project.repo}`} meta="项目源码与说明" />
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
            <Link to="/projects" className="article-back project-detail-detail-1" >
              <i className="fas fa-arrow-left" />返回项目列表
            </Link>
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
