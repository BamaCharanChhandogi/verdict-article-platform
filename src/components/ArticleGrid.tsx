import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
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

const BATCH_SIZE = 8;
const THROTTLE_MS = 400;

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  onSelectArticle,
  onBookmarkToggle,
  isBookmarked,
  onResetFilters,
  activeFilterName,
}) => {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lastLoadTimeRef = useRef<number>(0);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset pagination state when the active collection changes (search or category filter)
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    setIsLoadingMore(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  }, [articles.length, activeFilterName]);

  const hasMore = visibleCount < articles.length;

  // Throttled function to load the next chunk of articles
  const loadNextBatch = () => {
    const now = Date.now();
    if (now - lastLoadTimeRef.current < THROTTLE_MS || isLoadingMore || !hasMore) {
      return;
    }
    lastLoadTimeRef.current = now;
    setIsLoadingMore(true);

    loadTimeoutRef.current = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, articles.length));
      setIsLoadingMore(false);
    }, 450);
  };

  // Primary: IntersectionObserver on the bottom sentinel element
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadNextBatch();
        }
      },
      {
        root: null,
        rootMargin: '300px', // trigger 300px before reaching the end of screen for seamless loading
        threshold: 0.05,
      }
    );

    const target = sentinelRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, visibleCount, articles.length, isLoadingMore]);

  // Secondary: Window scroll listener fallback with throttle
  useEffect(() => {
    if (!hasMore) return;

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight - 350;
        if (scrollPosition >= threshold && hasMore && !isLoadingMore) {
          loadNextBatch();
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [hasMore, visibleCount, articles.length, isLoadingMore]);

  // Cleanup pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, []);

  const visibleArticles = articles.slice(0, visibleCount);

  return (
    <div className="py-8" id="latest-articles-section">
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
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelect={onSelectArticle}
                onBookmarkToggle={onBookmarkToggle}
                isBookmarked={isBookmarked(article.id)}
              />
            ))}
          </div>

          {/* Throttled Bottom Sentinel & Smooth Auto-Loading Indicator */}
          {hasMore && (
            <div 
              ref={sentinelRef} 
              className="mt-12 py-8 flex flex-col items-center justify-center space-y-2.5"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/70 dark:bg-[#171B22]/70 backdrop-blur-md border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#9E5A38] dark:text-[#E05A30]" />
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Loading more stories...
                </span>
              </div>
            </div>
          )}

          {/* End of Collection Notice */}
          {!hasMore && articles.length > BATCH_SIZE && (
            <div className="mt-16 pt-8 border-t border-[#EAE4D9]/80 dark:border-[#262C3A]/80 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                You've reached the end of the collection &bull; Stay curious
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
