# 部署说明：阿里云服务器 + GitHub Pages 双部署

目标访问方式：

- `http://47.97.56.180:8080`：直接访问阿里云 ECS 上的 Nginx 静态站点。
- `http://lv-zhu.top`：通过域名访问阿里云 ECS。
- `https://lv-zhu.github.io`：GitHub Pages 保留一份等价部署。

## 当前仓库行为

- GitHub Pages 不再使用 `CNAME` 绑定自定义域名，因此默认访问地址保留为 `lv-zhu.github.io`。
- 阿里云服务器使用 `deploy/nginx/lv-zhu-blog.conf`，站点目录为 `/var/www/lv-zhu-blog/current`。
- `deploy/scripts/deploy-dist-to-ecs.ps1` 会在本机执行 `npm.cmd run build`，然后把 `dist/` 上传到 ECS。

## 你需要在阿里云控制台做的事

### 1. 修改云解析 DNS

在 `lv-zhu.top` 的云解析里设置：

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | `@` | `47.97.56.180` |
| CNAME | `www` | `lv-zhu.top` |

如果之前给 `@` 配过 GitHub Pages 的 4 条 A 记录，需要删除或停用，否则根域名会冲突。

### 2. 放行安全组端口

在 ECS 安全组入方向放行：

| 端口 | 用途 |
| --- | --- |
| `22` | SSH 登录部署，建议只允许你的公网 IP |
| `80` | `http://lv-zhu.top` |
| `443` | 后续 HTTPS |
| `8080` | `http://47.97.56.180:8080` 测试访问 |

我当前从本机探测到 `47.97.56.180:80` 已经有 Nginx 返回，`47.97.56.180:8080` 返回 502。说明服务器上可能已有默认站点或反向代理；如果那是你正在使用的业务，执行下面脚本前先备份 `/etc/nginx/conf.d/` 和 `/etc/nginx/nginx.conf`。

### 3. 备案提醒

如果这台 ECS 是中国内地节点，域名解析到这台服务器后，通过域名访问通常需要 ICP 备案；非 80/443 端口也不能规避备案要求。IP 加端口可以先做技术验证，但正式用 `lv-zhu.top` 访问时请按阿里云要求完成备案。

## 首次配置服务器

把本仓库的 `deploy/` 目录传到服务器：

```powershell
& "$env:WINDIR\System32\OpenSSH\ssh.exe" root@47.97.56.180 "mkdir -p /opt/lv-zhu-blog"
& "$env:WINDIR\System32\OpenSSH\scp.exe" -r deploy root@47.97.56.180:/opt/lv-zhu-blog/
```

然后登录服务器执行：

```powershell
& "$env:WINDIR\System32\OpenSSH\ssh.exe" root@47.97.56.180
```

在服务器 SSH 会话里执行：

```bash
cd /opt/lv-zhu-blog
bash deploy/scripts/setup-alibaba-ecs.sh
```

如果你的服务器不是 `root` 登录，把命令里的 `root` 换成你的用户名；该用户需要有 `sudo` 权限。

## 每次发布到阿里云

在本机仓库根目录执行：

```powershell
.\deploy\scripts\deploy-dist-to-ecs.cmd -User root -HostName 47.97.56.180
```

如果 SSH 端口不是 22：

```powershell
.\deploy\scripts\deploy-dist-to-ecs.cmd -User root -HostName 47.97.56.180 -Port 你的SSH端口
```

发布成功后检查：

```powershell
Invoke-WebRequest http://47.97.56.180:8080 -UseBasicParsing
Invoke-WebRequest http://lv-zhu.top -UseBasicParsing
```

## GitHub Pages 设置

进入 GitHub 仓库：

`Settings -> Pages`

确认：

- Source 使用 GitHub Actions。
- Custom domain 为空；如果里面还有 `lv-zhu.top` 或 `blog.lv-zhu.top`，删除。

之后推送 `main` 分支，GitHub Actions 会继续发布到 `https://lv-zhu.github.io`。

## HTTPS 后续步骤

DNS 生效且备案/访问确认后，可以在服务器上安装证书：

```bash
sudo certbot --nginx -d lv-zhu.top -d www.lv-zhu.top
```

如果服务器还没有 `certbot`，先按服务器系统安装对应包。证书只适用于域名，不适用于 `47.97.56.180:8080` 这种 IP 访问。
