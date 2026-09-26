import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'
import {
  getAuth, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged,
  signInWithPopup, signInWithRedirect, getRedirectResult, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyB2_9eQioXfA9KUQCup4lifzeVXU-L9U34',
  authDomain: 'my-personal-blog-f825c.firebaseapp.com',
  projectId: 'my-personal-blog-f825c',
  storageBucket: 'my-personal-blog-f825c.firebasestorage.app',
  messagingSenderId: '1029767566489',
  appId: '1:1029767566489:web:eb442d8c2506abfcab5408',
}

const STORAGE_KEY = 'exam-trainer-state-v1'
const firebaseApp = initializeApp(FIREBASE_CONFIG)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

const QUESTS = {
  'word-search': {
    id: 'word-search',
    title: 'LeetCode 79 · 单词搜索',
    module: '搜索 / 回溯',
    focus: '递归返回后恢复现场',
    sourceUrl: 'https://leetcode.cn/problems/word-search/',
    gptName: 'LeetCode 79 单词搜索',
  },
  'kmp': {
    id: 'kmp',
    title: '洛谷 P3375 · KMP',
    module: '字符串',
    focus: '前缀函数 / next 的下标与失配跳转',
    sourceUrl: 'https://www.luogu.com.cn/problem/P3375',
    gptName: '洛谷 P3375 KMP',
  },
  'lis': {
    id: 'lis',
    title: 'LeetCode 300 · 最长递增子序列',
    module: '动态规划',
    focus: '先写清 dp[i] 的含义，再写转移',
    sourceUrl: 'https://leetcode.cn/problems/longest-increasing-subsequence/',
    gptName: 'LeetCode 300 最长递增子序列',
  },
  'cpp-baseline': {
    id: 'cpp-baseline',
    title: 'C++ / STL · 基线小测',
    module: '代码运动',
    focus: '把思路稳定翻译成可运行 C++',
    sourceUrl: '',
    gptName: 'C++ / STL 基线小测',
  },
}

function initialState() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    activeQuestId: 'word-search',
    activeSession: null,
    lastStuckReason: '',
    records: [
      { date: '2026-09-12', title: 'LeetCode 300 · LIS', module: '动态规划', minutes: 48, result: '提示后通过', note: '状态定义想复杂；先明确 dp[i] 含义' },
      { date: '2026-09-10', title: 'Dijkstra 模板复写', module: '图论', minutes: 32, result: '独立通过', note: '堆优化版可以独立写完' },
      { date: '2026-09-08', title: '二叉树层序遍历', module: '数据结构', minutes: 21, result: '独立通过', note: '队列边界处理正常' },
      { date: '2026-09-05', title: 'LeetCode 79 · 单词搜索', module: '搜索 / 回溯', minutes: 55, result: '暂未通过', note: '回溯后忘记恢复现场' },
      { date: '2026-09-01', title: '洛谷 P3375 · KMP', module: '字符串', minutes: 44, result: '提示后通过', note: 'next / 前缀函数下标仍需复写' },
    ],
    revivals: [
      { id: 'word-search', status: 'active', attempts: 1, reason: '回溯后忘记恢复现场', target: '从空白独立 AC' },
      { id: 'kmp', status: 'queued', attempts: 1, reason: 'next / 前缀函数下标不稳', target: '无提示重写' },
      { id: 'lis', status: 'queued', attempts: 1, reason: '状态定义想复杂', target: '先定义状态再实现' },
    ],
    skills: [
      { group: '代码运动', name: 'C++ 基础语法 / 输入输出', level: 0, status: '待测', evidence: '暂无基线' },
      { group: '代码运动', name: 'STL 常用容器 / API', level: 0, status: '待测', evidence: '暂无基线' },
      { group: '代码运动', name: '独立 debug', level: 0, status: '待测', evidence: '暂无稳定证据' },
      { group: '算法调用', name: 'DFS / 回溯', level: 1, status: '复活中', evidence: '单词搜索：恢复现场出错' },
      { group: '算法调用', name: '动态规划', level: 2, status: '需巩固', evidence: 'LIS：提示后通过' },
      { group: '算法调用', name: 'KMP / 字符串', level: 2, status: '需巩固', evidence: 'KMP：提示后通过' },
      { group: '算法调用', name: 'BFS / 队列', level: 3, status: '已验证', evidence: '层序遍历：独立通过' },
      { group: '算法调用', name: 'Dijkstra', level: 3, status: '已验证', evidence: '堆优化版：独立通过' },
      { group: '算法调用', name: '二分', level: 0, status: '未测', evidence: '暂无证据' },
      { group: '算法调用', name: '并查集', level: 0, status: '未测', evidence: '暂无证据' },
      { group: '算法调用', name: '拓扑排序', level: 0, status: '未测', evidence: '暂无证据' },
      { group: '考场', name: '30–60 分钟限时单题', level: 0, status: '未解锁', evidence: '基础恢复后进入' },
      { group: '考场', name: '2–3 小时综合模拟', level: 0, status: '未解锁', evidence: '后续阶段' },
    ],
  }
}

