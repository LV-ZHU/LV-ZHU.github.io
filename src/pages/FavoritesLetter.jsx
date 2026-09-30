import { letterData, placeholderLetters, O_PRIVATE_LINK_INSERT_INDEX } from '../data/favorites.js'
import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useAuth } from '../components/AuthProvider'
import { db } from '../firebase/init'
import PageHeader from '../components/PageHeader'
import '../styles/Favorites.css'

function normalize_shared_link(doc) {
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
  const [shared_links, set_shared_links] = useState([])
  const [shared_error, set_shared_error] = useState('')
  const upperLetter = letter?.toUpperCase()
  const data = letterData[upperLetter]
  const visibleLinks = useMemo(() => {
    if (!data?.links) return []
    if (upperLetter !== 'O' || !user || shared_links.length === 0) return data.links

    return [
      ...data.links.slice(0, O_PRIVATE_LINK_INSERT_INDEX),
      ...shared_links,
      ...data.links.slice(O_PRIVATE_LINK_INSERT_INDEX),
    ]
  }, [data, shared_links, upperLetter, user])

  useEffect(() => {
    let cancelled = false
    set_shared_links([])
    set_shared_error('')

    if (upperLetter !== 'O' || !user) {
      set_shared_links([])
      return () => {
        cancelled = true
      }
    }

    async function load_shared_links() {
      try {
        const shared_links_query = query(
          collection(db, 'privateLinks', 'favoritesO', 'items'),
          orderBy('order', 'asc')
        )
        const snapshot = await getDocs(shared_links_query)
        if (!cancelled) {
          set_shared_links(snapshot.docs.map(normalize_shared_link).filter(Boolean))
        }
      } catch (error) {
        console.error('加载登录用户共享链接失败:', error)
        if (!cancelled) {
          set_shared_links([])
          set_shared_error('共享链接暂时无法加载，请稍后重试。')
        }
      }
    }

    load_shared_links()

    return () => {
      cancelled = true
    }
  }, [upperLetter, user])

  if (!data && !placeholderLetters.includes(upperLetter)) {
    return (
      <div className="page-wrapper favorites-view page-direct">
        <div className="page-header">
          <h1>{upperLetter}</h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="resource-empty">
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
          <h1>{upperLetter}</h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="resource-empty">
              <p>这个键位还没有链接。</p>
              <Link to={`/favorites?edit=${upperLetter}`} className="card-link">设置 {upperLetter} 键</Link>
              <p className="favorites-letter-detail-3" ><Link className="card-link" to="/favorites">返回键盘</Link></p>
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
          {upperLetter === 'O' && shared_error && <p role="alert">{shared_error}</p>}
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
