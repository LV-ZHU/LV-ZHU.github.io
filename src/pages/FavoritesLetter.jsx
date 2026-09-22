import { letterData, placeholderLetters, O_PRIVATE_LINK_INSERT_INDEX } from '../data/favorites.js'
import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useAuth } from '../components/AuthProvider'
import { db } from '../firebase/init'
import PageHeader from '../components/PageHeader'
import '../styles/Favorites.css'

function normalizePrivateLink(doc) {
  const data = doc.data()
  if (typeof data.title !== 'string' || typeof data.url !== 'string') return null

  return {
    title: data.title,
    url: data.url,
    icon: typeof data.icon === 'string' && data.icon ? data.icon : 'fas fa-cloud',
    urlDisplay: typeof data.urlDisplay === 'string' && data.urlDisplay ? data.urlDisplay : data.url,
  }
}

export default function FavoritesLetter() {
  const { letter } = useParams()
  const { user } = useAuth()
  const [privateLinks, setPrivateLinks] = useState([])
  const upperLetter = letter?.toUpperCase()
  const data = letterData[upperLetter]
  const visibleLinks = useMemo(() => {
    if (!data?.links) return []
    if (upperLetter !== 'O' || !user || privateLinks.length === 0) return data.links

    return [
      ...data.links.slice(0, O_PRIVATE_LINK_INSERT_INDEX),
      ...privateLinks,
      ...data.links.slice(O_PRIVATE_LINK_INSERT_INDEX),
    ]
  }, [data, privateLinks, upperLetter, user])

  useEffect(() => {
    let cancelled = false

    if (upperLetter !== 'O' || !user) {
      setPrivateLinks([])
      return () => {
        cancelled = true
      }
    }

    async function loadPrivateLinks() {
      try {
        const privateLinksQuery = query(
          collection(db, 'privateLinks', 'favoritesO', 'items'),
          orderBy('order', 'asc')
        )
        const snapshot = await getDocs(privateLinksQuery)
        if (!cancelled) {
          setPrivateLinks(snapshot.docs.map(normalizePrivateLink).filter(Boolean))
        }
      } catch (error) {
        console.error('加载私密收藏链接失败:', error)
        if (!cancelled) setPrivateLinks([])
      }
    }

    loadPrivateLinks()

    return () => {
      cancelled = true
    }
  }, [upperLetter, user])

  if (!data && !placeholderLetters.includes(upperLetter)) {
    return (
      <div className="page-wrapper favorites-view page-direct">
        <div className="page-header">
          <h1><i className="fas fa-keyboard" /> {upperLetter}</h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="placeholder-box">
              <i className="fas fa-ghost" />
              <p>页面未找到</p>
              <Link to="/favorites" className="card-link favorites-letter-detail-1" >返回键盘</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Placeholder page
  if (!data) {
    return (
      <div className="page-wrapper favorites-view page-direct">
        <div className="page-header">
          <h1><i className="fas fa-keyboard" /> {upperLetter} 键 | 待配置</h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="placeholder-box">
              <i className="fas fa-folder-open" />
              <h3>暂未添加站点</h3>
              <p className="favorites-letter-detail-3" ><Link className="card-link" to="/favorites"><i className="fas fa-arrow-left" /> 返回 Favorites 键盘页</Link></p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-wrapper favorites-view">
      <PageHeader title={data.title} description={data.subtitle} />
      <section className="section">
        <div className="container">
          <Link to="/favorites" className="back-btn"><i className="fas fa-arrow-left" /> 返回键盘</Link>
          {data.qqGroups ? (
            <div className="link-grid">
              {data.qqGroups.map((g, i) => (
                <div key={i} className="qq-item">
                  <div className="qq-num">{g.num}</div>
                  <div className="qq-label">{g.label}</div>
                </div>
              ))}
            </div>
          ) : data.links ? (
            <div className="link-grid">
              {visibleLinks.map((link, i) => (
                <a key={i} className="lk" href={link.url} target="_blank" rel="noopener noreferrer">
                  <div className="lk-body">
                    <div className="lk-title">{link.title}</div>
                    <div className="lk-url">{link.urlDisplay}</div>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
