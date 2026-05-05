import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import FadeIn from '../components/FadeIn'
import '../styles/ProjectDetail.css'

/* ============================================================
   C++ BigHW
   ============================================================ */
function CppBigHW() {
  const downloads = [
    { file: '13-b7-bmp.exe', size: '176 KB', desc: 'BMP图像读取' },
    { file: '90-01-b1.exe', size: '98 KB', desc: '汉诺塔' },
    { file: '90-01-b2.exe', size: '125 KB', desc: '数织' },
    { file: '90-02-b1.exe', size: '181 KB', desc: '几何图形' },
    { file: 'txt_compare.exe', size: '255 KB', desc: '文本对比工具' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1><i className="fas fa-laptop-code" /> C++ BigHW</h1>
        <p>C++部分作业项目</p>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">程序下载</h2>
            <p className="section-desc">注意要在cmd窗口下运行</p>
          </div>

          <div className="download-list fade-in">
            {downloads.map((d) => (
              <a
                key={d.file}
                className="download-item"
                href={`${import.meta.env.BASE_URL}assets/cpp-bighw/${d.file}`}
                download
              >
                <i className="fas fa-file-arrow-down" />
                <div className="download-meta">
                  <div className="download-name">{d.file}</div>
                  <div className="download-size">大小：{d.size}</div>
                  <div className="download-usage">功能：{d.desc}</div>
                </div>
              </a>
            ))}
          </div>

          <p className="repo-note fade-in">
            代码仓库：<a href="https://github.com/LV-ZHU/OOP" target="_blank" rel="noopener noreferrer">LV-ZHU/OOP</a>。
          </p>

          <p className="download-note fade-in">
            提示：下载 EXE 时浏览器或系统可能出现安全提示，属于常见现象。                </p>
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   FPGA
   ============================================================ */
function FPGA() {
  return (
    <div>
      <div className="page-header">
        <h1><i className="fas fa-microchip" /> FPGA 开发</h1>
        <p>Verliog编写</p>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">数字逻辑实验</h2>
            <p className="section-desc">基于 MP3 和 OLED 的数字系统设计</p>
          </div>

          <p className="repo-note fade-in">
            Github仓库：<a href="https://github.com/LV-ZHU/OLED_MP3_PLAYER" target="_blank" rel="noopener noreferrer">LV-ZHU/OLED_MP3_PLAYER</a>。
          </p>
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   GPU
   ============================================================ */
function GPU() {
  const pdfUrl = `${import.meta.env.BASE_URL}assets/gpu/介数中心性.pdf`

  return (
    <div>
      <div className="page-header">
        <h1><i className="fas fa-server" /> GPU</h1>
        <p>GPU 相关项目</p>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">GPU资料</h2>
            <p className="section-desc">介数中心性</p>
          </div>

          <div className="doc-viewer-wrap fade-in">
            <iframe
              className="doc-viewer"
              src={pdfUrl}
              title="GPU 资料 PDF"
            />

            <div className="doc-actions">
              <a className="doc-btn" href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-up-right-from-square" />
                新标签打开
              </a>
              <a className="doc-btn" href={pdfUrl} download>
                <i className="fas fa-download" />
                下载 PDF
              </a>
            </div>

            <p className="doc-tip">若当前浏览器不支持内嵌预览，请使用"新标签打开"或"下载 PDF"。</p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   QQ Bot  --  Architecture SVG connection drawing
   ============================================================ */
function useArchSvg(mapRef) {
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const svg = map.querySelector('#arch-conn')
    const board = map.querySelector('#arch-board')
    if (!svg || !board) return

    function pos(id) {
      const el = document.getElementById(id)
      if (!el) return null
      const r = el.getBoundingClientRect()
      const m = map.getBoundingClientRect()
      return {
        cx: r.left - m.left + r.width / 2,
        cy: r.top - m.top + r.height / 2,
        top: r.top - m.top,
        bottom: r.bottom - m.top,
        left: r.left - m.left,
        right: r.right - m.left,
      }
    }

    function line(x1, y1, x2, y2) {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      l.setAttribute('x1', x1)
      l.setAttribute('y1', y1)
      l.setAttribute('x2', x2)
      l.setAttribute('y2', y2)
      return l
    }

    function draw() {
      svg.innerHTML = ''
      const w = map.scrollWidth
      const h = map.scrollHeight
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.setAttribute('width', w)
      svg.setAttribute('height', h)

      const pA = pos('astr-local')
      const pC = pos('astr-cloud')
      const pQ = pos('qq-plat')
      const pL = pos('llbot')
      const pN = pos('napcat')

      if (!pA || !pC || !pQ) return

      const platNodes = board.querySelectorAll('.arch-platforms .arch-node')

      // AstrBot(local) -> each platform: bottom to top
      platNodes.forEach((node) => {
        const r = node.getBoundingClientRect()
        const m = map.getBoundingClientRect()
        const nx = r.left - m.left + r.width / 2
        svg.appendChild(line(pA.cx, pA.bottom, nx, r.top - m.top))
      })

      // AstrBot(cloud) -> each platform: top to bottom
      platNodes.forEach((node) => {
        const r = node.getBoundingClientRect()
        const m = map.getBoundingClientRect()
        const nx = r.left - m.left + r.width / 2
        svg.appendChild(line(pC.cx, pC.top, nx, r.bottom - m.top))
      })

      // LLBot -> QQ platform
      if (pL && pQ) {
        svg.appendChild(line(pL.cx, pL.bottom, pQ.cx, pQ.top))
      }

      // NapCat -> QQ platform
      if (pN && pQ) {
        svg.appendChild(line(pN.cx, pN.top, pQ.cx, pQ.bottom))
      }
    }

    function debounce(fn, ms) {
      let t
      return () => { clearTimeout(t); t = setTimeout(fn, ms) }
    }

    const timer = setTimeout(draw, 100)
    const debouncedDraw = debounce(draw, 150)
    window.addEventListener('resize', debouncedDraw)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', debouncedDraw)
    }
  }, [mapRef])
}

/* ============================================================
   QQ Bot  --  Main component
   ============================================================ */
function QQBot() {
  const mapRef = useRef(null)
  useArchSvg(mapRef)

  return (
    <div>
      <div className="page-header">
        <h1><i className="fas fa-robot" /> LLM 聊天机器人 </h1>
        <p className="muted">基于 AstrBot 的多平台聊天助手</p>
      </div>

      <section className="section">
        <div className="container">
          <article className="tech-article fade-in">

            {/* Project intro + architecture + ports + IP check */}
            <p>这是一个基于 <a href="https://docs.astrbot.app/" target="_blank" className="ext-link"><i className="fas fa-link" /> AstrBot </a> 的 LLM 聊天机器人项目，对接QQ、钉钉、飞书、微信等消息平台，可接入各大模型的API。下图展示了各组件间的关系。</p>

            <h2 className="zone-title">架构图</h2>
            <div className="arch-map" id="arch-map" ref={mapRef}>
              <svg id="arch-conn" />
              <div className="arch-board" id="arch-board">
                {/* Local deployment */}
                <div className="arch-section">
                  <div className="arch-section-title">本地部署</div>
                  <div className="arch-flow">
                    <div className="arch-node node-local">
                      <span className="node-title">Windows</span>
                    </div>
                    <span className="arch-arrow"><i className="fas fa-arrow-right" /></span>
                    <a id="astr-local" className="arch-node node-hub" href="https://docs.astrbot.app/deploy/astrbot/desktop.html" target="_blank" rel="noopener noreferrer">
                      <span className="node-title">AstrBot</span>
                      <span className="node-desc">本地部署</span>
                    </a>
                    <span className="arch-arrow"><i className="fas fa-arrow-right" /></span>
                    <a id="llbot" className="arch-node node-adapter" href="https://luckylillia.com/guide/choice_install" target="_blank" rel="noopener noreferrer">
                      <span className="node-title">LLBot</span>
                      <span className="node-desc">WebSocket 服务端</span>
                    </a>

                    <a className="arch-node node-im" href="https://im.qq.com/" target="_blank" rel="noopener noreferrer">
                      <span className="node-title">Windows QQ</span>
                    </a>
                  </div>
                </div>

                {/* Platforms */}
                <div className="arch-platforms">
                  <span className="arch-platforms-label">消息平台</span>
                  <a className="arch-node node-im" href="https://docs.astrbot.app/platform/dingtalk.html" target="_blank" rel="noopener noreferrer">
                    <span className="node-title">钉钉</span>
                  </a>
                  <a className="arch-node node-im" href="https://docs.astrbot.app/platform/lark.html" target="_blank" rel="noopener noreferrer">
                    <span className="node-title">飞书</span>
                  </a>
                  <a id="qq-plat" className="arch-node node-im" href="https://docs.astrbot.app/platform/aiocqhttp.html" target="_blank" rel="noopener noreferrer">
                    <span className="node-title">QQ</span>
                  </a>
                  <a className="arch-node node-im" href="https://docs.astrbot.app/platform/weixin_oc.html" target="_blank" rel="noopener noreferrer">
                    <span className="node-title">个人微信</span>
                  </a>
                </div>

                {/* Cloud deployment */}
                <div className="arch-section">
                  <div className="arch-section-title">云端部署</div>
                  <div className="arch-flow">
                    <a className="arch-node node-server" href="https://account.aliyun.com/" target="_blank" rel="noopener noreferrer">
                      <span className="node-title">阿里云</span>
                      <span className="node-desc">云服务器</span>
                    </a>
                    <span className="arch-arrow"><i className="fas fa-arrow-right" /></span>
                    <a className="arch-node node-server" href="https://www.bt.cn/new/product_linux.html" target="_blank" rel="noopener noreferrer">
                      <span className="node-title">宝塔面板</span>
                      <span className="node-desc">容器环境管理</span>
                    </a>
                    <span className="arch-arrow"><i className="fas fa-arrow-right" /></span>
                    <a id="astr-cloud" className="arch-node node-hub" href="https://docs.astrbot.app/deploy/astrbot/btpanel.html" target="_blank" rel="noopener noreferrer">
                      <span className="node-title">AstrBot</span>
                      <span className="node-desc">宝塔Docker部署</span>
                    </a>
                    <span className="arch-arrow"><i className="fas fa-arrow-right" /></span>
                    <a id="napcat" className="arch-node node-adapter" href="https://napneko.github.io/guide/boot/Shell" target="_blank" rel="noopener noreferrer">
                      <span className="node-title">NapCat</span>
                      <span className="node-desc">WebSocket 服务端</span>
                    </a>

                    <a className="arch-node node-im" href="https://im.qq.com/" target="_blank" rel="noopener noreferrer">
                      <span className="node-title">Linux QQ</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <p className="map-note">QQ若想体验更完善的bot功能需要经过反向WS协议接入AstrBot；其他平台直连AstrBot即可。下面的[IP]若采用本地部署填写localhost，若采用服务器部署填写对应IP。</p>

            {/* Port section */}
            <div className="port-section">
              <div className="port-row">
                <div className="port-cards">
                  <div className="port-card">
                    <div className="port-label">AstrBot WebUI</div>
                    <code>http://[IP]:6185</code>
                  </div>
                  <div className="port-card">
                    <div className="port-label">宝塔面板 WebUI(初次登录时可能会更改端口)</div>
                    <code>http://[IP]:8888</code>
                  </div>
                  <div className="port-card">
                    <div className="port-label">NapCat WebUI</div>
                    <code>http://[IP]:6099</code>
                  </div>
                </div>
                <div className="port-card port-card-llbot">
                  <div className="port-label">LLBot WebUI</div>
                  <code>http://[IP]:3080</code>
                </div>
              </div>

              <details className="ip-check">
                <summary><i className="fas fa-code" /> 判断 IPV4 地址合法性的 C 语言风格代码</summary>
                <div className="code-block">{`static bool is_ipaddr_valid(const char* const ipstr)
{
    int dot_count = 0;
    for (int i = 0; ipstr[i]; i++) {
        if (!(ipstr[i] == '.' || (ipstr[i] >= '0' && ipstr[i] <= '9')))
            return false;
        if (ipstr[i] == '.')
            dot_count++;
    }
    if (dot_count != 3)
        return false;

    int dot_index[3] = { 0 };
    for (int i = 0, j = 0; ipstr[i]; i++) {
        if (ipstr[i] == '.') {
            dot_index[j] = i;
            j++;
        }
    }
    if (dot_index[0] == 0 || dot_index[2] == (int)strlen(ipstr) - 1)
        return false;
    for (int i = 0; i < 2; i++) {
        if (dot_index[i + 1] - dot_index[i] == 1)
            return false;
    }

    int ip_number[4] = { 0 };
    ip_number[0] = atoi(ipstr);
    for (int i = 0; i < 3; i++)
        ip_number[i + 1] = atoi(&ipstr[dot_index[i] + 1]);
    for (int i = 0; i < 4; i++) {
        if (ip_number[i] < 0 || ip_number[i] > 255)
            return false;
    }

    return true;
}`}</div>
              </details>
            </div>

            {/* Component table */}
            <div className="table-wrap">
              <table className="arch-table">
                <thead>
                  <tr>
                    <th>组件</th>
                    <th>部署位置</th>
                    <th>端口</th>
                    <th>端口内容</th>
                    <th>说明</th>
                    <th>跳转链接/说明文档</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>阿里云服务器</td>
                    <td>云主机</td>
                    <td>-</td>
                    <td>服务器</td>
                    <td>提供公网服务器环境，注意需放行安全组端口</td>
                    <td><a href="https://account.aliyun.com/" target="_blank" rel="noopener noreferrer">阿里云控制台</a></td>
                  </tr>
                  <tr>
                    <td>宝塔面板</td>
                    <td>宿主机</td>
                    <td>8888</td>
                    <td>WebUI</td>
                    <td>提供 Docker 环境与服务管理</td>
                    <td><a href="https://www.bt.cn/new/product_linux.html" target="_blank" rel="noopener noreferrer">宝塔面板</a></td>
                  </tr>
                  <tr>
                    <td>AstrBot</td>
                    <td>Docker</td>
                    <td>6185</td>
                    <td>WebUI</td>
                    <td>模型调度、平台配置、插件管理</td>
                    <td><a href="https://docs.astrbot.app/" target="_blank" rel="noopener noreferrer">AstrBot 文档</a></td>
                  </tr>
                  <tr>
                    <td>OneBot 连接</td>
                    <td>Docker ↔ 宿主机</td>
                    <td>6199</td>
                    <td>内网 WS</td>
                    <td>NapCat/LLBot通过此端口将 QQ 消息转发给 AstrBot</td>
                    <td><a href="https://napneko.github.io/onebot/" target="_blank" rel="noopener noreferrer">OneBot 协议</a></td>
                  </tr>
                  <tr>
                    <td>NapCat</td>
                    <td>宿主机/本地</td>
                    <td>6099</td>
                    <td>WebUI</td>
                    <td>QQ 协议适配器，OneBot 协议端实现，转发消息给 AstrBot</td>
                    <td><a href="https://napneko.github.io/" target="_blank" rel="noopener noreferrer">NapCat 文档</a></td>
                  </tr>
                  <tr>
                    <td>LLBot</td>
                    <td>宿主机/本地</td>
                    <td>3080</td>
                    <td>WebUI</td>
                    <td>和 NapCat 一致的功能，WebSocket 服务端</td>
                    <td><a href="https://luckylillia.com/" target="_blank" rel="noopener noreferrer">LLBot 文档</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ====== 从 0 到 1 ====== */}
            <h2 className="zone-title">从 0 到 1 完成 bot 版本的 Hello World</h2>
            <p>本地部署较为容易，可参考 <a href="https://luckylillia.com/guide/choice_install" target="_blank" className="ext-link"><i className="fas fa-external-link-alt" /> LLBot 安装指南</a> 和 <a href="https://luckylillia.com/guide/install_astrbot" target="_blank" className="ext-link"><i className="fas fa-external-link-alt" /> LLbot 对接 AstrBot </a>，安装后启动<code>llbot.exe</code>、登录 QQ 号开始监听消息，再启动 AstrBot 的 <code>start.bat</code> 按终端提示访问 WebUI 即可。下面主要讲讲服务器部署。</p>

            <h3 className="topic-title">服务器选型与环境搭建</h3>
            <div className="issue-card">
              <p>阿里云新账号有300元云服务器ECS免费试用，默认是 Windows Server，但由于 Windows 系统大量资源会消耗在图形化上，且诸如宝塔、1Panel等服务器管理软件普遍对 Linux 支持性更好，于是更换为 Ubuntu 镜像。连接服务器时尽量采用<a href="https://www.xshell.com/zh/free-for-home-school/" target="_blank" className="ext-link"><i className="fas fa-external-link-alt" />Xshell</a>连接，若使用阿里云自带连接方式尽量不使用VNC连接实例，VNC对扩展 ASCII 码适配较差，命令行中文会乱码，且会出现英文字母大小写问题。尽量使用<strong>Workbench</strong>或<strong>SSH</strong>连接。另外注意服务器需要按需放行诸如8888、6199、6185、6099、3080等端口。</p>
            </div>

            <h3 className="topic-title">Docker 装 AstrBot</h3>
            <div className="issue-card">
              <h4>宝塔 Docker 、端口映射</h4>
              <p>宝塔面板使服务器更便于管理（本质上是给部分命令行操作提供了WebUI界面），参考<a href="https://docs.astrbot.app/deploy/astrbot/btpanel.html" target="_blank" className="ext-link"><i className="fas fa-external-link-alt" /> 宝塔面板容器部署astrbot </a>完成操作，一定要注意安装好astrbot容器后进入<strong>容器编排</strong>在配置文件里添加<code>- {'${QQ_WS_PORT}'}:6199 </code>并在对应.env中添加环境变量<code> QQ_WS_PORT=6199</code>，从而使 Napcat 和 Astrbot 的内网通信端口正常工作，也可以用下面的命令行方式:</p>
              <div className="code-block">{`docker run -d --restart always \\
  -p 6185:6185 -p 6199:6199 \\
  -v ./data:/AstrBot/data \\
  --name astrbot \\
  soulter/astrbot:latest`}</div>
            </div>

            <h3 className="topic-title"> 连通钉钉时遇到的问题及解决方案 </h3>
            <p>装好了 AstrBot 就可以接入大多数消息平台了，我遇到的问题是钉钉 Stream 模式接入时反复报 <code>401 authFailed</code></p>
            <div className="issue-card">
              <h4>日志现象</h4>
              <p>AstrBot 启动后，日志里第一次连接成功获取了 endpoint：</p>
              <p><code>endpoint is {'{'}'endpoint': 'wss://wss-open-connection-union.dingtalk.com:443/connect', ...{'}'}</code></p>
              <p>但紧接着几秒后第二次连接就报错了：</p>
              <p><code>open connection failed, error=401 Client Error: Unauthorized ... response.text={'{"code":"authFailed","message":"鉴权失败"}'}</code></p>
            </div>
            <div className="issue-card">
              <h4>排查过程</h4>
              <p><strong>1.排除凭证问题。</strong>在终端用 curl 测试 AppKey 和 AppSecret：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">curl -X POST "https://api.dingtalk.com/v1.0/oauth2/accessToken" -H "Content-Type: application/json" -d {'\'{"appKey":"...","appSecret":"..."}\''}</span>
              </div>
              <p>返回了 accessToken，说明凭证没问题。</p>
              <p><strong>2.排除 IP 白名单。</strong>确认服务器出口 IP 与钉钉开发平台上配置的一致：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">curl ifconfig.me</span>
              </div>
              <p>返回的 IP 与后台白名单一致，排除。</p>
              <p><strong>3.检查系统时钟。</strong>钉钉的鉴权机制基于 Token 签名，对服务器时间非常敏感。如果系统时钟与标准时间偏差过大，生成的签名会直接失效：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">ntpdate ntp.aliyun.com</span>
              </div>
              <p>检查后发现时钟偏差只有 -0.000598 秒，排除。</p>
              <p><strong>4.检查发布状态。</strong>在钉钉开放平台，改了 IP 白名单、重置 Secret 或更改权限后，必须去版本管理与发布点确认发布，不然线上网关跑的还是旧配置。钉钉的 API 校验（curl 拿 token）和长连接网关（Stream Connection）是不同的逻辑，curl 拿 Token 只要 AppKey/Secret 对了就能给，但 connections/open 需要连接网关确认你的应用当前线上版本是否开启了 Stream 能力。发现顶部有黄色警告条"版本发布后，当前修改才能生效"，点击发布。但发布后依然 401。</p>
              <p><strong>5.发现问题：多实例并发。</strong>看进程列表：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">ps -ef | grep python</span>
              </div>
              <p>发现同一个 main.py 有<strong>多个 PID</strong> 在跑。原因是宝塔面板的Python 项目管理器默认开了异常重启，只要进程被 kill 就会立刻拉起一个新的，这样钉钉网关就会同时收到多份连接。而钉钉 Stream 模式一个 AppKey 只允许<strong>一个并发连接</strong>，多出来的全部返回 401。</p>
            </div>
            <div className="issue-card">
              <h4>解决方案</h4>
              <p>先在宝塔面板停止项目、关闭异常重启，然后清掉所有残留进程，等几分钟让钉钉网关释放旧连接，最后手动单次启动成功：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">pkill -9 -f main.py</span>
                <span className="cmd-chip">ps -ef | grep python</span>
              </div>
            </div>

            <h3 className="topic-title">安装 NapCat</h3>
            <div className="issue-card">
              <h4>Shell 模式 vs Docker 模式</h4>
              <p>NapCat 有多种<a href="https://napneko.github.io/guide/boot/Shell" target="_blank" className="ext-link"><i className="fas fa-external-link-alt" /> 部署方式 </a>，执行一键安装命令后还会提供两种模式选择：Docker 模式（镜像自带完整环境，资源隔离但稍重）和 Shell 模式（直接跑在宿主机上，轻量但依赖系统库）。选了 Shell 模式，官方安装脚本会交互式询问协议类型，注意输入协议名（比如此处就是反向WS <code>reverse_ws</code>），另外不建议装tui，命令行环境下操作可视化界面并不友好效果不如直接输入命令。</p>
              <p>Shell 模式还有一些系统依赖要装，按照提示操作，阿里云精简版 Ubuntu 默认不带这些图形渲染库，不装的话 QQ 核心进程无法启动（报 GPU 初始化错误）：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">apt-get install -y xvfb libnss3 libasound2 libgbm1 ttf-wqy-zenhei</span>
              </div>
            </div>

            <h3 className="topic-title"> 连通 QQ 时遇到的问题及解决方案</h3>
            <p>常见现象是 NapCat 和 AstrBot 都装好了，但消息就是不通。可能的原因很多，需要结合日志一个个排查。</p>
            <div className="issue-card">
              <p><strong>配置文件</strong>方面，反向 WebSocket 一定要配对。NapCat 的配置文件路径在 <code>root/Napcat/opt/QQ/resources/app/app_launcher/napcat/config</code> 下，包括连接类型/ws、Napcat WebUI的 token 都在该目录下。</p>
              <p><strong>端口连接</strong>方面，先在安全组放行端口。在容器里运行 <code>telnet 127.0.0.1 6199</code>，看到 Connected 就说明通了；然后可以再模拟 astrbot 的连接行为：<code>docker exec -it astrbot netstat -tulnp | grep 6199</code>。</p>
            </div>
            <div className="issue-card">
              <h4>排查技巧</h4>
              <p>用安装 NapCat 时提供的 token 登录 WebUI（<code>http://公网IP:6099/webui</code>），可以直观看到 QQ 登录状态、服务端开启情况等信息。</p>
            </div>

            {/* ====== 从 1 到 10 ====== */}
            <h2 className="zone-title">从 1 到 10 确保 bot 稳定在线</h2>
            <h3 className="topic-title">开启守护进程</h3>
            <p>成功发出消息后最重要的需求就是确保 Astrbot+Napcat 能稳定运行。<code>nohup</code> 和 <code>screen</code> 指令能解决连接断开的问题（<code>screen -dmS napcat</code> 创建后台会话，<code>Ctrl+A</code> 再按 <code>D</code> 退出但不关闭），但服务器重启后它们无法自动恢复。比较好的方案是 systemd 守护进程。</p>
            <p>创建服务文件在 <code> /etc/systemd/system/napcat.service </code>目录下，具体的诸如 xvfb-run 的路径可以用<code> where </code>指令查询后替换：</p>
            <div className="code-block">{`[Unit]
Description=NapCat QQ Bot Service
After=network.target

[Service]
WorkingDirectory=/root/Napcat/opt/QQ/
ExecStart=/usr/bin/xvfb-run -a /root/Napcat/opt/QQ/qq --no-sandbox -q <此处替换为机器人要登录的 QQ 号>
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=napcat
User=root

[Install]
WantedBy=multi-user.target`}</div>
            <p>输入命令激活：</p>
            <div className="cmd-inline">
              <span className="cmd-chip">systemctl daemon-reload</span>
              <span className="cmd-chip">systemctl enable napcat</span>
              <span className="cmd-chip">systemctl start napcat</span>
            </div>
            <p>验证状态：</p>
            <div className="cmd-inline">
              <span className="cmd-chip">systemctl status napcat</span>
            </div>
            <p>看到绿色的 <code>active (running)</code> 就说明守护进程已经开好了。以后确认 bot 工作状态是否正常可以在 QQ 聊天框里发 #Napcat，如果没有响应，可以用 <code>journalctl -u napcat -f</code>看日志，或者直接登录<code>http://IP地址:6099/webui</code>看 QQ 登录情况。如果连各类 WebUI 都登不上了，可能是服务器实例规格不够的原因，可检查服务器运行状态，升级服务器规格或者强制重启。</p>
            <p>排查 bot 问题时如果需要修改配置文件可以在找到对应文件所在目录后<code> cat </code>和重定向命令覆盖。</p>

            {/* ====== 节省服务器内存 ====== */}
            <h2 className="zone-title">节省服务器内存</h2>
            <p>如果用的是小规格服务器，跑 AstrBot+NapCat+QQ 资源可能会比较吃紧，容易夯住然后磁盘 IO 读写受限。</p>

            <h3 className="topic-title">内存占比排查方式</h3>
            <div className="issue-card">
              <p>几个常用的排查命令：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">free -h</span>
              </div>
              <p>看整体内存和 Swap 使用情况，重点关注 <code>available</code> 那一列。如果 available 只剩一两百兆甚至更少，就该清理了。</p>
              <div className="cmd-inline">
                <span className="cmd-chip">top</span>
              </div>
              <p>打开 top 后按 <code>Shift+M</code> 按内存排序，能直观看到哪些进程吃得最多。</p>
              <div className="cmd-inline">
                <span className="cmd-chip">ps aux --sort=-%mem | head -20</span>
              </div>
              <p>这条命令列出内存占用 Top 20 的进程。如果看到 MySQL 之类的进程但根本没在用数据库，可以考虑减少不必要的内存开销。</p>
            </div>

            <h3 className="topic-title">使用 Swap </h3>
            <div className="issue-card">
              <p>Swap 是 Linux 的"虚拟内存"，内存不够时会把一部分数据写到磁盘上。它不能替代真正的内存（磁盘比内存慢几个数量级），但至少能让系统在内存紧张时不至于直接 OOM 崩溃。</p>
              <p>先看有没有开 Swap：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">swapon --show</span>
              </div>
              <p>如果输出为空，说明没开。可以手动创建一个 2G 的 Swap 文件（阿里云服务器也可以用云助手）：</p>
              <div className="code-block">{`# 创建 2G 的 swap 文件
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 写入 fstab 让它开机自动挂载
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab`}</div>
              <p>挂好之后再 <code>free -h</code> 看看。可以调整 <code>vm.swappiness</code> 值（默认为 0，即全部用完再去 Swap）为 30：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">sudo sysctl vm.swappiness=30</span>
              </div>
              <p>永久生效的话加一行 <code>vm.swappiness=30</code> 到 <code>/etc/sysctl.conf</code>，这里 30 就代表内存可用百分比低于 30% 时开始 Swap。</p>
            </div>

            <h3 className="topic-title">清理 QQ 缓存 </h3>
            <div className="issue-card">
              <p>QQ 基于 Electron，运行过程中会在 <code>~/.config/QQ/</code> 目录下堆积大量缓存。用一段时间后，这个目录轻松涨到几百兆甚至上 G。</p>
              <p><strong>聊天缓存</strong>在 <code>nt_qq/</code> 子目录下，群聊越多这个目录越大。<strong>表情包</strong>在 <code>emoji/</code> 目录下。<strong>日志文件</strong>在 <code>xlog/</code> 目录下，各种 <code>.xlog</code> 文件会持续增长。</p>
              <p>可以先看看 QQ 缓存吃了多少空间：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">du -sh ~/.config/QQ/</span>
                <span className="cmd-chip">{"du -sh ~/.config/QQ/nt_qq/ ~/.config/QQ/emoji/ ~/.config/QQ/xlog/ 2>/dev/null"}</span>
              </div>
              <p>可以使用的一些指令（先排查具体的文件路径然后rm -rf即可）:</p>
              <div className="code-block">{`rm -rf ~/.config/QQ/nt_qq/*/Emoji/
rm -rf ~/.config/QQ/nt_qq/*/File/
rm -rf ~/.config/QQ/nt_qq/*/Video/
rm -rf ~/.config/QQ/nt_qq/*/Ptt/
rm -f ~/.config/QQ/xlog/*.xlog
rm -f ~/.config/QQ/*.log`}</div>
              
            <p>清理后 QQ 会慢慢重新生成这些目录和文件，可以配合 cron 定期清理。</p>
            </div>

            <h3 className="topic-title">关掉不需要的系统服务</h3>
            <div className="issue-card">
              <p>用 <code>systemctl list-units --type=service --state=running</code> 看看都有哪些默认服务在跑。</p>
              <p>几个常见的可以关掉的服务：</p>
              <div className="code-block">{
`# MySQL 数据库
sudo systemctl stop mysql
sudo systemctl disable mysql
# fwupd 固件更新服务
sudo systemctl stop fwupd
sudo systemctl mask fwupd   # disable 只是不自动启动，但其他服务可以把它拉起来；mask 是创建一个指向 /dev/null 的符号链接，不会再启动。对于确定不需要的服务（比如云服务器上的固件更新），用 mask 更安心。
# snapd Snap 包管理器
sudo systemctl stop snapd snapd.socket
sudo systemctl disable snapd snapd.socket`}</div>
            </div>
            <h3 className="topic-title">NapCat 日志清理</h3>
            <div className="issue-card">
              <p>NapCat 运行时也会产生日志文件。日志路径一般在 <code>/root/Napcat/opt/QQ/resources/app/app_launcher/napcat/logs/</code> 下面。可以手动清理，也可以配合 cron 定期清理：</p>
              <div className="cmd-inline">
                <span className="cmd-chip">find /root/Napcat/ -name "*.log" -mtime +7 -delete</span>
              </div>
              <p>这条命令删除 7 天前的日志文件。如果用了 Docker 部署 AstrBot，Docker 自身的日志也可能很大，可以用下面的命令限制日志大小：</p>
              <div className="code-block">{`# 在 docker-compose.yml 里加日志限制
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"`}</div>
            </div>

            {/* ====== 从 10 到 100 ====== */}
            <h2 className="zone-title">从 10 到 100 利用 Astrbot 丰富的扩展生态</h2>

            <h3 className="topic-title">模型接入</h3>
            <p>AstrBot 支持接入各大厂商的 AI API，可以参考<a href="https://docs.astrbot.app/providers/start.html" target="_blank" className="ext-link"><i className="fas fa-link" /> Astrbot 接入 AI </a>，有些模型直接接入适配性较差，可以选择OpenAI或Anthropic的通用格式接入，选择自定义模型自行添加即可连接对应API。</p>

            <h3 className="topic-title">知识库</h3>
            <p>AstrBot 内置知识库功能（RAG），流程是先配置一个嵌入模型，然后在知识库管理页面创建知识库并关联该模型，上传文档后系统会自动切片、向量化并建立索引。使用时 bot 会根据用户问题检索相关片段作为上下文喂给大模型，从而基于你的资料回答。可以参考<a href="https://docs.astrbot.app/use/knowledge-base.html" target="_blank" className="ext-link"><i className="fas fa-link" /> Astrbot 知识库</a>。</p>

            <h3 className="topic-title">网页搜索</h3>
            <p>AstrBot 支持网页搜索，开启后 bot 可以联网检索实时信息，减少幻觉。支持 Tavily、BoCha、百度 AI 搜索和 Brave 四种搜索源，填入对应的 API Key 即可，可以参考<a href="https://docs.astrbot.app/use/websearch.html" target="_blank" className="ext-link"><i className="fas fa-link" /> Astrbot 网页搜索</a>。</p>

            <h3 className="topic-title">Skills</h3>
            <p>AstrBot 的 Skills 功能和 Claude 的 Skill 类似，通过上传包含指令和脚本的模块化文件，让 bot 按需加载执行特定任务，可参考<a href="https://docs.astrbot.app/use/skills.html" target="_blank" className="ext-link"><i className="fas fa-link" /> Astrbot Skills</a>。</p>

            <h3 className="topic-title">人格设定</h3>
            <p>Astrbot可以添加人格设定作为系统提示词，并且在不同的平台、群聊里使用不同的配置文件从而达到个性化定制 bot 说话风格的效果。人格文案可以参考<a href="https://jiupamiao.asia/" target="_blank" className="ext-link"><i className="fas fa-link" />各种风格的prompt</a>。</p>

            <h3 className="topic-title">插件</h3>
            <p>AstrBot 有非常丰富的插件系统（名为Star），可以在 WebUI 上挑选插件安装，也可以按需求自己写插件，插件目录在 <code>data/plugins/</code> 目录下。下面列举一部分插件：</p>

            {/* Plugin category: QQ管理工具 */}
            <div className="plugin-category">
              <div className="plugin-category-header"><i className="fas fa-shield-halved" /> QQ管理工具</div>
              <table className="plugin-table">
                <thead><tr><th>插件名称</th><th>功能简介</th><th>命令举例</th></tr></thead>
                <tbody>
                  <tr><td><strong>艾特群友</strong></td><td>把QQ私聊消息转发到群里，支持@指定用户</td><td><code>/send 群号 [@用户] 要发送的内容</code></td></tr>
                  <tr><td><strong>QQ群管</strong></td><td>禁言、全体禁言、踢人、拉黑、改群昵称、改头衔、设管理员、设精华、撤回消息、改群头像、改群名、发群公告、整理群友信息</td><td><code>禁言 {'<秒数>'} @用户</code> 对指定群员禁言</td></tr>
                  <tr><td><strong>qq_group_sign</strong></td><td>QQ定时签到</td><td><code>/设置打卡时间 hh:mm:ss</code> 在指定时间打卡</td></tr>
                </tbody>
              </table>
            </div>

            {/* Plugin category: 工具增强 */}
            <div className="plugin-category">
              <div className="plugin-category-header"><i className="fas fa-wrench" /> 工具增强</div>
              <table className="plugin-table">
                <thead><tr><th>插件名称</th><th>功能简介</th><th>命令举例</th></tr></thead>
                <tbody>
                  <tr><td><strong>biliVideo 视频总结</strong></td><td>提供b站视频链接生成视频总结,可订阅up主功能、定时推送最新视频</td><td><code>/总结 {'<视频链接>'}</code> 总结视频内容</td></tr>
                  <tr><td><strong>astrbot_plugin_github_cards</strong></td><td>根据GitHub链接发送GitHub 仓库简介/issue/pr卡片</td><td><code>/ghsub 用户名/仓库名</code> 订阅指定 GitHub 仓库的更新</td></tr>
                  <tr><td><strong>插件生成器</strong></td><td>可以调用LLM生成自己想要的插件</td><td><code>/生成插件 {'<插件功能描述>'}</code> 生成插件</td></tr>
                  <tr><td><strong>Markdown杀手</strong></td><td>移除输出中的Markdown格式</td><td>LLM智能判断</td></tr>
                  <tr><td><strong>astrbot_plugin_recall_cancel</strong></td><td>当用户撤回触发LLM回应的消息时，如果回复还未发送则取消发送</td><td>LLM智能判断</td></tr>
                  <tr><td><strong>meme_manager</strong></td><td>根据回复内容概率额外回复表情包</td><td>LLM智能判断</td></tr>
                  <tr><td><strong>Anti-Prompt Injector</strong></td><td>防止提示词注入，支持不同强度、拉黑攻击者等操作</td><td><code>/反注入帮助</code> 查看全部指令</td></tr>
                </tbody>
              </table>
            </div>

            {/* Plugin category: 历史消息分析 */}
            <div className="plugin-category">
              <div className="plugin-category-header"><i className="fas fa-chart-bar" /> 历史消息分析</div>
              <table className="plugin-table">
                <thead><tr><th>插件名称</th><th>功能简介</th><th>命令举例</th></tr></thead>
                <tbody>
                  <tr><td><strong>astrbot_plugin_message_stats</strong></td><td>QQ群消息统计插件，支持消息数量统计和排行榜生成</td><td><code>#发言榜</code> 查看总发言排行榜</td></tr>
                  <tr><td><strong>人物画像</strong></td><td>根据聊天记录分析群友画像</td><td><code>画像@群友</code> 分析指定群友画像</td></tr>
                  <tr><td><strong>群分析总结插件</strong></td><td>群聊内容趣味分析</td><td><code>/群分析 [天数]</code> 分析对应天数内的聊天记录</td></tr>
                  <tr><td><strong>用户画像</strong></td><td>在聊天中自动提取用户背景信息，起到聊天增强效果</td><td><code>我的画像</code> 查看自己的画像信息</td></tr>
                </tbody>
              </table>
            </div>

            {/* Plugin category: 学习 */}
            <div className="plugin-category">
              <div className="plugin-category-header"><i className="fas fa-book" /> 学习</div>
              <table className="plugin-table">
                <thead><tr><th>插件名称</th><th>功能简介</th><th>命令举例</th></tr></thead>
                <tbody>
                  <tr><td><strong>LeetCode每日亿题</strong></td><td>推送LeetCode每日一题、获取/解答特定编号题目</td><td><code>/lc菜单</code> 查看功能帮助</td></tr>
                  <tr><td><strong>CTF 赛题及赛事推送助手</strong></td><td>获取 CTFTime 全球即将开始的高质量赛事、题库</td><td><code>/ctf</code> 从nssctf跳题，支持分tag跳题</td></tr>
                </tbody>
              </table>
            </div>

            {/* Plugin category: 游戏 */}
            <div className="plugin-category">
              <div className="plugin-category-header"><i className="fas fa-gamepad" /> 游戏</div>
              <table className="plugin-table">
                <thead><tr><th>插件名称</th><th>功能简介</th><th>命令举例</th></tr></thead>
                <tbody>
                  <tr><td><strong>扫雷游戏</strong></td><td>经典的扫雷小游戏</td><td><code>扫雷 {'<行>'} {'<列>'} {'<雷数>'} {'<皮肤序号>'}</code> 开始扫雷</td></tr>
                  <tr><td><strong>astrbot_plugin_soupai</strong></td><td>自动生成谜题、智能判断、验证系统、智能提示</td><td><code>/汤</code> 开始海龟汤</td></tr>
                </tbody>
              </table>
            </div>

            {/* Plugin category: 搞笑 */}
            <div className="plugin-category">
              <div className="plugin-category-header"><i className="fas fa-face-laugh-squint" /> 搞笑</div>
              <table className="plugin-table">
                <thead><tr><th>插件名称</th><th>功能简介</th><th>命令举例</th></tr></thead>
                <tbody>
                  <tr><td><strong>原神圣经</strong></td><td>检测原神关键词自动回复原神圣经</td><td>LLM智能判断</td></tr>
                  <tr><td><strong>astrbot_plugin_payqr</strong></td><td>LLM 觉得自己没钱了或提到要别人给钱时，发送用户上传的收款码图片</td><td>LLM智能判断</td></tr>
                  <tr><td><strong>今日小猪</strong></td><td>抽取属于自己的每日小猪</td><td><code>/今日小猪</code> 抽取小猪</td></tr>
                  <tr><td><strong>是啊，吃什么</strong></td><td>检测吃什么复读机以及推送推荐食物</td><td>LLM智能判断</td></tr>
                  <tr><td><strong>今日老婆</strong></td><td>抽取群友当赛博老婆的插件</td><td><code>/今日老婆</code> 抽取群友</td></tr>
                  <tr><td><strong>疯狂星期四插件</strong></td><td>检测疯狂星期四关键词自动回复文案</td><td>LLM智能判断</td></tr>
                </tbody>
              </table>
            </div>

            {/* Plugin category: 其他 */}
            <div className="plugin-category">
              <div className="plugin-category-header"><i className="fas fa-ellipsis" /> 其他</div>
              <table className="plugin-table">
                <thead><tr><th>插件名称</th><th>功能简介</th><th>命令举例</th></tr></thead>
                <tbody>
                  <tr><td><strong>astrbot_plugin_papertrading</strong></td><td>大A模拟，支持实时股价、委托交易、持仓管理、群内排行</td><td><code>/股价 上证指数</code> 查询大盘指数</td></tr>
                  <tr><td><strong>Galgame百宝盒</strong></td><td>随机作品、资源下载、角色识别、拼图</td><td><code>/游戏 作品 {'<作品名>'}</code> 查阅作品</td></tr>
                  <tr><td><strong>群体协作长篇小说</strong></td><td>群友协作，AI辅助写作的长篇小说插件</td><td><code>/小说 帮助</code> 显示所有小说指令</td></tr>
                </tbody>
              </table>
            </div>

          </article>
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   Project detail mapping
   ============================================================ */
const projectComponents = {
  'cpp-bighw': CppBigHW,
  'fpga': FPGA,
  'gpu': GPU,
  'qq-bot': QQBot,
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const ProjectComponent = projectComponents[slug]
  const wrapperRef = useRef(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.01, rootMargin: '0px 0px -8% 0px' }
    )
    el.querySelectorAll('.fade-in').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [slug])

  if (!ProjectComponent) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <h1><i className="fas fa-code-branch" /> Projects</h1>
        </div>
        <section className="section">
          <div className="container">
            <Link to="/projects" className="article-back" style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <i className="fas fa-arrow-left" />返回项目列表
            </Link>
            <div className="placeholder-box">
              <i className="fas fa-ghost" />
              <p>项目未找到</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-wrapper" ref={wrapperRef}>
      <ProjectComponent />
    </div>
  )
}
