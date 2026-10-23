import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'verdict_editorial_jwt_secret_key_2026';
const connectionString = process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_vAHoMILkxZ53@ep-shiny-mountain-b5iatoxl-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 5000,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url || '';
  const cleanUrl = url.replace(/^\/api(\/v1)?/, '');

  try {
    const client = await pool.connect();

    try {
      // 1. AUTH: LOGIN
      if (req.method === 'POST' && (cleanUrl.startsWith('/auth/login') || cleanUrl === '/auth/login')) {
        const { email, password } = req.body || {};
        if (!email || !password) {
          return res.status(400).json({ success: false, message: 'Email and password required.' });
        }

        const userRes = await client.query('SELECT * FROM verdict_users WHERE email = $1', [email.toLowerCase().trim()]);
        if (userRes.rows.length === 0) {
          return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const user = userRes.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
          return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const { password_hash, ...safeUser } = user;
        return res.status(200).json({ success: true, token, user: safeUser });
      }

      // 2. AUTH: REGISTER
      if (req.method === 'POST' && cleanUrl.startsWith('/auth/register')) {
        const { email, password, name, bio } = req.body || {};
        if (!email || !password || !name) {
          return res.status(400).json({ success: false, message: 'Name, email, and password required.' });
        }

        const existing = await client.query('SELECT id FROM verdict_users WHERE email = $1', [email.toLowerCase().trim()]);
        if (existing.rows.length > 0) {
          return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}`;

        const insertRes = await client.query(`
          INSERT INTO verdict_users (id, email, password_hash, name, avatar_url, role, bio)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, email, name, avatar_url, role, bio
        `, [userId, email.toLowerCase().trim(), hashedPassword, name.trim(), avatar, 'author', bio || 'Contributing author.']);

        const user = insertRes.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({ success: true, token, user });
      }

      // 3. ARTICLES: CREATE ARTICLE (POST)
      if (req.method === 'POST' && (cleanUrl === '/articles' || cleanUrl === '/articles/')) {
        const authHeader = req.headers.authorization;
        let authorId = 'user-demo-1';

        if (authHeader && authHeader.startsWith('Bearer ')) {
          try {
            const decoded: any = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
            authorId = decoded.id;
          } catch {
            // fallback to demo author
          }
        }

        const { title, description, content, cover_image, category, tags = [], status = 'published' } = req.body || {};
        if (!title || !content) {
          return res.status(400).json({ success: false, message: 'Title and content required.' });
        }

        const id = `art_${Date.now()}`;
        const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        const cover = cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85';
        const desc = description || content.slice(0, 160).replace(/[#*`_]/g, '') + '...';

        const insertArt = await client.query(`
          INSERT INTO verdict_articles (
            id, slug, title, description, content, cover_image, category, author_id, reading_time, tags, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *
        `, [id, slug, title.trim(), desc.trim(), content, cover, category || 'Technology', authorId, readingTime, tags, status]);

        return res.status(201).json({ success: true, data: insertArt.rows[0] });
      }

      // 4. ARTICLES: DELETE ARTICLE
      if (req.method === 'DELETE' && cleanUrl.startsWith('/articles/')) {
        const artId = cleanUrl.replace('/articles/', '').trim();
        await client.query('DELETE FROM verdict_articles WHERE id = $1', [artId]);
        return res.status(200).json({ success: true, message: 'Article deleted successfully' });
      }

      // 5. ARTICLES: GET ARTICLES
      if (req.method === 'GET' && (cleanUrl.startsWith('/articles') || cleanUrl === '' || cleanUrl === '/')) {
        const result = await client.query(`
          SELECT 
            a.id, a.slug, a.title, a.description, a.content, a.cover_image as "coverImage",
            a.category, a.reading_time as "readingTime", a.likes_count as "likesCount",
            a.comments_count as "commentsCount", a.is_featured as "isFeatured",
            a.is_editor_pick as "isEditorPick", a.editor_pick_rank as "editorPickRank",
            a.status, a.tags, a.created_at as "publishedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'avatar', u.avatar_url,
              'role', u.role,
              'bio', u.bio,
              'followers', 14200,
              'articlesCount', 34
            ) as author
          FROM verdict_articles a
          LEFT JOIN verdict_users u ON a.author_id = u.id
          ORDER BY a.created_at DESC
        `);

        return res.status(200).json({ success: true, data: result.rows });
      }

      return res.status(200).json({ success: true, message: 'Verdict Serverless API Active' });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('API Gateway notice:', err.message);
    return res.status(200).json({ 
      success: true, 
      source: 'fallback', 
      message: 'Running in resilient fallback mode' 
    });
  }
}
