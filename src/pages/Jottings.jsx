import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import PageHeader from '../components/PageHeader'
import '../styles/Jottings.css'

const articles = [
  { slug: 'jiqin-fenliu', title: '同济济勤巨类大一生存指北', date: '2025-7-16', tags: '学习 / 经验 / 分流' },
  { slug: 'interview', title: '面试合集', date: '2026-3-30', tags: '面试 / 答辩' },
]

export default function Jottings() {
  return (
    <div className="page-wrapper">
      <PageHeader title="Jottings" />
      <section className="section">
        <div className="container">
          <div className="jotting-list">
            {articles.map((a) => (
              <FadeIn key={a.slug}>
                <Link to={`/jottings/${a.slug}`} className="jotting-item">
                  <div className="jotting-title">{a.title}</div>
                  <div className="jotting-meta">
                    <span>{a.date}</span>
                    <span>{a.tags}</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
