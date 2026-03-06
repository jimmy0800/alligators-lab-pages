/**
 * 下水道實驗室 - 文章頁面邏輯
 * 動態加載和渲染 Markdown 文章
 */

// 配置 marked.js
marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false,
});

// 自定義渲染器以支持 LaTeX 和 Mermaid
const renderer = new marked.Renderer();

// 保存原始的代碼塊渲染器
const originalCodeRenderer = renderer.code.bind(renderer);

// 自定義代碼塊渲染以支持 Mermaid
renderer.code = function(code, language) {
  if (language === 'mermaid') {
    return `<div class="mermaid">${code}</div>`;
  }
  return originalCodeRenderer(code, language);
};

marked.setOptions({ renderer });

/**
 * 初始化文章頁面
 */
async function initPostPage() {
  try {
    // 從 URL 獲取文章 ID
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    
    if (!postId) {
      throw new Error('未指定文章 ID');
    }
    
    // 加載文章清單
    const response = await fetch('/posts/index.json');
    if (!response.ok) {
      throw new Error('無法加載文章清單');
    }
    
    const allPosts = await response.json();
    const post = allPosts.find(p => p.id === postId);
    
    if (!post) {
      throw new Error('找不到指定的文章');
    }
    
    // 加載並渲染文章
    await renderPost(post);
    
    // 初始化 Giscus 評論
    initGiscus(post);
  } catch (error) {
    console.error('加載文章失敗:', error);
    document.getElementById('post-content').innerHTML = 
      `<p style="color: #ff3333;">錯誤：${error.message}</p>`;
  }
}

/**
 * 渲染文章內容
 */
async function renderPost(post) {
  // 更新頁面標題
  document.title = `${post.title} | Alligator's Lab`;
  
  // 填充文章頭部信息
  document.getElementById('post-title').textContent = post.title;
  
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  document.getElementById('post-date').textContent = formattedDate;
  
  document.getElementById('post-category').textContent = getCategoryLabel(post.category);
  
  const tags = post.tags ? post.tags.join(', ') : '無';
  document.getElementById('post-tags').textContent = tags;
  
  // 顯示 Hero 圖片
  if (post.hero) {
    const heroImg = document.getElementById('post-hero');
    heroImg.src = `/assets/images/${post.hero}`;
    heroImg.alt = post.title;
    heroImg.style.display = 'block';
  }
  
  // 渲染 Markdown 內容
  const htmlContent = marked(post.content);
  document.getElementById('post-content').innerHTML = htmlContent;
  
  // 高亮代碼塊
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });
  
  // 重新初始化 MathJax（用於 LaTeX 公式）
  if (window.MathJax) {
    MathJax.typesetPromise().catch(err => console.log('MathJax 初始化失敗:', err));
  }
  
  // 重新初始化 Mermaid（用於圖表）
  if (window.mermaid) {
    mermaid.contentLoaded();
  }
}

/**
 * 初始化 Giscus 評論
 */
function initGiscus(post) {
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'jimmy0800/alligators-lab-pages');
  script.setAttribute('data-repo-id', 'R_kgDONPPrAg');
  script.setAttribute('data-category', 'General');
  script.setAttribute('data-category-id', 'DIC_kwDONPPrAs4Clxfx');
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'bottom');
  script.setAttribute('data-theme', 'dark');
  script.setAttribute('data-lang', 'zh-TW');
  script.setAttribute('data-loading', 'lazy');
  script.crossOrigin = 'anonymous';
  script.async = true;
  
  const container = document.getElementById('giscus-container');
  if (container) {
    container.appendChild(script);
  }
}

/**
 * 獲取分類的中文標籤
 */
function getCategoryLabel(category) {
  const labels = {
    'tech-logs': '滲透紀錄',
    'device-analysis': '樣本拆解',
    'life-thoughts': '生活碎念'
  };
  return labels[category] || category;
}

/**
 * 頁面加載完成後初始化
 */
document.addEventListener('DOMContentLoaded', initPostPage);
