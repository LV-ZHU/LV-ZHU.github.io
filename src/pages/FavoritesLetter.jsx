import { useParams, Link } from 'react-router-dom'
import '../styles/Favorites.css'

const letterData = {
  A: {
    title: 'A — 代码练习',
    icon: 'fas fa-code',
    subtitle: '算法练习与在线编程平台',
    links: [
      { title: '洛谷 (Luogu)', url: 'https://www.luogu.com.cn/', icon: 'fas fa-terminal', urlDisplay: 'luogu.com.cn' },
      { title: 'LeetCode', url: 'https://leetcode.cn/', icon: 'fas fa-laptop-code', urlDisplay: 'leetcode.cn' },
      { title: '头歌', url: 'https://www.educoder.net/', icon: 'fas fa-chalkboard-teacher', urlDisplay: 'educoder.net' },
      { title: '气球问题-Leetcode312', url: 'https://thewayofnada.medium.com/how-to-solve-the-burst-balloons-problem-like-a-piece-of-cake-6121f365b1f', icon: 'fas fa-chalkboard-teacher', urlDisplay: 'DP入门题' },
    ],
  },
  B: {
    title: 'B — 学长博客',
    icon: 'fas fa-blog',
    subtitle: '学长学姐的博客和课程仓库',
    links: [
      { title: '计科信安学长访谈合集', url: 'https://tj-csccg.github.io/TJCS-F2F/', icon: 'fas fa-university', urlDisplay: 'tj-csccg.github.io/TJCS-F2F' },
      { title: '计科信安大数据课程仓库合集', url: 'https://github.com/TJ-CSCCG/TJCS-Course', icon: 'fas fa-book', urlDisplay: 'github.com/TJ-CSCCG/TJCS-Course' },
      { title: '22信安', url: 'https://isseymour.github.io/butterflyblog/', icon: 'fas fa-edit', urlDisplay: 'github.com/isSeymour' },
      { title: '22信安', url: 'https://wardell-h.github.io/', icon: 'fas fa-edit', urlDisplay: 'wardell-h.github.io' },
      { title: '22计科', url: 'https://flesymeb.github.io/', icon: 'fas fa-blog', urlDisplay: "flesymeb's Blog" },
      { title: '23计科', url: 'https://ainski.github.io/', icon: 'fas fa-brain', urlDisplay: 'ainski.github.io' },
      { title: '23信安', url: 'https://blog.chesszyh.xyz/', icon: 'fas fa-edit', urlDisplay: 'github.com/Chesszyh/' },
      { title: '24软工', url: 'https://blog.palind-rome.top/', icon: 'fas fa-edit', urlDisplay: 'blog.palind-rome.top' },
      { title: '叶神', url: 'https://github.com/Maoyao233', icon: 'fas fa-blog', urlDisplay: 'github.com/Maoyao233' },
      { title: 'DB/AI/计组去年期末复习资料', url: 'https://github.com/zytelaine/-Tongji2025CSFianlReview-', icon: 'fas fa-blog', urlDisplay: 'Tongji2025CSFianlReview' },
      { title: '信安课程仓库合集', url: 'https://github.com/ChestnutSilver', icon: 'fas fa-microchip', urlDisplay: 'skyleaworlder.github.io/.../CPU31' },
      { title: '21计科课程仓库合集', url: 'https://github.com/MurkyWorm/TongjiCSHomework', icon: 'fas fa-edit', urlDisplay: 'github.com/MurkyWorm/TongjiCSHomework' },
      { title: '24大数据，小学期python', url: 'https://github.com/PeikerYu/2025_python_programming', icon: 'fab fa-python', urlDisplay: 'github.com/PeikerYu/2025_python_programming' },
      { title: '19信安', url: 'https://github.com/slipegg', icon: 'fas fa-edit', urlDisplay: 'https://slipegg.github.io' },
      { title: '21信安', url: 'https://github.com/stayfish', icon: 'fas fa-edit', urlDisplay: 'github.com/stayfish' },
      { title: '22信安', url: 'https://github.com/KK-Ann', icon: 'fas fa-edit', urlDisplay: 'github.com/KK-Ann' },
      { title: '22信安', url: 'https://github.com/hxhr', icon: 'fas fa-edit', urlDisplay: 'github.com/hxhr' },
      { title: '22信安-课设', url: 'https://github.com/xxxy10001111/NetShield', icon: 'fas fa-edit', urlDisplay: 'github.com/xxxy10001111/NetShield' },
      { title: '23信安', url: 'https://github.com/evenhu9', icon: 'fas fa-edit', urlDisplay: 'github.com/evenhu9' },
      { title: '23信安', url: 'https://github.com/CodeVoyager0210', icon: 'fas fa-edit', urlDisplay: 'github.com/CodeVoyager0210' },
      { title: '21计科', url: 'https://github.com/italas12138/TongjiUniversity-Course', icon: 'fas fa-folder-open', urlDisplay: 'github.com/italas12138/TongjiUniversity-Course' },
      { title: '21计科', url: 'https://github.com/extreme1228/CS-IN-TJ', icon: 'fas fa-edit', urlDisplay: 'github.com/extreme1228/CS-IN-TJ' },
      { title: '21计科', url: 'https://github.com/BIGPIGFEET', icon: 'fas fa-database', urlDisplay: 'github.com/BIGPIGFEET' },
      { title: '21计科', url: 'https://github.com/MurkyWorm/TongjiCSHomework', icon: 'fas fa-edit', urlDisplay: 'github.com/MurkyWorm/TongjiCSHomework' },
      { title: '22计科', url: 'https://github.com/yuehuarulian', icon: 'fas fa-blog', urlDisplay: 'github.com/yuehuarulian' },
    ],
  },
  C: {
    title: 'C — 文章',
    icon: 'fas fa-file-alt',
    subtitle: '技术文章和参考资料',
    links: [
      { title: '右螺旋法则', url: 'https://blog.csdn.net/weixin_45710042/article/details/149065904', icon: 'fas fa-file-alt', urlDisplay: 'blog.csdn.net / weixin_45710042' },
      { title: 'Visual Studio 编译模式', url: 'https://blog.csdn.net/sac761/article/details/52120262', icon: 'fas fa-cogs', urlDisplay: 'blog.csdn.net / sac761' },
      { title: 'BMP 存储格式', url: 'https://learn.microsoft.com/zh-cn/windows/win32/api/wingdi/ns-wingdi-bitmap', icon: 'fas fa-image', urlDisplay: 'learn.microsoft.com / wingdi BITMAP' },
    ],
  },
  G: {
    title: 'G — 游戏网站',
    icon: 'fas fa-gamepad',
    subtitle: '各类游戏和娱乐平台',
    links: [
      { title: '速通网站', url: 'https://speedrun.com', icon: 'fas fa-chess', urlDisplay: 'speedrun.com' },
      { title: 'Lichess', url: 'https://lichess.org', icon: 'fas fa-chess', urlDisplay: 'lichess.org' },
      { title: 'Chess.com', url: 'https://chess.com', icon: 'fas fa-chess-king', urlDisplay: 'chess.com' },
      { title: 'Lidraughts国跳', url: 'https://lidraughts.org', icon: 'fas fa-circle', urlDisplay: 'lidraughts.org' },
      { title: '图寻', url: 'https://tuxun.fun', icon: 'fas fa-map-marker-alt', urlDisplay: 'tuxun.fun' },
      { title: '新睿桥牌', url: 'https://xinruibridge.com', icon: 'fas fa-spade', urlDisplay: 'xinruibridge.com' },
      { title: '线上桌游合集', url: 'https://game.hullqin.cn/', icon: 'fas fa-dice', urlDisplay: 'game.hullqin.cn' },
      { title: 'I Wanna 游戏合集', url: 'https://delicious-fruit.com', icon: 'fas fa-star', urlDisplay: 'delicious-fruit.com' },
      { title: 'MUGEN 形象下载', url: 'https://qxmugen.com', icon: 'fas fa-user-ninja', urlDisplay: 'qxmugen.com' },
      { title: '数织', url: 'https://cn.puzzle-nonograms.com/', icon: 'fas fa-th-large', urlDisplay: 'cn.puzzle-nonograms.com' },
      { title: 'PVZ资源站', url: 'http://www.lonelystar.org/download.htm', icon: 'fas fa-th-large', urlDisplay: 'www.lonelystar.org' },
      { title: '九章阵华录', url: 'https://tieba.baidu.com/p/5272254427?pn=1', icon: 'fas fa-th-large', urlDisplay: '植吧精品贴' },
      { title: '中国桥牌网', url: 'https://ccba.org.cn/', icon: 'fas fa-chart-line', urlDisplay: 'ccba.org.cn' },
      { title: '鳌太线穿越', url: 'https://cyberhiking.cn', icon: 'fas fa-users', urlDisplay: 'cyberhiking.cn' },
      { title: '桥友圈', url: 'http://pc.bridge-friends.com/', icon: 'fas fa-users', urlDisplay: 'pc.bridge-friends.com' },
      { title: '2048-yau版', url: 'https://everyday-life-of-celebrities.github.io/DaishuerHe', icon: 'fas fa-users', urlDisplay: 'everyday-life-of-celebrities.github.io' },
      { title: '桥牌叫牌教学', url: 'https://bridgesystem.netlify.app/', icon: 'fas fa-users', urlDisplay: 'bridgesystem.netlify.app' },
    ],
  },
  O: {
    title: 'O — 有趣网站',
    icon: 'fas fa-globe',
    subtitle: '各种有趣的网站',
    links: [
      { title: '拉导的网站推荐合集', url: 'https://lkssite.vip', icon: 'fas fa-bookmark', urlDisplay: 'lkssite.vip' },
      { title: 'enjoy physics，但不是只有physics', url: 'https://enjoyphysics.cn', icon: 'fas fa-atom', urlDisplay: 'enjoyphysics.cn' },
      { title: '浙大导航页', url: 'https://zjuers.com', icon: 'fas fa-university', urlDisplay: 'zjuers.com' },
      { title: '来自东方的神秘力量1', url: 'https://katp7luhifu2zxnpy8cs.wgetcloud.org/', icon: 'fas fa-cloud', urlDisplay: 'wgetcloud.org' },
      { title: '来自东方的神秘力量2', url: 'https://www.xcjs123.com/user', icon: 'fas fa-cloud', urlDisplay: 'www.xcjs123.com/user' },
      { title: '你是人机吗？', url: 'https://neal.fun/not-a-robot', icon: 'fas fa-robot', urlDisplay: 'neal.fun/not-a-robot' },
      { title: '阿里云地图小工具', url: 'https://datav.aliyun.com/portal/school/atlas/area_selector', icon: 'fas fa-map', urlDisplay: 'datav.aliyun.com / atlas area_selector' },
      { title: '神秘读文献方式', url: 'https://www.paper2gal.top/', icon: 'fas fa-file-alt', urlDisplay: 'paper2gal.top' },
      { title: 'EmojiMix', url: 'https://tikolu.net/emojimix', icon: 'fas fa-smile', urlDisplay: 'tikolu.net/emojimix' },
      { title: '大同杯', url: 'https://datongbei.com/', icon: 'fas fa-trophy', urlDisplay: 'datongbei.com' },
      { title: '地球Online食物合成表', url: 'https://cook.yunyoujun.cn', icon: 'fas fa-trophy', urlDisplay: 'cook.yunyoujun.cn' },
      { title: '万物皆可哈基米', url: 'https://hachima.vproxy.io/index.html', icon: 'fas fa-trophy', urlDisplay: 'hachima.vproxy.io/index.html' },
      { title: '位育北美校友会', url: 'https://weiyu51na.com/', icon: 'fas fa-trophy', urlDisplay: 'weiyu51na.com' },
      { title: '船新MBTI', url: 'https://sbti.unun.dev/', icon: 'fas fa-trophy', urlDisplay: 'sbti' },
      { title: 'B站视频总结', url: 'https://bibigpt.co/', icon: 'fas fa-trophy', urlDisplay: 'bibigpt.co' },
    ],
  },
  P: {
    title: 'P — 项目',
    icon: 'fas fa-project-diagram',
    subtitle: '有趣的开源项目',
    links: [
      { title: 'LLM聊天机器人', url: 'https://github.com/JustMon1ka/QQ-Bot-New?tab=readme-ov-file', icon: 'fas fa-robot', urlDisplay: 'github.com/JustMon1ka/QQ-Bot-New' },
      { title: 'TrendRadar — 新闻热点监控', url: 'https://github.com/bobkingdom/TrendRadar', icon: 'fas fa-chart-line', urlDisplay: 'github.com/bobkingdom/TrendRadar' },
      { title: 'gunrock — GPU 图计算库', url: 'https://github.com/gunrock/gunrock', icon: 'fas fa-project-diagram', urlDisplay: 'github.com/gunrock/gunrock' },
      { title: '抢课脚本', url: 'https://github.com/boatchanting/Tongji-Electcourse', icon: 'fas fa-project-diagram', urlDisplay: 'github.com/boatchanting/Tongji-Electcourse' },
    ],
  },
  Q: {
    title: 'Q — QQ 群号',
    icon: 'fab fa-qq',
    subtitle: '各类 QQ 群整理',
    qqGroups: [
      { num: '497301267', label: '信安' },
      { num: '195142580', label: '留学' },
      { num: '976187338', label: '就业' },
      { num: '1047837149', label: '考研' },
      { num: '943826679', label: '绿群' },
      { num: '657930661', label: '蓝群' },
      { num: '858250654', label: '紫群' },
    ],
  },
  S: {
    title: 'S — 学习资源',
    icon: 'fas fa-book-open',
    subtitle: '各类学习资源和教程',
    links: [
      { title: 'CS 自学指南', url: 'https://csdiy.wiki', icon: 'fas fa-map-signs', urlDisplay: 'csdiy.wiki' },
      { title: 'GitHub项目热点', url: 'https://hellogithub.com/', icon: 'fas fa-globe', urlDisplay: 'hellogithub.com' },
      { title: 'OI Wiki — 信息竞赛', url: 'https://oi.wiki', icon: 'fas fa-trophy', urlDisplay: 'oi.wiki' },
      { title: 'ZJU CS 基础技能拾遗', url: 'https://b23.tv/Ezrx6Av', icon: 'fas fa-play-circle', urlDisplay: 'b23.tv/Ezrx6Av' },
      { title: 'PKU CS 基础技能拾遗', url: 'https://missing.lcpu.dev/', icon: 'fas fa-terminal', urlDisplay: 'missing.lcpu.dev' },
      { title: '408 学习', url: 'http://csgraduates.com/', icon: 'fas fa-graduation-cap', urlDisplay: 'csgraduates.com' },
      { title: 'Java教程', url: 'https://javaguide.cn', icon: 'fab fa-python', urlDisplay: 'javaguide.cn' },
      { title: 'C++ Reference 详解', url: 'https://cppreference.cn/w/', icon: 'fas fa-code', urlDisplay: 'cppreference.cn' },
      { title: '廖雪峰 Python 教程', url: 'https://liaoxuefeng.com/books/python/introduction/index.html', icon: 'fab fa-python', urlDisplay: 'liaoxuefeng.com / python' },
      { title: 'Hello CTF 入门', url: 'https://hello-ctf.com/', icon: 'fas fa-flag', urlDisplay: 'hello-ctf.com' },
      { title: 'CTF Wiki — 夺旗赛', url: 'https://ctf-wiki.org', icon: 'fas fa-shield-alt', urlDisplay: 'ctf-wiki.org' },
      { title: '自动积分计算器', url: 'https://mathdf.com/int/cn/', icon: 'fas fa-integral', urlDisplay: 'mathdf.com/int/cn' },
      { title: '在线 LaTeX 编辑器', url: 'https://www.latexlive.com/', icon: 'fas fa-subscript', urlDisplay: 'latexlive.com' },
      { title: 'Git使用', url: 'https://git-scm.com/book/zh/v2', icon: 'fab fa-git-alt', urlDisplay: 'git-scm.com / book' },
      { title: '深度学习', url: 'https://cs231n.stanford.edu/index.html', icon: 'fas fa-brain', urlDisplay: 'cs231n.stanford.edu' },
      { title: 'Web技术栈', url: 'https://www.w3school.com.cn/', icon: 'fas fa-cogs', urlDisplay: 'www.w3school.com.cn' },
      { title: '古典 UNIX 美学', url: 'https://www.gnu.org/software/libc/manual/html_node/Argp.html', icon: 'fas fa-cogs', urlDisplay: 'gnu.org/software/libc' },
      { title: '风格优雅的命令行工具', url: 'https://llvm.org/docs/CommandLine.html', icon: 'fas fa-terminal', urlDisplay: 'llvm.org/docs/CommandLine' },
      { title: '现代C++参数解析工具', url: 'https://github.com/p-ranav/argparse', icon: 'fas fa-tools', urlDisplay: 'github.com/p-ranav/argparse' },
      { title: '网道开发合集', url: 'https://wangdoc.com/', icon: 'fas fa-tools', urlDisplay: 'wangdoc.com' },
      { title: 'Oceanbase数据库的简化版-MiniOB', url: 'https://oceanbase.github.io/miniob/', icon: 'fas fa-tools', urlDisplay: 'oceanbase.github.io/miniob/' },
    ],
  },
  T: {
    title: 'T — 同济网站',
    icon: 'fas fa-university',
    subtitle: '同济大学常用网站',
    links: [
      { title: '学校宣传网', url: 'https://www.tongji.edu.cn', icon: 'fas fa-globe', urlDisplay: 'www.tongji.edu.cn' },
      { title: '教务管理系统', url: 'https://1.tongji.edu.cn', icon: 'fas fa-book', urlDisplay: '1.tongji.edu.cn' },
      { title: '邮箱', url: 'https://mail.tongji.edu.cn', icon: 'fas fa-envelope', urlDisplay: 'mail.tongji.edu.cn' },
      { title: '一网通办', url: 'https://all.tongji.edu.cn', icon: 'fas fa-th', urlDisplay: 'all.tongji.edu.cn' },
      { title: '录课系统', url: 'https://look.tongji.edu.cn', icon: 'fas fa-video', urlDisplay: 'look.tongji.edu.cn' },
      { title: '旧录课系统', url: 'https://v.tongji.edu.cn', icon: 'fas fa-film', urlDisplay: 'v.tongji.edu.cn' },
      { title: 'OJ平台', url: 'https://oj.tongji.edu.cn', icon: 'fas fa-code', urlDisplay: 'oj.tongji.edu.cn' },
      { title: 'MIPS架构CPU', url: 'https://mips246.tongji.edu.cn', icon: 'fas fa-microchip', urlDisplay: 'mips246.tongji.edu.cn' },
      { title: '计算机学院', url: 'https://cs.tongji.edu.cn', icon: 'fas fa-tasks', urlDisplay: 'cs.tongji.edu.cn' },
      { title: '课程公告、作业', url: 'https://canvas.tongji.edu.cn', icon: 'fas fa-tasks', urlDisplay: 'canvas.tongji.edu.cn' },
      { title: '济你太美导航页', url: 'https://tongji.icu', icon: 'fas fa-map-signs', urlDisplay: 'tongji.icu' },
      { title: '乌龙茶选课社区', url: 'https://1.tongji.icu', icon: 'fas fa-calendar-alt', urlDisplay: '1.tongji.icu' },
      { title: '排课助手', url: 'https://xk.xialing.icu', icon: 'fas fa-sort', urlDisplay: 'xk.xialing.icu' },
      { title: '模拟选课系统', url: 'https://course.f1Justin.com', icon: 'fas fa-mouse-pointer', urlDisplay: 'course.f1Justin.com' },
      { title: '自助服务 ', url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1798312171055091713', icon: 'fas fa-print', urlDisplay: 'zzfw.tongji.edu.cn' },
      { title: '培养方案查询', url: 'https://jwc.tongji.edu.cn', icon: 'fas fa-file-alt', urlDisplay: 'jwc.tongji.edu.cn' },
      { title: '创新创业系统', url: 'https://cxcy.tongji.edu.cn', icon: 'fas fa-lightbulb', urlDisplay: 'cxcy.tongji.edu.cn' },
      { title: '高数练习', url: 'https://gaoshutongbu.tongji.edu.cn', icon: 'fas fa-calculator', urlDisplay: 'gaoshutongbu.tongji.edu.cn' },
      { title: 'C++ 教学', url: 'http://192.168.174.220', icon: 'fas fa-laptop-code', urlDisplay: '192.168.174.220' },
      { title: '新 C++ 教学', url: 'http://10.80.42.185', icon: 'fas fa-laptop-code', urlDisplay: '10.80.42.185' },
      { title: '思政课平台', url: 'https://shsj.tongji.edu.cn', icon: 'fas fa-hand-holding-heart', urlDisplay: 'shsj.tongji.edu.cn' },
      { title: '财务处缴费网站', url: 'https://paycwc.tongji.edu.cn', icon: 'fas fa-credit-card', urlDisplay: 'paycwc.tongji.edu.cn' },
    ],
  },
  U: {
    title: 'U — 实用工具',
    icon: 'fas fa-tools',
    subtitle: '各类实用软件和在线工具',
    links: [
      { title: '在线上传文件', url: 'https://upfile.live', icon: 'fas fa-file-upload', urlDisplay: 'upfile.live' },
      { title: '强力删除工具', url: 'https://geekuninstaller.com', icon: 'fas fa-trash-alt', urlDisplay: 'geekuninstaller.com' },
      { title: '截图工具', url: 'https://www.snipaste.com/', icon: 'fas fa-cut', urlDisplay: 'snipaste.com' },
      { title: '提示词优化', url: 'https://github.com/linshenkx/prompt-optimizer', icon: 'fas fa-wand-magic', urlDisplay: 'github.com / prompt-optimizer' },
      { title: '磁盘空间扫描', url: 'https://www.spacesniffer.com.cn/', icon: 'fas fa-chart-pie', urlDisplay: 'www.spacesniffer.com.cn' },
      { title: '更快的磁盘空间扫描', url: 'https://www.diskanalyzer.com/', icon: 'fas fa-chart-bar', urlDisplay: 'www.diskanalyzer.com' },
      { title: '免费的ChatGPT镜像网站合集', url: 'https://github.com/LiLittleCat/awesome-free-chatgpt', icon: 'fas fa-robot', urlDisplay: 'github.com/LiLittleCat/awesome-free-chatgpt' },
      { title: '上海图书馆', url: 'https://z.library.sh.cn/https/443/net/cnki/www/yitlink/', icon: 'fas fa-book', urlDisplay: 'z.library.sh.cn' },
      { title: '学术论文阅读', url: 'https://cajviewer.cnki.net/', icon: 'fas fa-file-alt', urlDisplay: 'cajviewer.cnki.net' },
      { title: 'Everything文件搜索工具', url: 'https://www.voidtools.com/', icon: 'fas fa-search', urlDisplay: 'www.voidtools.com' },
      { title: '下载管理器', url: 'https://www.neatdownloadmanager.com/index.php/en/', icon: 'fas fa-download', urlDisplay: 'www.neatdownloadmanager.com' },
      { title: '卡西欧在线版', url: 'https://edu.casio.com/softwarelicense/index.php', icon: 'fas fa-calculator', urlDisplay: 'edu.casio.com/softwarelicense/index.php' },
      { title: 'GHOST电脑备份恢复系统', url: 'https://gitcode.com/open-source-toolkit/ae422', icon: 'fas fa-clone', urlDisplay: 'gitcode.com/open-source-toolkit/ae422' },
      { title: 'AI降噪工具1', url: 'https://www.topazlabs.com', icon: 'fas fa-sliders-h', urlDisplay: 'www.topazlabs.com' },
      { title: 'AI降噪工具2', url: 'https://www.dxo.com/technology/deepprime/', icon: 'fas fa-camera', urlDisplay: 'www.dxo.com' },
      { title: '文件共享工具', url: 'https://u-torrent.org/', icon: 'fas fa-share-alt', urlDisplay: 'u-torrent.org' },
      { title: 'rar格式压缩工具', url: 'https://www.win-rar.com/', icon: 'fas fa-file-archive', urlDisplay: 'www.win-rar.com sj指定压缩工具' },
      { title: '压缩工具', url: 'https://www.bandisoft.com/bandizip/', icon: 'fas fa-file-archive', urlDisplay: 'www.bandisoft.com/bandizip' },
      { title: '功能丰富的磁盘管理工具', url: 'https://www.diskgenius.com/', icon: 'fas fa-hdd', urlDisplay: 'www.diskgenius.com' },
      { title: '图片素材网', url: 'https://miankoutupian.com/', icon: 'fas fa-image', urlDisplay: 'miankoutupian.com' },
      { title: '下载分区助手', url: 'https://www.disktool.cn/download.html', icon: 'fas fa-chart-pie', urlDisplay: 'www.disktool.cn/download.html' },
      { title: '几何画板', url: 'http://www.jinhu.me/article.asp?id=253', icon: 'fas fa-chalkboard-teacher', urlDisplay: 'www.jinhu.me' },
      { title: '格式工厂', url: 'https://www.pcgeshi.com/', icon: 'fas fa-file-video', urlDisplay: 'www.pcgeshi.com' },
    ],
  },
}

const placeholderLetters = ['D', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'R', 'V', 'W', 'X', 'Y', 'Z']

export default function FavoritesLetter() {
  const { letter } = useParams()
  const upperLetter = letter?.toUpperCase()
  const data = letterData[upperLetter]

  if (!data && !placeholderLetters.includes(upperLetter)) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <h1><i className="fas fa-keyboard" /> {upperLetter}</h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="placeholder-box">
              <i className="fas fa-ghost" />
              <p>页面未找到</p>
              <Link to="/favorites" className="card-link" style={{ marginTop: '1rem', display: 'inline-block' }}>返回键盘</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Placeholder page
  if (!data) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <h1><i className="fas fa-keyboard" /> {upperLetter} 键 | 待配置</h1>
          <p>当前分区还未配置内容，可在 Favorites 键盘页中开启编辑模式快速修改此键说明和跳转。</p>
        </div>
        <section className="section">
          <div className="container">
            <div className="placeholder-box">
              <i className="fas fa-folder-open" />
              <h3>此分区暂未添加站点</h3>
              <p style={{ marginTop: '0.5rem' }}>请返回键盘主页后点击 <strong>{upperLetter}</strong> 键进行配置，或直接编辑当前页面内容。</p>
              <p style={{ marginTop: '1rem' }}><Link className="card-link" to="/favorites"><i className="fas fa-arrow-left" /> 返回 Favorites 键盘页</Link></p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className={data.icon} /> {data.title}</h1>
        <p>{data.subtitle}</p>
      </div>
      <section className="section">
        <div className="container">
          <Link to="/favorites" className="back-btn"><i className="fas fa-arrow-left" /> 返回键盘</Link>
          {data.qqGroups ? (
            <div className="link-grid">
              {data.qqGroups.map((g, i) => (
                <div key={i} className="qq-item">
                  <div className="qq-num">{g.num}</div>
                  <div className="qq-label">{g.label}</div>
                </div>
              ))}
            </div>
          ) : data.links ? (
            <div className="link-grid">
              {data.links.map((link, i) => (
                <a key={i} className="lk" href={link.url} target="_blank" rel="noopener noreferrer">
                  <div className="lk-icon"><i className={link.icon} /></div>
                  <div className="lk-body">
                    <div className="lk-title">{link.title}</div>
                    <div className="lk-url">{link.urlDisplay}</div>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
