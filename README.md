# 下水道實驗室 | Alligator's Lab

一個基於 GitHub Pages 的靜態部落格系統，專注於技術分享、硬體拆解和生活思考。

## 🎯 特性

- **零維護工作流**：只需在 `posts/` 目錄中添加 Markdown 文件，GitHub Actions 自動生成索引
- **暗色主題設計**：護眼的深色界面，適合長時間閱讀
- **工業風美學**：霓虹綠/藍強調色，科技感十足
- **完整的 Markdown 支持**：LaTeX 公式、Mermaid 圖表、代碼高亮
- **Giscus 評論系統**：基於 GitHub Discussions
- **分類和標籤系統**：自動分類文章
- **響應式設計**：完美支持桌面和移動設備
- **免費部署**：GitHub Pages 原生支持

## 📁 項目結構

```
alligators-lab-pages/
├── .github/workflows/build.yml    # GitHub Actions 工作流
├── posts/                         # Markdown 文章目錄
│   ├── index.json                # 文章索引（自動生成）
│   └── images/                   # 文章圖片
├── docs/                         # GitHub Pages 根目錄
│   ├── index.html               # 首頁
│   ├── post.html                # 文章頁面
│   ├── css/style.css            # 暗色主題樣式
│   ├── js/                      # 前端邏輯
│   └── assets/images/           # 靜態圖片
├── scripts/generate.js          # 文章索引生成腳本
└── README.md
```

## 🚀 快速開始

### 添加新文章

在 `posts/` 目錄中創建 `YYYY-MM-DD-slug.md` 文件：

```markdown
---
title: 我的第一篇文章
date: 2026-03-06
category: tech-logs
tags: [技術, 分享]
image: hero-image.png
---

# 我的第一篇文章

文章內容...
```

### Frontmatter 字段

| 字段 | 必需 | 說明 |
|---|---|---|
| `title` | ✅ | 文章標題 |
| `date` | ✅ | 發佈日期 (YYYY-MM-DD) |
| `category` | ✅ | tech-logs / device-analysis / life-thoughts |
| `tags` | ❌ | 標籤陣列 |
| `image` | ❌ | Hero 圖片文件名 |

### 推送更新

```bash
git add posts/
git commit -m "Add new article"
git push origin main
```

GitHub Actions 會自動生成索引並部署！

## 📝 支持的功能

### LaTeX 數學公式
```markdown
$$E = mc^2$$
```

### Mermaid 圖表
```markdown
\`\`\`mermaid
graph TD
    A --> B
\`\`\`
```

### 代碼高亮
```markdown
\`\`\`python
print("Hello")
\`\`\`
```

## 🎨 設計特性

- **背景**：深灰黑 (#0f0f0f)
- **文字**：淺灰白 (#e8e8e8)
- **強調色**：霓虹綠 (#00ff88)、霓虹藍 (#00d4ff)

## 💬 評論系統

使用 Giscus（基於 GitHub Discussions）

## 📋 部署

1. 進入倉庫 Settings → Pages
2. 選擇 `gh-pages` 分支
3. 選擇 `/root` 目錄

## 🔧 本地開發

```bash
# 安裝依賴
npm install

# 生成文章索引
node scripts/generate.js

# 本地預覽
python -m http.server 8000 --directory docs
```

訪問 `http://localhost:8000`

## 📚 資源

- [Markdown 語法](https://www.markdownguide.org/)
- [MathJax 文檔](https://docs.mathjax.org/)
- [Mermaid 文檔](https://mermaid.js.org/)
- [Giscus 文檔](https://giscus.app/)

---

**最後更新**：2026 年 3 月 6 日
