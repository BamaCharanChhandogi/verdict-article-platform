import React, { useState, useMemo } from 'react';
import { 
  Bookmark, 
  Clock, 
  ArrowRight, 
  Trash2, 
  Share2, 
  Check, 
  Search, 
  Sparkles, 
  Compass, 
  Plus, 
  BookOpen,
  User,
  LogIn
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Article } from '../types';
import { useAuth } from '../context/AuthContext';

interface ReadingListPageProps {
  bookmarkedArticles: Article[];
  onRemoveBookmark: (article: Article) => void;
  onOpenAuth: () => void;
  allArticles?: Article[];
  onAddBookmark?: (article: Article) => void;
}

export const ReadingListPage: React.FC<ReadingListPageProps> = ({
  bookmarkedArticles,
  onRemoveBookmark,
  onOpenAuth,
  allArticles = [],
  onAddBookmark,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  // Categories present in saved articles
  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    bookmarkedArticles.forEach(a => set.add(a.category));
    return Array.from(set);
  }, [bookmarkedArticles]);

  // Filtered saved stories
  const filtered = useMemo(() => {
    return bookmarkedArticles.filter((article) => {
      const matchesCat = selectedCategory === 'All' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q)
      );
      return matchesCat && matchesSearch;
    });
  }, [bookmarkedArticles, selectedCategory, searchQuery]);

  const totalReadingTime = useMemo(() => {
    return bookmarkedArticles.reduce((acc, curr) => acc + (curr.readingTime || 5), 0);
  }, [bookmarkedArticles]);

  const handleShare = (article: Article, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/article/${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="border-b border-[#EAE4D9] dark:border-[#262C3A] pb-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#9E5A38] dark:text-[#E05A30] mb-2">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Personal Archive</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141416] dark:text-white">
              Reading List
            </h1>
            <p className="font-sans text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl">
              Your curated queue of essays, deep dives, and perspectives saved for focused reading.
            </p>
          </div>

          {isAuthenticated && bookmarkedArticles.length > 0 && (
            <div className="flex items-center space-x-3 text-xs bg-[#FAF7F2] dark:bg-[#1A1F29] border border-[#EAE4D9] dark:border-[#262C3A] px-4 py-2 rounded-2xl shrink-0">
              <span className="font-bold text-[#141416] dark:text-white">
                {bookmarkedArticles.length} {bookmarkedArticles.length === 1 ? 'story' : 'stories'}
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">&bull;</span>
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{totalReadingTime} min read</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 1. Unauthenticated Gate: Clean Auth Required State */}
      {!isAuthenticated ? (
        <div className="bg-white dark:bg-[#171B22] rounded-3xl border border-[#EAE4D9] dark:border-[#262C3A] p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xs my-8">
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] dark:text-[#F1F3F5] mb-3">
            Access Your Reading List
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
            Sign in to access your curated library of essays, perspectives, and dispatches synced securely across all your devices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-xs font-semibold px-6 py-3 rounded-full hover:bg-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Access Reading List</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#FAF7F2] dark:bg-[#12151B] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-700 dark:text-zinc-300 text-xs font-semibold px-6 py-3 rounded-full hover:bg-white dark:hover:bg-[#171B22] transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Editorial Feed</span>
            </button>
          </div>
        </div>
      ) : bookmarkedArticles.length === 0 ? (
        /* 2. Authenticated Empty State */
        <div className="bg-white dark:bg-[#171B22] rounded-3xl border border-[#EAE4D9] dark:border-[#262C3A] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs my-8">
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] dark:text-white mb-2">
            Your Reading Queue is Waiting
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
            As you explore long-form perspectives, tap the bookmark ribbon on any essay to stash it in your personal reading queue.
          </p>
          <button
            onClick={() => navigate('/feed')}
            className="inline-flex items-center space-x-2 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-xs font-bold px-6 py-3 rounded-full hover:bg-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Curated Feed</span>
          </button>
        </div>
      ) : (
        /* 3. Authenticated Bookmarked Articles Grid */
        <div>
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]'
                      : 'bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* In-List Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search saved stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] rounded-full text-xs text-[#141416] dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          {/* Cards Grid */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">
              No saved stories matched your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <div
                  key={article.id}
                  className="bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Cover Thumbnail */}
                    <div className="relative aspect-16/10 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 dark:bg-[#12151B]/90 backdrop-blur-xs text-[#9E5A38] dark:text-[#E05A30] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#EAE4D9] dark:border-[#262C3A]">
                        {article.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400 dark:text-zinc-500 mb-2">
                        <span>{article.readingTime} min read</span>
                        <span>&bull;</span>
                        <span>{article.publishedAt}</span>
                      </div>

                      <Link
                        to={`/article/${article.slug}`}
                        className="block no-underline text-inherit group-hover:text-[#2E4A3E] dark:group-hover:text-emerald-400 transition-colors"
                      >
                        <h3 className="font-editorial text-lg font-bold text-[#141416] dark:text-white leading-snug line-clamp-2 mb-2">
                          {article.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {article.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="p-5 pt-0 border-t border-[#FAF7F2] dark:border-[#1F2430] mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0 aspect-square ring-1 ring-zinc-200 dark:ring-zinc-700"
                      />
                      <span className="text-xs font-semibold text-[#141416] dark:text-zinc-200 truncate">
                        {article.author.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={(e) => handleShare(article, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
                        title="Copy story link"
                      >
                        {copiedId === article.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onRemoveBookmark(article)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Remove from Reading List"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        to={`/article/${article.slug}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#141416] dark:text-white hover:text-[#9E5A38] dark:hover:text-[#E05A30] ml-1 transition-colors no-underline"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
