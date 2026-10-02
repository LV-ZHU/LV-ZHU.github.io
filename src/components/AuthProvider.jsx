import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, db } from '../firebase/init'
import { doc, onSnapshot } from 'firebase/firestore'
import { create_provider, login_error } from '../features/auth/providers'
import { public_name } from '../features/auth/public_name'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [signing_in, set_signing_in] = useState(false)
  const signing_ref = useRef(false)
  const [profile, set_profile] = useState(null)
  const nickname = profile?.uid === user?.uid ? profile?.nickname || '' : ''
  const display_name = public_name(user, nickname)

  useEffect(() => {
    set_profile(null)
    if (!user) return
    return onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      set_profile({ uid: user.uid, nickname: snapshot.data()?.nickname || '' })
    }, () => set_profile(null))
  }, [user])

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

  async function signIn(provider_id = 'google') {
    if (signing_ref.current) return
    setError('')
    if (window.location.hostname === '127.0.0.1') {
      setError('当前本地地址未获 Firebase 授权，请使用 localhost 打开网站后登录。')
      return
    }
    signing_ref.current = true
    set_signing_in(true)
    try {
      const provider = create_provider(provider_id)
      await signInWithPopup(auth, provider)
    } catch (e) {
      if (!['auth/cancelled-popup-request', 'auth/popup-closed-by-user'].includes(e.code)) {
        setError(login_error(e.code))
      }
    } finally {
      signing_ref.current = false
      set_signing_in(false)
    }
  }

  async function signOutUser() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, nickname, display_name, loading, signing_in, error, signIn, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  )
}
