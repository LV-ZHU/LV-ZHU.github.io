import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { typeDict, questionBank } from '../data/typeDict'
import '../styles/Favorites.css'

const STORAGE_KEY = 'lv-zhu-favorites-keymap'
const defaultConfig = {
  1: { note: '-', href: '/favorites/1' },
  2: { note: '-', href: '/favorites/2' },
  3: { note: '-', href: '/favorites/3' },
  4: { note: '-', href: '/favorites/4' },
  5: { note: '-', href: '/favorites/5' },
  6: { note: '-', href: '/favorites/6' },
  7: { note: '-', href: '/favorites/7' },
  8: { note: '-', href: '/favorites/8' },
  9: { note: '-', href: '/favorites/9' },
  0: { note: '-', href: '/favorites/0' },
  Q: { note: 'QQ群号', href: '/favorites/Q' },
  W: { note: '-', href: '/favorites/W' },
  E: { note: '-', href: '/favorites/E' },
  R: { note: '-', href: '/favorites/R' },
  T: { note: '同济网站', href: '/favorites/T' },
  Y: { note: '-', href: '/favorites/Y' },
  U: { note: '实用工具', href: '/favorites/U' },
  I: { note: '-', href: '/favorites/I' },
  O: { note: '其他网站', href: '/favorites/O' },
  P: { note: '项目资源', href: '/favorites/P' },
  A: { note: '代码练习', href: '/favorites/A' },
  S: { note: '学习资源', href: '/favorites/S' },
  D: { note: '-', href: '/favorites/D' },
  F: { note: '-', href: '/favorites/F' },
  G: { note: '游戏网站', href: '/favorites/G' },
  H: { note: '-', href: '/favorites/H' },
  J: { note: '-', href: '/favorites/J' },
  K: { note: '-', href: '/favorites/K' },
  L: { note: '-', href: '/favorites/L' },
  Z: { note: '-', href: '/favorites/Z' },
  X: { note: '-', href: '/favorites/X' },
  C: { note: 'CSDN 系列', href: '/favorites/C' },
  V: { note: '-', href: '/favorites/V' },
  B: { note: '学长博客', href: '/favorites/B' },
  N: { note: '-', href: '/favorites/N' },
  M: { note: '-', href: '/favorites/M' },
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultConfig }
    return { ...defaultConfig, ...JSON.parse(raw) }
  } catch {
    return { ...defaultConfig }
  }
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

const keyboardLayout = [
  [
    { key: 'Q' }, { key: 'W' }, { key: 'E' }, { key: 'R' }, { key: 'T' },
    { key: 'Y' }, { key: 'U' }, { key: 'I' }, { key: 'O' }, { key: 'P' },
  ],
  [
    { key: null, spacer: true }, { key: 'A' }, { key: 'S' }, { key: 'D' }, { key: 'F' },
    { key: 'G' }, { key: 'H' }, { key: 'J' }, { key: 'K' }, { key: 'L' },
    { key: ';', static: true }, { key: null, spacer: true },
  ],
  [
    { key: null, spacer: true }, { key: 'Z' }, { key: 'X' }, { key: 'C' }, { key: 'V' },
    { key: 'B' }, { key: 'N' }, { key: 'M' }, { key: ',', static: true }, { key: '.', static: true },
  ],
  [
    { key: null, spacer: true }, { key: null, spacer: true }, { key: null, spacer: true },
    { key: null, spacer: true }, { key: null, spacer: true }, { key: null, spacer: true },
    { key: '↑', static: true }, { key: null, spacer: true }, { key: null, spacer: true }, { key: null, spacer: true },
  ],
  [
    { key: null, spacer: true }, { key: null, spacer: true }, { key: null, spacer: true },
    { key: null, spacer: true }, { key: null, spacer: true },
    { key: '←', static: true }, { key: '↓', static: true }, { key: '→', static: true },
    { key: null, spacer: true }, { key: null, spacer: true },
  ],
]

const rowClasses = ['key-row', 'key-row row-mid', 'key-row row-bottom', 'key-row row-arrows', 'key-row row-arrows']

