import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { EditorsPicks } from './components/EditorsPicks';
import { CategoryPills } from './components/CategoryPills';
import { ArticleGrid } from './components/ArticleGrid';
import { ArticleDetail } from './components/ArticleDetail';
import { ReadingListPage } from './components/ReadingListPage';
import { AuthModal } from './components/AuthModal';
import { DedicatedWriterStudio } from './components/DedicatedWriterStudio';
import { DraftsPage } from './components/DraftsPage';
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
  const { isAuthenticated, user } = useAuth();

  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Partial<Article> | null>(null);

  // Check if current route is an article reading canvas
  const isArticlePage = location.pathname.startsWith('/article/');

  // Sync activeNav with current pathname
  const activeNav: NavTab = useMemo(() => {
    const path = location.pathname;
    if (path === '/authors') return 'authors';
    if (path === '/drafts') return 'drafts';
    if (path === '/studio' || path === '/mystories') return 'mystories';
    if (path === '/feed' || path === '/explore') return 'feed';
    if (path === '/reading-list' || path === '/bookmarks') return 'bookmarks';
    if (path.startsWith('/write')) return 'write';
    return isAuthenticated ? 'feed' : 'home';
  }, [location.pathname, isAuthenticated]);

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

  // Real Multi-API & Editorial Articles Fetch on Mount + User Drafts Sync
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchArticles().then((data) => {
      if (isMounted) {
        try {
          const storedDrafts: Article[] = JSON.parse(localStorage.getItem('verdict_user_drafts') || '[]');
          if (storedDrafts.length > 0) {
            const serverIds = new Set(data.map(d => String(d.id)));
            const uniqueDrafts = storedDrafts.filter(d => !serverIds.has(String(d.id)));
            setArticles([...uniqueDrafts, ...data]);
          } else {
            setArticles(data);
          }
        } catch (e) {
          setArticles(data);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter drafts vs published stories for authenticated author
  const draftsList = useMemo(() => {
    if (!isAuthenticated || !user) return [];
    return articles.filter(a => 
      a.status === 'draft' && (
        a.author.id === user.id || 
        a.author.name === user.name ||
        (user.id === 'user-demo-1' && (a.author.id === 'user-demo-1' || a.author.name === 'Elena Rostova'))
      )
    );
  }, [articles, isAuthenticated, user]);

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

  // Delete article handler (real database sync & local drafts cleanup)
  const handleDeleteArticle = (id: string | number) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    try {
      const storedDrafts: Article[] = JSON.parse(localStorage.getItem('verdict_user_drafts') || '[]');
      const filtered = storedDrafts.filter(d => String(d.id) !== String(id));
      localStorage.setItem('verdict_user_drafts', JSON.stringify(filtered));
      const activeRaw = localStorage.getItem('verdict_active_draft');
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (String(active?.id) === String(id)) {
          localStorage.removeItem('verdict_active_draft');
        }
      }
    } catch (e) {}
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
      navigate('/drafts');
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
    <>
      <Routes>
        {/* 1. DEDICATED FULL-SCREEN WRITER STUDIO ROUTES (/write and /write/:draftId) */}
        <Route
          path="/write"
          element={
            <DedicatedWriterStudio
              onBack={() => {
                setEditingDraft(null);
                navigate(isAuthenticated ? '/studio' : '/');
              }}
              onArticlePublished={handleArticlePublished}
              initialDraft={editingDraft}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          }
        />
        <Route
          path="/write/:draftId"
          element={
            <DedicatedWriterStudio
              onBack={() => {
                setEditingDraft(null);
                navigate(isAuthenticated ? '/drafts' : '/');
              }}
              onArticlePublished={handleArticlePublished}
              initialDraft={editingDraft}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          }
        />

        {/* 2. LAYOUT-WRAPPED ROUTES (Sidebar + Header + Content Outlet) */}
        <Route
          element={
            <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-[#141416] dark:text-[#F1F3F5] flex transition-colors relative">
              {!isArticlePage && (
                <Sidebar
                  activeNav={activeNav}
                  setActiveNav={(nav) => {
                    if (nav === 'home') {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      navigate('/');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (nav === 'feed') {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      navigate('/feed');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (nav === 'authors') {
                      setSearchQuery('');
                      navigate('/authors');
                    } else if (nav === 'drafts') {
                      navigate('/drafts');
                    } else if (nav === 'mystories') {
                      navigate('/studio');
                    } else if (nav === 'bookmarks') {
                      navigate('/reading-list');
                    } else if (nav === 'write') {
                      if (!isAuthenticated) {
                        setIsAuthOpen(true);
                      } else {
                        setEditingDraft(null);
                        navigate('/write');
                      }
                    }
                  }}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  bookmarksCount={bookmarkedIds.length}
                  draftsCount={draftsList.length}
                  isOpenMobile={isMobileSidebarOpen}
                  setIsOpenMobile={setIsMobileSidebarOpen}
                  onOpenBookmarks={() => navigate('/reading-list')}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onOpenEditor={() => {
                    if (!isAuthenticated) {
                      setIsAuthOpen(true);
                    } else {
                      setEditingDraft(null);
                      navigate('/write');
                    }
                  }}
                />
              )}

              <div className={`flex-1 flex flex-col min-w-0 ${!isArticlePage ? 'lg:pl-24' : ''}`}>
                <Header
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onOpenEditor={() => {
                    if (!isAuthenticated) {
                      setIsAuthOpen(true);
                    } else {
                      setEditingDraft(null);
                      navigate('/write');
                    }
                  }}
                />

                <Outlet />
              </div>
            </div>
          }
        >
          {/* ARTICLE DETAIL READER ROUTE (/article/:slug) */}
          <Route
            path="/article/:slug"
            element={
              <main className="flex-1">
                <ArticleDetail
                  onBack={() => navigate(isAuthenticated ? '/feed' : '/')}
                  onBookmarkToggle={handleBookmarkToggle}
                  isBookmarked={isBookmarked}
                  allArticles={articles}
                  onOpenAuth={() => setIsAuthOpen(true)}
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

          {/* DEDICATED DRAFTS PAGE (/drafts) */}
          <Route
            path="/drafts"
            element={
              !isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <main className="flex-1">
                  <DraftsPage
                    drafts={draftsList}
                    onResumeDraft={(draft) => {
                      setEditingDraft(draft);
                      navigate(`/write/${draft.id}`);
                    }}
                    onOpenNewDraft={() => {
                      setEditingDraft(null);
                      navigate('/write');
                    }}
                    onDeleteDraft={handleDeleteArticle}
                    onBackToStudio={() => navigate('/studio')}
                  />
                </main>
              )
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
                    navigate(`/write/${draft.id}`);
                  }}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onNavigateDrafts={() => navigate('/drafts')}
                />
              </main>
            }
          />
          <Route path="/mystories" element={<Navigate to="/studio" replace />} />

          {/* DEDICATED READING LIST ROUTE (/reading-list) */}
          <Route
            path="/reading-list"
            element={
              <main className="flex-1">
                <ReadingListPage
                  bookmarkedArticles={bookmarkedArticles}
                  onRemoveBookmark={handleBookmarkToggle}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  allArticles={articles}
                  onAddBookmark={handleBookmarkToggle}
                />
              </main>
            }
          />
          <Route path="/bookmarks" element={<Navigate to="/reading-list" replace />} />

          {/* HASHNODE-STYLE FEED & DISCOVER ROUTE (/feed) */}
          <Route
            path="/feed"
            element={
              !isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE4D9] dark:border-[#262C3A] gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Popular Posts
                      </span>
                      <h1 className="font-editorial text-3xl font-bold text-[#141416] dark:text-white">
                        New &amp; Popular
                      </h1>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] px-3.5 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Last 24h: <strong>804 articles</strong> &bull; <strong>556 writers</strong></span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <CategoryPills
                      categories={ALL_CATEGORIES}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                    />
                  </div>

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
                </main>
              )
            }
          />

          {/* EDITORIAL HOME & EXPLORE FEED (/) */}
          <Route
            path="/"
            element={
              isAuthenticated && !searchQuery ? (
                <Navigate to="/feed" replace />
              ) : (
                <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
                {searchQuery ? (
                  <div className="pt-6">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="font-editorial text-2xl font-bold text-[#141416] dark:text-white">
                        Search Results for "{searchQuery}"
                      </h2>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
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
                    {isLoading ? (
                      <HeroSkeleton />
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        <div className="xl:col-span-9 space-y-6">
                          <HeroSection onExploreClick={() => {
                            const el = document.getElementById('latest-articles-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }} />

                          <FeaturedCarousel
                            articles={filteredArticles}
                            onSelectArticle={(article) => navigate(`/article/${article.slug}`)}
                          />
                        </div>

                        <div className="xl:col-span-3 pt-4 xl:pt-8 xl:border-l xl:border-[#EAE4D9] dark:xl:border-[#262C3A] xl:pl-6">
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

                    <div className="mt-8">
                      <CategoryPills
                        categories={ALL_CATEGORIES}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                      />
                    </div>

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

                <footer className="mt-20 pt-8 pb-12 border-t border-[#EAE4D9] dark:border-[#222733] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-editorial text-base font-bold text-[#141416] dark:text-[#F1F3F5]">Verdict<span className="text-[#9E5A38] dark:text-[#D98A62]">.</span></span>
                    <span>&bull;</span>
                    <span>Curated for curious minds worldwide</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>Independent Editorial &amp; Long-form Journalism</span>
                    <span>&bull;</span>
                    <span>Typography: Cormorant Garamond &amp; Manrope</span>
                    <span>&bull;</span>
                    <span>&copy; {new Date().getFullYear()} Verdict Media</span>
                  </div>
                </footer>
              </main>
              )
            }
          />
          <Route path="/explore" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}

export default App;
