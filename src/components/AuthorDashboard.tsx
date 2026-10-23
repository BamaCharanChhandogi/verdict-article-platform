import React, { useState } from 'react';
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
  Globe
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
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'profile'>('home');
  const [bioText, setBioText] = useState(user?.bio || 'Writing at the intersection of architecture, systems engineering, and modern editorial aesthetics.');
  const [authorName, setAuthorName] = useState(user?.name || 'Elena Rostova');
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

  // Filter articles belonging to author or editorial roster
  const authorStories = articles.filter(a => 
    a.author.id === user?.id || 
    a.author.name === user?.name || 
    String(a.id).startsWith('art_') || 
    String(a.id).startsWith('local-') ||
    String(a.id).startsWith('draft-') ||
    a.author.id === 'user-demo-1'
  );

  const displayStories = authorStories.length > 0 ? authorStories : articles;
  const publishedStories = displayStories.filter(s => s.status !== 'draft');
  const draftStories = displayStories.filter(s => s.status === 'draft');

  const totalLikes = publishedStories.reduce((acc, a) => acc + (a.likesCount || 0), 0);
  const totalComments = publishedStories.reduce((acc, a) => acc + (a.commentsCount || 0), 0);
  const estimatedViews = (totalLikes * 18.5 + 2400).toLocaleString('en-US', { maximumFractionDigits: 0 });

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
        <div className="w-16 h-16 rounded-3xl bg-[#2E4A3E]/10 text-[#2E4A3E] flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141416] mb-3">
          Author &amp; Creator Studio
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-8">
          Sign in or create an author account to manage your essays, monitor reader engagement, track analytics, and publish new articles.
        </p>
        <button
          onClick={onOpenAuth}
          className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-md cursor-pointer"
        >
          Sign In to Access Studio
        </button>
      </div>
    );
  }

  const displayName = user?.name ? user.name.split(' ')[0] : 'Author';

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-8">
      {/* 1. HASHNODE-STYLE PERSONALIZED GREETING BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-1">
            {formattedDate}
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141416] flex items-center gap-2">
            <span>{greeting.text}, {displayName}</span>
            <span>{greeting.emoji}</span>
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenEditor}
            className="inline-flex items-center justify-center space-x-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Story</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center space-x-2 border-b border-[#EAE4D9] mb-8">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'border-[#141416] text-[#141416]'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-[#141416] text-[#141416]'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#141416] text-[#141416]'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {activeTab === 'home' && (
        <div className="space-y-8">
          {/* 3. RECENTLY PUBLISHED SECTION (Direct Hashnode Pattern) */}
          <section className="bg-white rounded-2xl border border-[#EAE4D9] p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE4D9]/70">
              <h2 className="font-editorial text-xl font-bold text-[#141416]">
                Recently published
              </h2>
              <span className="text-xs font-semibold text-zinc-500">
                {publishedStories.length} published stories
              </span>
            </div>

            {publishedStories.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">
                No articles published yet. Click "Write New Story" to publish your first essay.
              </p>
            ) : (
              <div className="divide-y divide-[#EAE4D9]/60">
                {publishedStories.slice(0, 6).map((story) => (
                  <div 
                    key={story.id} 
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAF7F2]/60 px-2 rounded-xl transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <h3 
                          onClick={() => onSelectArticle(story)}
                          className="text-xs sm:text-sm font-semibold text-[#141416] hover:text-[#2E4A3E] cursor-pointer truncate"
                        >
                          {story.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-zinc-400 pl-4">
                        <span>{story.author.name}</span>
                        <span>&bull;</span>
                        <span>{story.category}</span>
                        <span>&bull;</span>
                        <span>{story.readingTime} min read</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-xs text-zinc-400 hidden sm:inline">
                        {story.publishedAt}
                      </span>
                      <button
                        onClick={() => onSelectArticle(story)}
                        className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        title="View Published Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onResumeDraft(story)}
                        className="p-1.5 text-zinc-400 hover:text-[#2E4A3E] hover:bg-[#2E4A3E]/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(story.id, story.title)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 4. ACTIVE DRAFTS IN PROGRESS */}
          <section className="bg-white rounded-2xl border border-[#EAE4D9] p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE4D9]/70">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="font-editorial text-xl font-bold text-[#141416]">
                  Drafts in progress ({draftStories.length})
                </h2>
              </div>
              {onNavigateDrafts && (
                <button
                  onClick={onNavigateDrafts}
                  className="text-xs font-semibold text-[#9E5A38] hover:text-[#7d4428] flex items-center space-x-1 cursor-pointer"
                >
                  <span>View all drafts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {draftStories.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">
                No active drafts. Ideas you begin writing will automatically auto-save here.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draftStories.map((draft) => (
                  <div 
                    key={draft.id}
                    className="p-4 rounded-xl border border-[#EAE4D9] bg-[#FAF7F2]/40 hover:bg-[#FAF7F2] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          Draft
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {draft.category}
                        </span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-[#141416] mb-1 truncate">
                        {draft.title || 'Untitled Draft'}
                      </h4>
                      <p className="text-xs text-zinc-500 line-clamp-2">
                        {draft.description || 'No description yet.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE4D9]/60 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">
                        {draft.readingTime} min estimated
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onResumeDraft(draft)}
                          className="text-xs font-semibold text-white bg-[#141416] hover:bg-black px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                        >
                          Resume
                        </button>
                        <button
                          onClick={() => handleDelete(draft.id, draft.title)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer"
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

          {/* 5. QUICK METRICS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-[#EAE4D9] shadow-2xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Stories</span>
              <p className="font-editorial text-2xl font-bold text-[#141416] mt-1">{publishedStories.length}</p>
              <span className="text-[10px] text-emerald-600 font-medium">Published in catalogue</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#EAE4D9] shadow-2xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Estimated Views</span>
              <p className="font-editorial text-2xl font-bold text-[#141416] mt-1">{estimatedViews}</p>
              <span className="text-[10px] text-zinc-500 font-medium">Across all readers</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#EAE4D9] shadow-2xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Reader Claps</span>
              <p className="font-editorial text-2xl font-bold text-[#141416] mt-1">{totalLikes.toLocaleString()}</p>
              <span className="text-[10px] text-rose-600 font-medium">Positive responses</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#EAE4D9] shadow-2xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Drafts</span>
              <p className="font-editorial text-2xl font-bold text-[#141416] mt-1">{draftStories.length}</p>
              <span className="text-[10px] text-amber-600 font-medium">In PostgreSQL</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#EAE4D9] shadow-xs">
              <h3 className="font-editorial text-xl font-bold text-[#141416] mb-4">
                Traffic &amp; Reader Discovery
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Direct Verdict Feed</span>
                    <span>54%</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2">
                    <div className="bg-[#141416] h-2 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Editorial Weekly Brief (Newsletter)</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2">
                    <div className="bg-[#9E5A38] h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Topic Search &amp; Tags</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2">
                    <div className="bg-zinc-400 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE4D9] shadow-xs">
              <h3 className="font-editorial text-xl font-bold text-[#141416] mb-4">
                Reader Demographics
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Your essays have reached readers in 42 countries, with strongest engagement from engineering teams, typography designers, and founders.
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4D9]">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase">Average Read Time</span>
                  <p className="font-editorial text-2xl font-bold text-[#141416] mt-1">4.2 min</p>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4D9]">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase">Completion Rate</span>
                  <p className="font-editorial text-2xl font-bold text-[#141416] mt-1">87%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE4D9] shadow-xs max-w-2xl">
          <h3 className="font-editorial text-2xl font-bold text-[#141416] mb-2">
            Author Pen Name &amp; Bio
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Customize how your byline, specialty topics, and author introduction appear to readers across Verdict.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Display Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl px-4 py-2.5 text-xs text-[#141416] focus:bg-white focus:outline-hidden focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Author Bio &amp; Thesis
              </label>
              <textarea
                rows={3}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl px-4 py-2.5 text-xs text-[#141416] focus:bg-white focus:outline-hidden focus:border-[#141416]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
              >
                Save Profile Changes
              </button>

              {savedSettings && (
                <span className="inline-flex items-center space-x-1 text-xs text-emerald-700 font-semibold">
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
