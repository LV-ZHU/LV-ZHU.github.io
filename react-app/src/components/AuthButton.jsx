import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function AuthButton() {
  const { user, signIn, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (user) {
    return (
      <div className="auth-user">
        <Link to="/account" className="auth-user-info">
          {user.photoURL ? (
            <img className="auth-avatar" src={user.photoURL} alt="avatar" referrerPolicy="no-referrer" />
          ) : (
            <i className="fas fa-user-circle auth-avatar-icon" />
          )}
          <span className="auth-name">{user.displayName || user.email}</span>
        </Link>
        <button className="auth-logout-btn" onClick={signOut}>
          <i className="fas fa-right-from-bracket" />
        </button>
      </div>
    )
  }

  return (
    <div className="auth-dropdown" ref={ref}>
      <button className="auth-login-btn" onClick={(e) => { e.stopPropagation(); setOpen(!open) }}>
        <i className="fas fa-right-to-bracket" /><span>登录</span>
      </button>
      <div className={`auth-dropdown-menu${open ? ' active' : ''}`}>
        <button className="auth-provider-btn" onClick={() => { signIn('google'); setOpen(false) }}>
          <i className="fab fa-google" /><span>Google 登录</span>
        </button>
        <button className="auth-provider-btn" onClick={() => { signIn('github'); setOpen(false) }}>
          <i className="fab fa-github" /><span>GitHub 登录</span>
        </button>
      </div>
    </div>
  )
}
