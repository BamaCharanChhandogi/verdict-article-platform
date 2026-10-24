import axios from 'axios';
import { Article, Author, Comment } from '../types';
import { fallbackArticles, fallbackAuthors, fallbackComments } from '../data/fallbackData';
import { appCache } from './cache';

// API Endpoints
const DEVTO_API = 'https://dev.to/api/articles?per_page=12&top=7';
const DUMMY_COMMENTS_API = 'https://dummyjson.com/comments?limit=15';

/**
 * Service 1: Fetch Real Articles from PostgreSQL Database & Live Dev.to API
 */
export async function fetchArticles(): Promise<Article[]> {
  const cacheKey = 'articles_feed';
  const cached = appCache.get<Article[]>(cacheKey);
  if (cached) return cached;

  try {
    // 1. Fetch real published articles directly from PostgreSQL REST API
    const dbRes = await axios.get('/api/articles?status=published', { timeout: 3500 }).catch(() => null);
    let dbArticles: Article[] = [];
    if (dbRes?.data?.data && Array.isArray(dbRes.data.data)) {
      dbArticles = dbRes.data.data
        .filter((item: any) => item.status === 'published' || !item.status)
        .map((item: any) => ({
          ...item,
          status: 'published' as const,
          coverImage: item.coverImage || item.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        }));
    }

    // 2. Fetch live multi-API articles from Dev.to
    const devRes = await axios.get(DEVTO_API, { timeout: 4000 }).catch(() => null);
    let remoteArticles: Article[] = [];
    if (devRes?.data && Array.isArray(devRes.data)) {
      remoteArticles = devRes.data.map((item: any, idx: number) => {
        const tagMap: Record<string, string> = {
          react: 'Technology',
          javascript: 'Technology',
          webdev: 'Technology',
          ai: 'AI & Future',
          productivity: 'Productivity',
          design: 'Design',
          career: 'Business',
          life: 'Lifestyle',
        };
        const category = item.tag_list?.find((t: string) => tagMap[t.toLowerCase()]) 
          ? tagMap[item.tag_list.find((t: string) => tagMap[t.toLowerCase()]).toLowerCase()] 
          : (idx % 2 === 0 ? 'Design' : 'Productivity');

        return {
          id: `devto-${item.id}`,
          title: item.title,
          slug: item.slug || `article-${item.id}`,
          description: item.description || item.title,
          content: item.body_markdown || `# ${item.title}\n\n${item.description || ''}\n\nEvery breakthrough begins with the courage to question consensus. In an age saturated by instant algorithmic validation, true depth emerges not from consuming more, but from thinking more rigorously about what is essential.`,
          coverImage: item.cover_image || fallbackArticles[idx % fallbackArticles.length].coverImage,
          category,
          status: 'published' as const,
          author: {
            id: `author-${item.user.user_id || idx}`,
            name: item.user.name || item.user.username,
            avatar: item.user.profile_image || fallbackAuthors[0].avatar,
            role: 'Contributing Writer & Researcher',
            bio: 'Writing on systems architecture, design patterns, and humane computing.',
            followers: 4500 + idx * 320,
            articlesCount: 12 + idx * 3,
            twitter: item.user.twitter_username ? `@${item.user.twitter_username}` : undefined,
          },
          publishedAt: new Date(item.published_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readingTime: item.reading_time_minutes || Math.max(3, Math.ceil(item.title.length / 10)),
          likesCount: item.positive_reactions_count || 120 + idx * 45,
          commentsCount: item.comments_count || 14 + idx * 2,
          tags: item.tag_list?.length ? item.tag_list : ['Technology', 'Ideas'],
        };
      });
    }

    // Merge: PostgreSQL real database articles first, then curated editorial articles, then live multi-API articles
    const allArticles = [...dbArticles, ...fallbackArticles, ...remoteArticles];
    const uniqueMap = new Map<string, Article>();
    allArticles.forEach((art) => {
      const key = art.slug || String(art.id);
      if (key && !uniqueMap.has(key)) {
        uniqueMap.set(key, art);
      }
    });
    const combined = Array.from(uniqueMap.values());

    appCache.set(cacheKey, combined);
    return combined;
  } catch (err) {
    console.warn('Backend or remote API unreachable; utilizing local fallback.');
    appCache.set(cacheKey, fallbackArticles);
    return fallbackArticles;
  }
}

/**
 * Service 1B: Create Real Article / Draft in PostgreSQL Database
 */
export async function createRealArticle(articleData: {
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  status?: 'published' | 'draft';
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image?: string;
  scheduled_at?: string | null;
  is_unlisted?: boolean;
  series_name?: string;
}, token?: string | null): Promise<Article | null> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await axios.post('/api/articles', articleData, { headers });
    if (res.data?.success && res.data?.data) {
      appCache.clear();
      return res.data.data;
    }
    return null;
  } catch (err) {
    console.warn('Real DB POST failed, using client state fallback', err);
    return null;
  }
}

