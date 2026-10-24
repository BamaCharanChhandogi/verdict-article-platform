import React, { useState } from 'react';
import { Bookmark, MessageSquare, ArrowUpRight, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { likeRealArticle } from '../services/api';
import { isArticleLiked, getStoredArticleLikes, toggleArticleLike } from '../utils/likes';

interface ArticleRowProps {
  article: Article;
  onSelect?: (article: Article) => void;
  onBookmarkToggle: (article: Article) => void;
  isBookmarked: boolean;
  onOpenAuth?: () => void;
  onSelectCategory?: (category: Category) => void;
}

export const ArticleRow: React.FC<ArticleRowProps> = ({
  article,
  onSelect,
  onBookmarkToggle,
  isBookmarked,
  onOpenAuth,
  onSelectCategory,
}) => {
  const { isAuthenticated, token } = useAuth();
  const [likesCount, setLikesCount] = useState(() => getStoredArticleLikes(article.id, article.likesCount || 0));
  const [hasLiked, setHasLiked] = useState(() => isArticleLiked(article.id));

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const { hasLiked: newHasLiked, likesCount: newLikesCount } = toggleArticleLike(article.id, likesCount);
    setHasLiked(newHasLiked);
    setLikesCount(newLikesCount);

    if (token) {
      likeRealArticle(article.id, token).catch(() => {});
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/article/${article.slug}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  // Author sub-domain link simulator
  const authorSlug = article.author?.name
    ? article.author.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'verdict';
  const blogDomain = `verdict.media/@${authorSlug}`;

  return (
    <article className="group bg-white dark:bg-[#171B22] rounded-3xl p-5 sm:p-6 border border-[#EAE4D9] dark:border-[#262C3A] hover:border-zinc-300 dark:hover:border-zinc-600 shadow-2xs hover:shadow-md transition-all duration-300">
      {/* 1. Author & Metadata Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center space-x-2.5 min-w-0">
          <img
            src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt={article.author?.name || 'Author'}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 aspect-square border border-black/5 dark:border-white/10"
            loading="lazy"
          />
          <div className="flex items-center space-x-2 text-xs min-w-0">
            <span className="font-bold text-[#141416] dark:text-[#F1F3F5] hover:underline cursor-pointer truncate max-w-[105px] sm:max-w-none">
              {article.author?.name || 'Verdict Fellow'}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">&bull;</span>
            <span className="text-zinc-500 dark:text-zinc-400 shrink-0 whitespace-nowrap">
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500 hidden sm:inline">&bull;</span>
            <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline font-medium shrink-0 whitespace-nowrap">
              {article.readingTime || 4} min read
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onSelectCategory) onSelectCategory(article.category as Category);
          }}
          className="text-[10px] uppercase font-bold tracking-widest text-[#9E5A38] dark:text-[#E05A30] bg-[#9E5A38]/10 dark:bg-[#E05A30]/15 hover:bg-[#9E5A38]/20 dark:hover:bg-[#E05A30]/25 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors shrink-0 whitespace-nowrap ml-2"
        >
          {article.category}
        </button>
      </div>

      {/* 2. Main Body: Headline + Excerpt (Left) & Thumbnail (Right) */}
      <Link
        to={`/article/${article.slug}`}
        onClick={() => onSelect && onSelect(article)}
        className="flex items-start justify-between gap-4 sm:gap-6 block no-underline text-inherit cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#141416] dark:text-[#F1F3F5] group-hover:text-[#9E5A38] dark:group-hover:text-[#E05A30] transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-sans">
            {article.description}
          </p>
        </div>

        {/* Thumbnail Image */}
        {article.coverImage && (
          <div className="w-28 sm:w-44 h-20 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5 shadow-2xs">
            <img
              src={article.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
              alt={article.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </div>
        )}
      </Link>

      {/* 3. Action Footer (Hashnode Style) */}
      <div className="mt-4 pt-3.5 border-t border-[#FAF7F2] dark:border-[#202633] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center space-x-3">
          {/* Upvote Pill */}
          <button
            type="button"
            onClick={handleLike}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              hasLiked
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}
            title="Upvote story"
          >
            <span className={`text-sm ${hasLiked ? 'text-rose-500 font-bold' : ''}`}>▲</span>
            <span>{likesCount}</span>
          </button>

          {/* Comments Count */}
          <Link
            to={`/article/${article.slug}#comments`}
            onClick={() => onSelect && onSelect(article)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-inherit no-underline cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{article.commentsCount || 0}</span>
          </Link>
        </div>

        {/* Right Actions: Publication domain + Share + Bookmark */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="hidden md:inline-flex items-center space-x-1 text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors font-mono">
            <span>{blogDomain}</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
            title="Copy story link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAuthenticated) {
                if (onOpenAuth) onOpenAuth();
                return;
              }
              onBookmarkToggle(article);
            }}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-[#9E5A38] dark:text-[#E05A30] bg-[#9E5A38]/10'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
};