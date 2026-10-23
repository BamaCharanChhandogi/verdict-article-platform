import React from 'react';
import { Search, Menu, Bookmark, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenBookmarks,
  bookmarksCount,
  onOpenMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EFECE6] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger + Tagline */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-zinc-700 hover:text-black rounded-lg hover:bg-zinc-100 cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="hidden sm:inline-block text-[11px] font-semibold tracking-[0.25em] text-zinc-500 uppercase font-sans">
          Ideas &nbsp;•&nbsp; People &nbsp;•&nbsp; Perspectives
        </span>
      </div>

      {/* Right: Search Input + Action Buttons */}
      <div className="flex items-center space-x-3 flex-1 max-w-md justify-end">
        {/* Search Input */}
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics or authors..."
            className="w-full bg-[#F3EFEA] hover:bg-[#ECE7DF] focus:bg-white text-xs text-[#18181B] placeholder:text-zinc-500 rounded-full pl-9 pr-8 py-2 border border-transparent focus:border-zinc-300 focus:outline-hidden transition-all shadow-2xs"
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
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E05A30] text-white text-[9px] font-bold flex items-center justify-center">
              {bookmarksCount}
            </span>
          )}
        </button>

        {/* Sign In Button */}
        <button
          onClick={() => alert("Sign In modal: Welcome back to Verdict.")}
          className="bg-[#18181B] hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-xs cursor-pointer shrink-0"
        >
          Sign In
        </button>
      </div>
    </header>
  );
};
