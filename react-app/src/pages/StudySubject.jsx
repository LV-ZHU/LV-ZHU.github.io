import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import coMarkdown from '../data/co-markdown'
import '../styles/Study.css'

const dsExamText = `25261数据结构期末真题回忆（4学分，适用计科和信安）
题型：15个选择30分，10个填空10分，5道综合40分，程序填空4分，写功能6分，最后一题算法思想和尽量完整的代码实现各5分

一、选择：（2'*15=30'）
1.下列说法不正确的是（）
考察逻辑结构、物理结构的概念
3.以下哪项不能衡量算法（） 有时间复杂度之类的选项
4.如果频繁的要对无向图边更改，那么适合拿（） A.邻接矩阵 B.邻接表 C.十字链表 D.邻接多重表
11.往年期末原题，森林和树的转化，问二叉树左子树的个数为多少
13.判断带头节点的双循环链表只有一个节点的条件是（）A.front->next=NULL B.front=rear C.front->next=rear D.
14.简单的数组判断错误选项
15.一个链表常见的操作是在末尾删除和插入节点，最适合使用的链表类型是（） 带/不带头节点的单循环/双循环链表

二、填空：（1'*10=10'）
1.链栈S为空的判定条件是
2.递归算法转为非递归算法时经常需要使用
5. 图的判定
6. 如果一个图满足     ，那么有拓扑序列
7. 链表删除元素的时间复杂度为
8. 无向图V,E用邻接表存储，删去某个节点的时间复杂度为
9. 3阶B树每个节点关键字的个数不小于
10. 平衡二叉树的定义是平衡因子的值不大于

三、综合题（5'*8=40'）
1.和往届大题类似，给出二叉树的中序、后序序列（2'+4'+2'）
（1）先序序列  (2）画出二叉树 （3）画出先序线索二叉树
2.给定一些数，（比如12，79，23，54，45，65，68，99）随便编的
（1）如果折半插入排序，第一趟排序后的结果为 第二趟排序后的结果为（4'）
（2）如果起泡排序，第一趟排序后的结果为 第二趟排序后的结果为（4'）
3.哈希表寻址，只考了链地址法，关键字为H(Key)=Keymod11，
（1）把链地址法表格填满
（2）计算某个元素放入时的查找长度（没考ASL，只考了一个元素）
4.DFS的运用，给出图（连通分量为2）
（1）画出图对应的邻接表，按序从小到大连接  (2）给出DFS序列（2'） （3）把搜索BFS的过程转成树/森林（本题连通分量为2，V1-V6一组，V7-V9一组，自然要转成森林）
5.堆排序8个数完整写出找出最小（注意是最小）的两个数的过程

四、代码题：（4'+6'=10'）
背景给的二叉树的数据结构定义，
typedef struct BiTNode {
int data;               // 数据域
struct BiTNode *lchild; // 左孩子指针
struct BiTNode *rchild; // 右孩子指针
} BiTNode, *BiTree;
然后分成两道题：

1. 中序遍历的非递归算法程序填空，2空共4分（PPT上有）
void inorder(BiTree T){
SqStack S;  \tBiTree P=T;
InitStack(S);
do{\twhile(P){
Pop(S);
填空1; }
if (S.top){
Pop(S);
printf("%c",P->data);
填空2；}
}while((S.top!=S.base) || P);
}
2.问程序功能，一个空直接6分，结合队列考代码功能，
int countNodes(BiTree T) {
if (T == nullptr) {
return 0;
}
int count = 0;
queue<BiTree> q;
q.push(T);
while (!q.empty()) {
BiTree current = q.front();
q.pop();
if (current->lchild != nullptr && current->rchild != nullptr) {
count++;
}
if (current->lchild != nullptr) {
q.push(current->lchild);
}
if (current->rchild != nullptr) {
q.push(current->rchild);
}
}
return count;
}
上述程序的功能是

五、算法设计题（5'+5'=10'） 数据结构居然是顺序表，没有考后面树/图的代码实现
数据结构定义：
typedef struct {
int *elem;
int length;
int listsize;
} SqList;
已知一个有序顺序表，现在插入新的元素X（不需要考虑空间不够的情况），希望满足：
（1）如果表里面已经有X了就认为插入失败
（2）插入后希望数组依然有序
1.描述算法的实现思想.
2.尽可能给出完整的代码实现.

------全卷完，以下是算法设计题题解-----































就用折半查找的思想（比遍历时间复杂度低），先按照查找X的思路，用一个返回类型为bool的函数（因为书里教的C with reference，所以可以写成返回int型），如果查找出来的元素在表里就return false；否则就刚好用折半查找的O(nlongn）的时间复杂度实现了
位置的查找，然后进行顺序表经典的插入一个元素，时间复杂度为O(n)，参考代码如下：
bool InsertOrdered(SqList &L, int X)
{
// 1. 检查X是否已存在（折半查找）
int low = 0, high = L.length - 1, mid;
while (low <= high) {
mid = (low + high) / 2;
if (L.elem[mid] == X) {
return false;  // 元素已存在
} else if (L.elem[mid] < X) {
low = mid + 1;
} else {
high = mid - 1;
}
}
// 此时low是X应该插入的位置
// 2.不用判断空间是否够用，元素后移
for (int i = L.length; i > low; i--) {
L.elem[i] = L.elem[i - 1];
}
// 3. 插入X
L.elem[low] = X;
L.length++;
return true;
}`

