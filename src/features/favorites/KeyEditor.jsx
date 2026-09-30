import { useState } from 'react'
import { key_label, key_target } from './links.js'

export default function KeyEditor({ selected_key, item, on_save, on_cancel }) {
  const [note, set_note] = useState(key_label(item))
  const [href, set_href] = useState(key_target(item))
  const [error, set_error] = useState('')

  function submit(event) {
    event.preventDefault()
    set_error(on_save(selected_key, note, href) || '')
  }

  return (
    <form className="key-editor" onSubmit={submit} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); on_cancel() } }} aria-labelledby="key-editor-title">
      <h3 id="key-editor-title">{selected_key} 键</h3>
      <label htmlFor="key-name">名称</label>
      <input id="key-name" value={note} maxLength={32} onChange={event => set_note(event.target.value)} autoFocus />
      <label htmlFor="key-url">链接</label>
      <input id="key-url" value={href} onChange={event => set_href(event.target.value)} placeholder="https://… 或 /study" aria-describedby="key-url-help" spellCheck={false} />
      <p id="key-url-help" className="key-editor-help">留空可停用此键。修改仅保存在此浏览器。</p>
      {error && <p className="key-editor-error" role="alert">{error}</p>}
      <div className="key-editor-actions">
        <button type="submit" className="ctrl-btn">保存</button>
        <button type="button" className="ctrl-btn" onClick={on_cancel}>取消</button>
      </div>
    </form>
  )
}
