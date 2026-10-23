import { Router } from 'express';
import multer from 'multer';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { 
  getArticles, 
  getArticleBySlug, 
  createArticle, 
  toggleLike, 
  toggleBookmark 
} from '../controllers/article.controller.js';
import { getComments, createComment } from '../controllers/comment.controller.js';
import { uploadImage } from '../controllers/upload.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// --- AUTHENTICATION ROUTES ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', requireAuth, getMe);

// --- ARTICLE ROUTES ---
router.get('/articles', optionalAuth, getArticles);
router.get('/articles/:slug', getArticleBySlug);
router.post('/articles', requireAuth, createArticle);
router.post('/articles/:id/like', optionalAuth, toggleLike);
router.post('/articles/:id/bookmark', optionalAuth, toggleBookmark);

// --- COMMENT ROUTES ---
router.get('/articles/:articleId/comments', getComments);
router.post('/articles/:articleId/comments', optionalAuth, createComment);

// --- STORAGE / CLOUDFLARE R2 UPLOAD ---
router.post('/upload', upload.single('image'), uploadImage);

export default router;