export default function Favorites() {
  const navigate = useNavigate()
  const [config, setConfig] = useState(loadConfig)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTypeGame, setIsTypeGame] = useState(false)
  const [typeTimeLeft, setTypeTimeLeft] = useState(60)
  const [typeScore, setTypeScore] = useState(0)
  const [typeCombo, setTypeCombo] = useState(0)
  const [activeWord, setActiveWord] = useState('')
  const [activeHint, setActiveHint] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [typeIndex, setTypeIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [errorKey, setErrorKey] = useState(null)

  const typeTimerRef = useRef(null)
  const errorTimerRef = useRef(null)
  const keysRef = useRef([])

  const linkableKeys = keyboardLayout.flat().filter(k => k.key && !k.static && !k.spacer)
  const hotkeys = {}
  linkableKeys.forEach(k => {
    const item = config[k.key] || defaultConfig[k.key]
    hotkeys[k.key.toLowerCase()] = item?.href || defaultConfig[k.key]?.href
  })

  const applyConfigToKey = (key) => {
    const item = config[key] || defaultConfig[key]
    return item || defaultConfig[key]
  }

  const setCurrent = useCallback((idx) => {
    const len = linkableKeys.length
    setCurrentIndex(((idx % len) + len) % len)
  }, [linkableKeys.length])

  function normalizeHref(input, fallback) {
    const val = (input || '').trim()
    if (!val) return fallback
    return val
  }

  function handleKeyClick(key) {
    if (!isEditMode) return
    const current = config[key] || defaultConfig[key]
    const note = window.prompt('输入 ' + key + ' 键显示标题：', current?.note || '-')
    if (note === null) return
    const href = window.prompt('输入 ' + key + ' 键跳转地址：', current?.href || defaultConfig[key]?.href)
    if (href === null) return
    const newConfig = {
      ...config,
      [key]: {
        note: note.trim() || '-',
        href: normalizeHref(href, defaultConfig[key]?.href),
      },
    }
    setConfig(newConfig)
    saveConfig(newConfig)
  }

  function toggleEditMode() {
    if (isTypeGame) return
    setIsEditMode(prev => !prev)
  }

  function resetConfig() {
    if (!window.confirm('确认重置所有键位配置为默认值吗？')) return
    localStorage.removeItem(STORAGE_KEY)
    setConfig({ ...defaultConfig })
    setCurrentIndex(0)
  }

  // Type game logic
  function nextTypeWord() {
    const item = typeDict[Math.floor(Math.random() * typeDict.length)]
    setActiveWord(item.w)
    setActiveHint(item.h)
    setActiveTag(item.tag || '')
    let idx = 0
    while (idx < item.w.length && item.w[idx] === ' ') idx++
    setTypeIndex(idx)
  }

  function startTypeGame() {
    if (isEditMode) setIsEditMode(false)
    setIsTypeGame(true)
    setTypeTimeLeft(60)
    setTypeScore(0)
    setTypeCombo(0)
    nextTypeWord()
    clearInterval(typeTimerRef.current)
    typeTimerRef.current = setInterval(() => {
      setTypeTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(typeTimerRef.current)
          showQuestionModal()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function stopTypeGame() {
    setIsTypeGame(false)
    clearInterval(typeTimerRef.current)
    setCurrentIndex(0)
  }

  function showQuestionModal() {
    if (!questionBank || !questionBank.length) {
      alert('时间到！\n\n  你的最终得分是：' + typeScore + ' 分')
      stopTypeGame()
      return
    }
    const q = questionBank[Math.floor(Math.random() * questionBank.length)]
    setCurrentQuestion(q)
    setSelectedAnswers([])
    setShowQuiz(true)
  }

  function handleQuizSubmit() {
    if (!currentQuestion) return
    if (selectedAnswers.length === 0) {
      alert('请选择答案！')
      return
    }
    const userAns = [...selectedAnswers].sort()
    const correctAns = [...currentQuestion.answer].sort()
    const isCorrect = JSON.stringify(userAns) === JSON.stringify(correctAns)

    if (isCorrect) {
      alert('🎉 回答正确！恢复到 60 秒时间，继续游戏！\n\n解析：' + currentQuestion.analysis)
      setShowQuiz(false)
      setTypeTimeLeft(60)
      if (isTypeGame) {
        clearInterval(typeTimerRef.current)
        typeTimerRef.current = setInterval(() => {
          setTypeTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(typeTimerRef.current)
              showQuestionModal()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } else {
      if (typeTimeLeft <= 0) {
        alert(`❌ 回答错误！游戏结束。\n\n正确答案：${correctAns.join(', ').toUpperCase()}\n你的答案：${userAns.join(', ').toUpperCase()}\n\n解析：${currentQuestion.analysis}\n   \n  最终得分：${typeScore}`)
        setShowQuiz(false)
        stopTypeGame()
      } else {
        alert(`回答错误！时间扣除 15 秒\n\n正确答案：${correctAns.join(', ').toUpperCase()}\n你的答案：${userAns.join(', ').toUpperCase()}\n\n解析：${currentQuestion.analysis}\n`)
        setShowQuiz(false)
        setTypeTimeLeft(prev => Math.max(0, prev - 15))
      }
    }
  }

  function toggleAnswer(ans) {
    if (!currentQuestion) return
    if (currentQuestion.type === 'single') {
      setSelectedAnswers([ans])
    } else {
      setSelectedAnswers(prev =>
        prev.includes(ans) ? prev.filter(a => a !== ans) : [...prev, ans]
      )
    }
  }

  // Render type word
  function renderTypeWord() {
    if (!activeWord) return null
    const chars = activeWord.split('').map((char, i) => {
      if (char === ' ') return <span key={i} className="space">&nbsp;</span>
      if (i < typeIndex) return <span key={i} className="tw-done">{char}</span>
      return <span key={i} className="tw-todo">{char}</span>
    })
    return <div className="type-word">{chars}</div>
  }

  // Get target key for type game highlight
  function getTargetKey() {
    if (!isTypeGame || typeIndex >= activeWord.length) return null
    return activeWord[typeIndex]?.toLowerCase()
  }

  const targetKey = getTargetKey()

  // Keyboard event handler
  useEffect(() => {
    function handleKeyDown(event) {
      const tag = (event.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea') return

      if (isTypeGame) {
        if (showQuiz) return
        event.preventDefault()
        if (event.key === 'Escape') {
          stopTypeGame()
          return
        }
        if (event.key.length !== 1 || !/[a-zA-Z0-9]/.test(event.key)) return

        const typedChar = event.key.toLowerCase()
        const expectedChar = activeWord[typeIndex]?.toLowerCase()

        if (typedChar === expectedChar) {
          let newTypeIndex = typeIndex + 1
          while (newTypeIndex < activeWord.length && activeWord[newTypeIndex] === ' ') newTypeIndex++
          const newCombo = typeCombo + 1
          const addScore = 10 + (Math.floor(typeCombo / 5) * 5)
          setTypeCombo(newCombo)
          setTypeScore(prev => prev + addScore)

          if (newTypeIndex >= activeWord.length) {
            setTypeScore(prev => prev + 50)
            setTypeIndex(newTypeIndex)
            nextTypeWord()
          } else {
            setTypeIndex(newTypeIndex)
          }
        } else {
          setTypeCombo(0)
          // Flash error on target key
          setErrorKey(expectedChar)
          clearTimeout(errorTimerRef.current)
          errorTimerRef.current = setTimeout(() => setErrorKey(null), 300)
        }
        return
      }

      const lower = event.key.toLowerCase()
      if (hotkeys[lower] && !isEditMode) {
        navigate(hotkeys[lower])
        return
      }

      if (!linkableKeys.length) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setCurrent(currentIndex + 1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setCurrent(currentIndex - 1)
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        // Build row map from linkableKeys order
        const currentKey = linkableKeys[currentIndex]?.key
        if (!currentKey) return
        // Find which row the current key is in
        let currentRowIdx = -1
        let currentColInRow = -1
        for (let r = 0; r < keyboardLayout.length; r++) {
          const linkable = keyboardLayout[r].filter(k => k.key && !k.static && !k.spacer)
          const idx = linkable.findIndex(k => k.key === currentKey)
          if (idx !== -1) {
            currentRowIdx = r
            currentColInRow = idx
            break
          }
        }
        if (currentRowIdx === -1) return
        const direction = event.key === 'ArrowUp' ? -1 : 1
        let targetRowIdx = currentRowIdx + direction
        // Skip rows with no linkable keys
        while (targetRowIdx >= 0 && targetRowIdx < keyboardLayout.length) {
          const rowLinkable = keyboardLayout[targetRowIdx].filter(k => k.key && !k.static && !k.spacer)
          if (rowLinkable.length > 0) break
          targetRowIdx += direction
        }
        if (targetRowIdx < 0 || targetRowIdx >= keyboardLayout.length) return
        const targetRowLinkable = keyboardLayout[targetRowIdx].filter(k => k.key && !k.static && !k.spacer)
        const targetCol = Math.min(currentColInRow, targetRowLinkable.length - 1)
        const targetKey = targetRowLinkable[targetCol]?.key
        const targetIdx = linkableKeys.findIndex(k => k.key === targetKey)
        if (targetIdx !== -1) setCurrent(targetIdx)
      } else if (event.key === 'Enter' && !isEditMode) {
        event.preventDefault()
        const keyItem = linkableKeys[currentIndex]
        if (keyItem) navigate(hotkeys[keyItem.key.toLowerCase()])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isTypeGame, showQuiz, isEditMode, currentIndex, activeWord, typeIndex, typeCombo, hotkeys, navigate, linkableKeys, setCurrent, errorKey])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearInterval(typeTimerRef.current)
      clearTimeout(errorTimerRef.current)
    }
  }, [])

  // Click blocker during type game
  useEffect(() => {
    function handleClick(e) {
      if (isTypeGame && e.target.closest('.key.linkable')) {
        e.preventDefault()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isTypeGame])

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-keyboard" /> Favorites</h1>
        <p>键盘上按下字母键即可进入对应收藏分区</p>
      </div>

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
                style={{ display: isTypeGame ? 'inline-flex' : 'none' }}
              >
                知识问答
              </button>
            </div>
            <p className="edit-tip" style={{ display: isTypeGame ? 'none' : 'block' }}>
              {isEditMode
                ? '编辑模式已开启：点击任意字母键，依次输入新标题与新地址（可自行选择填写任意站内相对路径或完整网址）。'
                : '编辑模式关闭。开启后可点击任意字母键自定义标题和跳转地址。'}
            </p>

            <div className="type-board" style={{ display: isTypeGame ? 'block' : 'none' }}>
              {renderTypeWord()}
              <div className="type-hint">
                {activeTag && (
                  <span style={{
                    background: 'var(--primary)', color: 'white', padding: '0.15rem 0.5rem',
                    borderRadius: 999, fontSize: '0.75rem', marginRight: '0.6rem',
                    verticalAlign: 'middle', boxShadow: 'var(--shadow-sm)',
                  }}>{activeTag}</span>
                )}
                <span style={{ verticalAlign: 'middle' }}>{activeHint}</span>
              </div>
              <div className="type-stats">
                <span>⏱️ 时间: <span id="twTime">{typeTimeLeft}</span>s</span>
                <span>⭐ 分数: <span className="tw-score-val">{typeScore}</span></span>
                <span>🔥 连击: <span className="tw-combo-val">{typeCombo}</span></span>
              </div>
            </div>

            <div className="keyboard-legend" style={{ display: isTypeGame ? 'none' : 'flex' }}>
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

            <p className="tip-line">提示：非游戏模式下按回车键/点击鼠标可直接进入当前选择模块；按字母键跳转到对应字母；按方向键可切换当前选择模块。</p>
          </div>
        </div>
      </section>

      {/* 答题 Modal */}
      {showQuiz && currentQuestion && (
        <div className="q-modal-overlay" style={{ display: 'flex' }}>
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
            <div style={{ textAlign: 'right' }}>
              <button className="q-btn" onClick={handleQuizSubmit}>提交答案</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
