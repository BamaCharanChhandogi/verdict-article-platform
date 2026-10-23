import React from 'react';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
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
  return (
    <div className="py-8">
      {/* Editorial Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h3 className="font-serif text-3xl font-semibold text-[#18181B] tracking-tight">
            Latest Articles
          </h3>
          <p className="text-zinc-500 text-sm mt-1">
            Fresh perspectives to keep you inspired every day.
            {activeFilterName && activeFilterName !== 'All' && (
              <span className="font-semibold text-[#E05A30] ml-2">
                &bull; Filtered by {activeFilterName}
              </span>
            )}
          </p>
        </div>

        {activeFilterName && activeFilterName !== 'All' && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 hover:text-black bg-white border border-[#EFECE6] px-3.5 py-1.5 rounded-full shadow-2xs hover:bg-[#F3EFEA] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Show All</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EFECE6] p-8 max-w-lg mx-auto">
          <p className="font-serif text-xl text-zinc-800 font-medium">No stories found</p>
          <p className="text-xs text-zinc-500 mt-2 mb-6">
            We couldn't find any articles matching your query. Try searching for a different topic, author, or keyword.
          </p>
          <button
            onClick={onResetFilters}
            className="bg-[#18181B] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
              onBookmarkToggle={onBookmarkToggle}
              isBookmarked={isBookmarked(article.id)}
            />
          ))}

          {/* Right Newsletter / Curated Insights Promo Card (Exact match to reference UI) */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg p-6 text-white flex flex-col justify-between min-h-[320px] group bg-gradient-to-b from-[#0A1A12] via-[#05110B] to-[#010805]">
            {/* Background Organic Leaf / Waves Overlay */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600 via-transparent to-transparent"></div>
            <img 
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80" 
              alt="Curated leaf pattern"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-700"
            />

            <div className="relative z-10">
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full mb-4">
                <Sparkles className="w-3 h-3" />
                <span>The Weekly Brief</span>
              </span>
              <h4 className="font-serif text-2xl font-medium leading-snug mt-2">
                Curated insights. <br />
                <span className="italic">Real impact.</span>
              </h4>
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
                Join 45,000+ discerning readers who receive our Sunday morning digest on ideas, design, and culture.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <button
                onClick={() => alert("Subscribed! You will receive next Sunday's curated edition.")}
                className="w-full bg-white hover:bg-zinc-100 text-[#18181B] font-semibold text-xs py-2.5 px-4 rounded-full transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer group-hover:scale-102"
              >
                <span>Subscribe Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
