import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

// ----- 命令表定义 -----
const CORE_COMMANDS = ['about', 'open', 'contact', 'play']
const TOOL_COMMANDS = ['ls', 'help', 'clear']
const EASTER_EGG_COMMANDS = ['whoami', 'neofetch', 'sudo', 'echo', 'exit', 'reboot']
const ALL_COMMANDS = [...CORE_COMMANDS, ...TOOL_COMMANDS, ...EASTER_EGG_COMMANDS]

// ----- 工具函数 -----
function fmtTime(t) {
  if (!t || !isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return m + ':' + String(s).padStart(2, '0')
}

function levenshteinDistance(a, b) {
  const matrix = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i-1] === a[j-1]) {
        matrix[i][j] = matrix[i-1][j-1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + 1,
          matrix[i][j-1] + 1,
          matrix[i-1][j] + 1
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

function fuzzyMatch(input, candidates) {
  let best = null
  let bestDist = Infinity
  for (const cmd of candidates) {
    const dist = levenshteinDistance(input, cmd)
    if (dist < bestDist) {
      bestDist = dist
      best = cmd
    }
  }
  return bestDist <= 2 ? best : null
}

// ----- 打字机效果组件 -----
function TypingText({ text, className = '', delay = 25, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + text[index])
        setIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [index, text, delay, onComplete])

  return <span className={className}>{displayed}</span>
}

function HomeTerminal() {
  const navigate = useNavigate()
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

  // 重置终端
  function resetTerminal() {
    setEntries([])
    setPlaying(false)
    setProgress(0)
    setTimeText('0:00 / 0:00')
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // 添加输出条目：支持直接 JSX 或带样式的纯文本（自动打字）
  function addOut(content, className = '') {
    if (typeof content === 'string') {
      // 纯文本 → 打字效果
      const entry = (
        <div className="term-entry" key={nextId()}>
          <TypingText text={content} className={className} />
        </div>
      )
      setEntries(prev => [...prev, entry])
    } else {
      // JSX → 直接显示
      setEntries(prev => [...prev, <div className="term-entry" key={nextId()}>{content}</div>])
    }
  }

  // 添加命令输入行
  function addLine(typed) {
    setEntries(prev => [...prev, (
      <div className="term-entry term-line" key={nextId()}>
        <span className="term-prompt"><span className="t-user">lv-zhu</span>@<span className="t-host">lv-zhu</span><span className="t-colon">:~$ </span></span>
        <span className="t-typed">{typed}</span>
      </div>
    )])
  }

  function runCommand(raw) {
    const val = raw.trim()
    addLine(val)
    if (!val) return

    const parts = val.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    // ----- 特殊命令 -----
    if (cmd === 'clear') {
      setEntries([])
      return
    }

    if (cmd === 'play') {
      addOut('▶ now playing: Próxima Estación', 'term-np')
      setPlaying(true)
      audioRef.current?.play?.().catch(() => {})
      return
    }

    if (cmd === 'stop' || cmd === 'pause') {
      setPlaying(false)
      audioRef.current?.pause?.()
      addOut('stopped', 't-dim')
      return
    }

    if (cmd === 'open') {
      const path = args[0]
      if (!path) {
        addOut('Usage: open [path] (e.g. open /favorites)', 't-err')
      } else {
        addOut(`Opening ${path} ...`, 't-dim')
        navigate(path)
      }
      return
    }

    if (cmd === 'exit') {
      addOut('logout', 't-dim')
      setTimeout(() => resetTerminal(), 1500)
      return
    }

    if (cmd === 'reboot') {
      // 清屏并显示重启信息
      setEntries([])
      setTimeout(() => {
        addOut('Rebooting...', 't-dim')
        setTimeout(() => resetTerminal(), 2000)
      }, 100)
      return
    }

    if (cmd === 'echo') {
      const rest = args.join(' ')
      addOut(rest, '')
      return
    }

    // ----- 通过 getOutput 处理 -----
    const output = getOutput(cmd)
    if (output !== null) {
      // output 可能是 JSX 或字符串，由 addOut 处理
      if (typeof output === 'string') {
        addOut(output, '')
      } else {
        addOut(output)
      }
      return
    }

    // ----- 未知命令 -----
    const suggestion = fuzzyMatch(cmd, ALL_COMMANDS)
    addOut(`zsh: command not found: ${val}`, 't-err')
    if (suggestion) {
      addOut(`Did you mean '${suggestion}'?`, 't-dim')
    }
    addOut("Try 'help'.", 't-dim')
  }

  // ----- getOutput 定义 -----
  function getOutput(cmd) {
    switch (cmd) {
      case 'ls':
        return (
          <>
            <span className="t-cmd">about</span>   <span className="t-cmd">open</span>   <span className="t-cmd">contact</span>   <span className="t-cmd">play</span>
            <br />
            <span className="t-file">proxima-estacion.mp3</span>
          </>
        )
      case 'help':
        return (
          <>
            <span className="t-cmd">about</span>   <span className="t-cmd">open</span>   <span className="t-cmd">contact</span>   <span className="t-cmd">play</span>
          </>
        )
      case 'whoami':
        return 'lv-zhu'
      case 'about':
        return "I'm lv-zhu, an Information Security student at Tongji CS. Currently navigating the next station of my journey."
      case 'contact':
        return <a className="t-url" href="https://github.com/LV-ZHU" target="_blank" rel="noopener noreferrer">GitHub → https://github.com/LV-ZHU</a>
      case 'neofetch':
        return (
          <>
            <div>OS:       Personal Site v1.0</div>
            <div>Host:     Tongji University's School of Computer Science and Technology</div>
            <div>Major:    Information Security</div>
          </>
        )
      case 'sudo':
        return 'Nice try.'
      default:
        return null
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      setInput('')
      return
    }
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

  // 滚动到底部
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [entries, playing])

  // 自动聚焦
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