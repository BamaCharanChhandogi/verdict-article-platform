import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getArticles(req: Request, res: Response): Promise<void> {
  const { category, search, page = '1', limit = '20' } = req.query;
  const offset = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

  try {
    let query = `
      SELECT 
        a.id, a.slug, a.title, a.description, a.content, a.cover_image as "coverImage",
        a.category, a.reading_time as "readingTime", a.likes_count as "likesCount",
        a.comments_count as "commentsCount", a.is_featured as "isFeatured",
        a.is_editor_pick as "isEditorPick", a.editor_pick_rank as "editorPickRank",
        a.tags, a.created_at as "publishedAt",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'avatar', u.avatar_url,
          'role', u.role,
          'bio', u.bio,
          'followers', 12400,
          'articlesCount', 28
        ) as author
      FROM verdict_articles a
      LEFT JOIN verdict_users u ON a.author_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category && category !== 'All') {
      params.push(category);
      query += ` AND LOWER(a.category) = LOWER($${params.length})`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (a.title ILIKE $${params.length} OR a.description ILIKE $${params.length} OR u.name ILIKE $${params.length})`;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string, 10), offset);

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (err: any) {
    console.error('Fetch articles error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve articles.', error: err.message });
  }
}

export async function getArticleBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        a.id, a.slug, a.title, a.description, a.content, a.cover_image as "coverImage",
        a.category, a.reading_time as "readingTime", a.likes_count as "likesCount",
        a.comments_count as "commentsCount", a.is_featured as "isFeatured",
        a.is_editor_pick as "isEditorPick", a.editor_pick_rank as "editorPickRank",
        a.tags, a.created_at as "publishedAt",
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
      WHERE a.slug = $1 OR a.id = $1
      LIMIT 1
    `, [slug]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve article detail.', error: err.message });
  }
}

export async function createArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  const { title, description, content, cover_image, category, tags = [] } = req.body;

  if (!title || !content || !category) {
    res.status(400).json({ success: false, message: 'Title, content, and category are required.' });
    return;
  }

  try {
    const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    
    // Auto calculate reading time: ~200 words per minute
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const cover = cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
    const desc = description || content.slice(0, 160).replace(/[#*`_]/g, '') + '...';

    const result = await pool.query(`
      INSERT INTO verdict_articles (
        id, slug, title, description, content, cover_image, category, author_id, reading_time, tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      id, slug, title.trim(), desc.trim(), content, cover, category, req.user.id, readingTime, tags
    ]);

    res.status(201).json({
      success: true,
      message: 'Article published successfully to Verdict feed.',
      data: result.rows[0]
    });
  } catch (err: any) {
    console.error('Create article error:', err);
    res.status(500).json({ success: false, message: 'Failed to publish article.', error: err.message });
  }
}

export async function toggleLike(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user?.id || 'anonymous_user';

  try {
    const existing = await pool.query(
      'SELECT id FROM verdict_likes WHERE user_id = $1 AND article_id = $2',
      [userId, id]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM verdict_likes WHERE user_id = $1 AND article_id = $2', [userId, id]);
      await pool.query('UPDATE verdict_articles SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1', [id]);
      res.status(200).json({ success: true, liked: false });
    } else {
      const likeId = `lk_${Date.now()}`;
      await pool.query('INSERT INTO verdict_likes (id, user_id, article_id) VALUES ($1, $2, $3)', [likeId, userId, id]);
      await pool.query('UPDATE verdict_articles SET likes_count = likes_count + 1 WHERE id = $1', [id]);
      res.status(200).json({ success: true, liked: true });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to toggle like.', error: err.message });
  }
}

export async function toggleBookmark(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user?.id || 'anonymous_user';

  try {
    const existing = await pool.query(
      'SELECT id FROM verdict_bookmarks WHERE user_id = $1 AND article_id = $2',
      [userId, id]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM verdict_bookmarks WHERE user_id = $1 AND article_id = $2', [userId, id]);
      res.status(200).json({ success: true, bookmarked: false });
    } else {
      const bookmarkId = `bm_${Date.now()}`;
      await pool.query('INSERT INTO verdict_bookmarks (id, user_id, article_id) VALUES ($1, $2, $3)', [bookmarkId, userId, id]);
      res.status(200).json({ success: true, bookmarked: true });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to toggle bookmark.', error: err.message });
  }
}
