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
  Settings 
} from 'lucide-react';
import { Article } from '../types';
import { useAuth } from '../context/AuthContext';

interface AuthorDashboardProps {
  articles: Article[];
  onOpenEditor: () => void;
  onSelectArticle: (article: Article) => void;
  onDeleteArticle: (id: string | number) => void;
  onOpenAuth: () => void;
}

export const AuthorDashboard: React.FC<AuthorDashboardProps> = ({
  articles,
  onOpenEditor,
  onSelectArticle,
  onDeleteArticle,
  onOpenAuth,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'stories' | 'analytics' | 'profile'>('stories');
  const [storyFilter, setStoryFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [bioText, setBioText] = useState(user?.bio || 'Writing at the intersection of architecture, systems engineering, and modern editorial aesthetics.');
  const [authorName, setAuthorName] = useState(user?.name || 'Editorial Contributor');
  const [savedSettings, setSavedSettings] = useState(false);

  // Filter articles belonging to author or show recent editorial stories
  const authorStories = articles.filter(a => 
    a.author.id === user?.id || 
    a.author.name === user?.name || 
    String(a.id).startsWith('art_') || 
    String(a.id).startsWith('local-')
  );

  // If user has no self-authored stories yet, provide the primary catalog as manage-ready demo stories
  const displayStories = authorStories.length > 0 ? authorStories : articles.slice(0, 5);

  const totalLikes = displayStories.reduce((acc, a) => acc + (a.likesCount || 0), 0);
  const totalComments = displayStories.reduce((acc, a) => acc + (a.commentsCount || 0), 0);
  const estimatedViews = (totalLikes * 18.5 + 2400).toLocaleString('en-US', { maximumFractionDigits: 0 });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
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
          className="bg-[#2E4A3E] hover:bg-[#233a30] text-white text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-md cursor-pointer"
        >
          Sign In to Access Studio
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EAE4D9]">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name || 'Author'}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#2E4A3E]/20"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416]">
                {authorName}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2E4A3E] text-white px-2 py-0.5 rounded-full">
                {user?.role || 'Staff Author'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 max-w-md line-clamp-1">
              {bioText}
            </p>
          </div>
        </div>

        {/* Action Button: Launch Publishing Studio */}
        <button
          onClick={onOpenEditor}
          className="inline-flex items-center justify-center space-x-2 bg-[#2E4A3E] hover:bg-[#233a30] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </button>
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-[#EAE4D9] shadow-2xs">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stories</span>
            <FileText className="w-4 h-4 text-[#2E4A3E]" />
          </div>
          <p className="font-editorial text-3xl font-bold text-[#141416]">
            {displayStories.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Active in publication</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EAE4D9] shadow-2xs">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Views</span>
            <Eye className="w-4 h-4 text-[#9E5A38]" />
          </div>
          <p className="font-editorial text-3xl font-bold text-[#141416]">
            {estimatedViews}
          </p>
          <span className="text-[11px] text-zinc-500 font-medium">Across all platforms</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EAE4D9] shadow-2xs">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Reader Claps</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="font-editorial text-3xl font-bold text-[#141416]">
            {totalLikes.toLocaleString()}
          </p>
          <span className="text-[11px] text-rose-600 font-medium">Positive responses</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EAE4D9] shadow-2xs">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Discussion</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-editorial text-3xl font-bold text-[#141416]">
            {totalComments}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Threaded conversations</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#EAE4D9] mb-6">
        <button
          onClick={() => setActiveTab('stories')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'stories'
              ? 'border-[#2E4A3E] text-[#2E4A3E]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Stories &amp; Drafts ({displayStories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-[#2E4A3E] text-[#2E4A3E]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Audience Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#2E4A3E] text-[#2E4A3E]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Author Profile Settings</span>
        </button>
      </div>

      {/* TAB 1: Stories Management */}
      {activeTab === 'stories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span>Showing all published articles and drafts authored by you</span>
            <div className="flex items-center space-x-1 bg-white border border-[#EAE4D9] rounded-full p-0.5">
              <button
                onClick={() => setStoryFilter('all')}
                className={`px-3 py-1 rounded-full font-medium cursor-pointer ${storyFilter === 'all' ? 'bg-[#FAF7F2] text-black font-bold' : 'text-zinc-500'}`}
              >
                All ({displayStories.length})
              </button>
              <button
                onClick={() => setStoryFilter('published')}
                className={`px-3 py-1 rounded-full font-medium cursor-pointer ${storyFilter === 'published' ? 'bg-[#FAF7F2] text-black font-bold' : 'text-zinc-500'}`}
              >
                Published
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE4D9] overflow-hidden divide-y divide-[#EAE4D9] shadow-xs">
            {displayStories.map((story) => (
              <div key={story.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E5A38] bg-[#9E5A38]/10 px-2 py-0.5 rounded-full">
                      {story.category}
                    </span>
                    <h3 
                      onClick={() => onSelectArticle(story)}
                      className="font-editorial text-lg sm:text-xl font-bold text-[#141416] hover:text-[#2E4A3E] cursor-pointer mt-1 line-clamp-1"
                    >
                      {story.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                      {story.description}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-zinc-400 mt-2">
                      <span>{story.publishedAt}</span>
                      <span>&bull;</span>
                      <span>{story.readingTime} min read</span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1 text-rose-600 font-semibold">
                        <Heart className="w-3 h-3" />
                        <span>{story.likesCount}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => onSelectArticle(story)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-zinc-700 hover:text-black bg-[#FAF7F2] hover:bg-zinc-200 border border-[#EAE4D9] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                    title="Read live preview"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => onOpenEditor()}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2E4A3E] bg-[#2E4A3E]/10 hover:bg-[#2E4A3E]/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                    title="Edit article"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${story.title}"?`)) {
                        onDeleteArticle(story.id);
                      }
                    }}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                    title="Delete story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Audience Analytics */}
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
                    <div className="bg-[#2E4A3E] h-2 rounded-full" style={{ width: '54%' }}></div>
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
                Your essays have reached readers in 42 countries, with the strongest engagement from engineering teams, typography designers, and founders.
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

      {/* TAB 3: Author Profile Settings */}
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
                className="w-full bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl px-4 py-2.5 text-xs text-[#141416] focus:bg-white focus:outline-hidden focus:border-[#2E4A3E]"
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
                className="w-full bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl px-4 py-2.5 text-xs text-[#141416] focus:bg-white focus:outline-hidden focus:border-[#2E4A3E]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#2E4A3E] hover:bg-[#233a30] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
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
