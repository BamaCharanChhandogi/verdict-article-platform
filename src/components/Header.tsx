import React from 'react';
import { Search, Menu, X, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenAuth: () => void;
  onOpenEditor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenMobileSidebar,
  onOpenAuth,
  onOpenEditor,
}) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 dark:bg-[#0E1116]/90 backdrop-blur-md border-b border-[#EAE4D9] dark:border-[#222733] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Menu Trigger + Editorial Tagline */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1A1F29] cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="hidden sm:inline-block text-[11px] font-semibold tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase font-sans">
          Ideas &nbsp;&bull;&nbsp; People &nbsp;&bull;&nbsp; Perspectives
        </span>
      </div>

      {/* Right: Clean Global Search Input & Write Story CTA */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 flex-1 max-w-lg justify-end">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics or authors..."
            className="w-full bg-[#EAE4D9]/50 dark:bg-[#171B22] hover:bg-[#EAE4D9]/80 dark:hover:bg-[#1E232B] focus:bg-white dark:focus:bg-[#1E232B] text-xs text-[#141416] dark:text-[#F1F3F5] placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-full pl-9 pr-8 py-2 border border-transparent dark:border-[#262C3A] focus:border-zinc-300 dark:focus:border-zinc-600 focus:outline-hidden transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Authenticated User Badge */}
        {isAuthenticated && (
          <div className="flex items-center space-x-2 shrink-0">
            <img 
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
              alt={user?.name || 'User'} 
              className="w-7 h-7 rounded-full object-cover border border-[#EAE4D9] dark:border-[#262C3A]"
            />
            <span className="text-xs font-semibold text-[#141416] dark:text-white hidden md:inline truncate max-w-[100px]">
              {user?.name?.split(' ')[0] || 'Author'}
            </span>
          </div>
        )}

        <button
          onClick={() => {
            if (!isAuthenticated) {
              onOpenAuth();
            } else if (onOpenEditor) {
              onOpenEditor();
            }
          }}
          className="inline-flex items-center space-x-1.5 bg-[#141416] dark:bg-[#F1F3F5] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1116] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-2xs cursor-pointer shrink-0 group"
          title={isAuthenticated ? "Write a new story" : "Sign in to write a story"}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Write Story</span>
        </button>
      </div>
    </header>
  );
};