const dmExamText = `教材：25261开始换为清华大学出版社第4版

考试纸2张A3，基本上一面2道题
一、用反证法证明素数有无穷多个（8'）

二、填空（2'*11=22'）
1. 第8章例题8.7原题，P191，问有n个元素A的自反、反自反、对称、反对称、既不对称也不反对称的数量各1个空，一共5个空
2. 第14章习题14.1（2）原题，P334，问n元集上一元、二元运算、可交换二元运算、幂等二元运算、既不可交换又不幂等的运算数量各1个空，一共5个空
3. ABC集合的韦恩图，图中阴影区域要求用集合和相对补-表示，答案是A-B-C

三、商集（8'+4'+4'=16'）
非常类似第5章例5.6，P140，只不过把f1和f2函数顺序颠倒，f3=xmod3，f4=xmod6（卷子上用的是f3=j,{x|x=3k+j,k∈N,j=0/1/2}类似的表述）
（1）求四个函数的商集 （2）定义加细关系，画出四个函数的哈斯图   （3）求集合{x|x=10k,k为自然数}在四个函数的像分别是多少

四、主合取/析取范的实际应用（8'）
三个开关每个开关都能改变灯的亮暗状态，初始为亮设为1，求所有亮的情况对应的表达式（非常类似数字逻辑，写出4个最小项即可）

五、树（4'+7'=11'）
1. 写出树的定义，并且写出判定图为树的两个充要条件
2. 类似P178，画出最小生成树并详细说明最小步骤，注意离散数学只讲了Kruskal这一种算法，不要用Prim求解

六、推理（7'）（本题"或"或许可以是书上说的两种理解中任意一种，都能正确推理，表述的不是很到位，实际题目逻辑稍复杂，但大致意思如下）
证明下列推理：已知如果小明是上海人，那么小明是同济大学或者浙江大学学生。如果小明想离开上海，则小明是浙江大学学生。证明如果小明不想离开上海，则小明是同济大学学生。

七、欧拉图的应用（4'+5'+6'=15'）
给出一张有18个节点的带权无向公路图，有两个奇度顶点A和J（需要自己观察），给出了总节点数，dijkstra算法从A到J的最短路径（因为有选了离散的同学专业课培养方案上无数据结构因此未考察dijkstra算法的具体实现）。
目标是检查所有公路图的节点，希望总路径最短。
（1）从A到J最短长度，给出一条路径（考察半欧拉图回路的书写）
（2）从D到D最短长度
（3）从D到H最短长度
分别考察奇到奇、同一偶到偶、不同偶到偶的情况

八、群论（6'+7'=13'）
（1）已知G是群，H是G子群，证明{x|x=aTya,y∈H}是子群（具体表述忘了）
 (2) 书上第14章习题14.12原题，求|x|，唯一区别是把y改成了z，只改了符号其他都没改`