let state = loadLocal()
let selectedMinutes = state.activeSession?.targetMinutes || 30
let currentUser = null
let cloudEnabled = false
let syncing = false
let timerHandle = null
let cloudTimer = null

const el = (id) => document.getElementById(id)
const modal = el('modal')
const modalContent = el('modalContent')

function loadLocal() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.version === 1) return saved
  } catch {}
  return initialState()
}

function saveLocal() {
  state.updatedAt = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function patch(fn) {
  const next = structuredClone(state)
  fn(next)
  state = next
  saveLocal()
  render()
  scheduleCloudSync()
}

function quest() {
  return QUESTS[state.activeQuestId] || QUESTS['word-search']
}

function latestRecordFor(q) {
  const key = q.id === 'word-search' ? '单词搜索'
    : q.id === 'kmp' ? 'KMP'
    : q.id === 'lis' ? 'LIS'
    : 'C++'
  return state.records.find((r) => r.title.includes(key))
}

function renderToday() {
  const q = quest()
  const latest = latestRecordFor(q)
  el('questTitle').textContent = q.title
  el('questModule').textContent = q.module
  el('questFocus').textContent = q.focus
  el('questEvidence').textContent = latest ? `上次 ${latest.minutes} min · ${latest.result}` : '尚无记录'

  const open = el('openProblemButton')
  if (q.sourceUrl) {
    open.href = q.sourceUrl
    open.classList.remove('hidden')
  } else {
    open.classList.add('hidden')
  }

  const active = Boolean(state.activeSession)
  el('idlePanel').classList.toggle('hidden', active)
  el('sessionPanel').classList.toggle('hidden', !active)
  document.querySelectorAll('.duration-select button').forEach((button) => {
    button.classList.toggle('selected', Number(button.dataset.minutes) === selectedMinutes)
  })

  if (active) {
    el('sessionHint').textContent = state.activeSession.rescues ? `本次已请求 ${state.activeSession.rescues} 次提示` : '提交后直接点结果。'
    startTimerLoop()
  }
}

function statusClass(status) {
  if (['已验证', 'resolved', '独立通过'].includes(status)) return 'good'
  if (['需巩固', '复活中', 'queued', '提示后通过'].includes(status)) return 'mid'
  if (['active', '暂未通过'].includes(status)) return 'low'
  return 'new'
}

function renderRevivals() {
  el('revivalList').innerHTML = state.revivals.map((item) => {
    const q = QUESTS[item.id] || { title: item.id, module: '' }
    const label = item.status === 'resolved' ? '已完成' : state.activeQuestId === item.id ? '当前' : '待复活'
    return `
      <button class="item revival-item" data-id="${item.id}" type="button">
        <div class="item-top">
          <div><h3>${escapeHtml(q.title)}</h3><p>${escapeHtml(item.reason)}</p></div>
          <span class="status ${statusClass(item.status)}">${label}</span>
        </div>
        <div class="detail-grid">
          <div><b>目标</b><span>${escapeHtml(item.target)}</span></div>
          <div><b>尝试</b><span>${item.attempts || 0} 次</span></div>
        </div>
      </button>
    `
  }).join('')
  document.querySelectorAll('.revival-item').forEach((button) => {
    button.addEventListener('click', () => {
      patch((next) => { next.activeQuestId = button.dataset.id })
      switchView('today')
    })
  })
}

function renderSkills() {
  el('skillList').innerHTML = state.skills.map((skill) => `
    <div class="item">
      <div class="item-top">
        <div><h3>${escapeHtml(skill.name)}</h3><p>${escapeHtml(skill.group)} · ${escapeHtml(skill.evidence)}</p></div>
        <span class="status ${statusClass(skill.status)}">${escapeHtml(skill.status)}</span>
      </div>
      <div class="meter"><span style="width:${Math.max(5, Math.min(100, skill.level * 33))}%"></span></div>
    </div>
  `).join('')
}

function renderHistory() {
  const records = state.records || []
  const independent = records.filter((r) => r.result === '独立通过').length
  const minutes = records.reduce((n, r) => n + Number(r.minutes || 0), 0)
  el('historySummary').textContent = `${records.length} 次训练 · ${independent} 次独立通过 · ${Math.round(minutes / 6) / 10} h`
  el('historyList').innerHTML = records.map((r) => `
    <div class="item">
      <div class="item-top">
        <div><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.date)} · ${escapeHtml(r.module || '')} · ${r.minutes || 0} min</p></div>
        <span class="status ${statusClass(r.result)}">${escapeHtml(r.result)}</span>
      </div>
      ${r.note ? `<p>${escapeHtml(r.note)}</p>` : ''}
    </div>
  `).join('')
}

function renderSync() {
  const banner = el('syncBanner')
  if (!currentUser) {
    banner.classList.remove('hidden')
    setSync('', '未登录')
    return
  }
  banner.classList.add('hidden')
  if (syncing) setSync('busy', '同步中')
  else if (cloudEnabled) setSync('ok', '已同步')
  else setSync('error', '同步失败')
}

function renderAuth() {
  const area = el('authArea')
  if (!currentUser) {
    area.innerHTML = `
      <div>未登录：数据只在当前浏览器。</div>
      <div class="auth-actions">
        <button id="googleLogin" type="button">Google 登录</button>
        <button id="githubLogin" type="button">GitHub 登录</button>
      </div>
    `
    el('googleLogin').addEventListener('click', () => signIn('google'))
    el('githubLogin').addEventListener('click', () => signIn('github'))
  } else {
    area.innerHTML = `
      <div>${escapeHtml(currentUser.displayName || currentUser.email || '已登录')} · ${cloudEnabled ? '跨设备同步已开启' : '已登录，但云同步未成功'}</div>
      <div class="auth-actions">
        <button id="manualSync" type="button">立即同步</button>
        <button id="logoutButton" type="button">退出</button>
      </div>
    `
    el('manualSync').addEventListener('click', () => cloudEnabled ? syncCloud() : loadCloud(currentUser))
    el('logoutButton').addEventListener('click', () => signOut(auth))
  }
}

function render() {
  renderToday()
  renderRevivals()
  renderSkills()
  renderHistory()
  renderSync()
  renderAuth()
}

function setSync(kind, text) {
  el('syncDot').className = 'sync-dot' + (kind ? ' ' + kind : '')
  el('syncText').textContent = text
}

function startSession() {
  patch((next) => {
    next.activeSession = { questId: next.activeQuestId, targetMinutes: selectedMinutes, startedAt: Date.now(), rescues: 0 }
    next.lastStuckReason = ''
  })
}

function secondsElapsed(session = state.activeSession) {
  if (!session) return 0
  return Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000))
}

