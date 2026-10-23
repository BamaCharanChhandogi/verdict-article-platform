import React from 'react';
import { ArrowRight, Bookmark } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
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
    <div
      onClick={() => onSelect(article)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EFECE6] hover:border-zinc-300 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Card Image with Bookmark Button Overlay */}
        <div className="relative aspect-16/10 overflow-hidden bg-zinc-100">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle(article);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-white text-[#E05A30] shadow-sm'
                : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1.5 block">
            {article.category}
          </span>
          <h4 className="font-sans text-sm sm:text-base font-semibold text-[#18181B] group-hover:text-[#E05A30] transition-colors leading-snug line-clamp-2">
            {article.title}
          </h4>
          <p className="text-zinc-500 text-xs mt-2 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center justify-between border-t border-zinc-100 mt-2">
        <span className="text-[11px] font-medium text-zinc-400">
          {article.readingTime} min read
        </span>
        <div className="w-7 h-7 rounded-full bg-[#F3EFEA] group-hover:bg-[#18181B] text-zinc-700 group-hover:text-white flex items-center justify-center transition-colors">
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
