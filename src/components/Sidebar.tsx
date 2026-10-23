import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  Users, 
  Bookmark, 
  FileText, 
  Sun, 
  Moon, 
  LogIn, 
  LogOut,
  X,
  Compass
} from 'lucide-react';
import { NavTab, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
  setSelectedCategory,
  bookmarksCount,
  draftsCount = 0,
  isOpenMobile,
  setIsOpenMobile,
  onOpenAuth,
}) => {
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Navigation Items matching the frosted capsule dock
  const navItems = isAuthenticated
    ? [
        { id: 'feed', label: 'Feed & Discover', icon: LayoutGrid },
        { id: 'authors', label: 'Authors & Fellows', icon: Users },
        { id: 'bookmarks', label: 'Reading List', icon: Bookmark, badge: bookmarksCount },
        { id: 'mystories', label: 'Creator Studio', icon: FileText, badge: draftsCount },
      ]
    : [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'authors', label: 'Authors & Fellows', icon: Users },
        { id: 'bookmarks', label: 'Reading List', icon: Bookmark, badge: bookmarksCount },
        { id: 'mystories', label: 'Creator Studio', icon: FileText },
      ];

  return (
    <>
      {/* MOBILE SLIDE-OUT DRAWER (When hamburger is clicked on small screens) */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#FAF7F2] dark:bg-[#121620] border-r border-[#EAE4D9] dark:border-[#262C3A] p-6 flex flex-col justify-between
        transition-transform duration-300 ease-in-out lg:hidden
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE4D9] dark:border-[#262C3A] pb-4">
            <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#141416] dark:text-white">
              Verdict<span className="text-[#9E5A38] dark:text-[#E05A30]">.</span>
            </h2>
            <button 
              onClick={() => setIsOpenMobile(false)}
              className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id as NavTab);
                    setSelectedCategory('All');
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416] shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-[#EAE4D9]/50 dark:hover:bg-[#1E232B] hover:text-black dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#EAE4D9] dark:border-[#262C3A] flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setIsOpenMobile(false);
              }}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                setIsOpenMobile(false);
              }}
              className="text-xs font-bold text-[#141416] dark:text-white hover:underline cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* DESKTOP FROSTED GLASS CAPSULE DOCK (Matches User Provided Image 2) */}
      <aside 
        className="fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center justify-between frosted-glass-dock w-[54px] h-[352px] py-3.5 px-1.5 rounded-full"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <div key={item.id} className="relative group flex items-center justify-center">
              <button
                onClick={() => {
                  if (item.id === 'mystories' && !isAuthenticated) {
                    onOpenAuth();
                    return;
                  }
                  setActiveNav(item.id as NavTab);
                  setSelectedCategory('All');
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'border-2 border-zinc-800 dark:border-white text-zinc-900 dark:text-white bg-transparent'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/40 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Floating Tooltip Pill */}
              <div className="absolute left-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
                {item.badge !== undefined && item.badge > 0 && ` (${item.badge})`}
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="w-6 h-px bg-zinc-300/60 dark:bg-zinc-700/60 my-0.5"></div>

        {/* Theme Switcher Button */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-white/40 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400 stroke-[1.75]" /> : <Moon className="w-5 h-5 stroke-[1.75]" />}
          </button>
          <div className="absolute left-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </div>
        </div>

        {/* Auth Button (Sign In / Sign Out) */}
        <div className="relative group flex items-center justify-center">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-rose-500/20 hover:text-rose-600 transition-all cursor-pointer"
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5 stroke-[1.75]" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-white/40 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all cursor-pointer"
              aria-label="Sign In"
            >
              <LogIn className="w-5 h-5 stroke-[1.75]" />
            </button>
          )}
          <div className="absolute left-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {isAuthenticated ? 'Sign Out' : 'Sign In'}
          </div>
        </div>
      </aside>
    </>
  );
};
