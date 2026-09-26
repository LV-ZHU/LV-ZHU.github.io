import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
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
const app = initializeApp(FIREBASE_CONFIG)
const auth = getAuth(app)
const db = getFirestore(app)

const QUESTIONS = {
  'word-search': {
    id: 'word-search',
    title: '单词搜索 · 冷启动复写',
    module: '搜索 / 回溯',
    state: '等待第二战',
    why: '上一次不是“不会 DFS”，而是在递归返回后忘记恢复现场。这个断点具体、可修，而且修好后会迁移到大量回溯题。',
    goal: '不看题解和 AI，从空白独立 AC；最后能自己说清：选择 → 标记 → 递归 → 恢复。',
    evidence: '上次：2026-09-05 · 55 分钟 · 暂未通过',
  },
  'kmp': {
    id: 'kmp',
    title: 'KMP 前缀函数 · 冷启动',
    module: '字符串',
    state: '待复活',
    why: '你已经理解过 KMP，但前缀函数 / next 的下标仍需要外部提示。现在要把“看懂”变成“能从空白生成”。',
    goal: '无提示写出前缀函数并通过样例与边界；解释失配后为什么跳到那个位置。',
    evidence: '上次：2026-09-01 · 44 分钟 · 提示后通过',
  },
  'lis': {
    id: 'lis',
    title: 'LIS · 冷启动',
    module: '动态规划',
    state: '待复活',
    why: '上次真正卡的是状态定义想复杂了。这个节点适合训练“先定义状态，再写转移”的 DP 基本动作。',
    goal: '先用一句话写清 dp[i] 的含义，再独立完成一种正确解法。',
    evidence: '上次：2026-09-12 · 48 分钟 · 提示后通过',
  },
  'cpp-baseline': {
    id: 'cpp-baseline',
    title: 'C++ / STL · 基线小测',
    module: '代码运动',
    state: '未探索',
    why: '当前最大的未知量不是算法知识，而是从脑中思路到可运行 C++ 的“运动能力”还剩多少。',
    goal: '20–30 分钟完成一组基础实现，不查 AI；记录 API、生疏点和独立 debug 情况。',
    evidence: '当前：尚无系统基线',
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
      { date: '2026-09-12', title: '300 最长递增子序列', module: '动态规划', minutes: 48, result: '提示后通过', note: '状态定义想复杂；先明确 dp[i] 含义' },
      { date: '2026-09-10', title: 'Dijkstra 模板复写', module: '图论', minutes: 32, result: '独立通过', note: '堆优化版可以独立写完' },
      { date: '2026-09-08', title: '二叉树层序遍历', module: '数据结构', minutes: 21, result: '独立通过', note: '队列边界处理正常' },
      { date: '2026-09-05', title: '单词搜索', module: '搜索 / 回溯', minutes: 55, result: '暂未通过', note: '回溯后忘记恢复现场' },
      { date: '2026-09-01', title: 'KMP 前缀函数', module: '字符串', minutes: 44, result: '提示后通过', note: 'next / 前缀函数下标仍需复写' },
    ],
    revivals: [
      { id: 'word-search', status: 'active', attempts: 1, reason: '回溯后忘记恢复现场', target: '从空白独立 AC', standard: '稳定写出选择→标记→递归→恢复' },
      { id: 'kmp', status: 'queued', attempts: 1, reason: 'next / 前缀函数下标不稳', target: '无提示重写', standard: '样例 + 边界稳定' },
      { id: 'lis', status: 'queued', attempts: 1, reason: '状态定义想复杂', target: '先定义状态再实现', standard: '10–15 分钟独立完成一种解法' },
    ],
    skills: [
      { group: '代码运动', name: 'C++ 基础语法 / 输入输出', level: 0, status: '待测', evidence: '暂无稳定基线' },
      { group: '代码运动', name: 'STL 常用容器 / API', level: 0, status: '待测', evidence: '暂无稳定基线' },
      { group: '代码运动', name: '独立 debug', level: 0, status: '待测', evidence: '需要在 AI-off 中积累证据' },
      { group: '模板映射', name: 'DFS / 回溯', level: 1, status: '复活中', evidence: '单词搜索：恢复现场出错' },
      { group: '模板映射', name: '动态规划', level: 2, status: '需巩固', evidence: 'LIS：提示后通过' },
      { group: '模板映射', name: 'KMP / 字符串', level: 2, status: '需巩固', evidence: 'KMP：提示后通过' },
      { group: '模板映射', name: 'BFS / 队列', level: 3, status: '已验证', evidence: '层序遍历：独立通过' },
      { group: '模板映射', name: 'Dijkstra', level: 3, status: '已验证', evidence: '堆优化版：独立通过' },
      { group: '模板映射', name: '二分', level: 0, status: '未测', evidence: '暂无证据' },
      { group: '模板映射', name: '并查集', level: 0, status: '未测', evidence: '暂无证据' },
      { group: '模板映射', name: '拓扑排序', level: 0, status: '未测', evidence: '暂无证据' },
      { group: '赛场系统', name: '30–60 分钟限时单题', level: 0, status: '未解锁', evidence: '基础恢复后进入' },
      { group: '赛场系统', name: '2–3 小时综合模拟', level: 0, status: '未解锁', evidence: '阶段性开启' },
    ],
  }
}

