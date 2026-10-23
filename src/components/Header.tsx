import React from 'react';
import { Search, Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenMobileSidebar,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE4D9] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger + Editorial Tagline */}
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

      {/* Right: Clean Global Search Input (No duplicate Write or Bookmarks buttons) */}
      <div className="flex items-center space-x-3 flex-1 max-w-md justify-end">
        <div className="relative w-full">
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

        {!isAuthenticated && (
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-flex items-center space-x-1.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
