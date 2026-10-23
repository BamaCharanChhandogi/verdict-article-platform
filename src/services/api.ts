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
    // 1. Fetch real articles and drafts directly from PostgreSQL REST API
    const dbRes = await axios.get('/api/articles', { timeout: 3500 }).catch(() => null);
    let dbArticles: Article[] = [];
    if (dbRes?.data?.data && Array.isArray(dbRes.data.data)) {
      dbArticles = dbRes.data.data.map((item: any) => ({
        ...item,
        status: item.status || 'published',
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

    // Merge: PostgreSQL real database articles first, then live multi-API articles
    const combined = dbArticles.length > 0 
      ? [...dbArticles, ...remoteArticles] 
      : (remoteArticles.length > 0 ? remoteArticles : fallbackArticles);

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
 * Service 3: Fetch Real-Time Community Comments for an Article (DummyJSON Comments)
 */
export async function fetchCommentsForArticle(articleId: string | number): Promise<Comment[]> {
  const cacheKey = `comments_${articleId}`;
  const cached = appCache.get<Comment[]>(cacheKey);
  if (cached) return cached;

  const localComments = fallbackComments[articleId as string] || [];

  try {
    const res = await axios.get(DUMMY_COMMENTS_API, { timeout: 3500 });
    const apiComments: Comment[] = res.data.comments.slice(0, 3).map((c: any) => ({
      id: `remote-c-${c.id}`,
      articleId,
      user: {
        id: `user-${c.user.id}`,
        name: c.user.fullName || c.user.username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user.username}`,
      },
      body: c.body,
      likes: c.likes || Math.floor(Math.random() * 20) + 5,
      createdAt: 'Recently',
    }));

    const merged = [...localComments, ...apiComments];
    appCache.set(cacheKey, merged);
    return merged;
  } catch (err) {
    appCache.set(cacheKey, localComments);
    return localComments;
  }
}
