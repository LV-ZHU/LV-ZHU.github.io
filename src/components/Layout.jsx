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
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Comments />
      <Footer />
    </AuthProvider>
  )
}
