import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/init'
import { public_name } from '../features/auth/public_name'
import { useAuth } from './AuthProvider'

function formatTime(ts) {
  let d
  if (ts && ts.toDate) d = ts.toDate()
  else if (ts) d = new Date(ts)
  else return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Comments() {
  const { user, display_name } = useAuth()
  const location = useLocation()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, set_loading] = useState(true)
  const [read_error, set_read_error] = useState('')
  const [action_error, set_action_error] = useState('')
  const [deleting_id, set_deleting_id] = useState(null)
  const sending_ref = useRef(false)
  const deleting_ref = useRef(false)
  const mounted_ref = useRef(false)

  useEffect(() => {
    mounted_ref.current = true
    return () => { mounted_ref.current = false }
  }, [])
  const pageId = location.pathname

  useEffect(() => {
    let active = true
    set_loading(true)
    set_read_error('')
    const q = query(
      collection(db, 'comments'),
      where('page', '==', pageId),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      if (!active) return
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      set_loading(false)
      set_read_error('')
    }, () => {
      if (!active) return
      setComments([])
      set_loading(false)
      set_read_error('评论加载失败，请刷新重试。')
    })
    return () => { active = false; unsub() }
  }, [pageId])

  async function submit() {
    const content = text.trim()
    if (!content || !user || sending_ref.current) return
    sending_ref.current = true
    setSending(true)
    set_action_error('')
    try {
      await addDoc(collection(db, 'comments'), {
        page: pageId,
        uid: user.uid,
        displayName: display_name,
        photoURL: user.photoURL || '',
        content,
        createdAt: serverTimestamp(),
      })
      if (mounted_ref.current) setText('')
    } catch {
      if (mounted_ref.current) set_action_error('评论未发送，内容已保留，请重试。')
    } finally {
      sending_ref.current = false
      if (mounted_ref.current) setSending(false)
    }
  }

  async function handleDelete(id) {
    if (deleting_ref.current || !user || !comments.some((comment) => comment.id === id && comment.uid === user.uid)) return
    if (!confirm('确定删除这条评论？')) return
    deleting_ref.current = true
    set_deleting_id(id)
    set_action_error('')
    try {
      await deleteDoc(doc(db, 'comments', id))
    } catch {
      if (mounted_ref.current) set_action_error('删除失败，请重试。')
    } finally {
      deleting_ref.current = false
      if (mounted_ref.current) set_deleting_id(null)
    }
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
            <span>{display_name}</span>
          </div>
          <textarea
            id="comment-input"
            className="comment-input"
            placeholder="写点什么..."
            rows="3"
            aria-label="评论内容"
            disabled={sending}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className="comment-submit" onClick={submit} disabled={sending || !text.trim()}>
            {sending ? '发送中...' : '发表'}
          </button>
        </div>
      ) : (
        <div className="comment-login-hint">登录后可评论</div>
      )}
      {action_error && <p role="alert">{action_error}</p>}
      <div className="comment-list" aria-busy={loading}>
        {loading ? (
          <div className="comment-empty" role="status">加载中…</div>
        ) : read_error ? (
          <div className="comment-empty" role="alert">{read_error}</div>
        ) : comments.length === 0 ? (
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
                  <span className="comment-author">{public_name(c)}</span>
                  <span className="comment-time">{formatTime(c.createdAt)}</span>
                  {user && user.uid === c.uid && (
                    <button type="button" className="comment-delete" aria-label="删除评论" disabled={deleting_id !== null} onClick={() => handleDelete(c.id)}>
                      <i className="fas fa-times" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="comment-body">{c.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
