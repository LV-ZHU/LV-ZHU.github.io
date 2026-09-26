import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase/init'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
      setError('')
    }, (error) => {
      console.error('Firebase auth state:', error)
      setLoading(false)
      setError('无法读取登录状态，请刷新后重试。')
    })
    return unsub
  }, [])

  async function signIn() {
    setError('')
    if (window.location.hostname === '127.0.0.1') {
      setError('当前本地地址未获 Firebase 授权，请使用 localhost 打开网站后登录。')
      return
    }
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      if (!['auth/cancelled-popup-request', 'auth/popup-closed-by-user'].includes(e.code)) {
        const messages = {
          'auth/unauthorized-domain': '当前域名未获 Firebase 授权，无法登录。',
          'auth/popup-blocked': '登录窗口被浏览器拦截，请允许本站弹出窗口后重试。',
          'auth/network-request-failed': '无法连接登录服务，请检查网络后重试。',
        }
        setError(messages[e.code] || '登录失败: ' + e.message)
      }
    }
  }

  async function signOutUser() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  )
}
