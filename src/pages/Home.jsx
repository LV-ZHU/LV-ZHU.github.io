import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import '../styles/Home.css'

const sections = [
  ['/study', 'Study'],
  ['/projects', 'Projects'],
  ['/jottings', 'Jottings'],
  ['/favorites', 'Favorites'],
  ['/acgn', 'ACGN'],
  ['/music', 'Music'],
  ['/travel', 'Travel'],
  ['/tutoring', 'Tutoring'],
]

const AUDIO_SRC = '/assets/audio/proxima-estacion.mp3'

function fmtTime(t) {
  if (!t || !isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return m + ':' + String(s).padStart(2, '0')
}

function getOutput(key) {
  switch (key) {
    case 'ls':
      return (<>
        <span className="t-cmd">whoami</span>   <span className="t-cmd">school</span>   <span className="t-cmd">college</span>   <span className="t-cmd">major</span>   <span className="t-cmd">contact</span>   <span className="t-file">proxima-estacion.mp3</span>
      </>)
    case 'whoami':
      return <>lv-zhu</>
    case 'school':
      return <span className="t-val">Tongji University</span>
    case 'college':
      return <span className="t-val">School of Computer Science and Technology</span>
    case 'major':
      return <span className="t-val">Information Security</span>
    case 'contact':
      return <a className="t-url" href="https://github.com/LV-ZHU" target="_blank" rel="noopener noreferrer">GitHub → https://github.com/LV-ZHU</a>
    default:
      return null
  }
}

function HomeTerminal() {
  const [entries, setEntries] = useState([])
  const [input, setInput] = useState('')
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeText, setTimeText] = useState('0:00 / 0:00')
  const audioRef = useRef(null)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const idRef = useRef(0)
  const nextId = () => 'e' + ++idRef.current

  function addLine(typed) {
    setEntries(prev => [...prev, (
      <div className="term-entry term-line" key={nextId()}>
        <span className="term-prompt"><span className="t-user">lv-zhu</span>@<span className="t-host">lv-zhu</span><span className="t-colon">:~$ </span></span>
        <span className="t-typed">{typed}</span>
      </div>
    )])
  }

  function addOut(node) {
    setEntries(prev => [...prev, <div className="term-entry" key={nextId()}>{node}</div>])
  }

  function runCommand(raw) {
    const val = raw.trim()
    addLine(val)
    if (!val) return
    const key = val.toLowerCase()
    if (key === 'clear') { setEntries([]); return }
    if (key === 'play' || key === 'play proxima-estacion.mp3') {
      addOut(<span className="term-np">▶ now playing</span>)
      setPlaying(true)
      audioRef.current?.play?.().catch(() => {})
      return
    }
    if (key === 'stop' || key === 'pause') {
      setPlaying(false)
      audioRef.current?.pause?.()
      addOut(<span className="t-dim">stopped</span>)
      return
    }
    const out = getOutput(key)
    if (out) addOut(out)
    else addOut(<span className="t-err">zsh: command not found: {val}</span>)
  }

  function onKeyDown(e) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    runCommand(input)
    setInput('')
  }

  function togglePlay(e) {
    e.stopPropagation()
    const next = !playing
    setPlaying(next)
    if (next) audioRef.current?.play?.().catch(() => {})
    else audioRef.current?.pause?.()
  }

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [entries, playing])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term-bar">
        <span className="term-dot" /><span className="term-dot" /><span className="term-dot" />
        <span className="term-title">lv-zhu — zsh</span>
      </div>
      <div className="term-body" ref={bodyRef}>
        {entries}
        {playing && (
          <div className="term-npbar">
            <button className="term-npbtn" type="button" aria-label={playing ? '暂停' : '播放'} onClick={togglePlay}>{playing ? '⏸' : '▶'}</button>
            <span className="term-nptrack">proxima-estacion.mp3</span>
            <span className="term-npprog"><span className="term-npfill" style={{ width: (progress * 100) + '%' }} /></span>
            <span className="term-nptime">{timeText}</span>
          </div>
        )}
        <div className="term-input-line">
          <span className="term-prompt"><span className="t-user">lv-zhu</span>@<span className="t-host">lv-zhu</span><span className="t-colon">:~$ </span></span>
          <input
            ref={inputRef}
            className="term-input"
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="type something…"
            aria-label="终端输入"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        onTimeUpdate={e => {
          const a = e.currentTarget
          const d = a.duration
          setProgress(d ? a.currentTime / d : 0)
          setTimeText(fmtTime(a.currentTime) + ' / ' + fmtTime(d))
        }}
        onEnded={() => setPlaying(false)}
      />
    </div>
  )
}

export default function Home() {
  return (
    <main className="home-main">
      <div className="home-wallpaper" aria-hidden="true" />
      <div className="container home-content">
        <FadeIn className="home-profile">
          <img src="/assets/images/avatar.jpg" alt="LV-ZHU 头像" />
          <h1 id="home-title" aria-label="LV-ZHU">Lv Zhu</h1>
        </FadeIn>

        <FadeIn as="section" className="home-broadcast" aria-label="Terminal">
          <HomeTerminal />
        </FadeIn>

        <FadeIn as="section" className="home-sections" aria-labelledby="sections-title">
          <h2 id="sections-title">Sections</h2>
          <div className="home-section-grid">
            {sections.map(([path, title]) => (
              <Link to={path} className="home-section-link" key={path}>{title}</Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </main>
  )
}