let state = loadLocal()
let currentUser = null
let cloudEnabled = false
let syncing = false
let timerHandle = null

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

function touch(next) {
  next.updatedAt = new Date().toISOString()
  state = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  render()
  scheduleCloudSync()
}

function patch(mutator) {
  const next = structuredClone(state)
  mutator(next)
  touch(next)
}

let cloudTimer = null
function scheduleCloudSync() {
  if (!currentUser || !cloudEnabled) return
  clearTimeout(cloudTimer)
  cloudTimer = setTimeout(syncCloud, 500)
}

async function syncCloud() {
  if (!currentUser || !cloudEnabled || syncing) return
  syncing = true
  setSync('busy', '同步中')
  try {
    await setDoc(doc(db, 'examTrainer', currentUser.uid), {
      state,
      updatedAt: state.updatedAt,
      ownerUid: currentUser.uid,
      serverUpdatedAt: serverTimestamp(),
    }, { merge: true })
    setSync('ok', '已同步')
  } catch (error) {
    console.warn('Exam trainer cloud sync unavailable:', error)
    cloudEnabled = false
    setSync('error', '仅本机')
    toast('云同步权限暂不可用，训练记录仍保存在本机。')
  } finally {
    syncing = false
  }
}

async function loadCloud(user) {
  setSync('busy', '检查云端')
  try {
    const snap = await getDoc(doc(db, 'examTrainer', user.uid))
    cloudEnabled = true
    if (snap.exists() && snap.data()?.state) {
      const remote = snap.data().state
      const remoteTime = Date.parse(remote.updatedAt || 0)
      const localTime = Date.parse(state.updatedAt || 0)
      if (remoteTime > localTime) {
        state = remote
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } else if (localTime > remoteTime) {
        await syncCloud()
      }
    } else {
      await syncCloud()
    }
    setSync('ok', '已同步')
    render()
  } catch (error) {
    console.warn('Cloud load unavailable:', error)
    cloudEnabled = false
    setSync('error', '仅本机')
    renderAuth()
  }
}

function setSync(kind, text) {
  el('syncDot').className = 'sync-dot' + (kind ? ' ' + kind : '')
  el('syncText').textContent = text
}

function getQuest() {
  return QUESTIONS[state.activeQuestId] || QUESTIONS['word-search']
}

function pickNextQuest(next) {
  const unresolved = next.revivals.find((item) => item.status !== 'resolved')
  next.activeQuestId = unresolved?.id || 'cpp-baseline'
}

function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function minutesElapsed(session = state.activeSession) {
  if (!session) return 0
  return Math.max(0, Math.round((Date.now() - session.startedAt) / 60000))
}

function startSession(minutes) {
  patch((next) => {
    next.activeSession = {
      questId: next.activeQuestId,
      targetMinutes: minutes,
      startedAt: Date.now(),
      rescues: 0,
    }
  })
  toast(minutes === 12 ? '只做 12 分钟。到点就有资格停。' : '计时开始。第一次保持 AI-off。')
  startTimerLoop()
}

