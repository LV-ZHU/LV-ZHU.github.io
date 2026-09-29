import '../styles/Projects.css'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { projects } from '../features/projects/project_catalog'

export default function Projects() {
  return (
    <div className="page-wrapper projects-view">
      <PageHeader title="Projects" />
      <section className="section">
        <div className="container">
          <ul className="project-index">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link to={'/projects/' + project.slug}>{project.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
