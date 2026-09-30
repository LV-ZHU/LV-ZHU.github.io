import { useEffect, useRef, useState } from 'react'
import { typeDict } from '../../data/typeDict'

const choose_word = () => typeDict[Math.floor(Math.random() * typeDict.length)]

export default function TypingPractice() {
  const [word, set_word] = useState(choose_word)
  const [typed, set_typed] = useState('')
  const [phase, set_phase] = useState('ready')
  const [remaining, set_remaining] = useState(60)
  const [stats, set_stats] = useState({ correct: 0, attempts: 0, words: 0 })
  const deadline = useRef(0)
  const input_ref = useRef(null)
  const elapsed = 60 - remaining
  const accuracy = stats.attempts ? Math.round(stats.correct / stats.attempts * 100) : 100
  const speed = elapsed ? Math.round(stats.correct / 5 / (elapsed / 60)) : 0

  useEffect(() => {
    if (phase !== 'running') return
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      set_remaining(seconds)
      if (!seconds) set_phase('finished')
    }, 200)
    return () => clearInterval(timer)
  }, [phase])

  function restart() {
    set_word(choose_word())
    set_typed('')
    set_remaining(60)
    set_stats({ correct: 0, attempts: 0, words: 0 })
    set_phase('ready')
    requestAnimationFrame(() => input_ref.current?.focus())
  }

  function accept_input(event) {
    if (event.nativeEvent.isComposing || phase === 'finished') return
    if (phase === 'running' && Date.now() >= deadline.current) {
      set_remaining(0)
      set_phase('finished')
      return
    }
    const value = event.target.value.toLowerCase()
    if (value.length > typed.length + 1) return
    if (phase === 'ready' && value) {
      deadline.current = Date.now() + 60000
      set_phase('running')
    }
    const added = value.length > typed.length
    const correct = added && value[value.length - 1] === word.w.toLowerCase()[value.length - 1]
    const complete = value === word.w.toLowerCase()
    set_stats(previous => ({
      correct: previous.correct + Number(correct),
      attempts: previous.attempts + Number(added),
      words: previous.words + Number(complete),
    }))
    set_typed(complete ? '' : value)
    if (complete) set_word(choose_word())
  }

  return <section className="typing-practice" aria-label="单词打字练习">
    <div className="practice-heading"><h2>单词打字练习</h2><span>60 秒 · 计算机词汇</span></div>
    <p>{phase === 'ready' ? '照着下方单词输入，第一笔开始计时。空格也需要输入，输错可退格修改。' : phase === 'finished' ? '本轮练习结束。可以查看成绩，或再练一轮。' : '保持节奏，完整输入后自动进入下一个单词。'}</p>
    <div className="practice-metrics" aria-label="练习成绩">
      <span><strong>{remaining}</strong> 秒</span><span><strong>{speed}</strong> WPM</span>
      <span><strong>{accuracy}%</strong> 准确率</span><span><strong>{stats.words}</strong> 个词</span>
    </div>
    <progress max="60" value={remaining} aria-label="剩余时间" />
    {phase !== 'finished' && <>
      <div className="practice-word" aria-label={word.w}>{[...word.w].map((char, index) => <span key={index} className={index < typed.length ? (typed[index] === char.toLowerCase() ? 'practice-correct' : 'practice-wrong') : index === typed.length ? 'practice-current' : ''}>{char === ' ' ? '\u00a0' : char}</span>)}</div>
      <p className="practice-meaning"><small>{word.tag}</small> {word.h}</p>
      <label htmlFor="practice-input">输入上方单词</label>
      <input ref={input_ref} id="practice-input" value={typed} onChange={accept_input} onPaste={event => event.preventDefault()} autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} maxLength={word.w.length} aria-describedby="practice-feedback" />
      <p id="practice-feedback" role="status">{typed && !word.w.toLowerCase().startsWith(typed) ? '红色字母输入有误，请退格修改。' : '大小写均可，请使用英文输入法。'}</p>
    </>}
    {phase === 'finished' && <p role="status">完成 {stats.words} 个词，速度 {speed} WPM，准确率 {accuracy}%。</p>}
    <button className="ctrl-btn" type="button" onClick={restart}>{phase === 'finished' ? '再练一轮' : '重新开始'}</button>
  </section>
}
