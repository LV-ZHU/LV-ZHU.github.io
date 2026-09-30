# 登录与内容维护

## GitHub 登录

前端支持 Google 和 GitHub popup 登录，不额外申请 GitHub 仓库权限，也不保存 GitHub access token。同邮箱遇到登录方式冲突时，提示使用原方式登录，不自动合并账号。

云端配置尚未验证。站主需在 GitHub 的 Settings → Developer settings → OAuth Apps 创建或选择本站应用，首页设为 `https://lv-zhu.top`，回调地址设为 `https://coding-ed4a5.firebaseapp.com/__/auth/handler`。随后在 Firebase 项目 `coding-ed4a5` 的 Authentication → Sign-in method 中启用 GitHub，填写该 OAuth 应用的 Client ID 和 Client Secret。Secret 只填写在 Firebase 控制台，不放入源码、Vite 环境变量或聊天。

参考：[Firebase GitHub 登录官方文档](https://firebase.google.com/docs/auth/web/github-auth)。上线前需实际检查新用户登录、取消弹窗、同邮箱冲突，以及 Google 原入口。生产构建不能证明 OAuth 配置正确。

## 公开名称与已有数据

评论、页头和排行榜统一使用昵称、提供方显示名或“用户”，不回退到邮箱。像邮箱的旧评论名称在页面上显示为“用户”，但这不等于数据库中的邮箱已经删除。历史评论与旧 travelData 如曾保存邮箱，需要管理员单独审查和清理；本次没有改写历史云端数据。

## O 类共享链接

站主确认这些链接供所有登录用户共享，因此保留 `privateLinks/favoritesO/items` 路径，不按 UID 拆分。前端称作“登录用户共享链接”。数据库集合的旧名字只为兼容现有数据而保留。

`firestore.community.rules` 是待合并规则，要求登录后才能读取共享链接，禁止客户端写入；评论只能以本人 UID 创建、仅作者可删除。部署时保留其他功能规则，并撤掉覆盖这些路径的宽泛授权。规则没有上线或经模拟器验证，必须用未登录、账号 A、账号 B 分别测试。不要将片段直接覆盖整个项目的规则。

## 内容迁移第一步

- 歌单：编辑 `src/content/music/categories.json`，保留分类 ID 和曲目顺序。
- 学科元数据：编辑 `src/content/study/subjects.json`。
- 8 篇考试回忆：编辑同目录独立 `.md` 文件；目前按原来的纯文本方式展示，保留代码、空行和原文，不解释 HTML。
- `npm run validate:content` 检查 JSON Schema、重复分类 ID 和正文文件引用；构建前自动执行。

此次迁移对 570 首歌曲、18 个学科、8 篇正文做了迁移前后深比较，内容一致。旧 `src/data` 导出接口继续保留。

Jottings 和 Projects 仍使用原 JSX。它们包含专用组件和交互，后续宜先区分正文与组件，再迁移为 Markdown/MDX；本次没有机械转换或改写这些文章。
