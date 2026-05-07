import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import '../styles/Jottings.css'

const articles = [
  { slug: 'jiqin-fenliu', title: '同济济勤巨类大一生存指北', date: '2025-7-16', tags: '学习 / 经验 / 分流' },
  { slug: 'update-log', title: '网站更新日志', date: '2026-3-17', tags: '日志' },
  { slug: 'assignment', title: '大二下安排', date: '2026-3-20', tags: '前瞻' },
  { slug: 'jotting1', title: '随笔', date: '2026-3-28', tags: '生命' },
  { slug: 'interview', title: '面试合集', date: '2026-3-30', tags: '面试 / 答辩' },
]

export default function Jottings() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-pen-fancy" /> Jottings</h1>
      </div>
      <section className="section">
        <div className="container">
          <div className="jotting-list">
            {articles.map((a) => (
              <FadeIn key={a.slug}>
                <Link to={`/jottings/${a.slug}`} className="jotting-item">
                  <div className="jotting-title">{a.title}</div>
                  <div className="jotting-meta">
                    <span><i className="far fa-calendar-alt" />{a.date}</span>
                    <span><i className="fas fa-tags" />{a.tags}</span>
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
