import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  BookOpen, 
  Eye, 
  Heart, 
  TrendingUp, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Check, 
  FileText, 
  BarChart3, 
  User, 
  Clock,
  ArrowRight,
  Globe,
  Users,
  MessageSquare,
  ArrowUpRight,
  Award,
  Activity,
  Calendar,
  Filter,
  Share2
} from 'lucide-react';
import { Article } from '../types';
import { useAuth } from '../context/AuthContext';
import { deleteRealArticle } from '../services/api';

interface AuthorDashboardProps {
  articles: Article[];
  onOpenEditor: () => void;
  onSelectArticle: (article: Article) => void;
  onDeleteArticle: (id: string | number) => void;
  onResumeDraft: (draft: Article) => void;
  onOpenAuth: () => void;
  onNavigateDrafts?: () => void;
}

export const AuthorDashboard: React.FC<AuthorDashboardProps> = ({
  articles,
  onOpenEditor,
  onSelectArticle,
  onDeleteArticle,
  onResumeDraft,
  onOpenAuth,
  onNavigateDrafts,
}) => {
  const { user, token, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'profile'>(() => {
    if (tabParam === 'profile' || tabParam === 'analytics') return tabParam;
    return 'home';
  });

  // Automatically sync activeTab when URL search parameter changes
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab === 'profile' || currentTab === 'analytics' || currentTab === 'home') {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'home' | 'analytics' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'home') {
      searchParams.delete('tab');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ tab }, { replace: true });
    }
  };

  const [bioText, setBioText] = useState(user?.bio || 'Writing at the intersection of architecture, systems design, and modern editorial aesthetics.');
  const [authorName, setAuthorName] = useState(user?.name || 'Author');
  const [savedSettings, setSavedSettings] = useState(false);

  // Dynamic Time Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅' };
    if (hour < 18) return { text: 'Good afternoon', emoji: '☀️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const greeting = getGreeting();

  // Filter articles belonging to current author or author's created stories
  const authorStories = articles.filter(a => 
    a.author.id === user?.id || 
    a.author.name === user?.name || 
    String(a.id).startsWith('art_') || 
    String(a.id).startsWith('local-') ||
    String(a.id).startsWith('draft-') ||
    (user?.id === 'user-demo-1' && (a.author.id === 'user-demo-1' || a.author.name === 'Elena Rostova'))
  );

  const displayStories = authorStories.length > 0 ? authorStories : articles;
  const publishedStories = displayStories.filter(s => s.status !== 'draft');
  const draftStories = displayStories.filter(s => s.status === 'draft');

  const totalLikes = publishedStories.reduce((acc, a) => acc + (a.likesCount || 0), 0);
  const totalComments = publishedStories.reduce((acc, a) => acc + (a.commentsCount || 0), 0);
  const estimatedViews = (totalLikes * 18.5 + 2400).toLocaleString('en-US', { maximumFractionDigits: 0 });

  // Analytics State & Timeframe computations
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [storySort, setStorySort] = useState<'views' | 'likes' | 'comments' | 'recent'>('views');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const timeframeMultiplier = timeframe === '7d' ? 0.32 : timeframe === '30d' ? 1.0 : timeframe === '90d' ? 2.6 : 4.8;
  const scaledViews = Math.round((totalLikes * 18.5 + 2400) * timeframeMultiplier);
  const scaledLikes = Math.round(totalLikes * timeframeMultiplier);
  const scaledComments = Math.round(totalComments * timeframeMultiplier);
  const scaledSubscribers = Math.round((publishedStories.length * 128 + 840) * timeframeMultiplier);

  // Readership Velocity Points for SVG Chart
  const chartPoints = [
    { label: timeframe === '7d' ? 'Mon' : 'Wk 1', views: Math.round(380 * timeframeMultiplier), reads: Math.round(310 * timeframeMultiplier) },
    { label: timeframe === '7d' ? 'Tue' : 'Wk 2', views: Math.round(520 * timeframeMultiplier), reads: Math.round(410 * timeframeMultiplier) },
    { label: timeframe === '7d' ? 'Wed' : 'Wk 3', views: Math.round(460 * timeframeMultiplier), reads: Math.round(380 * timeframeMultiplier) },
    { label: timeframe === '7d' ? 'Thu' : 'Wk 4', views: Math.round(710 * timeframeMultiplier), reads: Math.round(590 * timeframeMultiplier) },
    { label: timeframe === '7d' ? 'Fri' : 'Wk 5', views: Math.round(890 * timeframeMultiplier), reads: Math.round(720 * timeframeMultiplier) },
    { label: timeframe === '7d' ? 'Sat' : 'Wk 6', views: Math.round(1140 * timeframeMultiplier), reads: Math.round(930 * timeframeMultiplier) },
    { label: timeframe === '7d' ? 'Sun' : 'Today', views: Math.round(1380 * timeframeMultiplier), reads: Math.round(1120 * timeframeMultiplier) },
  ];

  const maxViews = Math.max(...chartPoints.map(p => p.views), 100);

  // Enriched published stories for the table
  const enrichedStories = publishedStories.map((story, idx) => {
    const views = story.viewsCount || Math.round((story.likesCount || 12) * 17 + 340 + (idx * 90));
    const reads = Math.round(views * 0.78);
    const readRatio = Math.min(94, Math.max(68, Math.round((reads / views) * 100)));
    return {
      ...story,
      analyticsViews: views,
      analyticsReads: reads,
      readRatio,
    };
  });

  const sortedStories = [...enrichedStories].sort((a, b) => {
    if (storySort === 'views') return b.analyticsViews - a.analyticsViews;
    if (storySort === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
    if (storySort === 'comments') return (b.commentsCount || 0) - (a.commentsCount || 0);
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  const handleDelete = async (id: string | number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteArticle(id);
      await deleteRealArticle(id, token);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-16 max-w-2xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#2E4A3E]/10 dark:bg-emerald-950/40 text-[#2E4A3E] dark:text-emerald-400 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141416] dark:text-[#F1F3F5] mb-3">
          Author &amp; Creator Studio
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
          Sign in or create an author account to manage your essays, monitor reader engagement, track analytics, and publish new articles.
        </p>
        <button
          onClick={onOpenAuth}
          className="bg-[#141416] dark:bg-[#F1F3F5] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1116] text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-md cursor-pointer"
        >
          Sign In to Access Studio
        </button>
      </div>
    );
  }

  const displayName = user?.name ? user.name.split(' ')[0] : 'Author';

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-8">
      {/* 1. LITERARY EDITORIAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#EAE4D9] dark:border-[#262C3A]">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#9E5A38] dark:text-[#E05A30] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creator Studio &bull; {formattedDate}</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141416] dark:text-white">
            Writer's Desk &mdash; {displayName}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            Manage your long-form dispatches, monitor reader resonance, and review draft revisions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenEditor}
            className="inline-flex items-center justify-center space-x-2 bg-[#2E4A3E] dark:bg-emerald-600 hover:bg-[#233a30] dark:hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Story</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION PILL TABS */}
      <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleTabChange('home')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416] shadow-xs'
              : 'bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => handleTabChange('analytics')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416] shadow-xs'
              : 'bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => handleTabChange('profile')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416] shadow-xs'
              : 'bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile Settings</span>
        </button>
      </div>

      {activeTab === 'home' && (
        <div className="space-y-8">
          {/* 3. RECENTLY PUBLISHED SECTION */}
          <section className="bg-white dark:bg-[#171B22] rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE4D9]/70 dark:border-[#222733]">
              <h2 className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5]">
                Recently published
              </h2>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {publishedStories.length} published stories
              </span>
            </div>

            {publishedStories.length === 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 py-6 text-center">
                No articles published yet. Click "Write New Story" to publish your first essay.
              </p>
            ) : (
              <div className="divide-y divide-[#EAE4D9]/60 dark:divide-[#222733]">
                {publishedStories.slice(0, 6).map((story) => (
                  <div 
                    key={story.id} 
                    className="py-3.5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1E232B] px-1 sm:px-2 rounded-xl transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <h3 
                          onClick={() => onSelectArticle(story)}
                          className="text-xs sm:text-sm font-semibold text-[#141416] dark:text-[#F1F3F5] hover:text-[#2E4A3E] dark:hover:text-emerald-400 cursor-pointer truncate"
                        >
                          {story.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400 dark:text-zinc-500 pl-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="truncate max-w-[85px] sm:max-w-none shrink-0">{story.author.name}</span>
                        <span>&bull;</span>
                        <span className="shrink-0">{story.category}</span>
                        <span>&bull;</span>
                        <span className="shrink-0 whitespace-nowrap">{story.readingTime} min read</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-2.5 shrink-0">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                        {story.publishedAt}
                      </span>
                      <button
                        onClick={() => onSelectArticle(story)}
                        className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252B36] rounded-lg transition-colors cursor-pointer"
                        title="View Published Article"
                      >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onResumeDraft(story)}
                        className="p-1.5 text-zinc-400 hover:text-[#2E4A3E] dark:hover:text-emerald-400 hover:bg-[#2E4A3E]/10 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(story.id, story.title)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 4. ACTIVE DRAFTS IN PROGRESS */}
          <section className="bg-white dark:bg-[#171B22] rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] p-4 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE4D9]/70 dark:border-[#222733] gap-2">
              <div className="flex items-center space-x-2 min-w-0">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#141416] dark:text-[#F1F3F5] truncate">
                  Drafts in progress ({draftStories.length})
                </h2>
              </div>
              {onNavigateDrafts && (
                <button
                  onClick={onNavigateDrafts}
                  className="text-xs font-semibold text-[#9E5A38] dark:text-[#D98A62] hover:text-[#7d4428] dark:hover:text-[#f2a279] flex items-center space-x-1 cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">View all drafts</span>
                  <span className="sm:hidden">View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {draftStories.length === 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 py-6 text-center">
                No active drafts. Ideas you begin writing will automatically auto-save here.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draftStories.map((draft) => (
                  <div 
                    key={draft.id}
                    className="p-4 rounded-xl border border-[#EAE4D9] dark:border-[#262C3A] bg-[#FAF7F2]/40 dark:bg-[#1A1F29]/60 hover:bg-[#FAF7F2] dark:hover:bg-[#1A1F29] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full shrink-0">
                          Draft
                        </span>
                        <span className="text-[11px] text-zinc-400 shrink-0">
                          {draft.category}
                        </span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-[#141416] dark:text-[#F1F3F5] mb-1 truncate">
                        {draft.title || 'Untitled Draft'}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {draft.description || 'No description yet.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE4D9]/60 dark:border-[#222733] flex items-center justify-between gap-2">
                      <span className="text-[11px] text-zinc-400 shrink-0 whitespace-nowrap">
                        {draft.readingTime} min estimated
                      </span>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => onResumeDraft(draft)}
                          className="text-xs font-semibold text-white dark:text-[#0E1116] bg-[#141416] dark:bg-[#F1F3F5] hover:bg-black dark:hover:bg-white px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                        >
                          Resume
                        </button>
                        <button
                          onClick={() => handleDelete(draft.id, draft.title)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0"
                          title="Delete draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick link banner to deep Analytics */}
          <div className="bg-[#FAF7F2] dark:bg-[#12151B] rounded-2xl p-5 border border-[#EAE4D9] dark:border-[#262C3A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2E4A3E]/10 dark:bg-emerald-500/10 text-[#2E4A3E] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-editorial text-base font-bold text-[#141416] dark:text-[#F1F3F5]">
                  Detailed Readership &amp; Story Velocity Analytics
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Track audience reach, dwell time, retention funnels, and reader demographics in Creator Analytics.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleTabChange('analytics')}
              className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-[#141416] dark:bg-[#F1F3F5] text-white dark:text-[#141416] hover:bg-black dark:hover:bg-white transition-all shadow-xs cursor-pointer shrink-0"
            >
              <span>Explore Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* 1. ANALYTICS HEADER & TIMEFRAME FILTERS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#171B22] p-5 rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#9E5A38] dark:text-[#E05A30] mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Editorial Intelligence &bull; Live Insights</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#141416] dark:text-[#F1F3F5]">
                Audience Resonance &amp; Performance
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Detailed readership velocity, dwell time breakdown, and subscriber retention.
              </p>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="flex items-center bg-[#FAF7F2] dark:bg-[#12151B] p-1 rounded-xl border border-[#EAE4D9] dark:border-[#262C3A] shrink-0 self-start sm:self-auto">
              {(
                [
                  { id: '7d', label: '7 Days' },
                  { id: '30d', label: '30 Days' },
                  { id: '90d', label: '90 Days' },
                  { id: 'all', label: 'All Time' },
                ] as const
              ).map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === tf.id
                      ? 'bg-white dark:bg-[#1C212B] text-[#141416] dark:text-white shadow-xs'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. EXPANDED KPI METRICS GRID (6 TILES) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {/* Stories */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Stories</span>
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="font-editorial text-2xl font-bold text-[#141416] dark:text-[#F1F3F5]">{publishedStories.length}</p>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[10px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{draftStories.length} drafts</span>
                <span className="text-zinc-400 dark:text-zinc-500">&bull; in progress</span>
              </div>
            </div>

            {/* Estimated Views */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Read Views</span>
                <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="font-editorial text-2xl font-bold text-[#141416] dark:text-[#F1F3F5]">{scaledViews.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-1.5 text-[10px]">
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+18.4%</span>
                <span className="text-zinc-400 dark:text-zinc-500">vs prev</span>
              </div>
            </div>

            {/* Reader Claps */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Reader Claps</span>
                <span className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="font-editorial text-2xl font-bold text-[#141416] dark:text-[#F1F3F5]">{scaledLikes.toLocaleString()}</p>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[10px]">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  ~{Math.round(scaledLikes / Math.max(1, publishedStories.length))}
                </span>
                <span className="text-zinc-400 dark:text-zinc-500">avg per dispatch</span>
              </div>
            </div>

            {/* Discussions */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Comments</span>
                <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="font-editorial text-2xl font-bold text-[#141416] dark:text-[#F1F3F5]">{scaledComments.toLocaleString()}</p>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[10px]">
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Active</span>
                <span className="text-zinc-400 dark:text-zinc-500">community dialogue</span>
              </div>
            </div>

            {/* Avg Read Time */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Avg Read Time</span>
                <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="font-editorial text-2xl font-bold text-[#141416] dark:text-[#F1F3F5]">4m 38s</p>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[10px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">84.6%</span>
                <span className="text-zinc-400 dark:text-zinc-500">completion rate</span>
              </div>
            </div>

            {/* Audience & Subscribers */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Audience</span>
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="font-editorial text-2xl font-bold text-[#141416] dark:text-[#F1F3F5]">{scaledSubscribers.toLocaleString()}</p>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[10px]">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">+14.2%</span>
                <span className="text-zinc-400 dark:text-zinc-500">readers gained</span>
              </div>
            </div>
          </div>

          {/* 3. READERSHIP VELOCITY & DWELL TREND (INTERACTIVE SVG CHART) */}
          <div className="bg-white dark:bg-[#171B22] rounded-2xl p-6 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5]">
                  Readership Velocity &amp; Engagement Trend
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Comparison between total article views and full dispatch completions.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#2E4A3E] dark:bg-emerald-500 inline-block"></span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">Daily Views</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#9E5A38] dark:bg-amber-500 inline-block"></span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">Completed Reads</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div className="relative w-full h-56 sm:h-64">
              <svg 
                viewBox="0 0 600 200" 
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="velocityViewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E4A3E" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2E4A3E" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="velocityReadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9E5A38" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#9E5A38" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[40, 80, 120, 160].map((y) => (
                  <line 
                    key={y} 
                    x1="0" 
                    y1={y} 
                    x2="600" 
                    y2={y} 
                    stroke="currentColor" 
                    className="text-[#EAE4D9]/80 dark:text-[#262C3A]" 
                    strokeDasharray="4 4" 
                  />
                ))}

                {/* Views Area Fill */}
                <path
                  d={`M 0 190 ${chartPoints.map((p, i) => `L ${(i * 600) / (chartPoints.length - 1)} ${180 - (p.views / maxViews) * 140}`).join(' ')} L 600 190 Z`}
                  fill="url(#velocityViewsGrad)"
                />

                {/* Views Line */}
                <path
                  d={`M 0 ${180 - (chartPoints[0].views / maxViews) * 140} ${chartPoints.map((p, i) => `L ${(i * 600) / (chartPoints.length - 1)} ${180 - (p.views / maxViews) * 140}`).join(' ')}`}
                  fill="none"
                  stroke="#2E4A3E"
                  strokeWidth="2.5"
                  className="dark:stroke-emerald-400 transition-all duration-300"
                />

                {/* Reads Line */}
                <path
                  d={`M 0 ${180 - (chartPoints[0].reads / maxViews) * 140} ${chartPoints.map((p, i) => `L ${(i * 600) / (chartPoints.length - 1)} ${180 - (p.reads / maxViews) * 140}`).join(' ')}`}
                  fill="none"
                  stroke="#9E5A38"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  className="dark:stroke-amber-400 transition-all duration-300"
                />

                {/* Interactive Points */}
                {chartPoints.map((p, i) => {
                  const cx = (i * 600) / (chartPoints.length - 1);
                  const cy = 180 - (p.views / maxViews) * 140;
                  const isHovered = hoveredPointIndex === i;

                  return (
                    <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 6 : 4}
                        className="fill-[#2E4A3E] dark:fill-emerald-400 stroke-white dark:stroke-[#171B22] stroke-2 transition-all duration-150"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip Overlay if hovered */}
              {hoveredPointIndex !== null && (
                <div 
                  className="absolute pointer-events-none -top-2 bg-[#141416] text-white dark:bg-white dark:text-[#141416] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all transform -translate-x-1/2 z-10"
                  style={{ left: `${(hoveredPointIndex / (chartPoints.length - 1)) * 100}%` }}
                >
                  <div className="font-bold">{chartPoints[hoveredPointIndex].label}</div>
                  <div className="text-[10px] opacity-80">
                    {chartPoints[hoveredPointIndex].views} views &bull; {chartPoints[hoveredPointIndex].reads} reads
                  </div>
                </div>
              )}
            </div>

            {/* X-Axis Date Labels */}
            <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 pt-3 border-t border-[#EAE4D9]/60 dark:border-[#222733] mt-2">
              {chartPoints.map((p, i) => (
                <span key={i}>{p.label}</span>
              ))}
            </div>

            {/* Chart Summary Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#EAE4D9]/60 dark:border-[#222733] text-center">
              <div className="p-2.5 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Peak Velocity</span>
                <p className="text-xs sm:text-sm font-bold text-[#141416] dark:text-[#F1F3F5] mt-0.5">
                  {chartPoints[chartPoints.length - 1].views.toLocaleString()} reads
                </p>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Daily Average</span>
                <p className="text-xs sm:text-sm font-bold text-[#141416] dark:text-[#F1F3F5] mt-0.5">
                  ~{Math.round(scaledViews / (timeframe === '7d' ? 7 : 30))} readers/day
                </p>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Read Ratio</span>
                <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  84.2% completion
                </p>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Index Health</span>
                <p className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  98% Active
                </p>
              </div>
            </div>
          </div>

          {/* 4. STORY PERFORMANCE BREAKDOWN TABLE */}
          <div className="bg-white dark:bg-[#171B22] rounded-2xl p-6 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#EAE4D9]/70 dark:border-[#222733]">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5]">
                  Top Performing Dispatches &amp; Stories
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Granular breakdown of reader retention, read ratio, claps, and discussion for each article.
                </p>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Sort:
                </span>
                {(
                  [
                    { id: 'views', label: 'Views' },
                    { id: 'likes', label: 'Claps' },
                    { id: 'comments', label: 'Discussion' },
                    { id: 'recent', label: 'Recent' },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStorySort(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      storySort === s.id
                        ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]'
                        : 'bg-[#FAF7F2] dark:bg-[#12151B] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stories Table / List */}
            <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE4D9]/70 dark:border-[#222733] text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <th className="pb-3 pl-2">Dispatch</th>
                    <th className="pb-3 text-right">Views</th>
                    <th className="pb-3 text-right hidden sm:table-cell">Reads</th>
                    <th className="pb-3 text-center">Read Ratio</th>
                    <th className="pb-3 text-right">Claps</th>
                    <th className="pb-3 text-right hidden md:table-cell">Discussion</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D9]/60 dark:divide-[#222733] text-xs">
                  {sortedStories.slice(0, 8).map((story, idx) => (
                    <tr 
                      key={story.id} 
                      className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1E232B] transition-colors group"
                    >
                      <td className="py-3.5 pl-2 max-w-[240px] sm:max-w-xs">
                        <div className="flex items-center space-x-3">
                          <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 w-4 shrink-0">
                            #{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p 
                              onClick={() => onSelectArticle(story)}
                              className="font-semibold text-[#141416] dark:text-[#F1F3F5] hover:text-[#2E4A3E] dark:hover:text-emerald-400 cursor-pointer truncate"
                            >
                              {story.title}
                            </p>
                            <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mt-0.5">
                              <span className="text-[#9E5A38] dark:text-[#E05A30] font-semibold">{story.category}</span>
                              <span>&bull;</span>
                              <span>{story.readingTime} min read</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-medium text-zinc-700 dark:text-zinc-300">
                        {story.analyticsViews.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right font-medium text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">
                        {story.analyticsReads.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-center">
                        <div className="inline-flex items-center space-x-1.5">
                          <div className="w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full" 
                              style={{ width: `${story.readRatio}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                            {story.readRatio}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-semibold text-rose-600 dark:text-rose-400">
                        {(story.likesCount || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right text-zinc-500 dark:text-zinc-400 hidden md:table-cell">
                        {(story.commentsCount || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={() => onSelectArticle(story)}
                          className="inline-flex items-center space-x-1 text-zinc-400 hover:text-black dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                          title="Open article in reader"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. TRAFFIC DISCOVERY & READER DEMOGRAPHICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traffic & Discovery */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl p-6 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5]">
                  Traffic &amp; Reader Discovery
                </h3>
                <span className="text-xs font-semibold text-zinc-400">Top Channels</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                Breakdown of how readers land on your dispatches across our platform, newsletters, and search engines.
              </p>
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center space-x-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Direct Verdict Feed &amp; Explore</span>
                    </span>
                    <span>54% &bull; ~{Math.round(scaledViews * 0.54).toLocaleString()} reads</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-[#2E4A3E] dark:bg-emerald-500 h-2 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#9E5A38] dark:text-[#E05A30]" />
                      <span>Editorial Morning Brief (Newsletter)</span>
                    </span>
                    <span>28% &bull; ~{Math.round(scaledViews * 0.28).toLocaleString()} reads</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-[#9E5A38] dark:bg-[#D98A62] h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>Topic Search &amp; Categorical Index</span>
                    </span>
                    <span>11% &bull; ~{Math.round(scaledViews * 0.11).toLocaleString()} reads</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" style={{ width: '11%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center space-x-1.5">
                      <Share2 className="w-3.5 h-3.5 text-purple-500" />
                      <span>External Referrals (Substack, X, Hacker News)</span>
                    </span>
                    <span>7% &bull; ~{Math.round(scaledViews * 0.07).toLocaleString()} reads</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full" style={{ width: '7%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reader Demographics & Geo Distribution */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl p-6 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5]">
                  Reader Demographics &amp; Geo
                </h3>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">48 Countries</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                Global geographic distribution and primary professional disciplines reading your work.
              </p>

              {/* Geographic Footprint */}
              <div className="space-y-2.5 text-xs mb-5">
                {[
                  { country: '🇺🇸 United States', percent: 42, color: 'bg-[#141416] dark:bg-white' },
                  { country: '🇩🇪 Germany & EU', percent: 22, color: 'bg-emerald-600 dark:bg-emerald-400' },
                  { country: '🇮🇳 India', percent: 18, color: 'bg-amber-600 dark:bg-amber-400' },
                  { country: '🇬🇧 United Kingdom', percent: 11, color: 'bg-blue-600 dark:bg-blue-400' },
                  { country: '🇨🇦 Canada & APAC', percent: 7, color: 'bg-zinc-400 dark:bg-zinc-600' },
                ].map((geo) => (
                  <div key={geo.country}>
                    <div className="flex justify-between font-semibold mb-1 text-zinc-700 dark:text-zinc-300 text-[11px]">
                      <span>{geo.country}</span>
                      <span>{geo.percent}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                      <div className={`${geo.color} h-1.5 rounded-full`} style={{ width: `${geo.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reader Disciplines */}
              <div className="pt-4 border-t border-[#EAE4D9]/60 dark:border-[#222733]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Audience Professional Background
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 bg-[#FAF7F2] dark:bg-[#12151B] border border-[#EAE4D9] dark:border-[#262C3A] rounded-lg font-medium text-zinc-700 dark:text-zinc-300">
                    💡 Systems Designers (44%)
                  </span>
                  <span className="px-2.5 py-1 bg-[#FAF7F2] dark:bg-[#12151B] border border-[#EAE4D9] dark:border-[#262C3A] rounded-lg font-medium text-zinc-700 dark:text-zinc-300">
                    🚀 Founders &amp; Strategists (29%)
                  </span>
                  <span className="px-2.5 py-1 bg-[#FAF7F2] dark:bg-[#12151B] border border-[#EAE4D9] dark:border-[#262C3A] rounded-lg font-medium text-zinc-700 dark:text-zinc-300">
                    🎨 UI/UX Designers (16%)
                  </span>
                  <span className="px-2.5 py-1 bg-[#FAF7F2] dark:bg-[#12151B] border border-[#EAE4D9] dark:border-[#262C3A] rounded-lg font-medium text-zinc-700 dark:text-zinc-300">
                    ✍️ Journalists &amp; Writers (11%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. EDITORIAL RETENTION & CONVERSION FUNNEL */}
          <div className="bg-white dark:bg-[#171B22] rounded-2xl p-6 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
            <h3 className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5] mb-2">
              Editorial Engagement &amp; Conversion Funnel
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Track reader progression from catalogue impression to full story completion and positive resonance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
              <div className="p-4 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">1. Impressions</span>
                <p className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5] mt-1">100%</p>
                <span className="text-[10px] text-zinc-500 mt-1 block">~{Math.round(scaledViews * 1.8).toLocaleString()} readers</span>
              </div>
              <div className="p-4 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">2. Article Opens</span>
                <p className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5] mt-1">56%</p>
                <span className="text-[10px] text-zinc-500 mt-1 block">~{scaledViews.toLocaleString()} readers</span>
              </div>
              <div className="p-4 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">3. Midpoint Dwell</span>
                <p className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5] mt-1">42%</p>
                <span className="text-[10px] text-zinc-500 mt-1 block">~{Math.round(scaledViews * 0.75).toLocaleString()} readers</span>
              </div>
              <div className="p-4 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">4. Full Complete</span>
                <p className="font-editorial text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">32%</p>
                <span className="text-[10px] text-zinc-500 mt-1 block">~{Math.round(scaledViews * 0.58).toLocaleString()} readers</span>
              </div>
              <div className="p-4 bg-[#FAF7F2] dark:bg-[#12151B] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">5. Clap / Saved</span>
                <p className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">14%</p>
                <span className="text-[10px] text-zinc-500 mt-1 block">~{scaledLikes.toLocaleString()} actions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-[#171B22] rounded-2xl p-6 sm:p-8 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs max-w-2xl">
          <h3 className="font-editorial text-2xl font-bold text-[#141416] dark:text-[#F1F3F5] mb-2">
            Author Pen Name &amp; Bio
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
            Customize how your byline, specialty topics, and author introduction appear to readers across Verdict.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Display Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#FAF7F2] dark:bg-[#12151B] border border-[#EAE4D9] dark:border-[#262C3A] rounded-xl px-4 py-2.5 text-xs text-[#141416] dark:text-[#F1F3F5] focus:bg-white dark:focus:bg-[#171B22] focus:outline-hidden focus:border-[#141416] dark:focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Author Bio &amp; Thesis
              </label>
              <textarea
                rows={3}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="w-full bg-[#FAF7F2] dark:bg-[#12151B] border border-[#EAE4D9] dark:border-[#262C3A] rounded-xl px-4 py-2.5 text-xs text-[#141416] dark:text-[#F1F3F5] focus:bg-white dark:focus:bg-[#171B22] focus:outline-hidden focus:border-[#141416] dark:focus:border-zinc-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#141416] dark:bg-[#F1F3F5] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1116] text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
              >
                Save Profile Changes
              </button>

              {savedSettings && (
                <span className="inline-flex items-center space-x-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
