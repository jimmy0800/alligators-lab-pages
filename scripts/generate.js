/**
 * 下水道實驗室 - 文章索引生成腳本
 * 掃描 posts/ 目錄中的所有 Markdown 文件
 * 提取 frontmatter 和內容，生成 posts/index.json
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, '../posts');
const OUTPUT_FILE = path.join(POSTS_DIR, 'index.json');

/**
 * 從 Markdown 文件名提取日期
 * 格式：YYYY-MM-DD-slug.md
 */
function extractDateFromFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : null;
}

/**
 * 從 Markdown 文件名提取 ID
 * 格式：YYYY-MM-DD-slug.md → slug
 */
function extractIdFromFilename(filename) {
  return filename.replace(/\.md$/, '');
}

/**
 * 生成文章索引
 */
function generatePostsIndex() {
  try {
    // 讀取 posts 目錄中的所有 Markdown 文件
    const files = fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.md') && file !== 'index.json')
      .sort()
      .reverse(); // 最新的在前

    const posts = [];

    files.forEach(file => {
      try {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // 使用 gray-matter 解析 frontmatter
        const { data, content: markdown } = matter(content);
        
        // 從文件名提取日期
        const dateFromFilename = extractDateFromFilename(file);
        const date = data.date || dateFromFilename;
        
        // 提取第一段作為摘要
        const excerpt = markdown
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .slice(0, 3)
          .join(' ')
          .substring(0, 200)
          .trim();

        const post = {
          id: extractIdFromFilename(file),
          title: data.title || '無標題',
          date: date || new Date().toISOString().split('T')[0],
          category: data.category || 'tech-logs',
          tags: Array.isArray(data.tags) 
            ? data.tags 
            : (data.tags ? data.tags.split(',').map(t => t.trim()) : []),
          hero: data.image ? data.image.replace('/static/images/', '') : null,
          excerpt: excerpt,
          content: markdown,
          filename: file
        };

        posts.push(post);
        console.log(`✓ 已處理: ${file}`);
      } catch (error) {
        console.error(`✗ 處理 ${file} 時出錯:`, error.message);
      }
    });

    // 寫入 JSON 文件
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf-8');
    console.log(`\n✓ 已生成 ${posts.length} 篇文章的索引`);
    console.log(`✓ 索引文件已保存到: ${OUTPUT_FILE}`);

    return posts;
  } catch (error) {
    console.error('生成文章索引時出錯:', error);
    process.exit(1);
  }
}

// 執行生成
generatePostsIndex();
