import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

export async function initDatabase() {
  const client = await pool.connect();
  try {
    // 1. Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS verdict_users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        role VARCHAR(50) DEFAULT 'author',
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS verdict_articles (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        cover_image TEXT,
        category VARCHAR(100) NOT NULL,
        author_id VARCHAR(64) REFERENCES verdict_users(id) ON DELETE CASCADE,
        reading_time INT DEFAULT 5,
        likes_count INT DEFAULT 0,
        comments_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_editor_pick BOOLEAN DEFAULT FALSE,
        editor_pick_rank INT,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS verdict_comments (
        id VARCHAR(64) PRIMARY KEY,
        article_id VARCHAR(64) REFERENCES verdict_articles(id) ON DELETE CASCADE,
        user_id VARCHAR(64) REFERENCES verdict_users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS verdict_bookmarks (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES verdict_users(id) ON DELETE CASCADE,
        article_id VARCHAR(64) REFERENCES verdict_articles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, article_id)
      );

      CREATE TABLE IF NOT EXISTS verdict_likes (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES verdict_users(id) ON DELETE CASCADE,
        article_id VARCHAR(64) REFERENCES verdict_articles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, article_id)
      );

      CREATE INDEX IF NOT EXISTS idx_verdict_articles_category ON verdict_articles(category);
      CREATE INDEX IF NOT EXISTS idx_verdict_articles_slug ON verdict_articles(slug);
    `);

    // 2. Check if default demo user exists, if not seed
    const userCheck = await client.query('SELECT id FROM verdict_users WHERE email = $1', ['demo@verdict.com']);
    let demoUserId = 'user-demo-1';
    
    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await client.query(`
        INSERT INTO verdict_users (id, email, password_hash, name, avatar_url, role, bio)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        demoUserId,
        'demo@verdict.com',
        hashedPassword,
        'Elena Rostova',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        'Editor in Chief',
        'Writing at the intersection of intentional living, architectural philosophy, and contemporary aesthetics.'
      ]);
    } else {
      demoUserId = userCheck.rows[0].id;
    }

    // 3. Check if articles exist, if not seed initial reference articles
    const articleCheck = await client.query('SELECT COUNT(*) FROM verdict_articles');
    if (parseInt(articleCheck.rows[0].count, 10) === 0) {
      const seedArticles = [
        {
          id: 'feat-1',
          slug: 'how-ai-is-changing-everyday-creativity',
          title: 'How AI is Changing Everyday Creativity',
          description: 'Generative models are transitioning from novel parlor tricks to ambient cognitive partners, reshaping how writers, architects, and painters sculpt ideas.',
          content: 'Generative intelligence is acting as an intellectual catalyst, dissolving the friction between initial conception and executable form.',
          cover_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
          category: 'Technology',
          reading_time: 6,
          is_featured: true,
          tags: ['Technology', 'AI & Future', 'Design']
        },
        {
          id: 'feat-2',
          slug: 'the-art-of-a-calmer-morning',
          title: 'The Art of a Calmer Morning',
          description: 'In an era of relentless notification overload, intentional rituals of silence, natural illumination, and single-tasking restore mental sovereignty.',
          content: 'How we cross into consciousness dictates the emotional timbre of every subsequent hour. Delay the digital deluge.',
          cover_image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
          category: 'Lifestyle',
          reading_time: 4,
          is_featured: true,
          tags: ['Lifestyle', 'Mindfulness', 'Wellness']
        },
        {
          id: 'feat-3',
          slug: 'hidden-places-you-must-visit-in-2024',
          title: 'Hidden Places You Must Visit in 2024',
          description: 'Venturing beyond the well-worn tourist corridors into secluded alpine valleys, ancient cycladic villages, and untouched misty coastlines.',
          content: 'Travel is not about collecting flags or checking off bucket-list coordinates. It is about allowing an unfamiliar topography to disrupt your habitual perception of reality.',
          cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
          category: 'Travel',
          reading_time: 5,
          is_featured: true,
          tags: ['Travel', 'Nature', 'Adventure']
        },
        {
          id: 'pick-1',
          slug: 'the-future-of-remote-work-is-more-human-than-you-think',
          title: 'The Future of Remote Work is More Human Than You Think',
          description: 'Why the next generation of decentralized teams will prioritize synchronous retreats, emotional attunement, and asynchronous deep work over surveillance.',
          content: 'Remote work succeeds not when we replicate physical offices digitally, but when we empower knowledge workers with radical autonomy.',
          cover_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
          category: 'Business',
          reading_time: 5,
          is_editor_pick: true,
          editor_pick_rank: 1,
          tags: ['Business', 'Productivity', 'Culture']
        },
        {
          id: 'pick-2',
          slug: 'design-lessons-from-nature',
          title: 'Design Lessons from Nature',
          description: 'From biomimetic structural load paths to the organic color harmonies of autumnal foliage, nature offers the ultimate masterclass in systemic elegance.',
          content: 'Nature is an evolutionary laboratory with 3.8 billion years of research and development. In the natural world, waste does not exist.',
          cover_image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
          category: 'Design',
          reading_time: 4,
          is_editor_pick: true,
          editor_pick_rank: 2,
          tags: ['Design', 'Nature', 'Architecture']
        },
        {
          id: 'latest-1',
          slug: 'building-products-people-actually-love',
          title: 'Building Products People Actually Love',
          description: 'Beyond growth metrics and customer acquisition loops lies the timeless craft of empathetic product intuition and obsessive customer delight.',
          content: 'The products that endure in the human psyche are born from taste, respect, and deep restraint.',
          cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
          category: 'Business',
          reading_time: 5,
          tags: ['Business', 'Product', 'Design']
        },
        {
          id: 'latest-2',
          slug: 'a-minimalist-guide-to-deep-work',
          title: 'A Minimalist Guide to Deep Work',
          description: 'How to structure four hours of uncompromising creative flow by silencing micro-interruptions and designing an analog sanctum.',
          content: 'True creative breakthrough demands uninterrupted depth. Four hours of laser focus will consistently out-produce twelve hours of distracted pseudo-labor.',
          cover_image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
          category: 'Productivity',
          reading_time: 6,
          tags: ['Productivity', 'Focus', 'Habits']
        }
      ];

      for (const a of seedArticles) {
        await client.query(`
          INSERT INTO verdict_articles (id, slug, title, description, content, cover_image, category, author_id, reading_time, is_featured, is_editor_pick, editor_pick_rank, tags)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          a.id, a.slug, a.title, a.description, a.content, a.cover_image, a.category, demoUserId, a.reading_time,
          a.is_featured || false, a.is_editor_pick || false, a.editor_pick_rank || null, a.tags
        ]);
      }
    }

    console.log('PostgreSQL Verdict database schema initialized and seeded successfully.');
  } catch (err: any) {
    console.error('Database initialization notice:', err.message);
  } finally {
    client.release();
  }
}