function minutesElapsed(session = state.activeSession) {
  return Math.max(1, Math.round(secondsElapsed(session) / 60))
}

function updateTimer() {
  const session = state.activeSession
  if (!session) return
  const remaining = Math.max(0, session.targetMinutes * 60 - secondsElapsed(session))
  el('timer').textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
  if (remaining === 0) el('sessionHint').textContent = '计时结束。可以继续，也可以直接记录结果。'
}

function startTimerLoop() {
  clearInterval(timerHandle)
  updateTimer()
  timerHandle = setInterval(updateTimer, 1000)
}

function endSession(result, note = '') {
  const session = state.activeSession
  if (!session) return
  const q = QUESTS[session.questId] || quest()
  const used = minutesElapsed(session)
  patch((next) => {
    next.records.unshift({ date: new Date().toISOString().slice(0, 10), title: q.title, module: q.module, minutes: used, result, note })
    const revival = next.revivals.find((x) => x.id === session.questId)
    if (revival) {
      revival.attempts = (revival.attempts || 0) + 1
      revival.status = result === '独立通过' ? 'resolved' : result === '提示后通过' ? 'queued' : 'active'
    }
    if (session.questId === 'word-search' && result === '独立通过') {
      const skill = next.skills.find((x) => x.name === 'DFS / 回溯')
      if (skill) {
        skill.level = 3
        skill.status = '已验证'
        skill.evidence = '单词搜索冷启动：独立通过'
      }
    }
    next.activeSession = null
    const nextRevival = next.revivals.find((x) => x.status !== 'resolved')
    next.activeQuestId = nextRevival?.id || 'cpp-baseline'
  })
  clearInterval(timerHandle)
  timerHandle = null
  switchView('today')
}

