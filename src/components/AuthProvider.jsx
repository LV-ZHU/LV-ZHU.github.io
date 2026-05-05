import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { auth } from '../firebase/init'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn(providerName) {
    const provider = providerName === 'google'
      ? new GoogleAuthProvider()
      : new GithubAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      if (e.code !== 'auth/cancelled-popup-request') {
        alert('登录失败: ' + e.message)
      }
    }
  }

  async function signOutUser() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  )
}
