import { useState } from 'react'
import TypingPractice from '../features/favorites/TypingPractice'
import { use_favorites } from '../features/favorites/use_favorites'
import { key_label, key_target } from '../features/favorites/links.js'
import KeyEditor from '../features/favorites/KeyEditor'
import { keyboardLayout, rowClasses } from '../features/favorites/config.js';

import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader'
import '../styles/Favorites.css'

export default function Favorites() {
  const [typing_mode, set_typing_mode] = useState(false)
  const { editor_key, save_key, cancel_edit, save_message, isEditMode, currentIndex, linkableKeys, applyConfigToKey, handleKeyClick, toggleEditMode, resetConfig } = use_favorites(typing_mode)

  return (
    <div className={`page-wrapper favorites-view${typing_mode ? " typing-active" : ""}`}>
      <PageHeader title="Favorites" />
      <section className="section">
        <div className="container">
          <div className="keyboard-shell">
            <div className="keyboard-head">
              <h2>快捷键盘</h2>
            </div>

            <div className="controls">
              <button className="ctrl-btn" onClick={toggleEditMode} type="button" aria-pressed={isEditMode} disabled={typing_mode}>
                {isEditMode ? '退出编辑' : '编辑键位'}
              </button>
              {isEditMode && <button className="ctrl-btn" onClick={resetConfig} type="button">恢复默认</button>}
              <button
                className={`ctrl-btn ${typing_mode ? 'warning' : 'play-type-btn'}`}
                onClick={() => { if (isEditMode) toggleEditMode(); set_typing_mode(!typing_mode) }}
                type="button"
              >
                {typing_mode ? <><i className="fas fa-times" /> 退出打字</> : <><i className="fas fa-keyboard" /> 打字练习 </>}
              </button>
            </div>
            {isEditMode && !editor_key && <p className="edit-tip">选择一个键位，修改名称和链接。</p>}
            {editor_key && <KeyEditor key={editor_key} selected_key={editor_key} item={applyConfigToKey(editor_key)} on_save={save_key} on_cancel={cancel_edit} />}
            {save_message && <p className="key-save-message" role="status">{save_message}</p>}

            {typing_mode && <TypingPractice />}

            <div className="keyboard" hidden={typing_mode}>
              {keyboardLayout.map((row, rowIdx) => (
                <div key={rowIdx} className={rowClasses[rowIdx]}>
                  {row.map((item, colIdx) => {
                    if (item.spacer) return <div key={colIdx} className="spacer" />
                    if (item.static) {
                      return (
                        <div key={colIdx} className="key">
                          <span className="k-label">{item.key}</span>
                          <span className="k-note" aria-hidden="true"></span>
                        </div>
                      )
                    }
                    const keyConfig = applyConfigToKey(item.key)
                    const linkableIdx = linkableKeys.findIndex(k => k.key === item.key)
                    const isCurrent = linkableIdx === currentIndex
                    const isEditing = isEditMode
                    const href = key_target(keyConfig)
                    const label = key_label(keyConfig)
                    const KeyElement = isEditMode || typing_mode || !href ? 'button' : Link

                    let className = 'key linkable'
                    if (isCurrent && !typing_mode) className += ' current-key'
                    if (isEditing) className += ' editing'
                    if (!href) className += ' unassigned'
                    if (editor_key === item.key) className += ' selected-edit'

                    return (
                      <KeyElement
                        key={colIdx}
                        {...(KeyElement === Link ? { to: href } : { type: 'button' })}
                        aria-label={`${item.key}${label ? ` · ${label}` : ''}${isEditMode ? '，编辑' : !href ? '，未设置' : ''}`}
                        aria-disabled={!isEditMode && !typing_mode && !href ? true : undefined}
                        tabIndex={!isEditMode && !typing_mode && !href ? -1 : undefined}
                        aria-pressed={isEditMode ? editor_key === item.key : undefined}
                        className={className}
                        data-key={item.key}
                        onClick={(e) => {
                          if (isEditMode) {
                            e.preventDefault()
                            handleKeyClick(item.key)
                          } else if (typing_mode) {
                            e.preventDefault()
                          }
                        }}
                      >
                        <span className="k-label">{item.key}</span>
                        <span className="k-note">{label || (isEditMode ? '+' : '')}</span>
                      </KeyElement>
                    )
                  })}
                </div>
              ))}
            </div>

            {!isEditMode && !typing_mode && <p className="tip-line">按字母键打开链接。</p>}
          </div>
        </div>
      </section>


    </div>
  )
}
