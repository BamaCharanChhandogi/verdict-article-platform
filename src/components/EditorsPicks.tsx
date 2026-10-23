import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { Article } from '../types';

interface EditorsPicksProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onBookmarkToggle: (article: Article) => void;
  isBookmarked: (id: string | number) => boolean;
  onSeeAllClick: () => void;
}

export const EditorsPicks: React.FC<EditorsPicksProps> = ({
  articles,
  onSelectArticle,
  onBookmarkToggle,
  isBookmarked,
  onSeeAllClick,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 4;

  const picks = articles.filter(a => a.isEditorPick);
  const displayPicks = picks.length > 0 ? picks : articles.slice(0, 8);
  
  const totalPages = Math.ceil(displayPicks.length / pageSize);
  const currentPicks = displayPicks.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="bg-transparent rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-xl font-semibold text-[#18181B] tracking-tight">
          Editor's Picks
        </h3>
        <button
          onClick={onSeeAllClick}
          className="text-xs font-semibold text-zinc-500 hover:text-[#18181B] transition-colors cursor-pointer"
        >
          See All
        </button>
      </div>

      {/* 4 Numbered Articles List */}
      <div className="space-y-4">
        {currentPicks.map((article, index) => {
          const globalIndex = currentPage * pageSize + index + 1;
          const rankStr = globalIndex < 10 ? `0${globalIndex}` : `${globalIndex}`;
          const bookmarked = isBookmarked(article.id);

          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group flex items-center space-x-3 p-2 rounded-xl hover:bg-[#F3EFEA] transition-colors cursor-pointer"
            >
              {/* Number Rank */}
              <span className="font-sans text-xs font-bold text-zinc-400 group-hover:text-[#18181B] transition-colors w-5 shrink-0">
                {rankStr}
              </span>

              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>

              {/* Title & Reading Time */}
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-sans text-xs font-semibold text-[#18181B] leading-snug group-hover:text-[#E05A30] transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center space-x-2 text-[10px] text-zinc-500 mt-1">
                  <span>{article.readingTime} min read</span>
                  <span>&bull;</span>
                  <span>{article.category}</span>
                </div>
              </div>

              {/* Bookmark Action */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle(article);
                }}
                className={`p-1.5 rounded-full hover:bg-zinc-200/60 transition-colors shrink-0 cursor-pointer ${
                  bookmarked ? 'text-[#E05A30]' : 'text-zinc-400 hover:text-zinc-700'
                }`}
                title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-[#EFECE6]">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-[#18181B] hover:border-zinc-400 transition-colors cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-[#18181B] hover:border-zinc-400 transition-colors cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
