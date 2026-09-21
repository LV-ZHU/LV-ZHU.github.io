import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { typeDict, questionBank } from '../../data/typeDict'
import { STORAGE_KEY, defaultConfig, loadConfig, saveConfig, keyboardLayout } from './config.js';
import { advance_typing } from './typing.js'

export function use_favorites() {
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
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* Reset remains available in memory. */ }
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
      if (tag === 'input' || tag === 'textarea' || event.target.isContentEditable || event.ctrlKey || event.metaKey || event.altKey) return

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

        const result = advance_typing(activeWord, typeIndex, typeCombo, typedChar)
        if (result.correct) {
          setTypeCombo(result.combo)
          setTypeScore(prev => prev + result.score)
          setTypeIndex(result.index)
          if (result.complete) nextTypeWord()
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

  return { isEditMode, currentIndex, isTypeGame, typeTimeLeft, typeScore, typeCombo, activeHint, activeTag, showQuiz, currentQuestion, selectedAnswers, errorKey, linkableKeys, applyConfigToKey, handleKeyClick, toggleEditMode, resetConfig, startTypeGame, stopTypeGame, showQuestionModal, handleQuizSubmit, toggleAnswer, renderTypeWord, targetKey }
}