function endSession(result, note = '') {
  const session = state.activeSession
  if (!session) return
  const quest = QUESTIONS[session.questId] || getQuest()
  const spent = Math.max(1, minutesElapsed(session))
  patch((next) => {
    next.records.unshift({
      date: formatDate(),
      title: quest.title.replace(' · 冷启动复写', '').replace(' · 冷启动', ''),
      module: quest.module,
      minutes: spent,
      result,
      note,
    })
    const revival = next.revivals.find((item) => item.id === session.questId)
    if (revival) {
      revival.attempts = (revival.attempts || 0) + 1
      if (result === '独立通过') revival.status = 'resolved'
      else if (result === '提示后通过') revival.status = 'queued'
      else revival.status = 'active'
    }
    if (session.questId === 'word-search' && result === '独立通过') {
      const skill = next.skills.find((item) => item.name === 'DFS / 回溯')
      if (skill) {
        skill.level = Math.max(skill.level, 3)
        skill.status = '已验证'
        skill.evidence = '单词搜索冷启动：独立通过'
      }
    }
    next.activeSession = null
    pickNextQuest(next)
  })
  clearInterval(timerHandle)
  timerHandle = null
  toast(result === '独立通过' ? '这一关已经从“会看”变成了“能调用”。' : '记录完成。下次回来仍然从具体断点继续。')
}

function updateTimer() {
  const session = state.activeSession
  if (!session) return
  const total = session.targetMinutes * 60
  const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
  const remaining = Math.max(0, total - elapsed)
  const m = String(Math.floor(remaining / 60)).padStart(2, '0')
  const s = String(remaining % 60).padStart(2, '0')
  el('timer').textContent = `${m}:${s}`
  if (remaining === 0) {
    el('sessionInstruction').textContent = '时间到了。你已经完成今天的最低承诺；想继续就继续，不继续也算完成一次训练。'
  }
}

function startTimerLoop() {
  clearInterval(timerHandle)
  updateTimer()
  timerHandle = setInterval(updateTimer, 1000)
}

function render() {
  renderToday()
  renderSkills()
  renderRevivals()
  renderHistory()
  renderAuth()
  if (state.activeSession) startTimerLoop()
}

function renderToday() {
  const quest = getQuest()
  el('questModule').textContent = quest.module
  el('questState').textContent = quest.state
  el('questTitle').textContent = quest.title
  el('questWhy').textContent = quest.why
  el('questGoal').textContent = quest.goal
  el('lastEvidence').textContent = quest.evidence

  const active = Boolean(state.activeSession)
  el('idlePanel').classList.toggle('hidden', active)
  el('sessionPanel').classList.toggle('hidden', !active)
  if (active) {
    el('sessionInstruction').textContent = state.activeSession.rescues
      ? `已经请求过 ${state.activeSession.rescues} 次救援。继续由你完成最后一步。`
      : '从空白开始。今天不要求一次成功。'
    updateTimer()
  }
}

function statusClass(status) {
  if (['已验证', 'resolved', '独立通过'].includes(status)) return 'status-good'
  if (['需巩固', '复活中', 'queued', '提示后通过'].includes(status)) return 'status-mid'
  if (['active', '暂未通过'].includes(status)) return 'status-low'
  return 'status-new'
}

function renderSkills() {
  el('skillList').innerHTML = state.skills.map((skill) => {
    const width = Math.max(7, Math.min(100, skill.level * 32))
    return `
      <article class="skill-card">
        <div class="skill-head">
          <div>
            <div class="eyebrow">${escapeHtml(skill.group)}</div>
            <h3>${escapeHtml(skill.name)}</h3>
          </div>
          <span class="status-badge ${statusClass(skill.status)}">${escapeHtml(skill.status)}</span>
        </div>
        <p class="skill-evidence">${escapeHtml(skill.evidence)}</p>
        <div class="skill-meter"><span style="width:${width}%"></span></div>
      </article>
    `
  }).join('')
}

function renderRevivals() {
  el('revivalList').innerHTML = state.revivals.map((item) => {
    const quest = QUESTIONS[item.id] || { title: item.id, module: '' }
    const isCurrent = state.activeQuestId === item.id
    const label = item.status === 'resolved' ? '已固化' : item.status === 'active' ? '当前主线' : '待复活'
    return `
      <article class="revival-card ${isCurrent ? 'current' : ''}">
        <div class="revival-head">
          <div>
            <div class="eyebrow">${escapeHtml(quest.module)}</div>
            <h3>${escapeHtml(quest.title)}</h3>
          </div>
          <span class="status-badge ${statusClass(item.status)}">${label}</span>
        </div>
        <div class="revival-details">
          <div class="detail-row"><b>核心断点</b><span>${escapeHtml(item.reason)}</span></div>
          <div class="detail-row"><b>下一目标</b><span>${escapeHtml(item.target)}</span></div>
          <div class="detail-row"><b>复活标准</b><span>${escapeHtml(item.standard)}</span></div>
          <div class="detail-row"><b>尝试次数</b><span>${item.attempts || 0}</span></div>
        </div>
      </article>
    `
  }).join('')
}

