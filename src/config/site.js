import { projects } from '../features/projects/project_catalog'

export const SITE_NAME = 'LV-ZHU'
export const DEFAULT_DOCUMENT_TITLE = 'LV-ZHU | Personal Space'

export const studySections = [
  { label: '形式语言与自动机', path: '/study/formal-languages', keywords: '形式语言 自动机 文法 正则 DFA NFA' },
  { label: '机器学习', path: '/study/machine-learning', keywords: '机器学习 machine learning ML' },
  { label: '计算机取证', path: '/study/computer-forensics', keywords: '计算机取证 数字取证 computer forensics' },
  { label: '数据结构', path: '/study/data-structure', keywords: '数据结构 data structure 408' },
  { label: '计组', path: '/study/computer-organization', keywords: '计组 CPU 408' },
  { label: '操作系统', path: '/study/os', keywords: '操作系统 os 408' },
  { label: '计网', path: '/study/computer-network', keywords: '计网 网络 408' },
  { label: '数分高数', path: '/study/math-analysis', keywords: '数分 高数 微积分 数学分析 极限 导数' },
  { label: '高代线代', path: '/study/linear-algebra', keywords: '高代 线代 线性代数 矩阵 行列式' },
  { label: '离散数学', path: '/study/discrete-math', keywords: '离散数学 discrete math' },
  { label: '算法设计', path: '/study/algorithm-design', keywords: '算法设计 算法分析与设计 algorithm design 分治 动态规划 贪心 回溯 分支限界 线性规划' },
  { label: '人工智能', path: '/study/artificial-intelligence', keywords: '人工智能 人工智能原理与应用 AI artificial intelligence 机器学习 深度学习 强化学习' },
  { label: '信安数基', path: '/study/security-math-foundations', keywords: '信安数基 信息安全数学基础 数论 有限域 椭圆曲线' },
  { label: '大学物理', path: '/study/physics', keywords: '大学物理 物理 电磁学 光学 量子力学' },
  { label: '电路理论', path: '/study/circuit-theory', keywords: '电路理论 电路' },
  { label: '汇编语言', path: '/study/assembly_language_programming', keywords: '汇编 汇编语言 8086 指令 x86' },
  { label: '数据库', path: '/study/database', keywords: '数据库 database sql oceanbase' },
  { label: '密码学', path: '/study/cryptography', keywords: '密码学 cryptography 信安 信息安全' },
]

export const navItems = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'study', label: 'Study', path: '/study', children: studySections.map(({ label, path }) => ({ label, path })) },
  {
    key: 'projects',
    label: 'Projects',
    path: '/projects',
    children: projects.map((project) => ({ label: project.name, path: `/projects/${project.slug}` })),
  },
  { key: 'jottings', label: 'Jottings', path: '/jottings' },
  { key: 'favorites', label: 'Favorites', path: '/favorites' },
  { key: 'acgn', label: 'ACGN', path: '/acgn' },
  { key: 'music', label: 'Music', path: '/music' },
  { key: 'travel', label: 'Travel', path: '/travel' },
  { key: 'tutoring', label: 'Tutoring', path: '/tutoring' },
]

export const searchIndex = [
  { title: 'Home', path: '/', keywords: '主页 首页 home personal space' },
  { title: 'Study', path: '/study', keywords: '学习 study 课程 408 知识地图' },
  ...studySections.map((section) => ({
    title: `Study / ${section.label}`,
    path: section.path,
    keywords: section.keywords,
  })),
  { title: 'Projects', path: '/projects', keywords: '项目 projects' },
  ...projects.map((project) => ({ title: `Projects / ${project.name}`, path: `/projects/${project.slug}`, keywords: `${project.desc} ${project.repo || ''}` })),
  { title: 'Music', path: '/music', keywords: '音乐 music 歌单 eason jj' },
  { title: 'Favorites', path: '/favorites', keywords: '收藏 favorites 网址 键盘 打字 问答' },
  { title: 'Favorites / T', path: '/favorites/T', keywords: 't 同济' },
  { title: 'Jottings', path: '/jottings', keywords: '随笔 jottings' },
  { title: '同济济勤巨类大一生存指北', path: '/jottings/jiqin-fenliu', keywords: '济勤 分流 同济 生存指北' },
  { title: '面试合集', path: '/jottings/interview', keywords: '面试 答辩 interview' },
  { title: 'ACGN', path: '/acgn', keywords: '二次元 动画 游戏 小说 acgn animation game novel 植物大战僵尸 wanna 洲 舟 农 瓦 崩 原 go 铁 绝 劫 铲 穿 斗 鸣 尘 柚 ow 杀 邦 轨 mc 谷 ut 空 茶 蔚 脑 死 以 塞' },
  { title: 'Travel', path: '/travel', keywords: '旅行 旅游 travel 开元心 行夫 世界 地图' },
  { title: 'Tutoring', path: '/tutoring', keywords: '家教 tutoring 原创试题' },
  { title: 'Account', path: '/account', keywords: '账号 account 个人 昵称 profile 设置' },
].map((item) => ({
  ...item,
  searchable: `${item.title} ${item.keywords}`.toLowerCase(),
}))

const routeTitles = new Map(searchIndex.map(({ path, title }) => [path.toLowerCase(), title]))
routeTitles.set('/projects/qq-bot', 'Projects / LLM聊天机器人')

export function getDocumentTitle(pathname) {
  if (pathname === '/') return DEFAULT_DOCUMENT_TITLE

  const normalizedPath = pathname.replace(/\/$/, '').toLowerCase() || '/'
  const exactTitle = routeTitles.get(normalizedPath)
  if (exactTitle) return `${exactTitle} | ${SITE_NAME}`

  if (normalizedPath.startsWith('/favorites/')) {
    const letter = pathname.split('/').filter(Boolean).at(-1)?.toUpperCase()
    if (letter) return `Favorites / ${letter} | ${SITE_NAME}`
  }

  return `页面未找到 | ${SITE_NAME}`
}
