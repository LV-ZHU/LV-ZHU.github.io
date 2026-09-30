import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/init'
import { useAuth } from '../components/AuthProvider'
import '../styles/Account.css'

export default function Account() {
  const { user } = useAuth()
  return <AccountForm key={user?.uid || 'signed-out'} user={user} />
}

function AccountForm({ user }) {
  const toast_timer = useRef(null)
  const mounted = useRef(false)
  const edited = useRef(false)
  const save_pending = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(toast_timer.current)
    }
  }, [])
  const [nickname, setNickname] = useState('')
  const [savedNickname, setSavedNickname] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)
  const [profile_loading, set_profile_loading] = useState(Boolean(user))
  const [profile_error, set_profile_error] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const loadNickname = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (!cancelled && snap.exists() && snap.data().nickname) {
        if (!edited.current) setNickname(snap.data().nickname)
        setSavedNickname(snap.data().nickname)
      }
    }
    loadNickname().catch(() => {
      if (!cancelled) set_profile_error('昵称读取失败，请刷新重试。')
    }).finally(() => { if (!cancelled) set_profile_loading(false) })
    return () => { cancelled = true }
  }, [user])

  async function handleSave(event) {
    event.preventDefault()
    const next_nickname = nickname.trim()
    if (!user || profile_loading || save_pending.current || next_nickname === savedNickname) return
    save_pending.current = true
    setSaving(true)
    set_profile_error('')
    setToast(false)
    try {
      await setDoc(doc(db, 'users', user.uid), { nickname: next_nickname }, { merge: true })
      if (!mounted.current) return
      setNickname(next_nickname)
      setSavedNickname(next_nickname)
      setToast(true)
      clearTimeout(toast_timer.current)
      toast_timer.current = setTimeout(() => setToast(false), 2000)
    } catch (e) {
      if (mounted.current) set_profile_error('昵称未保存，请重试。')
    } finally {
      save_pending.current = false
      if (mounted.current) setSaving(false)
    }
  }

  function getProviderIcon() {
    if (!user) return 'fas fa-user'
    const p = user.providerData?.[0]?.providerId
    if (p === 'google.com') return 'fab fa-google'
    if (p === 'github.com') return 'fab fa-github'
    return 'fas fa-user'
  }

  return (
    <div className="page-wrapper account-view">
      <div className="page-header">
        <h1>账号管理</h1>
      </div>
      <section className="section">
        <div className="container">
          {!user ? (
            <div className="account-not-logged">
              <p>请在登录后查看账号信息</p>
              <Link to="/">返回首页</Link>
            </div>
          ) : (
            <div className="account-card">
              {user.photoURL ? (
                <img className="account-avatar" src={user.photoURL} alt="avatar" referrerPolicy="no-referrer" />
              ) : (
                <i className="fas fa-user-circle account-avatar-icon" />
              )}
              <div className="account-name">{user.displayName || '用户'}</div>
              <div className="account-email">{user.email || ''}</div>
              <div className="account-provider">
                <i className={getProviderIcon()} style={{ marginRight: '0.3rem' }} />
                {user.providerData?.[0]?.providerId === 'google.com' ? 'Google' : user.providerData?.[0]?.providerId === 'github.com' ? 'GitHub' : '未知'}
              </div>

              <form className="account-section" onSubmit={handleSave}>
                <label className="account-section-title" htmlFor="account-nickname">昵称</label>
                <div className="nickname-row">
                  <input
                    className="nickname-input"
                    id="account-nickname"
                    type="text"
                    disabled={saving || profile_loading}
                    maxLength={20}
                    aria-describedby="nickname-limit"
                    value={nickname}
                    onChange={(e) => { edited.current = true; setToast(false); setNickname(e.target.value) }}
                  />
                  <button className="nickname-save" type="submit" disabled={saving || profile_loading || nickname.trim() === savedNickname}>
                    {saving ? '保存中...' : '保存'}
                  </button>
                </div>
                <div className="nickname-hint" id="nickname-limit">最多20个字符</div>
                {profile_loading && <p className="save-feedback" role="status">读取中…</p>}
                {profile_error && <p role="alert">{profile_error}</p>}
                {toast && <p className="save-feedback" role="status">已保存</p>}
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
