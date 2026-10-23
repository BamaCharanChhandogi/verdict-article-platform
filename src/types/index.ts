export interface Author {
  id: string | number;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  followers: number;
  articlesCount: number;
  twitter?: string;
  github?: string;
}

export interface Comment {
  id: string | number;
  articleId: string | number;
  user: {
    id: string | number;
    name: string;
    avatar: string;
  };
  body: string;
  likes: number;
  createdAt: string;
}

export interface Article {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  subtitle?: string;
  content: string;
  coverImage: string;
  category: string;
  author: Author;
  publishedAt: string;
  readingTime: number; // in minutes
  likesCount: number;
  commentsCount: number;
  viewsCount?: number;
  isFeatured?: boolean;
  isEditorPick?: boolean;
  editorPickRank?: number;
  tags: string[];
  status?: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  scheduledAt?: string;
  isUnlisted?: boolean;
  seriesName?: string;
  updatedAt?: string;
}

export type Category = 
  | 'All'
  | 'Technology'
  | 'Design'
  | 'Business'
  | 'Lifestyle'
  | 'Travel'
  | 'Health'
  | 'Productivity'
  | 'AI & Future';

export type NavTab = 
  | 'home'
  | 'feed'
  | 'explore'
  | 'topics'
  | 'authors'
  | 'bookmarks'
  | 'newsletter'
  | 'mystories'
  | 'drafts'
  | 'submissions'
  | 'analytics'
  | 'write';