function renderHistory() {
  const records = state.records || []
  const independent = records.filter((r) => r.result === '独立通过').length
  const totalMinutes = records.reduce((sum, r) => sum + Number(r.minutes || 0), 0)
  el('historyStats').innerHTML = `
    <div class="stat"><b>${records.length}</b><span>训练记录</span></div>
    <div class="stat"><b>${independent}</b><span>独立通过</span></div>
    <div class="stat"><b>${Math.round(totalMinutes / 60 * 10) / 10}h</b><span>累计投入</span></div>
  `
  el('historyList').innerHTML = records.map((record) => `
    <article class="history-card">
      <div class="history-head">
        <div>
          <h3>${escapeHtml(record.title)}</h3>
          <time>${escapeHtml(record.date)} · ${escapeHtml(record.module || '其他')} · ${record.minutes || 0} 分钟</time>
        </div>
        <span class="status-badge ${statusClass(record.result)}">${escapeHtml(record.result)}</span>
      </div>
      ${record.note ? `<p>${escapeHtml(record.note)}</p>` : ''}
    </article>
  `).join('')
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]))
}

function currentPrompt(reason = state.lastStuckReason) {
  const quest = getQuest()
  const session = state.activeSession
  return [
    '机试陪练更新（请按我们约定的 AI-off 协议处理）：',
    `题目：${quest.title}`,
    `模块：${quest.module}`,
    `当前目标：${quest.goal}`,
    session ? `本次模式：${session.targetMinutes} 分钟；已进行约 ${minutesElapsed(session)} 分钟` : '当前未计时',
    reason ? `我卡在：${reason}` : '',
    '',
    '请不要直接给完整答案。先判断我卡在知识、建模、API、实现、debug 还是边界，只给一级最小提示，让我继续自己完成。',
  ].filter(Boolean).join('\n')
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast('已复制。切回你固定在主屏幕的 ChatGPT 对话即可粘贴。')
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
    toast('已复制。')
  }
}

function openModal(html) {
  modalContent.innerHTML = html
  modal.classList.remove('hidden')
}

function closeModal() {
  modal.classList.add('hidden')
  modalContent.innerHTML = ''
}

function showStuckModal() {
  openModal(`
    <h3>你卡在哪一层？</h3>
    <p>先给断点命名。这样 GPT 才能只补你缺的那一级，而不是把整题接管。</p>
    <div class="option-list">
      ${['完全没思路','知道算法，但从空白写不出来','编译 / API 卡住','WA，找不到反例','边界条件不确定','TLE / 复杂度问题','debug 方向混乱'].map((x) => `<button class="option-button stuck-option" data-reason="${x}" type="button">${x}</button>`).join('')}
    </div>
  `)
  document.querySelectorAll('.stuck-option').forEach((button) => {
    button.addEventListener('click', () => chooseStuck(button.dataset.reason))
  })
}

function chooseStuck(reason) {
  patch((next) => {
    next.lastStuckReason = reason
    if (next.activeSession) next.activeSession.rescues = (next.activeSession.rescues || 0) + 1
  })
  const prompt = currentPrompt(reason)
  openModal(`
    <h3>一级提示模式</h3>
    <p>把这段发到你已经固定在手机主屏幕的 ChatGPT 对话。它会知道现在只该给最小提示。</p>
    <div class="prompt-box">${escapeHtml(prompt)}</div>
    <div class="modal-actions">
      <button id="copyPromptNow" class="primary-button" type="button">复制给 GPT</button>
      <button id="continueWithout" class="secondary-button" type="button">我再自己试 5 分钟</button>
    </div>
  `)
  el('copyPromptNow').addEventListener('click', () => copyText(prompt))
  el('continueWithout').addEventListener('click', closeModal)
}

function showAcModal() {
  openModal(`
    <h3>这次属于哪一种？</h3>
    <p>不要为了好看选“独立”。我们记录的是以后能不能稳定调用的证据。</p>
    <div class="option-list">
      <button class="option-button result-option" data-result="独立通过" type="button">独立 AC · 全程没有外部提示</button>
      <button class="option-button result-option" data-result="提示后通过" type="button">提示后 AC · 仍需冷启动复活</button>
    </div>
  `)
  document.querySelectorAll('.result-option').forEach((button) => {
    button.addEventListener('click', () => {
      const result = button.dataset.result
      closeModal()
      endSession(result, state.lastStuckReason ? `本次曾卡在：${state.lastStuckReason}` : '')
    })
  })
}

