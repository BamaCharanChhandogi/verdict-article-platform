import React, { useState } from 'react';
import { Search, Menu, Bookmark, X, Edit3, LogOut, User as UserIcon, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  onOpenMobileSidebar: () => void;
  onOpenAuth: () => void;
  onOpenEditor: () => void;
  onNavigateStudio?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenBookmarks,
  bookmarksCount,
  onOpenMobileSidebar,
  onOpenAuth,
  onOpenEditor,
  onNavigateStudio,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE4D9] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger + Tagline */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-zinc-700 hover:text-black rounded-lg hover:bg-zinc-100 cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="hidden sm:inline-block text-[11px] font-semibold tracking-[0.25em] text-zinc-400 uppercase font-sans">
          Ideas &nbsp;&bull;&nbsp; People &nbsp;&bull;&nbsp; Perspectives
        </span>
      </div>

      {/* Right: Search Input + Action Buttons */}
      <div className="flex items-center space-x-3 flex-1 max-w-lg justify-end">
        {/* Search Input */}
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics or authors..."
            className="w-full bg-[#EAE4D9]/50 hover:bg-[#EAE4D9]/80 focus:bg-white text-xs text-[#141416] placeholder:text-zinc-500 rounded-full pl-9 pr-8 py-2 border border-transparent focus:border-zinc-300 focus:outline-hidden transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bookmarks Pill */}
        <button
          onClick={onOpenBookmarks}
          className="relative p-2 rounded-full border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-colors shadow-2xs cursor-pointer shrink-0"
          title="View Saved Bookmarks"
        >
          <Bookmark className="w-4 h-4" />
          {bookmarksCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9E5A38] text-white text-[9px] font-bold flex items-center justify-center">
              {bookmarksCount}
            </span>
          )}
        </button>

        {/* Write / Publish Story Button (Opens Studio) */}
        <button
          onClick={isAuthenticated ? onOpenEditor : onOpenAuth}
          className="hidden sm:inline-flex items-center space-x-1.5 bg-[#2E4A3E] hover:bg-[#233a30] text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-colors shadow-xs cursor-pointer shrink-0"
          title="Write a new article"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Write</span>
        </button>

        {/* Authentication State: User Profile or Sign In */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-1 pl-1.5 rounded-full border border-[#EAE4D9] bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-200"
              />
              <span className="text-xs font-semibold text-[#141416] pr-2 max-w-[90px] truncate hidden md:inline">
                {user.name.split(' ')[0]}
              </span>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EAE4D9] py-2 z-50 animate-in fade-in"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-zinc-100">
                  <p className="text-xs font-bold text-[#141416] truncate">{user.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-[#2E4A3E] bg-[#EBF1EE] px-2 py-0.5 rounded-full">
                    {user.role || 'Author'}
                  </span>
                </div>

                <button
                  onClick={onOpenEditor}
                  className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-[#FAF7F2] flex items-center space-x-2 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Write a Story</span>
                </button>

                {onNavigateStudio && (
                  <button
                    onClick={onNavigateStudio}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-[#FAF7F2] flex items-center space-x-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Author Studio &amp; Stories</span>
                  </button>
                )}

                <button
                  onClick={onOpenBookmarks}
                  className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-[#FAF7F2] flex items-center space-x-2 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Reading List ({bookmarksCount})</span>
                </button>

                <div className="border-t border-zinc-100 my-1"></div>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="bg-[#141416] hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-xs cursor-pointer shrink-0"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
