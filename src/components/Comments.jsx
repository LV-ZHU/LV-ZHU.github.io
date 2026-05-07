import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/init'
import { useAuth } from './AuthProvider'

function escapeHtml(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}

function formatTime(ts) {
  let d
  if (ts && ts.toDate) d = ts.toDate()
  else if (ts) d = new Date(ts)
  else return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Comments() {
  const { user } = useAuth()
  const location = useLocation()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const pageId = location.pathname

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('page', '==', pageId),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [pageId])

  async function submit() {
    const content = text.trim()
    if (!content || !user) return
    setSending(true)
    try {
      await addDoc(collection(db, 'comments'), {
        page: pageId,
        uid: user.uid,
        displayName: user.displayName || user.email || '用户',
        photoURL: user.photoURL || '',
        content,
        createdAt: serverTimestamp(),
      })
      setText('')
    } catch (e) {
      alert('评论失败: ' + e.message)
    }
    setSending(false)
  }

  async function handleDelete(id) {
    if (!confirm('确定删除这条评论？')) return
    await deleteDoc(doc(db, 'comments', id))
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="comments-section">
      <h3 className="comment-title">评论</h3>
      {user ? (
        <div className="comment-form">
          <div className="comment-form-user">
            {user.photoURL ? (
              <img className="comment-avatar-sm" src={user.photoURL} alt="avatar" referrerPolicy="no-referrer" />
            ) : (
              <i className="fas fa-user-circle comment-avatar-icon" />
            )}
            <span>{user.displayName || user.email}</span>
          </div>
          <textarea
            id="comment-input"
            className="comment-input"
            placeholder="写点什么..."
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="comment-submit" onClick={submit} disabled={sending}>
            {sending ? '发送中...' : '发表'}
          </button>
        </div>
      ) : (
        <div className="comment-login-hint">登录后可评论</div>
      )}
      <div className="comment-list">
        {comments.length === 0 ? (
          <div className="comment-empty">暂无评论</div>
        ) : (
          comments.map((c) => (
            <div className="comment-item" key={c.id}>
              <div className="comment-item-left">
                {c.photoURL ? (
                  <img className="comment-avatar" src={c.photoURL} alt="avatar" referrerPolicy="no-referrer" />
                ) : (
                  <i className="fas fa-user-circle comment-avatar-icon" />
                )}
              </div>
              <div className="comment-item-right">
                <div className="comment-meta">
                  <span className="comment-author">{c.displayName}</span>
                  <span className="comment-time">{formatTime(c.createdAt)}</span>
                  {user && user.uid === c.uid && (
                    <button className="comment-delete" onClick={() => handleDelete(c.id)}>
                      <i className="fas fa-times" />
                    </button>
                  )}
                </div>
                <div className="comment-body">{escapeHtml(c.content)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