function showStopModal() {
  const session = state.activeSession
  const ignition = session?.targetMinutes === 12
  openModal(`
    <h3>${ignition ? '点火已经算完成' : '今天停在这里也可以'}</h3>
    <p>${ignition ? '12 分钟模式的目标就是“愿意回来”。不要求你把题收掉。' : '我们记录断点，不记录羞耻。下一次会从同一个具体问题继续。'}</p>
    <div class="modal-actions">
      <button id="confirmStop" class="primary-button" type="button">${ignition ? '记录一次点火' : '记录并结束'}</button>
      <button id="keepGoing" class="secondary-button" type="button">我再继续一点</button>
    </div>
  `)
  el('confirmStop').addEventListener('click', () => {
    closeModal()
    endSession(ignition ? '点火完成' : '暂未通过', state.lastStuckReason || '主动结束，保留下次断点')
  })
  el('keepGoing').addEventListener('click', closeModal)
}

function toast(message) {
  const t = el('toast')
  t.textContent = message
  t.classList.remove('hidden')
  clearTimeout(toast.timer)
  toast.timer = setTimeout(() => t.classList.add('hidden'), 2800)
}

function switchView(target) {
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.dataset.view === target))
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.target === target))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `exam-trainer-${formatDate()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function importData(file) {
  try {
    const data = JSON.parse(await file.text())
    if (data?.version !== 1 || !Array.isArray(data.records)) throw new Error('invalid')
    state = data
    state.updatedAt = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    render()
    scheduleCloudSync()
    toast('数据已导入。')
  } catch {
    toast('导入失败：不是有效的训练台 JSON。')
  }
}

function isMobile() {
  return matchMedia('(max-width: 700px)').matches || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)
}

async function signIn(providerName) {
  const provider = providerName === 'github' ? new GithubAuthProvider() : new GoogleAuthProvider()
  try {
    if (isMobile()) {
      await signInWithRedirect(auth, provider)
    } else {
      await signInWithPopup(auth, provider)
    }
  } catch (error) {
    console.warn(error)
    toast('登录失败；你仍可继续使用本机模式。')
  }
}

function renderAuth() {
  const area = el('authArea')
  if (!area) return
  if (currentUser) {
    area.innerHTML = `
      <div>当前账号：<strong>${escapeHtml(currentUser.displayName || currentUser.email || '已登录')}</strong></div>
      <div class="auth-buttons">
        <button id="manualSync" class="secondary-button" type="button">立即同步</button>
        <button id="signOutButton" class="secondary-button" type="button">退出登录</button>
      </div>
    `
    el('manualSync').addEventListener('click', async () => {
      if (!cloudEnabled) await loadCloud(currentUser)
      else await syncCloud()
    })
    el('signOutButton').addEventListener('click', () => signOut(auth))
  } else {
    area.innerHTML = `
      <div>当前仅保存在这台设备。若想让手机和电脑自动接续，可登录后启用云同步。</div>
      <div class="auth-buttons">
        <button id="googleLogin" class="secondary-button" type="button">Google 登录</button>
        <button id="githubLogin" class="secondary-button" type="button">GitHub 登录</button>
      </div>
    `
    el('googleLogin').addEventListener('click', () => signIn('google'))
    el('githubLogin').addEventListener('click', () => signIn('github'))
  }
}

document.querySelectorAll('.mode-card').forEach((button) => button.addEventListener('click', () => startSession(Number(button.dataset.minutes))))
document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.target)))
el('acButton').addEventListener('click', showAcModal)
el('stuckButton').addEventListener('click', showStuckModal)
el('stopButton').addEventListener('click', showStopModal)
el('copyStateButton').addEventListener('click', () => copyText(currentPrompt()))
el('modalClose').addEventListener('click', closeModal)
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal() })
el('exportButton').addEventListener('click', exportData)
el('importInput').addEventListener('change', (event) => {
  const file = event.target.files?.[0]
  if (file) importData(file)
  event.target.value = ''
})
el('syncButton').addEventListener('click', () => switchView('history'))

getRedirectResult(auth).catch(() => {})
onAuthStateChanged(auth, async (user) => {
  currentUser = user
  if (user) await loadCloud(user)
  else {
    cloudEnabled = false
    setSync('', '本机')
    renderAuth()
  }
})

render()
if (state.activeSession) startTimerLoop()
