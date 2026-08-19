import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import '../styles/Home.css'

const sections = [
  { to: '/study', icon: 'fa-book', title: 'Study', subtitle: 'Notes' },
  { to: '/projects', icon: 'fa-code-branch', title: 'Projects', subtitle: 'Builds' },
  { to: '/jottings', icon: 'fa-pen-fancy', title: 'Jottings', subtitle: 'Logs' },
  { to: '/favorites', icon: 'fa-star', title: 'Favorites', subtitle: 'Links' },
  { to: '/acgn', icon: 'fa-layer-group', title: 'ACGN', subtitle: 'Entertainment' },
  { to: '/music', icon: 'fa-music', title: 'Music', subtitle: 'Playlist' },
  { to: '/travel', icon: 'fa-map-marked-alt', title: 'Travel', subtitle: 'Map' },
  { to: '/tutoring', icon: 'fa-chalkboard-teacher', title: 'Tutoring', subtitle: 'Original papers' },
]

const projects = [
  ['LLM 聊天机器人', '/projects/llm-bot'],
  ['C++ BigHW', '/projects/cpp-bighw'],
  ['FPGA 开发', '/projects/fpga'],
  ['GPU', '/projects/gpu'],
]

export default function Home() {
  return (
    <main className="home-main">
      <div className="home-background" aria-hidden="true">
        <div className="home-background-image" />
        <span className="home-glow glow-one" />
        <span className="home-glow glow-two" />
      </div>

      <div className="container home-content">
        <div className="home-grid home-grid-top">
          <FadeIn className="glass-card profile-card">
            <div className="profile-main">
              <div className="profile-avatar"><img src="/assets/images/avatar.jpg" alt="LV-ZHU avatar" /></div>
              <div className="profile-text">
                <p className="card-label">WELCOME</p>
                <h1 id="home-title">LV-ZHU</h1>
                <p className="profile-tagline">Learn, build, repeat.</p>
              </div>
            </div>
            <div className="profile-links" aria-label="主要页面">
              <Link to="/study"><i className="fas fa-book" aria-hidden="true" />Study</Link>
              <Link to="/projects"><i className="fas fa-code" aria-hidden="true" />Projects</Link>
              <Link to="/jottings"><i className="fas fa-pen" aria-hidden="true" />Jottings</Link>
            </div>
          </FadeIn>

          <FadeIn className="glass-card voice-card">
            <div className="voice-heading">
              <div><p className="card-label">AUDIO</p><h2>音频</h2></div>
              <span className="voice-icon"><i className="fas fa-headphones" aria-hidden="true" /></span>
            </div>
            <div className="voice-wave" aria-hidden="true">
              {Array.from({ length: 24 }, (_, index) => <i key={index} />)}
            </div>
            <audio controls preload="metadata">
              <source src="/assets/audio/voice.m4a" type="audio/mp4" />
              你的浏览器不支持音频播放。
            </audio>
            <Link to="/music" className="card-link">Music <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
          </FadeIn>
        </div>

        <div className="path-strip" aria-label="快捷路径">
          <span>/study</span><span>/projects</span><span>/favorites</span><span>/music</span><span>/tutoring</span>
        </div>

        <div className="home-grid home-grid-content">
          <FadeIn className="glass-card latest-card">
            <div className="latest-cover" aria-hidden="true"><span>J</span><i className="fas fa-pen-nib" /></div>
            <div className="latest-body">
              <p className="card-label">最近更新 · 2026-3-30</p>
              <h2>面试合集</h2>
              <p className="latest-tags">面试 / 答辩</p>
              <Link to="/jottings/interview" className="card-link">查看 <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
            </div>
          </FadeIn>

          <div className="home-stack">
            <FadeIn className="glass-card campus-card">
              <div>
                <p className="card-label">2025-7-16 · 学习 / 经验 / 分流</p>
                <h2>同济济勤巨类<br />大一生存指北</h2>
              </div>
              <Link to="/jottings/jiqin-fenliu" className="round-link" aria-label="查看同济济勤巨类大一生存指北"><i className="fas fa-arrow-right" aria-hidden="true" /></Link>
            </FadeIn>

            <div className="home-mini-grid">
              <FadeIn className="glass-card mini-card travel-card">
                <i className="fas fa-map-marked-alt" aria-hidden="true" />
                <div><p className="card-label">MAP</p><h2>Travel</h2></div>
                <Link to="/travel" aria-label="进入 Travel" />
              </FadeIn>
              <FadeIn className="glass-card mini-card favorites-card">
                <i className="fas fa-keyboard" aria-hidden="true" />
                <div><p className="card-label">LINKS</p><h2>Favorites</h2></div>
                <Link to="/favorites" aria-label="打开 Favorites" />
              </FadeIn>
            </div>
          </div>
        </div>

        <FadeIn className="glass-card project-strip">
          <div className="project-strip-heading">
            <div><p className="card-label">PROJECTS</p><h2>项目</h2></div>
            <Link to="/projects" className="card-link">全部 <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
          </div>
          <div className="project-strip-list">
            {projects.map(([name, path], index) => (
              <Link to={path} key={path}><span>0{index + 1}</span>{name}<i className="fas fa-arrow-right" aria-hidden="true" /></Link>
            ))}
          </div>
        </FadeIn>

        <section className="home-sections" aria-labelledby="sections-title">
          <div className="home-section-heading"><h2 id="sections-title">All Sections</h2></div>
          <div className="section-card-grid">
            {sections.map((section) => (
              <Link to={section.to} className="glass-card section-card" key={section.to}>
                <span className="section-icon"><i className={`fas ${section.icon}`} aria-hidden="true" /></span>
                <span><strong>{section.title}</strong><small>{section.subtitle}</small></span>
                <i className="fas fa-chevron-right" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
