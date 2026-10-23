import React from 'react';
import { ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onSelect?: (article: Article) => void;
  onBookmarkToggle: (article: Article) => void;
  isBookmarked: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  onBookmarkToggle,
  isBookmarked,
}) => {
  return (
    <Link
      to={`/article/${article.slug}`}
      onClick={() => onSelect && onSelect(article)}
      className="group bg-white dark:bg-[#171B22] rounded-2xl overflow-hidden border border-[#EAE4D9] dark:border-[#262C3A] hover:border-zinc-300 dark:hover:border-zinc-600 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between block no-underline text-inherit"
    >
      <div>
        {/* Card Image with Bookmark Button Overlay */}
        <div className="relative aspect-16/10 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBookmarkToggle(article);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-white dark:bg-[#171B22] text-[#9E5A38] dark:text-[#D98A62] shadow-sm'
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E5A38] dark:text-[#D98A62] mb-1.5 block">
            {article.category}
          </span>
          <h4 className="font-editorial text-base sm:text-lg font-bold text-[#141416] dark:text-[#F1F3F5] group-hover:text-[#2E4A3E] dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h4>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center justify-between border-t border-[#FAF7F2] dark:border-[#1F242E] mt-2">
        <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
          {article.readingTime} min read
        </span>
        <div className="w-7 h-7 rounded-full bg-[#FAF7F2] dark:bg-[#1E232B] group-hover:bg-[#141416] group-hover:text-white dark:group-hover:bg-[#F1F3F5] dark:group-hover:text-black text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors">
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
