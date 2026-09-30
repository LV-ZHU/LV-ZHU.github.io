import { use_favorites } from '../features/favorites/use_favorites'
import { key_label, key_target } from '../features/favorites/links.js'
import KeyEditor from '../features/favorites/KeyEditor'
import { keyboardLayout, rowClasses } from '../features/favorites/config.js';

import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader'
import '../styles/Favorites.css'

export default function Favorites() {
  const { editor_key, save_key, cancel_edit, save_message, isEditMode, currentIndex, isTypeGame, typeTimeLeft, typeScore, typeCombo, activeHint, activeTag, showQuiz, currentQuestion, selectedAnswers, errorKey, linkableKeys, applyConfigToKey, handleKeyClick, toggleEditMode, resetConfig, startTypeGame, stopTypeGame, showQuestionModal, handleQuizSubmit, toggleAnswer, renderTypeWord, targetKey } = use_favorites()
  return (
    <div className={`page-wrapper favorites-view${isTypeGame ? " typing-active" : ""}`}>
      <PageHeader title="Favorites" />
      <section className="section">
        <div className="container">
          <div className="keyboard-shell">
            <div className="keyboard-head">
              <h2>快捷键盘</h2>
            </div>

            <div className="controls">
              <button className="ctrl-btn" onClick={toggleEditMode} type="button" aria-pressed={isEditMode} disabled={isTypeGame}>
                {isEditMode ? '退出编辑' : '编辑键位'}
              </button>
              {isEditMode && <button className="ctrl-btn" onClick={resetConfig} type="button">恢复默认</button>}
              <button
                className={`ctrl-btn ${isTypeGame ? 'warning' : 'play-type-btn'}`}
                onClick={isTypeGame ? stopTypeGame : startTypeGame}
                type="button"
              >
                {isTypeGame ? <><i className="fas fa-times" /> 退出打字</> : <><i className="fas fa-keyboard" /> 打字练习 </>}
              </button>
              <button
                className="ctrl-btn primary"
                onClick={showQuestionModal}
                type="button"
                data-game-only="true"
              >
                知识问答
              </button>
            </div>
            {isEditMode && !editor_key && <p className="edit-tip">选择一个键位，修改名称和链接。</p>}
            {editor_key && <KeyEditor key={editor_key} selected_key={editor_key} item={applyConfigToKey(editor_key)} on_save={save_key} on_cancel={cancel_edit} />}
            {save_message && <p className="key-save-message" role="status">{save_message}</p>}

            <div className="type-board">
              {renderTypeWord()}
              <div className="type-hint">
                {activeTag && (
                  <span className="type-category-tag">{activeTag}</span>
                )}
                <span className="favorites-detail-1" >{activeHint}</span>
              </div>
              <div className="type-stats">
                <span>⏱️ 时间: <span id="twTime">{typeTimeLeft}</span>s</span>
                <span>⭐ 分数: <span className="tw-score-val">{typeScore}</span></span>
                <span>🔥 连击: <span className="tw-combo-val">{typeCombo}</span></span>
              </div>
            </div>


            <div className="keyboard">
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
                    const KeyElement = isEditMode || isTypeGame || !href ? 'button' : Link
                    const isTarget = isTypeGame && targetKey === item.key.toLowerCase()
                    const isError = isTypeGame && errorKey === item.key.toLowerCase()

                    let className = 'key linkable'
                    if (isCurrent && !isTypeGame) className += ' current-key'
                    if (isEditing) className += ' editing'
                    if (!href) className += ' unassigned'
                    if (editor_key === item.key) className += ' selected-edit'
                    if (isTarget) className += ' type-target'
                    if (isError) className += ' type-error'

                    return (
                      <KeyElement
                        key={colIdx}
                        {...(KeyElement === Link ? { to: href } : { type: 'button' })}
                        aria-label={`${item.key}${label ? ` · ${label}` : ''}${isEditMode ? '，编辑' : !href ? '，未设置' : ''}`}
                        aria-disabled={!isEditMode && !isTypeGame && !href ? true : undefined}
                        tabIndex={!isEditMode && !isTypeGame && !href ? -1 : undefined}
                        aria-pressed={isEditMode ? editor_key === item.key : undefined}
                        className={className}
                        data-key={item.key}
                        onClick={(e) => {
                          if (isEditMode) {
                            e.preventDefault()
                            handleKeyClick(item.key)
                          } else if (isTypeGame) {
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

            {!isEditMode && !isTypeGame && <p className="tip-line">按字母键打开链接。</p>}
          </div>
        </div>
      </section>

      {/* 答题 Modal */}
      {showQuiz && currentQuestion && (
        <div className="q-modal-overlay favorites-detail-2" >
          <div className="q-modal">
            <div className="q-title">
              <span className="q-tag">{currentQuestion.tag}</span>
              [{currentQuestion.type === 'single' ? '单选' : '多选'}] {currentQuestion.title}
            </div>
            <div className="q-options">
              {Object.entries(currentQuestion.options).map(([key, val]) => (
                <label
                  key={key}
                  className="q-option"
                >
                  <input
                    type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'}
                    name="qAnswer"
                    value={key}
                    checked={selectedAnswers.includes(key)}
                    onChange={() => toggleAnswer(key)}
                  />
                  <span>{key.toUpperCase()}. {val}</span>
                </label>
              ))}
            </div>
            <div className="favorites-detail-3" >
              <button className="q-btn" onClick={handleQuizSubmit}>提交答案</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
