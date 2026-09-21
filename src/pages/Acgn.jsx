import { games, anime, novels } from '../data/acgn.js'
import { useState } from 'react'

import PageHeader from '../components/PageHeader'
import '../styles/Acgn.css'

export default function Acgn() {
  const [showAll, setShowAll] = useState(false)

  const handleToggle = () => {
    const next = !showAll
    setShowAll(next)
  }

  return (
    <div className={showAll ? "page-wrapper acgn-view acgn-page show-all-comments" : "page-wrapper acgn-view acgn-page"}>
      <PageHeader title="ACGN" />
      <section className="section">
        <div className="container acgn-layout">
          <nav className="acgn-navigation">
            <a href="#acgn-game">游戏</a>
            <a href="#acgn-anime">动漫</a>
            <a href="#acgn-novel">小说</a>
          </nav>
          <div className="acgn-content">
          <label className="acgn-toggle">
            <input type="checkbox" checked={showAll} onChange={handleToggle} />
            显示所有个人评价
          </label>
          <div className="acgn-section">
            <h2 className="acgn-header game" id="acgn-game">
              游戏
            </h2>
            <div className="media-grid">
              {games.map((item, index) => (
                <div key={index} className="media-item game">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <span>{item.name}</span>
                  </a>
                  {item.review && <div className="media-review">{item.review}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="acgn-section">
            <h2 className="acgn-header anime" id="acgn-anime">
              动漫
            </h2>
            <div className="media-grid">
              {anime.map((item, index) => (
                <div key={index} className="media-item anime">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <span>{item.name}</span>
                  </a>
                  {item.review && <div className="media-review">{item.review}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="acgn-section">
            <h2 className="acgn-header novel" id="acgn-novel">
              小说
            </h2>
            <div className="media-grid">
              {novels.map((item, index) => (
                <div key={index} className="media-item novel">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <span>{item.name}</span>
                  </a>
                  {item.review && <div className="media-review">{item.review}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
          </div>
      </section>
    </div>
  )
}
