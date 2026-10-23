import React from 'react';
import { 
  Home, 
  Rss, 
  Users, 
  Bookmark, 
  X,
  FileText,
  Edit3,
  LogOut,
  LogIn,
  Sparkles,
  Clock,
  Compass,
  Moon,
  Sun,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { NavTab, Category } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeNav: NavTab;
  setActiveNav: (nav: NavTab) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  bookmarksCount: number;
  draftsCount?: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenBookmarks: () => void;
  onOpenAuth: () => void;
  onOpenEditor: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  selectedCategory,
  setSelectedCategory,
  bookmarksCount,
  draftsCount = 0,
  isOpenMobile,
  setIsOpenMobile,
  onOpenBookmarks,
  onOpenAuth,
  onOpenEditor,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'feed', label: 'Feed & Discover', icon: Rss, badge: 'Live' },
    { id: 'authors', label: 'Authors & Fellows', icon: Users },
    { id: 'bookmarks', label: 'Reading List', icon: Bookmark, count: bookmarksCount },
  ];

  const writingNavItems = [
    { id: 'drafts', label: 'Drafts', icon: Clock, count: draftsCount },
    { id: 'mystories', label: 'Creator Studio', icon: FileText },
  ];

  const popularTopics: Category[] = [
    'Technology',
    'Design',
    'Productivity',
    'Business',
    'Lifestyle',
    'AI & Future',
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FBF9F5] border-r border-[#EAE4D9] p-5 flex flex-col justify-between
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Brand Logo & Header */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => { setActiveNav('home'); setSelectedCategory('All'); setIsOpenMobile(false); }}
              className="text-left group cursor-pointer"
            >
              <h1 className="font-editorial text-2xl font-bold tracking-tight text-[#141416] flex items-baseline">
                Verdict
                <span className="text-[#9E5A38] font-black text-2xl ml-0.5 group-hover:scale-125 transition-transform">.</span>
              </h1>
            </button>
            
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prominent Hashnode-Style Write Button */}
          <div>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuth();
                } else {
                  onOpenEditor();
                }
                setIsOpenMobile(false);
              }}
              className="w-full bg-[#141416] hover:bg-black text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <Edit3 className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white transition-colors" />
              <span>Write Story</span>
            </button>
          </div>

          {/* Primary Navigation Section */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'bookmarks') {
                      onOpenBookmarks();
                    } else {
                      setActiveNav(item.id as NavTab);
                    }
                    setIsOpenMobile(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-[#EAE4D9] text-[#141416] font-semibold shadow-2xs' 
                      : 'text-zinc-600 hover:text-[#141416] hover:bg-[#FAF7F2]'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#141416]' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#141416] text-white">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* WRITING SECTION (Hashnode Hierarchy) */}
          <div className="pt-4 border-t border-[#EAE4D9]/80">
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-3">
              Writing
            </h2>
            <div className="space-y-1">
              {writingNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!isAuthenticated) {
                        onOpenAuth();
                      } else {
                        setActiveNav(item.id as NavTab);
                      }
                      setIsOpenMobile(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer
                      ${isActive 
                        ? 'bg-[#EAE4D9] text-[#141416] font-semibold shadow-2xs' 
                        : 'text-zinc-600 hover:text-[#141416] hover:bg-[#FAF7F2]'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#141416]' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-800">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curated Editorial Topics */}
          <div className="pt-4 border-t border-[#EAE4D9]/80">
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-3">
              Explore Topics
            </h2>
            <div className="space-y-0.5">
              {popularTopics.map((topic) => {
                const isSelected = selectedCategory === topic && (activeNav === 'home' || activeNav === 'feed');
                return (
                  <button
                    key={topic}
                    onClick={() => {
                      setSelectedCategory(topic);
                      setActiveNav('feed');
                      setIsOpenMobile(false);
                    }}
                    className={`
                      w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer
                      ${isSelected 
                        ? 'text-[#9E5A38] font-bold bg-[#9E5A38]/10' 
                        : 'text-zinc-600 hover:text-[#141416] hover:bg-[#FAF7F2]'
                      }
                    `}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM DOCK: Theme, More, and Profile */}
        <div className="mt-6 pt-4 border-t border-[#EAE4D9] space-y-3">
          {/* Theme & Extras */}
          <div className="flex items-center justify-between px-2 text-xs text-zinc-500">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center space-x-2 hover:text-[#141416] cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDarkMode ? 'Light' : 'Theme'}</span>
            </button>
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Verdict Pro</span>
            </div>
          </div>

          {/* User Profile or Sign In */}
          {isAuthenticated && user ? (
            <div className="bg-white rounded-2xl p-3 border border-[#EAE4D9] shadow-2xs flex items-center justify-between">
              <div 
                onClick={() => {
                  setActiveNav('mystories');
                  setIsOpenMobile(false);
                }}
                className="flex items-center space-x-3 min-w-0 cursor-pointer"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#141416] truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 capitalize">
                    {user.role || 'Author'}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                setIsOpenMobile(false);
              }}
              className="w-full bg-white hover:bg-zinc-50 border border-[#EAE4D9] text-[#141416] text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-zinc-500" />
              <span>Sign in to Verdict</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
