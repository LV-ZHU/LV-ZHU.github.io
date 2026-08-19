import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Comments from './Comments'
import AuthProvider from './AuthProvider'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const focusHeading = () => {
      const heading = document.querySelector('.page-header h1, .home-main h1, main h1')
      if (heading) {
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      }
    }
    const frame = requestAnimationFrame(() => requestAnimationFrame(focusHeading))
    return () => cancelAnimationFrame(frame)
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <div className="app-shell">
        <div className="ambient-backdrop" aria-hidden="true" />
        <Navbar />
        <div id="main-content" className="app-content">
          <Outlet />
        </div>
        <Comments />
        <Footer />
      </div>
    </AuthProvider>
  )
}
