import { Link } from 'react-router-dom'
import { navItems } from '../config/site'
import HomeTerminal from '../features/home/HomeTerminal'
import '../styles/Home.css'

export default function Home() {
  return (
    <div className="home-main">
      <div className="home-wallpaper" aria-hidden="true" />
      <div className="container home-content">
        <div className="home-profile">
          <img src="/assets/images/avatar.jpg" alt="LV-ZHU 头像" />
          <h1 id="home-title" aria-label="LV-ZHU">Lv Zhu</h1>
        </div>

        <section className="home-broadcast" aria-label="Terminal">
          <HomeTerminal />
        </section>

        <section className="home-sections" aria-labelledby="sections-title">
          <h2 id="sections-title">Sections</h2>
          <div className="home-section-grid">
            {navItems.filter(item => item.key !== 'home').map(({ path, label }) => (
              <Link to={path} className="home-section-link" key={path}><span>{label}</span><span aria-hidden="true">↗</span></Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
