import axios from 'axios';
import { Article, Author, Comment } from '../types';
import { fallbackArticles, fallbackAuthors, fallbackComments } from '../data/fallbackData';
import { appCache } from './cache';

// API Endpoints
const DEVTO_API = 'https://dev.to/api/articles?per_page=12&top=7';
const DUMMY_USERS_API = 'https://dummyjson.com/users?limit=8&select=id,firstName,lastName,image,company';
const DUMMY_COMMENTS_API = 'https://dummyjson.com/comments?limit=15';

/**
 * Service 1: Fetch Editorial Articles from Public API (Dev.to) with Seamless Fallback
 */
export async function fetchArticles(): Promise<Article[]> {
  const cacheKey = 'articles_feed';
  const cached = appCache.get<Article[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await axios.get(DEVTO_API, { timeout: 4000 });
    const remoteArticles: Article[] = res.data.map((item: any, idx: number) => {
      // Map tags to our editorial categories
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
        content: `
# ${item.title}

${item.description}

### Deep Dive & Strategic Perspectives

Modern digital craftsmanship requires balancing architectural velocity with long-term systemic stability. As technology evolves at an unprecedented pace, creators and engineers must cultivate intellectual discernment rather than chasing fleeting hype cycles.

> "The ultimate elegance in software and design is not how much you can add, but the disciplined restraint of knowing what to leave out."

### Core Architectural Principles
1. **Clarity of Intent**: Every line of code or pixel placed on screen must serve a concrete human need.
2. **Resilient Systems**: Engineering for edge cases and failures before they manifest in production.
3. **Continuous Curiosity**: Embracing lifelong iteration with humble intellectual rigor.
        `,
        coverImage: item.cover_image || fallbackArticles[idx % fallbackArticles.length].coverImage,
        category,
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

    // Merge high-polish reference articles at the top to preserve exact visual fidelity from reference UI
    const combined = [...fallbackArticles, ...remoteArticles];
    appCache.set(cacheKey, combined);
    return combined;
  } catch (err) {
    console.warn('API 1 (Dev.to) unreachable or rate-limited; utilizing high-availability local fallback.');
    appCache.set(cacheKey, fallbackArticles);
    return fallbackArticles;
  }
}

/**
 * Service 2: Fetch Enriched Authors from Public API (DummyJSON Users)
 */
export async function fetchAuthors(): Promise<Author[]> {
  const cacheKey = 'authors_feed';
  const cached = appCache.get<Author[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await axios.get(DUMMY_USERS_API, { timeout: 3500 });
    const remoteAuthors: Author[] = res.data.users.map((u: any, idx: number) => ({
      id: `author-api-${u.id}`,
      name: `${u.firstName} ${u.lastName}`,
      avatar: u.image || fallbackAuthors[idx % fallbackAuthors.length].avatar,
      role: u.company?.title || 'Senior Fellow & Essayist',
      bio: `Investigating digital culture, humane technology, and cognitive philosophy at ${u.company?.name || 'Verdict Media'}.`,
      followers: 8500 + u.id * 410,
      articlesCount: 15 + u.id * 2,
      twitter: `@${u.firstName.toLowerCase()}_${u.lastName.toLowerCase()}`,
    }));

    const allAuthors = [...fallbackAuthors, ...remoteAuthors];
    appCache.set(cacheKey, allAuthors);
    return allAuthors;
  } catch (err) {
    console.warn('API 2 (DummyJSON Users) unreachable; utilizing local author dataset.');
    appCache.set(cacheKey, fallbackAuthors);
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

  // Check fallback comments first for instant response
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
