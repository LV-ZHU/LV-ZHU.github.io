import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/init'
import { useAuth } from '../components/AuthProvider'
import '../styles/Account.css'

function escapeHtml(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}

export default function Account() {
  const { user } = useAuth()
  const [nickname, setNickname] = useState('')
  const [savedNickname, setSavedNickname] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!user) return
    const loadNickname = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists() && snap.data().nickname) {
        setNickname(snap.data().nickname)
        setSavedNickname(snap.data().nickname)
      }
    }
    loadNickname()
  }, [user])

  async function handleSave() {
    if (!user || nickname === savedNickname) return
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', user.uid), { nickname }, { merge: true })
      setSavedNickname(nickname)
      setToast(true)
      setTimeout(() => setToast(false), 2000)
    } catch (e) {
      alert('保存失败: ' + e.message)
    }
    setSaving(false)
  }

  function getProviderIcon() {
    if (!user) return 'fas fa-user'
    const p = user.providerData?.[0]?.providerId
    if (p === 'google.com') return 'fab fa-google'
    if (p === 'github.com') return 'fab fa-github'
    return 'fas fa-user'
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-user-circle" /> 账号管理</h1>
      </div>
      <section className="section">
        <div className="container">
          {!user ? (
            <div className="account-not-logged">
              <p>请在登录后查看账号信息</p>
              <a href="/">返回首页</a>
            </div>
          ) : (
            <div className="account-card">
              {user.photoURL ? (
                <img className="account-avatar" src={user.photoURL} alt="avatar" referrerPolicy="no-referrer" />
              ) : (
                <i className="fas fa-user-circle account-avatar-icon" />
              )}
              <div className="account-name">{escapeHtml(user.displayName || '用户')}</div>
              <div className="account-email">{escapeHtml(user.email || '')}</div>
              <div className="account-provider">
                <i className={getProviderIcon()} style={{ marginRight: '0.3rem' }} />
                {user.providerData?.[0]?.providerId === 'google.com' ? 'Google' : user.providerData?.[0]?.providerId === 'github.com' ? 'GitHub' : '未知'}
              </div>

              <div className="account-section">
                <div className="account-section-title">昵称</div>
                <div className="nickname-row">
                  <input
                    className="nickname-input"
                    type="text"
                    placeholder="设置你的昵称..."
                    maxLength={20}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <button className="nickname-save" onClick={handleSave} disabled={saving || nickname === savedNickname}>
                    {saving ? '保存中...' : '保存'}
                  </button>
                </div>
                <div className="nickname-hint">最多20个字符</div>
              </div>
            </div>
          )}
        </div>
      </section>
      <div className={`save-toast${toast ? ' show' : ''}`}>已保存</div>
    </div>
  )
}
