import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { EditorsPicks } from './components/EditorsPicks';
import { CategoryPills } from './components/CategoryPills';
import { ArticleGrid } from './components/ArticleGrid';
import { ArticleDetail } from './components/ArticleDetail';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { AuthModal } from './components/AuthModal';
import { DedicatedWriterStudio } from './components/DedicatedWriterStudio';
import { AuthorDirectory } from './components/AuthorDirectory';
import { AuthorDashboard } from './components/AuthorDashboard';
import { HeroSkeleton, ArticleCardSkeleton } from './components/Skeletons';
import { Article, Category, NavTab } from './types';
import { fetchArticles } from './services/api';
import { fallbackArticles } from './data/fallbackData';

const ALL_CATEGORIES: Category[] = [
  'All',
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Travel',
  'Health',
  'Productivity',
  'AI & Future'
];

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Partial<Article> | null>(null);

  // Sync activeNav with current pathname
  const activeNav: NavTab = useMemo(() => {
    const path = location.pathname;
    if (path === '/authors') return 'authors';
    if (path === '/studio' || path === '/mystories') return 'mystories';
    if (path === '/explore') return 'explore';
    if (path === '/write') return 'write';
    return 'home';
  }, [location.pathname]);

  // LocalStorage Bookmarks Persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('verdict_bookmarks');
      return saved ? JSON.parse(saved) : ['feat-1', 'pick-2'];
    } catch {
      return ['feat-1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('verdict_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (err) {
      console.warn('LocalStorage unavailable');
    }
  }, [bookmarkedIds]);

  // Real Multi-API & PostgreSQL Fetch on Mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchArticles().then((data) => {
      if (isMounted) {
        setArticles(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Bookmark Toggle Handler
  const handleBookmarkToggle = (article: Article) => {
    const id = String(article.id);
    setBookmarkedIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string | number) => bookmarkedIds.includes(String(id));

  const bookmarkedArticles = useMemo(() => {
    return articles.filter(a => bookmarkedIds.includes(String(a.id)));
  }, [articles, bookmarkedIds]);

  // Delete article handler (real database sync)
  const handleDeleteArticle = (id: string | number) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  // Article published or saved in Dedicated Studio
  const handleArticlePublished = (newArticle: Article) => {
    setArticles((prev) => {
      const exists = prev.some(a => a.id === newArticle.id);
      if (exists) {
        return prev.map(a => a.id === newArticle.id ? newArticle : a);
      }
      return [newArticle, ...prev];
    });

    setEditingDraft(null);
    if (newArticle.status === 'draft') {
      navigate('/studio');
    } else {
      navigate(`/article/${newArticle.slug}`);
    }
  };

  // Debounced Search & Filter Logic (Only show published articles on public feed)
  const filteredArticles = useMemo(() => {
    return articles
      .filter(a => a.status !== 'draft')
      .filter((a) => {
        // Category filter
        const matchesCategory = selectedCategory === 'All' || a.category.toLowerCase() === selectedCategory.toLowerCase();

        // Search query filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        );

        return matchesCategory && matchesSearch;
      });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <Routes>
      {/* 1. DEDICATED FULL-SCREEN WRITER STUDIO ROUTE (/write) */}
      <Route
        path="/write"
        element={
          <DedicatedWriterStudio
            onBack={() => {
              setEditingDraft(null);
              navigate('/studio');
            }}
            onArticlePublished={handleArticlePublished}
            initialDraft={editingDraft}
          />
        }
      />

      {/* 2. ALL LAYOUT-WRAPPED PAGES */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-[#FAF7F2] text-[#141416] flex">
            {/* Fixed Left Vertical Navigation Rail (Single source of truth) */}
            <Sidebar
              activeNav={activeNav}
              setActiveNav={(nav) => {
                if (nav === 'home') navigate('/');
                else if (nav === 'authors') navigate('/authors');
                else if (nav === 'mystories') navigate('/studio');
                else if (nav === 'explore') navigate('/explore');
                else if (nav === 'write') {
                  setEditingDraft(null);
                  navigate('/write');
                }
              }}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              bookmarksCount={bookmarkedIds.length}
              isOpenMobile={isMobileSidebarOpen}
              setIsOpenMobile={setIsMobileSidebarOpen}
              onOpenBookmarks={() => setIsBookmarksOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenEditor={() => {
                setEditingDraft(null);
                navigate('/write');
              }}
            />

            {/* Main Content Canvas */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
              
              {/* Sticky Utility Header */}
              <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
              />

              <Routes>
                {/* ARTICLE DETAIL READER ROUTE (/article/:slug) */}
                <Route
                  path="/article/:slug"
                  element={
                    <main className="flex-1">
                      <ArticleDetail
                        onBack={() => navigate('/')}
                        onBookmarkToggle={handleBookmarkToggle}
                        isBookmarked={isBookmarked}
                        allArticles={articles}
                      />
                    </main>
                  }
                />

                {/* AUTHORS & FELLOWS DIRECTORY ROUTE (/authors) */}
                <Route
                  path="/authors"
                  element={
                    <main className="flex-1">
                      <AuthorDirectory
                        onSelectAuthorArticles={(authorName) => {
                          setSearchQuery(authorName);
                          setSelectedCategory('All');
                          navigate('/');
                        }}
                      />
                    </main>
                  }
                />

                {/* AUTHOR HUB & CREATOR STUDIO ROUTE (/studio or /mystories) */}
                <Route
                  path="/studio"
                  element={
                    <main className="flex-1">
                      <AuthorDashboard
                        articles={articles}
                        onOpenEditor={() => {
                          setEditingDraft(null);
                          navigate('/write');
                        }}
                        onSelectArticle={(article) => navigate(`/article/${article.slug}`)}
                        onDeleteArticle={handleDeleteArticle}
                        onResumeDraft={(draft) => {
                          setEditingDraft(draft);
                          navigate('/write');
                        }}
                        onOpenAuth={() => setIsAuthOpen(true)}
                      />
                    </main>
                  }
                />
                <Route path="/mystories" element={<Navigate to="/studio" replace />} />

                {/* EDITORIAL HOME & EXPLORE FEED (/) */}
                <Route
                  path="*"
                  element={
                    <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
                      {/* Active Search Mode */}
                      {searchQuery ? (
                        <div className="pt-6">
                          <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-editorial text-2xl font-bold text-[#141416]">
                              Search Results for "{searchQuery}"
                            </h2>
                            <span className="text-xs text-zinc-500 font-semibold">
                              {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'} found
                            </span>
                          </div>
                          <ArticleGrid
                            articles={filteredArticles}
                            onSelectArticle={(article) => navigate(`/article/${article.slug}`)}
                            onBookmarkToggle={handleBookmarkToggle}
                            isBookmarked={isBookmarked}
                            onResetFilters={() => {
                              setSearchQuery('');
                              setSelectedCategory('All');
                            }}
                            activeFilterName={selectedCategory}
                          />
                        </div>
                      ) : (
                        <>
                          {/* Hero Section & Organic Editorial Block */}
                          {isLoading ? (
                            <HeroSkeleton />
                          ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                              <div className="xl:col-span-9 space-y-6">
                                <HeroSection onExploreClick={() => {
                                  const el = document.getElementById('latest-articles-section');
                                  el?.scrollIntoView({ behavior: 'smooth' });
                                }} />

                                {/* Featured This Week (3 Horizontal Glass Cards) */}
                                <FeaturedCarousel
                                  articles={filteredArticles}
                                  onSelectArticle={(article) => navigate(`/article/${article.slug}`)}
                                />
                              </div>

                              {/* Right Rail: Editor's Picks (Numbered 01-04) */}
                              <div className="xl:col-span-3 pt-4 xl:pt-8 xl:border-l xl:border-[#EAE4D9] xl:pl-6">
                                <EditorsPicks
                                  articles={filteredArticles}
                                  onSelectArticle={(article) => navigate(`/article/${article.slug}`)}
                                  onBookmarkToggle={handleBookmarkToggle}
                                  isBookmarked={isBookmarked}
                                  onSeeAllClick={() => setSelectedCategory('All')}
                                />
                              </div>
                            </div>
                          )}

                          {/* Horizontal Category Pill Filter Bar */}
                          <div className="mt-8">
                            <CategoryPills
                              categories={ALL_CATEGORIES}
                              selectedCategory={selectedCategory}
                              onSelectCategory={setSelectedCategory}
                            />
                          </div>

                          {/* Latest Articles Grid & Newsletter Callout */}
                          <div id="latest-articles-section">
                            {isLoading ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
                                {[1, 2, 3, 4].map(i => <ArticleCardSkeleton key={i} />)}
                              </div>
                            ) : (
                              <ArticleGrid
                                articles={filteredArticles}
                                onSelectArticle={(article) => navigate(`/article/${article.slug}`)}
                                onBookmarkToggle={handleBookmarkToggle}
                                isBookmarked={isBookmarked}
                                onResetFilters={() => setSelectedCategory('All')}
                                activeFilterName={selectedCategory}
                              />
                            )}
                          </div>
                        </>
                      )}

                      {/* Editorial Footer */}
                      <footer className="mt-20 pt-8 pb-12 border-t border-[#EAE4D9] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-editorial text-base font-bold text-[#141416]">Verdict<span className="text-[#9E5A38]">.</span></span>
                          <span>&bull;</span>
                          <span>Curated for curious minds worldwide</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>Architecture: Multi-API &amp; PostgreSQL Orchestrated</span>
                          <span>&bull;</span>
                          <span>Typography: Cormorant Garamond &amp; Manrope</span>
                          <span>&bull;</span>
                          <span>&copy; {new Date().getFullYear()} Verdict Media</span>
                        </div>
                      </footer>
                    </main>
                  }
                />
              </Routes>
            </div>

            {/* Slide-Over Reading List / Bookmarks Drawer */}
            <BookmarksDrawer
              isOpen={isBookmarksOpen}
              onClose={() => setIsBookmarksOpen(false)}
              bookmarkedArticles={bookmarkedArticles}
              onSelectArticle={(article) => {
                navigate(`/article/${article.slug}`);
                setIsBookmarksOpen(false);
              }}
              onRemoveBookmark={handleBookmarkToggle}
              onClearAll={() => setBookmarkedIds([])}
            />

            {/* Authentication Modal */}
            <AuthModal
              isOpen={isAuthOpen}
              onClose={() => setIsAuthOpen(false)}
            />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
