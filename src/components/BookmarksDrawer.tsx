import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (article: Article) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] dark:bg-[#0E1116] border-l border-[#EAE4D9] dark:border-[#262C3A] shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#EAE4D9] dark:border-[#262C3A] flex items-center justify-between bg-white dark:bg-[#171B22]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F7EFE9] dark:bg-[#2A1D17] flex items-center justify-center text-[#9E5A38] dark:text-[#E05A30]">
                <Bookmark className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#141416] dark:text-white">
                  Your Reading List
                </h3>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {bookmarkedArticles.length} {bookmarkedArticles.length === 1 ? 'story' : 'stories'} saved
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bookmarks List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {bookmarkedArticles.length === 0 ? (
              <div className="text-center py-20">
                <Bookmark className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                <p className="font-editorial text-lg text-zinc-700 dark:text-zinc-300 font-medium">Your list is empty</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
                  Click the bookmark icon on any article card to save it for offline reading.
                </p>
              </div>
            ) : (
              bookmarkedArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="group bg-white dark:bg-[#171B22] p-3.5 rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center space-x-3.5"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#2E4A3E] dark:text-emerald-400">
                      {article.category}
                    </span>
                    <h4 className="font-sans text-xs font-bold text-[#141416] dark:text-white group-hover:text-[#9E5A38] dark:group-hover:text-[#E05A30] transition-colors line-clamp-2 leading-snug mt-0.5">
                      {article.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">
                      {article.readingTime} min read &bull; {article.author.name}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(article);
                    }}
                    className="p-2 text-zinc-300 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 cursor-pointer"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {bookmarkedArticles.length > 0 && (
            <div className="p-4 border-t border-[#EAE4D9] dark:border-[#262C3A] bg-white dark:bg-[#171B22] flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="bg-[#141416] dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-[#141416] text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
