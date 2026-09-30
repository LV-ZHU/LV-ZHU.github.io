import { games, anime, novels } from '../data/acgn.js'
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import '../styles/Acgn.css'

const media_sections = [
  { id: 'game', title: '游戏', items: games },
  { id: 'anime', title: '动漫', items: anime },
  { id: 'novel', title: '小说', items: novels },
]

export default function Acgn() {
  const [show_reviews, set_show_reviews] = useState(false)
  return (
    <div className={`page-wrapper acgn-view${show_reviews ? ' show-reviews' : ''}`}>
      <PageHeader title="ACGN" />
      <section className="section">
        <div className="container acgn-layout">
          <nav className="acgn-navigation" aria-label="作品分类">
            {media_sections.map(section => <a key={section.id} href={`#acgn-${section.id}`}>{section.title}</a>)}
          </nav>
          <div className="acgn-content">
            <label className="acgn-toggle">
              <input type="checkbox" checked={show_reviews} onChange={event => set_show_reviews(event.target.checked)} />
              显示短评
            </label>
            {media_sections.map(section => (
              <section className="acgn-section" key={section.id} aria-labelledby={`acgn-${section.id}`}>
                <h2 className="acgn-header" id={`acgn-${section.id}`}>{section.title}</h2>
                <ul className="media-grid">
                  {section.items.map((item, index) => (
                    <li className="media-item" key={`${item.url}-${index}`}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
                      {item.review && <div className="media-review"><div><p>{item.review}</p></div></div>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
