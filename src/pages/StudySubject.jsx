import { subjectData } from '../data/study.js';
import { Link } from 'react-router-dom'

import GitHubLink from '../components/GitHubLink'
import '../styles/Study.css'

export default function StudySubject({ subject }) {
  const data = subjectData[subject]
  if (!data) {
    return (
      <div className="page-wrapper study-view">
        <div className="page-header">
          <h1><i className="fas fa-book" /> 学科</h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="placeholder-box">
              <i className="fas fa-ghost" />
              <p>内容正在建设中</p>
              <Link to="/study" className="card-link study-subject-detail-1" >返回学习地图</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const renderContentBlock = (content) => {
    if (content.type === 'exam') {
      return (
        <div>
          <div className="text-file-panel">
            <div className="text-file-toolbar">
              <div className="text-file-title">{content.panelTitle}</div>
            </div>
            <pre className="text-file-content">{content.text}</pre>
          </div>
        </div>
      )
    }

    if (content.type === 'github') {
      return (
        <div>
          <GitHubLink
            href={content.url}
            title={content.title || content.sectionTitle}
            meta={content.meta}
          />
        </div>
      )
    }

    return null
  }

  const renderContent = () => {
    if (!data.content) {
      return (
        <div>
          <div className="placeholder-box">
            <i className="fas fa-tools" />
            <p>内容正在建设中，敬请期待</p>
          </div>
        </div>
      )
    }

    if (data.content.type === 'sections') {
      return data.content.sections.map((section) => (
        <div className="subject-content-section" key={section.sectionTitle}>
          <div className="section-header subject-section-header">
            <h2 className="section-title">{section.sectionTitle}</h2>
          </div>
          {renderContentBlock(section)}
        </div>
      ))
    }

    return (
      <>
        <div className="section-header subject-section-header">
          <h2 className="section-title">{data.content.sectionTitle}</h2>
        </div>
        {renderContentBlock(data.content)}
      </>
    )
  }

  return (
    <div className="page-wrapper study-view">
      <div className="page-header">
        <h1>{data.title}</h1>
        <p>{data.subtitle}</p>
      </div>
      <section className="section">
        <div className="container">
          {renderContent()}
        </div>
      </section>
    </div>
  )
}
