import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const articlesPerPage = 7; // 7 articles + 1 promo card = 8 grid slots

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="py-8">
      {/* Editorial Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h3 className="font-editorial text-3xl font-semibold text-[#141416] tracking-tight">
            Latest Articles
          </h3>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Fresh perspectives to keep you inspired every day.
            {activeFilterName && activeFilterName !== 'All' && (
              <span className="font-semibold text-[#9E5A38] ml-2">
                &bull; Filtered by {activeFilterName}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            Showing {articles.length === 0 ? 0 : startIndex + 1}&ndash;{Math.min(startIndex + articlesPerPage, articles.length)} of {articles.length} stories
          </span>

          {activeFilterName && activeFilterName !== 'All' && (
            <button
              onClick={() => {
                setCurrentPage(1);
                onResetFilters();
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 hover:text-black bg-white border border-[#EAE4D9] px-3.5 py-1.5 rounded-full shadow-2xs hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Show All</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE4D9] p-8 max-w-lg mx-auto">
          <p className="font-editorial text-2xl text-zinc-800 font-medium">No stories found</p>
          <p className="text-xs text-zinc-500 mt-2 mb-6">
            We couldn't find any articles matching your query. Try searching for a different topic, author, or keyword.
          </p>
          <button
            onClick={() => {
              setCurrentPage(1);
              onResetFilters();
            }}
            className="bg-[#141416] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
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

            {/* Curated Insights / Weekly Brief Promo Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg p-6 text-white flex flex-col justify-between min-h-[320px] group bg-gradient-to-b from-[#0A1A12] via-[#05110B] to-[#010805]">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600 via-transparent to-transparent"></div>
              <img 
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80" 
                alt="Curated leaf pattern"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-700"
              />

              <div className="relative z-10">
                <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3 h-3" />
                  <span>The Sunday Brief</span>
                </span>
                <h4 className="font-editorial text-2xl font-medium leading-snug mt-1">
                  Curated insights. <br />
                  <span className="italic">Real impact.</span>
                </h4>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                  Join 45,000+ discerning readers who receive our Sunday morning digest on ideas, design, and culture.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                {subscribed ? (
                  <div className="bg-emerald-900/60 border border-emerald-500/40 rounded-xl p-3 text-center text-xs text-emerald-200 flex items-center justify-center space-x-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>✓ Subscribed for Sunday Edition!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-hidden focus:bg-white/20"
                    />
                    <button
                      type="submit"
                      className="w-full bg-white hover:bg-zinc-100 text-[#141416] font-semibold text-xs py-2 px-4 rounded-full transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Subscribe Free</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-[#EAE4D9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-500">
                Page <strong className="text-zinc-800">{safePage}</strong> of <strong className="text-zinc-800">{totalPages}</strong>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={safePage === 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#EAE4D9] text-zinc-700 hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                          ? 'bg-[#141416] text-white shadow-xs'
                          : 'bg-white border border-[#EAE4D9] text-zinc-700 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={safePage === totalPages}
                  onClick={() => handlePageChange(safePage + 1)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#EAE4D9] text-zinc-700 hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
