import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { JWT_SECRET, AuthenticatedRequest } from '../middleware/auth.js';

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name, bio } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    return;
  }

  try {
    const existing = await pool.query('SELECT id FROM verdict_users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}`;

    const result = await pool.query(`
      INSERT INTO verdict_users (id, email, password_hash, name, avatar_url, role, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, name, avatar_url, role, bio, created_at
    `, [
      userId,
      email.toLowerCase().trim(),
      hashedPassword,
      name.trim(),
      avatar,
      'author',
      bio || 'Contributing essayist and reader at Verdict.'
    ]);

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Failed to create user account.', error: err.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required.' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, name, avatar_url, role, bio FROM verdict_users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: 'Successfully authenticated.',
      token,
      user: safeUser
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Authentication service failure.', error: err.message });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT id, email, name, avatar_url, role, bio, created_at FROM verdict_users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch user session.', error: err.message });
  }
}
