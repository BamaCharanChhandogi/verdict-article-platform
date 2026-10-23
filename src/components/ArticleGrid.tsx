import React, { useState } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onBookmarkToggle: (article: Article) => void;
  isBookmarked: (id: string | number) => boolean;
  onResetFilters: () => void;
  activeFilterName?: string;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  onSelectArticle,
  onBookmarkToggle,
  isBookmarked,
  onResetFilters,
  activeFilterName,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 8;

  // Calculate pagination bounds
  const totalPages = Math.max(1, Math.ceil(articles.length / articlesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * articlesPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const element = document.getElementById('latest-articles-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="py-8">
      {/* Editorial Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h3 className="font-editorial text-3xl font-semibold text-[#141416] dark:text-white tracking-tight">
            Latest Articles
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
            Fresh perspectives to keep you inspired every day.
            {activeFilterName && activeFilterName !== 'All' && (
              <span className="font-semibold text-[#9E5A38] dark:text-[#E05A30] ml-2">
                &bull; Filtered by {activeFilterName}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium hidden sm:inline">
            Showing {articles.length === 0 ? 0 : startIndex + 1}&ndash;{Math.min(startIndex + articlesPerPage, articles.length)} of {articles.length} stories
          </span>

          {activeFilterName && activeFilterName !== 'All' && (
            <button
              onClick={() => {
                setCurrentPage(1);
                onResetFilters();
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] px-3.5 py-1.5 rounded-full shadow-2xs hover:bg-[#FAF7F2] dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Show All</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#171B22] rounded-3xl border border-[#EAE4D9] dark:border-[#262C3A] p-8 max-w-lg mx-auto">
          <p className="font-editorial text-2xl text-zinc-800 dark:text-zinc-200 font-medium">No stories found</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
            We couldn't find any articles matching your query. Try searching for a different topic, author, or keyword.
          </p>
          <button
            onClick={() => {
              setCurrentPage(1);
              onResetFilters();
            }}
            className="bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelect={onSelectArticle}
                onBookmarkToggle={onBookmarkToggle}
                isBookmarked={isBookmarked(article.id)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-[#EAE4D9] dark:border-[#262C3A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Page <strong className="text-zinc-800 dark:text-zinc-200">{safePage}</strong> of <strong className="text-zinc-800 dark:text-zinc-200">{totalPages}</strong>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={safePage === 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-700 dark:text-zinc-300 hover:bg-[#FAF7F2] dark:hover:bg-[#1F2430] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === safePage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416] shadow-xs'
                          : 'bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-700 dark:text-zinc-300 hover:bg-[#FAF7F2] dark:hover:bg-[#1F2430]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={safePage === totalPages}
                  onClick={() => handlePageChange(safePage + 1)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-700 dark:text-zinc-300 hover:bg-[#FAF7F2] dark:hover:bg-[#1F2430] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
