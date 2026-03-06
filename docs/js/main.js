/**
 * 下水道實驗室 - 首頁邏輯
 * 動態加載文章列表和分類篩選
 */

// 全域變數
let allPosts = [];
let currentCategory = 'all';

// 動態檢測基礎路徑
const basePath = window.location.pathname.includes('/alligators-lab-pages/') 
  ? '/alligators-lab-pages' 
  : '';

/**
 * 初始化首頁
 */
async function initHomePage() {
  try {
    // 加載文章清單
    const response = await fetch(basePath + '/posts/index.json');
    if (!response.ok) {
      throw new Error('無法加載文章清單');
    }
    
    allPosts = await response.json();
    
    // 按日期排序（最新的在前）
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 渲染初始文章列表
    renderPosts(allPosts);
    
    // 設置分類按鈕事件監聽
    setupCategoryFilters();
  } catch (error) {
    console.error('初始化首頁失敗:', error);
    document.getElementById('posts-list').innerHTML = 
      '<p style="text-align: center; color: #ff3333;">無法加載文章列表，請稍後重試。</p>';
  }
}

/**
 * 渲染文章卡片列表
 */
function renderPosts(posts) {
  const container = document.getElementById('posts-list');
  
  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #b0b0b0;">暫無文章</p>';
    return;
  }
  
  container.innerHTML = posts.map(post => createPostCard(post)).join('');
}

/**
 * 創建單個文章卡片
 */
function createPostCard(post) {
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const heroImage = post.hero ? `/assets/images/${post.hero}` : '/assets/images/404.jpeg';
  const excerpt = post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
  const tags = (post.tags || []).map(tag => 
    `<span class="post-card-tag">${tag}</span>`
  ).join('');
  
  return `
    <div class="post-card">
      <img src="${heroImage}" alt="${post.title}" class="post-card-image" onerror="this.src='/assets/images/404.jpeg'">
      <div class="post-card-content">
        <span class="post-card-category">${getCategoryLabel(post.category)}</span>
        <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
        <div class="post-card-meta">
          <span>📅 ${formattedDate}</span>
        </div>
        <p class="post-card-excerpt">${escapeHtml(excerpt)}</p>
        <div class="post-card-tags">
          ${tags}
        </div>
        <a href="${basePath}/post.html?id=${post.id}" class="post-card-link">閱讀更多 →</a>
      </div>
    </div>
  `;
}

/**
 * 設置分類篩選按鈕
 */
function setupCategoryFilters() {
  const buttons = document.querySelectorAll('.category-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按鈕的 active 類
      buttons.forEach(btn => btn.classList.remove('active'));
      
      // 添加當前按鈕的 active 類
      button.classList.add('active');
      
      // 更新當前分類
      currentCategory = button.dataset.category;
      
      // 篩選並渲染文章
      const filteredPosts = currentCategory === 'all' 
        ? allPosts 
        : allPosts.filter(post => post.category === currentCategory);
      
      renderPosts(filteredPosts);
    });
  });
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
 * HTML 轉義函數（防止 XSS）
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 頁面加載完成後初始化
 */
document.addEventListener('DOMContentLoaded', initHomePage);
