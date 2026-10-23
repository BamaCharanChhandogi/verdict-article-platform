import React from 'react';
import { 
  Home, 
  Compass, 
  Users, 
  Bookmark, 
  X,
  FileText,
  Edit3,
  LogOut,
  LogIn,
  Sparkles
} from 'lucide-react';
import { NavTab, Category } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeNav: NavTab;
  setActiveNav: (nav: NavTab) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  bookmarksCount: number;
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
  isOpenMobile,
  setIsOpenMobile,
  onOpenBookmarks,
  onOpenAuth,
  onOpenEditor,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  // Navigation items adapted dynamically based on auth state
  const baseNavItems = [
    { id: 'home', label: 'Home Feed', icon: Home, badge: '•' },
    { id: 'explore', label: 'Explore & Topics', icon: Compass },
    { id: 'authors', label: 'Authors & Fellows', icon: Users },
    { id: 'bookmarks', label: 'Reading List', icon: Bookmark, count: bookmarksCount },
  ];

  const authenticatedNavItems = [
    ...baseNavItems,
    { id: 'mystories', label: 'My Stories & Studio', icon: FileText },
  ];

  const currentNavItems = isAuthenticated ? authenticatedNavItems : baseNavItems;

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
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FBF9F5] border-r border-[#EAE4D9] p-6 flex flex-col justify-between
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Logo "Verdict." */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => { setActiveNav('home'); setSelectedCategory('All'); setIsOpenMobile(false); }}
              className="text-left group cursor-pointer"
            >
              <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#141416] flex items-baseline">
                Verdict
                <span className="text-[#9E5A38] font-black text-3xl ml-0.5 group-hover:scale-125 transition-transform">.</span>
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

          {/* Quick Write Story CTA for Authenticated Creators */}
          {isAuthenticated && (
            <div className="mb-6">
              <button
                onClick={() => {
                  onOpenEditor();
                  setIsOpenMobile(false);
                }}
                className="w-full bg-[#2E4A3E] hover:bg-[#233a30] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write Story</span>
              </button>
            </div>
          )}

          {/* Primary Navigation */}
          <nav className="space-y-1 mb-8">
            {currentNavItems.map((item) => {
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
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer
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
                  {item.badge && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E5A38]"></span>
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

          {/* Curated Editorial Topics */}
          <div className="pt-6 border-t border-[#EAE4D9]">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3 px-3">
              Editorial Topics
            </h2>
            <div className="space-y-1">
              {popularTopics.map((topic) => {
                const isSelected = selectedCategory === topic && activeNav === 'home';
                return (
                  <button
                    key={topic}
                    onClick={() => {
                      setSelectedCategory(topic);
                      setActiveNav('home');
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

        {/* BOTTOM DOCK: Dual-State Behavior */}
        <div className="mt-8 pt-4 border-t border-[#EAE4D9]">
          {isAuthenticated && user ? (
            /* Logged-In User Profile Dock */
            <div className="bg-white rounded-2xl p-3.5 border border-[#EAE4D9] shadow-2xs flex items-center justify-between">
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
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#141416] truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 capitalize">
                    {user.role || 'Author'} &bull; Studio
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
            /* Logged-Out Elegant Invitation Card (No spammy 'Join Free' or alert popups) */
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE4D9]">
              <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2E4A3E] mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Verdict Circle</span>
              </div>
              <p className="text-xs text-zinc-600 leading-snug mb-3">
                Sign in to save articles, join discussions, and publish your essays.
              </p>
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsOpenMobile(false);
                }}
                className="w-full bg-[#141416] hover:bg-black text-white text-xs font-semibold py-2 px-3 rounded-full transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
