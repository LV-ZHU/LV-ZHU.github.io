import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import '../styles/Home.css'

const sections = [
  ['/study', 'Study'],
  ['/projects', 'Projects'],
  ['/jottings', 'Jottings'],
  ['/favorites', 'Favorites'],
  ['/acgn', 'ACGN'],
  ['/music', 'Music'],
  ['/travel', 'Travel'],
  ['/tutoring', 'Tutoring'],
]

export default function Home() {
  return (
    <main className="home-main">
      <div className="home-wallpaper" aria-hidden="true" />
      <div className="container home-content">
        <FadeIn className="home-profile">
          <img src="/assets/images/avatar.jpg" alt="LV-ZHU 头像" />
          <h1 id="home-title" aria-label="LV-ZHU">Lv Zhu</h1>
        </FadeIn>

        <FadeIn as="section" className="home-broadcast" aria-label="Audio player">
          <audio controls preload="metadata" src="/assets/audio/proxima-estacion.mp3" />
        </FadeIn>

        <FadeIn as="section" className="home-sections" aria-labelledby="sections-title">
          <h2 id="sections-title">Sections</h2>
          <div className="home-section-grid">
            {sections.map(([path, title]) => (
              <Link to={path} className="home-section-link" key={path}>{title}</Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </main>
  )
}
