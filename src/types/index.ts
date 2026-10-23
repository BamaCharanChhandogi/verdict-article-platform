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
  content: string;
  coverImage: string;
  category: string;
  author: Author;
  publishedAt: string;
  readingTime: number; // in minutes
  likesCount: number;
  commentsCount: number;
  isFeatured?: boolean;
  isEditorPick?: boolean;
  editorPickRank?: number;
  tags: string[];
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
  | 'explore'
  | 'topics'
  | 'authors'
  | 'bookmarks'
  | 'newsletter';
