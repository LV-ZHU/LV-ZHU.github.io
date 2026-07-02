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

const coExamText = `考试时间：120分钟
满分：100分

一、选择（1×25=25）
1.冯诺伊曼型计算机最显著的特征是（）
2.由0和1组成的语言是（）
3.计算减法的方式是（）
5.给出a补，b补，计算z=x*2+y/2的值为（）
6.阶码长、尾数短和阶码短、尾数长的指令相比精度和表示范围（）
7.给8位数据海明码纠错至少需要的检验位位数是（）
A.2   B.3   D.4   E.5
11.字长32位，4MB，则寻址范围为（）
12.Cache的主要意义是（）
13.指令周期是指（）
14.变址寻址，条件相关1000H，2000H，3000H，4000H，则地址为（）
15.关于RISC说法错误的是（）
16.微程序存放在（）中
A.存储寄存器   B.CPU
17.水平型微指令和垂直型微指令的特点是（）
A.前者一次一个操作，后者一次多个操作
B.前者一次多个操作，后者一次一个操作
C.都一次一个操作
D.都一次多个操作
18.分组微指令，有5个互斥组，分别为3、7、14、4、8，则总长为（）
21.带宽计算
22.I/O通道
23.若采用条件转换中断，中断方式为（）
24.多道程序中断适用的情况是（）
25.数据7位，其中1位奇偶校验位，1位，1位，已知速率，则带宽是（）

二、填空（1×15=15）
1.原码乘法符号位计算方法是_____________，
数值位计算方式是___________
2.总线判优控制的三种方式是______、_______、_______
3.SRAM的查询方式有______和______
4.存放指令的寄存器是_______，存放下一条指令地址的是_______，若计算机采用微程序控制器，则存放微程序指令的是______，存放下一条指令的是_______
5.中断和DMA的优先级一般_____更高
6.虚拟存储器里地址的实际地址叫______，计算出的相应地址叫______
7.设命中率为h，Cache的存储时间为Tc，主存的存取时间为Tm，则平均存取时间为______

三、简答（5×6=30）
1.从数据传输的角度，解释区分查询、中断、DMA、I/O接口的使用场景
2.画出4体交叉存储器的模式图
3.给出平均找道时间ti，转速r，N，n个字，计算总时长
4.指令长16位，操作码4位，设计三地址码15条、二地址码30条、一地址码31条、零地址码16条的指令数据格式
5.给出某七位二进制数（如1011101）采用偶检验，计算海明码并指出第6位出错如何纠错
6.分析中断屏蔽的作用

四、解答（3×10=30）
1.主存有8组B0-B7，Cache有4组C0-C3，块内有2块，4KB，32字
给出B1、B2、B0、B7、B4、...访问序列（共10个），使用FIFO
（1）写出主存组成，以及各段位数
（2）画出主存到cache的映射图
（3）计算该访问序列的命中率
2.给出指令图，23个控制信号，PC不会自动自增，写出下列三个指令对应的微操作（指出每个控制序列）
（1）(Rd)+R[dist]->Rd
（2）(Rd)，ALU
（3）JNZ R[dist]，Z=0
3.微指令，4096×65，有8个条件判断指令（直接判别法）
分为微指令字段、判别字段、后地址字段
（1）计算三者的位数
（2）画出指令逻辑图
（3）分析连续执行指令的过程`

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

