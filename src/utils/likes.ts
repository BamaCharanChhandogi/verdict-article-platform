const LIKED_ARTICLES_KEY = 'verdict_liked_articles';
const ARTICLE_LIKES_COUNTS_KEY = 'verdict_article_likes_counts';

export const getLikedArticleIds = (): string[] => {
  try {
    const raw = localStorage.getItem(LIKED_ARTICLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const isArticleLiked = (articleId: string | number): boolean => {
  const list = getLikedArticleIds();
  return list.includes(String(articleId));
};

export const getStoredArticleLikes = (articleId: string | number, defaultBase: number = 0): number => {
  const idStr = String(articleId);
  try {
    const raw = localStorage.getItem(ARTICLE_LIKES_COUNTS_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      if (typeof map[idStr] === 'number') {
        return map[idStr];
      }
    }
  } catch {
    // fallback
  }

  const userLiked = isArticleLiked(articleId);
  return defaultBase + (userLiked ? 1 : 0);
};

export const toggleArticleLike = (
  articleId: string | number, 
  currentLikes: number
): { hasLiked: boolean; likesCount: number } => {
  const idStr = String(articleId);
  const likedList = getLikedArticleIds();
  const currentlyLiked = likedList.includes(idStr);

  let updatedList: string[];
  let newLikesCount: number;

  if (currentlyLiked) {
    updatedList = likedList.filter(id => id !== idStr);
    newLikesCount = Math.max(0, currentLikes - 1);
  } else {
    updatedList = [...likedList, idStr];
    newLikesCount = currentLikes + 1;
  }

  try {
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(updatedList));

    const rawCounts = localStorage.getItem(ARTICLE_LIKES_COUNTS_KEY);
    const map = rawCounts ? JSON.parse(rawCounts) : {};
    map[idStr] = newLikesCount;
    localStorage.setItem(ARTICLE_LIKES_COUNTS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }

  return {
    hasLiked: !currentlyLiked,
    likesCount: newLikesCount
  };
};