function currentPrompt(reason = state.lastStuckReason) {
  const q = quest()
  const session = state.activeSession
  return [
    '机试陪练，按 AI-off 协议：',
    `题目：${q.gptName}`,
    `本轮训练点：${q.focus}`,
    session ? `已练约 ${minutesElapsed(session)} 分钟` : '',
    reason ? `当前卡点：${reason}` : '',
    '',
    '不要直接给完整答案。先判断卡点属于知识/建模/API/实现/debug/边界中的哪一类，只给一级最小提示，让我继续自己写。',
  ].filter(Boolean).join('\n')
}

function showStuck() {
  openModal(`
    <h3>卡在哪？</h3>
    <div class="option-list">
      ${['没思路','知道算法，写不出来','编译 / API','WA / 找不到反例','边界条件','TLE / 复杂度','debug 没方向'].map((x) => `<button class="option-button stuck-option" data-reason="${x}" type="button">${x}</button>`).join('')}
    </div>
  `)
  document.querySelectorAll('.stuck-option').forEach((b) => b.addEventListener('click', () => {
    const reason = b.dataset.reason
    patch((next) => {
      next.lastStuckReason = reason
      if (next.activeSession) next.activeSession.rescues = (next.activeSession.rescues || 0) + 1
    })
    const prompt = currentPrompt(reason)
    openModal(`
      <h3>发给 GPT</h3>
      <div class="prompt-box">${escapeHtml(prompt)}</div>
      <div class="modal-actions">
        <button id="copyPrompt" class="primary" type="button">复制</button>
        <button id="backToCode" type="button">回去再写</button>
      </div>
    `)
    el('copyPrompt').addEventListener('click', () => copyText(prompt))
    el('backToCode').addEventListener('click', closeModal)
  }))
}

function showAc() {
  openModal(`
    <h3>这次怎么算？</h3>
    <div class="option-list">
      <button class="option-button ac-option" data-result="独立通过" type="button">独立 AC</button>
      <button class="option-button ac-option" data-result="提示后通过" type="button">提示后 AC</button>
    </div>
  `)
  document.querySelectorAll('.ac-option').forEach((b) => b.addEventListener('click', () => {
    const result = b.dataset.result
    closeModal()
    endSession(result, state.lastStuckReason ? `卡点：${state.lastStuckReason}` : '')
  }))
}

function showStop() {
  openModal(`
    <h3>结束本次？</h3>
    <p>当前用时 ${minutesElapsed()} min。</p>
    <div class="modal-actions">
      <button id="confirmStop" class="primary" type="button">记录未完成</button>
      <button id="cancelStop" type="button">继续</button>
    </div>
  `)
  el('confirmStop').addEventListener('click', () => {
    closeModal()
    endSession('暂未通过', state.lastStuckReason || '本次未完成')
  })
  el('cancelStop').addEventListener('click', closeModal)
}

function showLogin() {
  if (currentUser) {
    switchView('history')
    setTimeout(() => document.querySelector('.data-panel')?.setAttribute('open', ''), 0)
    return
  }
  openModal(`
    <h3>跨设备同步</h3>
    <p>不登录：只存当前浏览器。登录：手机和电脑使用同一份训练状态。</p>
    <div class="modal-actions">
      <button id="loginGoogle" class="primary" type="button">Google 登录</button>
      <button id="loginGithub" type="button">GitHub 登录</button>
    </div>
  `)
  el('loginGoogle').addEventListener('click', () => signIn('google'))
  el('loginGithub').addEventListener('click', () => signIn('github'))
}