const cryptoExamText = `考试时间：95分钟
满分：100分

一、单选（2×11=22）
1. 希尔密码环上的矩阵乘法计算
2. 线性攻击属于哪类攻击
3. 不用ECB工作模式的原因是
4. 128bit分组，192bit的AES穷搜索的时间复杂度期望
5.
6. Hash特点
7. 生日攻击属于什么问题
8. 具有不可否认性的是
9. 签名和加密的顺序是
10. 哪个不是一次一密的特点
11. 以下哪个不是Hash函数要满足的条件

二、判断（1×15=15）
1. RSA是语义安全的
2. 判断RSA上大素数n的奇偶性问题和判断n的分解方式一样难
3. Alice签名用公钥，Bob用私钥验证
4. Alice签名应该用私钥，Bob用Alice公钥验证
5. 先压缩后加密唯一解距离
6. DES用代换-置换网络
7. S盒是非线性的
8.
9. AES使用了Shannon扩散-混淆的思想
10. 迭代Hash函数一定由分组密码而来
11. DES轮函数可逆
12. 消息认证码不带有密钥
13.
14.
15. Kerchoff假设敌手已知部分算法细节

三、填空（3×4=12）
1. 置换密码
π    1  2  3
     2  1  3
解密函数_______，crypto加密后的结果_____
2. 流密钥满足zi+4=zi⊕zi+1，则（1，1，1，0）的周期为______
3. 完善密码里K=100，则C＝____

四、解答（8+6+7+8+9+8+5）
1. 证明每个K概率都为1/26的移位密码具有完善保密性（Bayes公式）
2. CFB模式
（1）写出解密公式
（2）如果明文出错会怎么影响密文
3. 证明RSA里大素数n图灵规约于欧拉函数φ(n)
4. 密文空间为M，给出原像攻击，并计算穷搜索的概率
5. RSA算法变形RSA'，y=x^(2a)(mod n)
（1）给出该签名的安全性分析，并指明类型
（2）给出改进方法
6. Elgamal算法的变形GElgamal，
y1=α^k，y2=x+β^k
（1）计算解密函数
（2）若私钥a未知，证明Elgamal算法图灵规约于CDN问题
7. 若Elgamal签名里随机数k∈Zn泄露，会带来什么安全风险`

const aiExamText = `考试时间：95分钟
满分：100分

一、单选（10×1=10）
1. h(n)=0对应的算法是
2. 八数码问题的h1(n)和h2(n)
3. alpha-beta性质
4. 比较id3和C4.5算法
5. A*和贪婪算法的共同点是
6.
7. LDA和PCA的最主要区别是
8.
9. 遗传算法里参数大小关系是
10.

二、多选（10×2=20）
1.
2. K-means聚类算法说法正确的是
3. 搜索的要素选择
4.
5. CNN
6. 正则化方式
7. 激活函数
8. 神经网络池化层
9.
10. transformer自注意力机制

三、填空（10×1=10）
1. 搜索open表表示的是_____
2. A*搜索一致性的条件是h(n)＜___+h(n')
4. PCA___
5. LDA让类间样本差异___，类内样本差异___
6. 遗传算法里高频操作是将染色体_____
7.
8. 可以实时更新强化学习策略的方法是____
9. 神经网络

四、解答（10+12+8+10+10+10）
1. 【确定性推理】逻辑推理（5+5）
凶手一定在现场，且摸过柜子
Wangwu、Liliu、Zhaoqi凶手三选一排斥或
Wangwu不在场
柜子上只有Liliu和Wangqi的指纹
Liliu有不在场证明（当天在外地）
Zhaoqi指纹匹配
（1）化为子句集
（2）用归结原理推测凶手是谁
2. 【神经网络与深度学习】RNN（3+3+3+3）
（1）写出梯度偏导的递推公式
（2）在T较大时，当|Wh|＞1和＜1时分别会出现什么现象，并说明背后的数学原理
（3）LSTM
（a）写出LSTM的所有门
（b）写出ht的更新公式
（c）遗忘门的作用是
（4）RNN和LSTM分别怎么处理梯度消失问题？
3. 【不确定性推理】贝叶斯网络求概率（8）
给出贝叶斯网络和概率分布表，求P(V=T|G=T，S=T)
4. 【对抗搜索】alpha-beta剪枝算法（10）
5层20个叶子节点，标注非叶子节点各节点值，并标注各处剪枝是alpha还是beta剪枝
5. 【机器学习】决策树，id3（3+4+2+3）
给出二分类列表
（1）计算结果的熵H(D)
（2）分别计算条件熵H(D|A1)、H(D|A2)、H(D|A3)
（3）分别计算三者的信息增益，并说明节点应在哪个维度展开
（4）该算法对类别较多的样本效果不好，给出解决方案
6. 【强化学习】Q-learning（4+3+3）
给定4×4网格和格点参数值
（1）写出Q-learning公式，并更新Q(2,2)
（2）给出maxQ，更新Q(2,3)
（3）解释为什么ε参数不能过大也不能过小`

