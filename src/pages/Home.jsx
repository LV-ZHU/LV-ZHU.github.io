import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import '../styles/Home.css'

export default function Home() {
  useEffect(() => {
    document.body.classList.add('home-dark')
    return () => document.body.classList.remove('home-dark')
  }, [])
  return (
    <main className="home-main">
      <section className="hero">
        <div className="container hero-grid">
          <FadeIn className="hero-panel">
            <p className="eyebrow">System Index</p>
            <h1 className="hero-title">Learn, build, repeat.</h1>
            <p className="hero-meta">/study /projects /favorites /music /tutoring</p>
            <div className="hero-cta">
              <Link to="/favorites" className="cta-btn secondary"><i className="fas fa-keyboard" />Open Favorites</Link>
            </div>
          </FadeIn>

          <FadeIn className="hero-panel hero-panel-main">
            <div className="hero-avatar">
              <img src="/assets/images/avatar.jpg" alt="LV-ZHU avatar" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block' }} />
              <i className="fas fa-user" style={{ display: 'none' }} />
            </div>
            <div className="hero-card-title">LV-ZHU</div>
            <div className="hero-audio">
              <div className="hero-audio-label"><i className="fas fa-volume-up" /><span>音频</span></div>
              <audio controls preload="metadata">
                <source src="/assets/audio/voice.m4a" type="audio/mp4" />
                你的浏览器不支持音频播放。
              </audio>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="lux-divider" />

      <section className="nav-section">
        <div className="container">
          <div className="section-lead">
            <h2>All Sections</h2>
            <p>Full navigation map.</p>
          </div>
          <FadeIn className="nav-grid">
            <Link to="/study" className="nav-card"><i className="fas fa-book" /><h3>Study</h3><span>Notes</span></Link>
            <Link to="/projects" className="nav-card"><i className="fas fa-code-branch" /><h3>Projects</h3><span>Builds</span></Link>
            <Link to="/jottings" className="nav-card"><i className="fas fa-pen-fancy" /><h3>Jottings</h3><span>Logs</span></Link>
            <Link to="/favorites" className="nav-card"><i className="fas fa-star" /><h3>Favorites</h3><span>Links</span></Link>
            <Link to="/acgn" className="nav-card"><i className="fas fa-layer-group" /><h3>ACGN</h3><span>Entertainment</span></Link>
            <Link to="/music" className="nav-card"><i className="fas fa-music" /><h3>Music</h3><span>Playlist</span></Link>
            <Link to="/travel" className="nav-card"><i className="fas fa-map-marked-alt" /><h3>Travel</h3><span>Map</span></Link>
            <Link to="/tutoring" className="nav-card"><i className="fas fa-chalkboard-teacher" /><h3>Tutoring</h3><span>Original papers</span></Link>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
