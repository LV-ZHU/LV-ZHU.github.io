import GitHubLink from '../components/GitHubLink'

export default function Tutoring() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-chalkboard-teacher" /> Tutoring</h1>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">教培资料，初高中原创试题合集</h2>
          </div>
          <GitHubLink
            href="https://github.com/LV-ZHU/collection-of-original-test-papers"
            title="初高中原创试题合集"
            meta="GitHub 仓库"
          />
        </div>
      </section>
    </div>
  )
}