/**
 * Service 1C: Update Article / Draft in PostgreSQL Database (In-Place PUT)
 */
export async function updateRealArticle(id: string | number, updateData: {
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  status?: 'published' | 'draft';
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image?: string;
  scheduled_at?: string | null;
  is_unlisted?: boolean;
  series_name?: string;
}, token?: string | null): Promise<Article | null> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await axios.put(`/api/articles/${id}`, updateData, { headers });
    if (res.data?.success && res.data?.data) {
      appCache.clear();
      return res.data.data;
    }
    return null;
  } catch (err) {
    console.warn('Real DB PUT failed', err);
    return null;
  }
}

/**
 * Service 1D: Delete Real Article from PostgreSQL Database
 */
export async function deleteRealArticle(id: string | number, token?: string | null): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await axios.delete(`/api/articles/${id}`, { headers });
    appCache.clear();
    return res.data?.success === true;
  } catch (err) {
    console.warn('Real DB DELETE failed', err);
    return false;
  }
}

/**
 * Service 1E: Fetch Single Article from DB by ID or Slug
 */
export async function fetchSingleArticle(slugOrId: string): Promise<Article | null> {
  try {
    const res = await axios.get(`/api/articles/${slugOrId}`);
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Service 1F: Fetch Drafts specifically from PostgreSQL
 */
export async function fetchMyDrafts(): Promise<Article[]> {
  try {
    const res = await axios.get('/api/articles?status=draft');
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data;
    }
    return [];
  } catch (err) {
    return [];
  }
}

/**
 * Service 2: Fetch Real Authors & Fellows directly from PostgreSQL Database
 */
export async function fetchAuthors(): Promise<Author[]> {
  const cacheKey = 'authors_feed';
  const cached = appCache.get<Author[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await axios.get('/api/authors', { timeout: 3500 });
    if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      appCache.set(cacheKey, res.data.data);
      return res.data.data;
    }
    return fallbackAuthors;
  } catch (err) {
    console.warn('Real DB authors endpoint unavailable, using local fallback.');
    return fallbackAuthors;
  }
}

/**
 * Service 3: Fetch Real-Time Community Comments for an Article from Neon PostgreSQL
 */
