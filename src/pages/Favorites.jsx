import { use_favorites } from '../features/favorites/use_favorites'
import { defaultConfig, keyboardLayout, rowClasses } from '../features/favorites/config.js';

import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader'
import '../styles/Favorites.css'

export default function Favorites() {
  const { isEditMode, currentIndex, isTypeGame, typeTimeLeft, typeScore, typeCombo, activeHint, activeTag, showQuiz, currentQuestion, selectedAnswers, errorKey, linkableKeys, applyConfigToKey, handleKeyClick, toggleEditMode, resetConfig, startTypeGame, stopTypeGame, showQuestionModal, handleQuizSubmit, toggleAnswer, renderTypeWord, targetKey } = use_favorites()
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
              <button className={`ctrl-btn ${isEditMode ? 'warning' : 'primary'}`} onClick={toggleEditMode} type="button">
                {isEditMode ? '关闭编辑模式' : '开启编辑模式'}
              </button>
              <button className="ctrl-btn warning" onClick={resetConfig} type="button">重置键位配置</button>
              <button
                className={`ctrl-btn ${isTypeGame ? 'warning' : 'play-type-btn'}`}
                onClick={isTypeGame ? stopTypeGame : startTypeGame}
                type="button"
              >
                {isTypeGame ? <><i className="fas fa-times" /> 退出打字</> : <><i className="fas fa-keyboard" /> 小游戏：键盘打字王 </>}
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
            <p className="edit-tip">
              {isEditMode
                ? '点击字母键修改名称和链接。'
                : '开启编辑模式可修改键位。'}
            </p>

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

            <div className="keyboard-legend">
              <span className="legend-chip"><span className="legend-dot general" />键盘快捷导航</span>
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
                          <span className="k-note">-</span>
                        </div>
                      )
                    }
                    const keyConfig = applyConfigToKey(item.key)
                    const linkableIdx = linkableKeys.findIndex(k => k.key === item.key)
                    const isCurrent = linkableIdx === currentIndex
                    const isEditing = isEditMode
                    const isTarget = isTypeGame && targetKey === item.key.toLowerCase()
                    const isError = isTypeGame && errorKey === item.key.toLowerCase()

                    let className = 'key linkable'
                    if (isCurrent && !isTypeGame) className += ' current-key'
                    if (isEditing) className += ' editing'
                    if (isTarget) className += ' type-target'
                    if (isError) className += ' type-error'

                    return (
                      <Link
                        key={colIdx}
                        to={isEditMode ? '#' : (keyConfig?.href || defaultConfig[item.key]?.href)}
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
                        <span className="k-note">{keyConfig?.note || '-'}</span>
                      </Link>
                    )
                  })}
                </div>
              ))}
            </div>

            <p className="tip-line">方向键选择，回车或点击打开；字母键直接跳转。</p>
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
                <div
                  key={key}
                  className="q-option"
                  onClick={() => toggleAnswer(key)}
                >
                  <input
                    type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'}
                    name="qAnswer"
                    value={key}
                    checked={selectedAnswers.includes(key)}
                    onChange={() => toggleAnswer(key)}
                  />
                  <span>{key.toUpperCase()}. {val}</span>
                </div>
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
