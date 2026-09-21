import { useParams, Link } from 'react-router-dom'

import { CppBigHW, FPGA, GPU, QQBot } from '../features/projects/ProjectArticles'
import '../styles/ProjectDetail.css'

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
