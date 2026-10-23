import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getComments(req: Request, res: Response): Promise<void> {
  const { articleId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        c.id, c.article_id as "articleId", c.body, c.likes_count as "likes",
        c.created_at as "createdAt",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'avatar', u.avatar_url
        ) as user
      FROM verdict_comments c
      LEFT JOIN verdict_users u ON c.user_id = u.id
      WHERE c.article_id = $1
      ORDER BY c.created_at DESC
    `, [articleId]);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve comments.', error: err.message });
  }
}

export async function createComment(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { articleId } = req.params;
  const { body } = req.body;
  const userId = req.user?.id || 'user-demo-1';

  if (!body || !body.trim()) {
    res.status(400).json({ success: false, message: 'Comment body cannot be empty.' });
    return;
  }

  try {
    const commentId = `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const result = await pool.query(`
      INSERT INTO verdict_comments (id, article_id, user_id, body)
      VALUES ($1, $2, $3, $4)
      RETURNING id, article_id as "articleId", body, likes_count as likes, created_at as "createdAt"
    `, [commentId, articleId, userId, body.trim()]);

    await pool.query('UPDATE verdict_articles SET comments_count = comments_count + 1 WHERE id = $1', [articleId]);

    // Fetch user profile for response
    const userRes = await pool.query('SELECT id, name, avatar_url FROM verdict_users WHERE id = $1', [userId]);
    const user = userRes.rows[0] || { id: userId, name: 'Reader', avatar_url: '' };

    res.status(201).json({
      success: true,
      message: 'Comment published.',
      data: {
        ...result.rows[0],
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar_url
        }
      }
    });
  } catch (err: any) {
    console.error('Create comment error:', err);
    res.status(500).json({ success: false, message: 'Failed to post comment.', error: err.message });
  }
}
