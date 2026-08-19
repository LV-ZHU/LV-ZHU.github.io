import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  if (loading) {
    return <button type="button" className="auth-login-btn" aria-label="正在检查登录状态" disabled><i className="fas fa-circle-notch fa-spin" aria-hidden="true" /></button>
  }

  if (user) {
    return (
      <div className="auth-user">
        <Link to="/account" className="auth-user-info">
          {user.photoURL ? (
            <img className="auth-avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
          ) : (
            <i className="fas fa-user-circle auth-avatar-icon" />
          )}
          <span className="auth-name">{user.displayName || user.email}</span>
        </Link>
        <button type="button" className="auth-logout-btn" onClick={signOut} aria-label="退出登录">
          <i className="fas fa-right-from-bracket" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="auth-dropdown" ref={ref}>
      <button type="button" className="auth-login-btn" aria-haspopup="menu" aria-expanded={open} onClick={(e) => { e.stopPropagation(); setOpen(!open) }}>
        <i className="fas fa-right-to-bracket" aria-hidden="true" /><span>登录</span>
      </button>
      <div className={`auth-dropdown-menu${open ? ' active' : ''}`} role="menu" aria-hidden={!open}>
        <button type="button" role="menuitem" className="auth-provider-btn" onClick={() => { signIn('google'); setOpen(false) }}>
          <i className="fab fa-google" aria-hidden="true" /><span>Google 登录</span>
        </button>
        <button type="button" role="menuitem" className="auth-provider-btn" onClick={() => { signIn('github'); setOpen(false) }}>
          <i className="fab fa-github" aria-hidden="true" /><span>GitHub 登录</span>
        </button>
      </div>
    </div>
  )
}
