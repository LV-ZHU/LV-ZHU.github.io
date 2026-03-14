# Study 分区模板（1 HTML + 1 PDF）

用于快速新增课程分区，统一结构：

- 目录结构：
  - `<new-section>/index.html`
  - `<new-section>/notes.pdf`

## 新增步骤

1. 复制任意现有分区目录（推荐 `math-analysis`）到新目录名。
2. 修改新目录中的 `index.html`：
   - `<title>` 与页面主标题
   - 简介文案
   - `iframe` 的 `title`
3. 将课程资料替换为同名 `notes.pdf`。
4. 在 `pages/study/index.html` 中增加一个卡片入口（`folder-item`）。
5. 在 `js/common.js` 的 `studySections` 数组中增加一条：
   - `label`
   - `path`
   - `keywords`

## 说明

- 只需维护 `studySections`，导航下拉与搜索会自动同步。
- 二级 Study 子页统一使用：
  - `../../../css/common.css`
  - `../../../js/common.js`