const subjectData = {
  'data-structure': {
    title: '数据结构',
    icon: 'fas fa-sitemap',
    subtitle: '线性表、树、图、排序、查找',
    content: {
      type: 'exam',
      sectionTitle: '25261 期末真题回忆',
      panelTitle: '25261数据结构期末真题回忆',
      text: dsExamText,
    },
  },
  'computer-organization': {
    title: '计算机组成原理',
    icon: 'fas fa-memory',
    subtitle: 'CPU、存储器、总线、I/O',
    content: {
      type: 'markdown',
      sectionTitle: '知识点整理',
      text: coMarkdown,
    },
  },
  'os': {
    title: '操作系统',
    icon: 'fas fa-desktop',
    subtitle: '进程、内存、文件、设备管理',
  },
  'computer-network': {
    title: '计算机网络',
    icon: 'fas fa-network-wired',
    subtitle: 'TCP/IP、HTTP、DNS、路由',
  },
  'math-analysis': {
    title: '数分高数',
    icon: 'fas fa-infinity',
    subtitle: '极限、导数、积分、级数',
    content: {
      type: 'github',
      sectionTitle: '笔记',
      url: 'https://github.com/LV-ZHU/notes/blob/main/%E6%95%B0%E5%88%86%E9%AB%98%E6%95%B0.pdf',
    },
  },
  'linear-algebra': {
    title: '高代线代',
    icon: 'fas fa-table',
    subtitle: '矩阵、行列式、线性空间',
    content: {
      type: 'github',
      sectionTitle: '笔记',
      url: 'https://github.com/LV-ZHU/notes/blob/main/%E9%AB%98%E4%BB%A3%E7%BA%BF%E4%BB%A3.pdf',
    },
  },
  'discrete-math': {
    title: '离散数学',
    icon: 'fas fa-project-diagram',
    subtitle: '图论、组合、逻辑、代数结构',
    content: {
      type: 'exam',
      sectionTitle: '25261 期末回忆',
      panelTitle: '考点回忆',
      text: dmExamText,
    },
  },
  'physics': {
    title: '大学物理',
    icon: 'fas fa-atom',
    subtitle: '力学、热学、电磁学、光学',
    content: {
      type: 'github',
      sectionTitle: '笔记',
      url: 'https://github.com/LV-ZHU/notes/blob/main/%E5%A4%A7%E7%89%A9.pdf',
    },
  },
  'circuit-theory': {
    title: '电路理论',
    icon: 'fas fa-bolt',
    subtitle: '电路分析、暂态、稳态',
    content: {
      type: 'github',
      sectionTitle: '100 个常见问题',
      url: 'https://github.com/LV-ZHU/notes/blob/main/%E7%94%B5%E8%B7%AF%E7%90%86%E8%AE%BA.pdf',
    },
  },
  'assembly_language_programming': {
    title: '汇编语言程序设计',
    icon: 'fas fa-microchip',
    subtitle: '8086指令、x86架构',
    content: {
      type: 'github',
      sectionTitle: '24252 期末试卷',
      url: 'https://github.com/LV-ZHU/assembly_language_programming',
    },
  },
  'database': {
    title: '数据库',
    icon: 'fas fa-database',
    subtitle: 'SQL、关系模型、OceanBase',
  },
  'cryptography': {
    title: '密码学',
    icon: 'fas fa-lock',
    subtitle: '加密、认证、信息安全',
  },
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderSimpleMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/)
  const html = []
  let i = 0
  let inCode = false
  let inUl = false
  let inOl = false

  function closeLists() {
    if (inUl) { html.push('</ul>'); inUl = false }
    if (inOl) { html.push('</ol>'); inOl = false }
  }

  while (i < lines.length) {
    const line = lines[i]

    if (/^```/.test(line)) {
      closeLists()
      if (!inCode) { inCode = true; html.push('<pre><code>') }
      else { inCode = false; html.push('</code></pre>') }
      i += 1; continue
    }
    if (inCode) { html.push(escapeHtml(line) + '\n'); i += 1; continue }
    if (!line.trim()) { closeLists(); i += 1; continue }

    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*[-: ]+\|[-:| ]*\s*$/.test(lines[i + 1])) {
      closeLists()
      const headerCells = line.split('|').slice(1, -1).map(c => '<th>' + escapeHtml(c.trim()) + '</th>').join('')
      html.push('<table><thead><tr>' + headerCells + '</tr></thead><tbody>')
      i += 2
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        const rowCells = lines[i].split('|').slice(1, -1).map(c => '<td>' + escapeHtml(c.trim()) + '</td>').join('')
        html.push('<tr>' + rowCells + '</tr>')
        i += 1
      }
      html.push('</tbody></table>')
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      closeLists()
      const level = heading[1].length
      html.push('<h' + level + '>' + escapeHtml(heading[2]) + '</h' + level + '>')
      i += 1; continue
    }

    if (/^---+$/.test(line.trim())) { closeLists(); html.push('<hr>'); i += 1; continue }

    const ordered = line.match(/^\d+\.\s+(.+)$/)
    if (ordered) {
      if (inUl) { html.push('</ul>'); inUl = false }
      if (!inOl) { html.push('<ol>'); inOl = true }
      html.push('<li>' + escapeHtml(ordered[1]) + '</li>')
      i += 1; continue
    }

    const unordered = line.match(/^[-*+]\s+(.+)$/)
    if (unordered) {
      if (inOl) { html.push('</ol>'); inOl = false }
      if (!inUl) { html.push('<ul>'); inUl = true }
      html.push('<li>' + escapeHtml(unordered[1]) + '</li>')
      i += 1; continue
    }

    closeLists()
    html.push('<p>' + escapeHtml(line) + '</p>')
    i += 1
  }

  closeLists()
  if (inCode) html.push('</code></pre>')
  return html.join('')
}

const githubBtnWrapStyle = {
  textAlign: 'center',
  padding: '40px',
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}

const githubBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  backgroundColor: '#24292e',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: 500,
}

export default function StudySubject({ subject }) {
  const data = subjectData[subject]
  if (!data) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <h1><i className="fas fa-book" /> 学科</h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="placeholder-box">
              <i className="fas fa-ghost" />
              <p>内容正在建设中</p>
              <Link to="/study" className="card-link" style={{ marginTop: '1rem', display: 'inline-block' }}>返回学习地图</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const renderContent = () => {
    if (!data.content) {
      return (
        <FadeIn>
          <div className="placeholder-box">
            <i className="fas fa-tools" />
            <p>内容正在建设中，敬请期待</p>
          </div>
        </FadeIn>
      )
    }

    if (data.content.type === 'exam') {
      return (
        <FadeIn>
          <div className="text-file-panel">
            <div className="text-file-toolbar">
              <div className="text-file-title">{data.content.panelTitle}</div>
            </div>
            <pre className="text-file-content">{data.content.text}</pre>
          </div>
        </FadeIn>
      )
    }

    if (data.content.type === 'markdown') {
      return (
        <FadeIn>
          <div className="markdown-wrap">
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(data.content.text) }}
            />
          </div>
        </FadeIn>
      )
    }

    if (data.content.type === 'github') {
      return (
        <FadeIn>
          <div style={githubBtnWrapStyle}>
            <a
              href={data.content.url}
              target="_blank"
              rel="noopener noreferrer"
              style={githubBtnStyle}
            >
              <i className="fab fa-github" /> 跳转到GitHub仓库查看
            </a>
          </div>
        </FadeIn>
      )
    }

    return null
  }

  const sectionTitle = data.content ? data.content.sectionTitle : data.title

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className={data.icon} /> {data.title}</h1>
        <p>{data.subtitle}</p>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{sectionTitle}</h2>
          </div>
          {renderContent()}
        </div>
      </section>
    </div>
  )
}