const securityMathExamText = `考试时间：2小时
满分：100分

一、选择（2×10=20）
1. 2x≡3（mod 7）和2x≡4（mod 10）同时成立的个数有（）
A.0 B.1 C.2 D.35
2. 欧拉函数φ(100)的值为（）
3.
4.
5. n²≡5（mod 13）的解的个数为（）
6. O为无穷远点，椭圆曲线P、Q过R(x,y)，则P+Q=（）
A.(x,y) B.(-x,y) C.O D.(x,-y) E.不确定
7. 以下哪个不是循环群（）
A.Z₁₉ B.F₂¹⁰⁰ C.Z₂₇ D.Z₁₀₀
E.实数域上的乘法子群
8. 有限域F₂⁵的乘法群元素个数为（）
A.31 B.32 C.2 D.4 E.8 F.16
9. Z₅*上，α=2，β=3，则log_αβ是（）
10. 点(89,18)在椭圆曲线上压缩后是（）

二、判断（1×18=18）
1.
2. 整数a、s、b、t满足as+bt=1，则a与b互素
3. 元素个数相同的有限域未必同构
4. 阶相同的有限循环群必同构
5.
6.
8. 2是循环群Z₁₃的生成元，x⁵≡3（mod 13）的解和log₂5x=log₂3（mod 13）的解相同
9. 通过Fermat素性检测的未必为合数，通过的一定为素数
10. Miller-Rabin基于二次剩余，Solovay-Strassen基于费马小定理
11. 将111011011二进制NAF后是100100101
12. 椭圆曲线把倍数-和扩展成倍数-和差是因为求逆很容易，并会用NAF算法降低计算量
13.
14.
15.
16. 若整系数多项式f(x)=ax²+bx+c（mod p）有三个解，则对任意整数a，都有f(a)=0（mod p）
17. 若a是整数，则a^(p-1)≠1可得p为素数
18. Zₘ是域的充要条件是m是素数

三、填空（3×4=12）
1. 若x≡-1（mod 29）且x≡-1（mod 3），则
x=____（mod 87）
2. 模数53的原根个数为____
3. 模数31的所有次数为2的原根为_____
4. 写出一组模数8的缩系______

四、解答（6+6+6+5+6+5+8+8=50）
1. n用九进制表示n=a₀+a₁9+...+aₖ9ᵏ
证明10|n是a₀-a₁+a₂-...+(-1)ᵏaₖ的充分必要条件
2. 写出同余方程3x+9≡0（mod 66）模66形式的解
3. 证明群G是阿贝尔群的充要条件是f:G→G，
f(a)=a⁻¹是同构的
4. 求雅各比符号(17/65)的值
5. 已知m-p|mn+qp，求证m-p|mq+np
6. 求f(x)=...和g(x)=x²+x在F₃[x]域上的最大公因式
7. 证明：已知x₁、x₂分别是模m₁、m₂上的一组剩余系，则x₁+m₁x₂是通过模m₁m₂的一组完全剩余系
8. 有限域F₂[x]/(x³+x²+1)，α=x²+x+1，β=x+1，求值
（1）αβ
（2）α⁻¹`