export async function fetchCommentsForArticle(articleId: string | number): Promise<Comment[]> {
  const artIdStr = String(articleId);
  const cacheKey = `comments_${artIdStr}`;
  const cached = appCache.get<Comment[]>(cacheKey);
  if (cached) return cached;

  // 1. Read persistent localStorage comments for immediate local author updates
  let localSaved: Comment[] = [];
  try {
    const raw = localStorage.getItem(`verdict_comments_${artIdStr}`);
    if (raw) localSaved = JSON.parse(raw);
  } catch {
    localSaved = [];
  }

  // 2. Fetch real comments strictly from Neon PostgreSQL backend
  let dbComments: Comment[] = [];
  try {
    const res = await axios.get(`/api/articles/${artIdStr}/comments`, { timeout: 4000 });
    if (res.data?.success && Array.isArray(res.data.data)) {
      dbComments = res.data.data.map((c: any) => ({
        id: c.id,
        articleId: c.articleId || artIdStr,
        user: {
          id: c.user?.id || 'author-1',
          name: c.user?.name || 'Contributing Reader',
          avatar: c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
        body: c.body,
        likes: c.likes || 0,
        createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
      }));
    }
  } catch {
    // Graceful error recovery
  }

  // Merge database comments with local user comments, strictly without synthetic fallbacks
  const map = new Map<string, Comment>();
  localSaved.forEach(c => map.set(String(c.id), c));
  dbComments.forEach(c => map.set(String(c.id), c));

  const merged = Array.from(map.values());
  appCache.set(cacheKey, merged);
  return merged;
}

/**
 * Service 3B: Publish Comment to PostgreSQL and Local Storage
 */
export async function createRealComment(
  articleId: string | number,
  body: string,
  user: { id: string; name: string; avatar?: string; role?: string },
  token?: string | null
): Promise<Comment> {
  const artIdStr = String(articleId);
  const commentId = `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  let finalComment: Comment = {
    id: commentId,
    articleId: artIdStr,
    user: {
      id: user.id || 'usr_reader',
      name: user.name || 'Reader',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    body: body.trim(),
    likes: 0,
    createdAt: 'Just now',
  };

  // Try POST to PostgreSQL REST API
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await axios.post(`/api/articles/${artIdStr}/comments`, { body: body.trim() }, { headers });
    if (res.data?.success && res.data?.data) {
      finalComment = {
        id: res.data.data.id || commentId,
        articleId: artIdStr,
        user: {
          id: res.data.data.user?.id || user.id,
          name: res.data.data.user?.name || user.name,
          avatar: res.data.data.user?.avatar || user.avatar,
        },
        body: res.data.data.body || body.trim(),
        likes: res.data.data.likes || 0,
        createdAt: 'Just now',
      };
    }
  } catch (err) {
    console.warn('Real DB comment POST failed, persisting to client store fallback', err);
  }

  // Always save to persistent localStorage
  try {
    const key = `verdict_comments_${artIdStr}`;
    const existing: Comment[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [finalComment, ...existing.filter(c => c.id !== finalComment.id)];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Update in-memory appCache
  const cacheKey = `comments_${artIdStr}`;
  const cached = appCache.get<Comment[]>(cacheKey) || [];
  appCache.set(cacheKey, [finalComment, ...cached.filter(c => c.id !== finalComment.id)]);

  return finalComment;
}

/**
 * Service 3C: Upvote Comment
 */
export async function upvoteRealComment(commentId: string | number, token?: string | null): Promise<void> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await axios.post(`/api/comments/${commentId}/like`, {}, { headers });
  } catch {
    // resilience
  }
}

/**
 * Service 3D: Delete Comment
 */
export async function deleteRealComment(
  articleId: string | number,
  commentId: string | number,
  token?: string | null
): Promise<boolean> {
  const artIdStr = String(articleId);
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await axios.delete(`/api/comments/${commentId}`, { headers });
  } catch {
    // resilience
  }

  // Update localStorage
  try {
    const key = `verdict_comments_${artIdStr}`;
    const existing: Comment[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.filter(c => String(c.id) !== String(commentId));
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Invalidate cache
  appCache.delete(`comments_${artIdStr}`);
  return true;
}

/**
 * Service 4: Fetch User's Bookmarks from Real PostgreSQL Database
 */
export async function fetchUserBookmarks(token: string): Promise<{ data: Article[]; articleIds: string[] }> {
  try {
    const res = await axios.get('/api/bookmarks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data?.success) {
      return {
        data: res.data.data || [],
        articleIds: res.data.articleIds || []
      };
    }
    return { data: [], articleIds: [] };
  } catch (err) {
    console.warn('Failed to fetch bookmarks from database:', err);
    return { data: [], articleIds: [] };
  }
}

/**
 * Service 4B: Add Bookmark to Real PostgreSQL Database
 */
export async function addUserBookmark(articleId: string | number, token: string): Promise<boolean> {
  try {
    const res = await axios.post('/api/bookmarks', { articleId: String(articleId) }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data?.success === true;
  } catch (err) {
    console.warn('Failed to persist bookmark to database:', err);
    return false;
  }
}

/**
 * Service 4C: Remove Bookmark from Real PostgreSQL Database
 */
export async function removeUserBookmark(articleId: string | number, token: string): Promise<boolean> {
  try {
    const res = await axios.delete(`/api/bookmarks/${articleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data?.success === true;
  } catch (err) {
    console.warn('Failed to delete bookmark from database:', err);
    return false;
  }
}

/**
 * Service 5: Upvote Article in Real PostgreSQL Database
 */
export async function likeRealArticle(articleId: string | number, token?: string | null): Promise<number | null> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await axios.post(`/api/articles/${articleId}/like`, {}, { headers });
    if (res.data?.success && typeof res.data.likesCount === 'number') {
      return res.data.likesCount;
    }
    return null;
  } catch (err) {
    console.warn('Failed to like article in database:', err);
    return null;
  }
}
