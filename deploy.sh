#!/bin/bash

# 下水道實驗室 - 自動部署腳本
# 使用方式: ./deploy.sh 或 bash deploy.sh

set -e  # 任何命令失敗都會停止執行

echo "🐊 下水道實驗室 - 自動部署"
echo "================================"

# 檢查是否在正確的目錄
if [ ! -f "package.json" ]; then
  echo "❌ 錯誤：請在項目根目錄運行此腳本"
  exit 1
fi

# 檢查 Git 狀態
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ 錯誤：這不是一個 Git 倉庫"
  exit 1
fi

# 步驟 1: 生成文章索引
echo ""
echo "📝 步驟 1: 生成文章索引..."
node scripts/generate.js
if [ $? -eq 0 ]; then
  echo "✅ 文章索引生成成功"
else
  echo "❌ 文章索引生成失敗"
  exit 1
fi

# 步驟 2: 複製 index.json 到 docs 目錄
echo ""
echo "📋 步驟 2: 複製索引文件..."
cp posts/index.json docs/
if [ $? -eq 0 ]; then
  echo "✅ 索引文件複製成功"
else
  echo "❌ 索引文件複製失敗"
  exit 1
fi

# 步驟 3: 檢查是否有變更
echo ""
echo "🔍 步驟 3: 檢查變更..."
if git diff --quiet && git diff --cached --quiet; then
  echo "⚠️  沒有檢測到變更，跳過提交"
  exit 0
fi

# 步驟 4: 添加文件到 Git
echo ""
echo "📦 步驟 4: 添加文件到 Git..."
git add docs/index.json posts/
if [ $? -eq 0 ]; then
  echo "✅ 文件已添加"
else
  echo "❌ 添加文件失敗"
  exit 1
fi

# 步驟 5: 提交變更
echo ""
echo "💾 步驟 5: 提交變更..."
git commit -m "Update: Generate new posts - $(date '+%Y-%m-%d %H:%M:%S')"
if [ $? -eq 0 ]; then
  echo "✅ 變更已提交"
else
  echo "❌ 提交失敗"
  exit 1
fi

# 步驟 6: 推送到 GitHub
echo ""
echo "🚀 步驟 6: 推送到 GitHub..."
git push origin main
if [ $? -eq 0 ]; then
  echo "✅ 推送成功"
else
  echo "❌ 推送失敗"
  exit 1
fi

echo ""
echo "================================"
echo "✨ 部署完成！"
echo "您的文章已自動發佈到 GitHub Pages"
echo "https://jimmy0800.github.io/alligators-lab-pages/"
