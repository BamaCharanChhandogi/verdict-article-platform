import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, List, LayoutGrid } from 'lucide-react';
import { Article, Category } from '../types';
import { ArticleCard } from './ArticleCard';
import { ArticleRow } from './ArticleRow';
import { TrendingSidebar } from './TrendingSidebar';

interface ArticleGridProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onBookmarkToggle: (article: Article) => void;
  isBookmarked: (id: string | number) => boolean;
  onResetFilters: () => void;
  activeFilterName?: string;
  onSelectCategory?: (category: Category) => void;
  onOpenAuthors?: () => void;
  onOpenAuth?: () => void;
}

const BATCH_SIZE = 9;
const THROTTLE_MS = 400;

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  onSelectArticle,
  onBookmarkToggle,
  isBookmarked,
  onResetFilters,
  activeFilterName,
  onSelectCategory,
  onOpenAuthors,
  onOpenAuth,
}) => {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [prevFilter, setPrevFilter] = useState(activeFilterName);
  const [prevArticlesLen, setPrevArticlesLen] = useState(articles.length);

  // Synchronously reset visible count during render when filter or collection changes (zero flicker / no layout shift)
  if (prevFilter !== activeFilterName || prevArticlesLen !== articles.length) {
    setPrevFilter(activeFilterName);
    setPrevArticlesLen(articles.length);
    setVisibleCount(BATCH_SIZE);
  }

  const hasMore = visibleCount < articles.length;

  // Explicit click-only function to load 3 more articles
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, articles.length));
  };

  const visibleArticles = articles.slice(0, visibleCount);

  return (
    <div className="py-8" id="latest-articles-section">
      {/* Editorial Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#EAE4D9]/70 dark:border-[#262C3A]/70">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#9E5A38] dark:text-[#E05A30] mb-1">
            <span>The Daily Dispatch</span>
          </div>
          <h3 className="font-editorial text-3xl font-bold text-[#141416] dark:text-white tracking-tight">
            Latest Articles
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
            Carefully curated perspectives, deep dives, and ideas from around the globe.
            {activeFilterName && activeFilterName !== 'All' && (
              <span className="font-semibold text-[#9E5A38] dark:text-[#E05A30] ml-2">
                &bull; Filtered by {activeFilterName}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle: Single-row Feed (Default) vs Gallery Grid */}
          <div className="inline-flex items-center p-1 rounded-full bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('feed')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer select-none ${
                viewMode === 'feed'
                  ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Feed view (single row per story)"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer select-none ${
                viewMode === 'grid'
                  ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium hidden md:inline">
            Showing {Math.min(visibleCount, articles.length)} of {articles.length} stories
          </span>

          {activeFilterName && activeFilterName !== 'All' && (
            <button
              onClick={() => {
                setVisibleCount(BATCH_SIZE);
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
              setVisibleCount(BATCH_SIZE);
              onResetFilters();
            }}
            className="bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Main Content + Trending Sidebar Layout (Consistent across Feed & Grid view) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Feed rows or Card grid */}
            <div className="lg:col-span-8 min-h-[450px]">
              {viewMode === 'feed' ? (
                <div className="space-y-4">
                  {visibleArticles.map((article) => (
                    <ArticleRow
                      key={article.id}
                      article={article}
                      onSelect={onSelectArticle}
                      onBookmarkToggle={onBookmarkToggle}
                      isBookmarked={isBookmarked(article.id)}
                      onOpenAuth={onOpenAuth}
                      onSelectCategory={onSelectCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onSelect={onSelectArticle}
                      onBookmarkToggle={onBookmarkToggle}
                      isBookmarked={isBookmarked(article.id)}
                      onSelectCategory={onSelectCategory}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Natural Scrolling Trending Tags & Top Writers Sidebar */}
            <div className="lg:col-span-4 hidden lg:block space-y-6">
              <TrendingSidebar
                onSelectTag={onSelectCategory || (() => {})}
                selectedTag={activeFilterName as Category}
                onOpenAuthors={onOpenAuthors}
                onOpenAuth={onOpenAuth}
              />
            </div>
          </div>

          {/* Simple Load 3 more text button */}
          {hasMore && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#141416] dark:hover:text-white px-5 py-2 rounded-full border border-[#EAE4D9] dark:border-[#262C3A] hover:border-[#141416] dark:hover:border-zinc-400 bg-white dark:bg-[#171B22] transition-colors cursor-pointer"
              >
                Load {Math.min(3, articles.length - visibleCount)} more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};