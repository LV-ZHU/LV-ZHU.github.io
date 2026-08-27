import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Comments from './Comments'
import AuthProvider from './AuthProvider'
import RouteLoader from './RouteLoader'
import { getDocumentTitle } from '../config/site'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = getDocumentTitle(pathname)
    window.scrollTo(0, 0)
    let observer = null
    let timeout = null

    const focusHeading = () => {
      const heading = document.querySelector('.page-header h1, .home-main h1, main h1')
      if (heading) {
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
        observer?.disconnect()
        return true
      }
      return false
    }

    const frame = requestAnimationFrame(() => {
      if (focusHeading()) return

      const main = document.getElementById('main-content')
      if (!main) return

      observer = new MutationObserver(focusHeading)
      observer.observe(main, { childList: true, subtree: true })
      timeout = window.setTimeout(() => observer?.disconnect(), 3000)
    })

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      if (timeout) window.clearTimeout(timeout)
    }
  }, [pathname])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const showComments = !isHome
  return (
    <AuthProvider>
      <ScrollToTop />
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <div className={`app-shell${isHome ? ' home-shell' : ''}`}>
        <div className="ambient-backdrop" aria-hidden="true" />
        <Navbar />
        <main id="main-content" className="app-content">
          <Suspense fallback={<RouteLoader />}>
            <Outlet />
          </Suspense>
        </main>
        {showComments && <Comments />}
        {!isHome && <Footer />}
      </div>
    </AuthProvider>
  )
}