function openModal(html) {
  modalContent.innerHTML = html
  modal.classList.remove('hidden')
}
function closeModal() {
  modal.classList.add('hidden')
  modalContent.innerHTML = ''
}

function switchView(target) {
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.dataset.view === target))
  document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.target === target))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toast(message) {
  const node = el('toast')
  node.textContent = message
  node.classList.remove('hidden')
  clearTimeout(toast.timer)
  toast.timer = setTimeout(() => node.classList.add('hidden'), 2200)
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  toast('已复制')
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))
}

function scheduleCloudSync() {
  if (!currentUser || !cloudEnabled) return
  clearTimeout(cloudTimer)
  cloudTimer = setTimeout(syncCloud, 450)
}

async function syncCloud() {
  if (!currentUser || !cloudEnabled || syncing) return
  syncing = true
  renderSync()
  try {
    await setDoc(doc(db, 'examTrainer', currentUser.uid), {
      ownerUid: currentUser.uid,
      state,
      updatedAt: state.updatedAt,
      serverUpdatedAt: serverTimestamp(),
    }, { merge: true })
    cloudEnabled = true
  } catch (error) {
    console.warn('Exam trainer sync failed', error)
    cloudEnabled = false
    toast('Firebase 同步失败')
  } finally {
    syncing = false
    renderSync()
    renderAuth()
  }
}

async function loadCloud(user) {
  syncing = true
  renderSync()
  try {
    const snap = await getDoc(doc(db, 'examTrainer', user.uid))
    cloudEnabled = true
    if (snap.exists() && snap.data()?.state) {
      const remote = snap.data().state
      if (Date.parse(remote.updatedAt || 0) > Date.parse(state.updatedAt || 0)) {
        state = remote
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } else {
        await syncCloud()
      }
    } else {
      await syncCloud()
    }
  } catch (error) {
    console.warn('Exam trainer cloud unavailable', error)
    cloudEnabled = false
  } finally {
    syncing = false
    render()
  }
}

function isMobile() {
  return matchMedia('(max-width:700px)').matches || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)
}

async function signIn(providerName) {
  closeModal()
  const provider = providerName === 'github' ? new GithubAuthProvider() : new GoogleAuthProvider()
  try {
    if (isMobile()) await signInWithRedirect(auth, provider)
    else await signInWithPopup(auth, provider)
  } catch (error) {
    console.warn(error)
    toast('登录失败')
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `exam-trainer-${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function importData(file) {
  try {
    const data = JSON.parse(await file.text())
    if (data?.version !== 1 || !Array.isArray(data.records)) throw new Error('invalid')
    state = data
    saveLocal()
    render()
    scheduleCloudSync()
    toast('已导入')
  } catch {
    toast('导入失败')
  }
}

document.querySelectorAll('.duration-select button').forEach((b) => b.addEventListener('click', () => {
  selectedMinutes = Number(b.dataset.minutes)
  renderToday()
}))
el('startButton').addEventListener('click', startSession)
el('acButton').addEventListener('click', showAc)
el('stuckButton').addEventListener('click', showStuck)
el('stopButton').addEventListener('click', showStop)
el('copyStateButton').addEventListener('click', () => copyText(currentPrompt()))
el('switchQuestButton').addEventListener('click', () => switchView('revive'))
el('syncButton').addEventListener('click', showLogin)
el('syncBannerButton').addEventListener('click', showLogin)
document.querySelectorAll('.nav-item').forEach((b) => b.addEventListener('click', () => switchView(b.dataset.target)))
el('modalClose').addEventListener('click', closeModal)
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal() })
el('exportButton').addEventListener('click', exportData)
el('importInput').addEventListener('change', (e) => {
  const file = e.target.files?.[0]
  if (file) importData(file)
  e.target.value = ''
})

getRedirectResult(auth).catch(() => {})
onAuthStateChanged(auth, async (user) => {
  currentUser = user
  if (user) await loadCloud(user)
  else {
    cloudEnabled = false
    render()
  }
})

render()
if (state.activeSession) startTimerLoop()