const algorithmExamText = `考试时间：120分钟
满分：100分

一、填空（2×5=10）
1.设背包问题目标为n，重量w，则时间复杂度为_____，优化后空间复杂度为______
2.二分查找用了____思想，最坏时间复杂度___
3._____用了深度优先，____用了广度优先
4.贪心算法的性质是____和_____
5.若问题A可以在多项式时间内规约到问题B，A是NP完全问题，则B问题是_____

二、选择（2×5=10）
1.对算法描述正确的是（）
A.
B.不同输入可能造成不同的时间复杂度
C.空间复杂度与时间复杂度无关
D.算法O(n2)的计算时长一定大于O(n)算法的问题
2.两阶段单纯形法计算第二阶段最优解时一定没有（）
A.人工变量 B.松弛变量 C.剩余变量 D.自由变量
3.0-1背包问题不能拿（）
A.贪心算法 B.动态规划法
C.回溯法     D.分支限界法
4.多机调度问题接近最佳策略的贪心算法是
（）
A.依其所需的处理时间从小到大排序
B.依其所需的处理时间从大到小排序
C.等时长排序  D.任意顺序均可
5.最大字段和问题拿（）方法不能得到最优解
A.贪心算法 B.穷举法
C.分治法     D.动态规划法

三、简答（6+6+8=20）
1.比较Prim和Kruskal算法的不同，从对象类型、数据结构、适应范围三个角度
2.回溯法用剪枝是优化复杂度的关键策略。给出至少3种剪枝的方法，说明适用范围和原理
3.证明
（1）若f(n)=O(g(n)),g(n)=O(h(n)),则f(n)=O(h(n))
（2）O(f(n))+O(g(n))=O(max{f(n),g(n)})

四、解答（12×5=60）
1.有效 IP 地址正好由四个整数（每个整数位于 0 到 255 之间，且不能含有前导 0），整数之间用 . 分隔。
给定一个只包含数字的字符串 s，通过在字符串中插入 . 形成所有合法 IP；不能重新排序、不能删除任意数字。
返回所有可能的有效 IP 地址集合。
示例
输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]
2.有一些球形气球贴在一堵用 XY 平面表示的墙面上。气球记录在整数数组 points 中，其中 points[i] = [xstart, xend] 表示水平直径在 xstart 和 xend 之间的气球。
一支弓箭可以沿着 x = t 射出。在坐标 x 处射出一支箭，若有一个气球的直径的开始和结束坐标为 xstart，xend，且满足 xstart ≤ x ≤ xend，则该气球会被引爆。
给你一个数组 points，返回引爆所有气球所必须射出的最小弓箭数。
3.给定一个整数数组stones，其中stones[i]表示第i块石头的重量，用这些石头玩游戏。在每一轮选择任意两块石头并将它们砸在一起。假设这两块石头的重量分别为x和y，且x <= y。这次砸石头的结果是：如果x == y，两块石头都被摧毁；如果x != y，重量为x的石头被摧毁，重量为y的石头的新重量为y - x。游戏结束时，最多只剩下一块石头。
使用动态规划法返回剩余石头的最小可能重量。如果没有石头剩下，则返回0。
4.给定一个 R × C （<=10）的网格棋盘，其中某些格子是需要被覆盖的目标格（用 # 表示），其余格子是空格（用 . 表示，不需覆盖且不能放置方块）。同时给定 N 个不同形状的方块，每个方块由若干小方格组成。每个方块可以旋转，但不能翻转。用分支限界法输出一种可行方案
输入格式
第一行三个整数 R, C, N，分别表示棋盘的行数、列数和方块数量。
接下来 R 行，每行一个长度为 C 的字符串
接下来依次描述 N 个方块，每个方块的第一行包含两个整数 h, w 表示高和宽
样例输入
3 3 2
###
###
###
2 2
##
##
1 2
##
5.工厂A、B产品，消耗总时间不得多于24小时
，机器值不超过60，A、B可以不是整数
另外有购买限制：A不超过10，B不超过8
利润(元)  单位时间(时)   机器
40                2                   3
30                3                   4
用单纯形法计算A、B分别生产多少件时，总利润最大`

const databaseExamText = `考试时间：120分钟
满分：100分

一、多选题（2×10=20）
1.下列属于关系代数基本操作的有（）
A.选择 B.投影 C.赋值   D.笛卡尔  E.自然连接
2.
3.下列说法正确的是（）
A.natural join自动除去相同属性元素
B.outer left join保留左边全部元组和右边部分元组
C.natural join
4.下列哪些聚合函数计算时不考虑Null值（）
A.Avg   B.Sum  C.Count  D.Max
5.
6.选择操作树高hi，有n个指针，则选择主码需要I/O的次数是（）
A.hi    B.hi+1   C.hi+n   D.hi*n
7.下面有关索引说法正确的是（）
A.B+树适合等值查询和范围查询
B.散列索引适合范围查询
8.锁协议
9.事务的状态有（）
A.active      B. Partially committed  C.Failed
D.aborted   E.waiting      F.commited
10.下列说法正确的有（）
A.延迟数据库修改和即刻数据库修改
B.undo写盘...
C.redo写盘...
D.checkpoint可以减少查找压力

二、数据库设计（15+15+20=50）
1.用关系代数表达式描述关系模式R(A,B,C,D)S(D,E,F)T(E,F,G)
（1）查找R里非B、C属性（3分）
（2）计算R和S连接值按E降序排列（3分）
（3）S和T公共属性（3分）
（4）所有在S里不在T里的E/F属性 （3分）
（5）自行给出一个包含关系R，S，T的元组并给出关系代数表达式（3分）
2.学生(Student):StuId,StuName,...,...
教师(instructor):instructorid,...,....,...
课程(course):courseID,...,...
院系(department):deptname,building,...
每位老师可以教授多门课程，一门课程可由多个老师教，每位学生可选多个老师的课，教师和课程间存在teach关系，学生和院系存在StudyAt，教师和院系存在WorkAt关系，并有WorkYear属性，学生和课程间存在Study Semester关系
（1）画出ER图，标注属性关系，写出关系模式，并指明各个属性的主码和外码（5分）
（2）给出建Student表的SQL语句，并注明可行性约束（3分）
（3）给出SQL查询，查各个老师各门课程的上课学生人数（4分）
（4）给出关系代数表达式，给出查询优化，给出优化后的关系代数表达式（3分）
3.关系R=<U,F>，U={A,B,C,D,E}，F=<AB->CDE,AC->BD,B->CD,C->D,B->E>
（1）求(AB)+，(BC)+  （4分）
（2）求F的正则覆盖，说明理由（4分）
（3）写出R的全部候选码，并判断R最高属于第几范式（4分）
（4）对R进行分解，使其满足3NF（4分）
（5）证明该分解无损连接保持依赖（4分）

三、数据库管理系统（9+11+10=30）
1.数据库并发操作可能产生丢失修改、不可重复读、读脏数据等数据不一致问题。请举例阐述这些问题的含义，并指出基于锁的协议怎么解决这些问题（9分）
2.事务管理
T1：读A
T2：读写A，读写B
T3：读A，读C
T4：读写B，读写C
（1）给出一个上述事务的调度，要求产生死锁（6分）
（2）给出上述调度优先图，并解释处理死锁的方法（5分）
3.恢复系统
下图中包含4个并发事务 T1, T2, T3, T4，其中数据A, B, C 的初始值为：A=800, B=500, C=300，采用Immediate database modification，且在事务T2开始时创
建了一个检查点
（1）给出上述调度的日志记录以及 A, B, C 的最终结果
（2）在事务 T4提交前发生了故障，应当采取什么样的恢复操作，并解释原因

四、附加题（5分，二选一，若都做只计算第1题分值）
1.B+树，给定一组数据
（1）简述B+树和B树的区别
（2）建树，插入数据
（3）删除数据
2.归并外排序，给定t1-t12（如t1(107,a)，t2(114,c),t8(170,b),t11(153,r)，每个内存有3个数据块，给出按照第一个元组属性的排序`

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
  'algorithm-design': {
    title: '算法分析与设计',
    icon: 'fas fa-code-branch',
    subtitle: '概论、分治、动态规划、贪心、回溯、分支限界、线性规划',
    content: {
      type: 'exam',
      sectionTitle: '回忆版真题',
      panelTitle: '算法设计回忆版真题',
      text: algorithmExamText,
    },
  },
  'computer-organization': {
    title: '计算机组成原理',
    icon: 'fas fa-memory',
    subtitle: 'CPU、存储器、总线、I/O',
    content: {
      type: 'sections',
      sections: [
        {
          type: 'exam',
          sectionTitle: '期末回忆',
          panelTitle: '计算机组成原理期末回忆',
          text: coExamText,
        },
        {
          type: 'markdown',
          sectionTitle: '知识点整理',
          text: coMarkdown,
        },
      ],
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
  'artificial-intelligence': {
    title: '人工智能原理与应用',
    icon: 'fas fa-robot',
    subtitle: '搜索、推理、机器学习、强化学习',
    content: {
      type: 'exam',
      sectionTitle: '25262 期末回忆',
      panelTitle: '考点回忆',
      text: aiExamText,
    },
  },
  'security-math-foundations': {
    title: '信安数基',
    icon: '',
    subtitle: '数论、群、原根、二次剩余、素性检测、环、域、椭圆曲线',
    content: {
      type: 'exam',
      sectionTitle: '期末回忆',
      panelTitle: '考点回忆',
      text: securityMathExamText,
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
    subtitle: '关系代数、SQL、E-R图、正则覆盖、索引、查询优化、事务、并发控制、恢复系统',
    content: {
      type: 'exam',
      sectionTitle: '25262期末回忆',
      panelTitle: '数据库期末总结',
      text: databaseExamText,
    },
  },
  'cryptography': {
    title: '密码学',
    icon: 'fas fa-lock',
    subtitle: '加密、认证、信息安全',
    content: {
      type: 'exam',
      sectionTitle: '25262 期末回忆',
      panelTitle: '考点回忆',
      text: cryptoExamText,
    },
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

  const renderContentBlock = (content) => {
    if (content.type === 'exam') {
      return (
        <FadeIn>
          <div className="text-file-panel">
            <div className="text-file-toolbar">
              <div className="text-file-title">{content.panelTitle}</div>
            </div>
            <pre className="text-file-content">{content.text}</pre>
          </div>
        </FadeIn>
      )
    }

    if (content.type === 'markdown') {
      return (
        <FadeIn>
          <div className="markdown-wrap">
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(content.text) }}
            />
          </div>
        </FadeIn>
      )
    }

    if (content.type === 'github') {
      return (
        <FadeIn>
          <div style={githubBtnWrapStyle}>
            <a
              href={content.url}
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

  const renderContent = () => {
    if (!data.content) {
      return (
        <>
          <div className="section-header">
            <h2 className="section-title">{data.title}</h2>
          </div>
          <FadeIn>
            <div className="placeholder-box">
              <i className="fas fa-tools" />
              <p>内容正在建设中，敬请期待</p>
            </div>
          </FadeIn>
        </>
      )
    }

    if (data.content.type === 'sections') {
      return data.content.sections.map((section) => (
        <div className="subject-content-section" key={section.sectionTitle}>
          <div className="section-header">
            <h2 className="section-title">{section.sectionTitle}</h2>
          </div>
          {renderContentBlock(section)}
        </div>
      ))
    }

    return (
      <>
        <div className="section-header">
          <h2 className="section-title">{data.content.sectionTitle}</h2>
        </div>
        {renderContentBlock(data.content)}
      </>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>{data.icon && <i className={data.icon} />} {data.title}</h1>
        <p>{data.subtitle}</p>
      </div>
      <section className="section">
        <div className="container">
          {renderContent()}
        </div>
      </section>
    </div>
  )
}
