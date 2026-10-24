import React, { useState } from 'react';
import { Clock, Plus, Trash2, Edit3, ArrowLeft, FileText, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { deleteRealArticle } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface DraftsPageProps {
  drafts: Article[];
  onResumeDraft: (draft: Article) => void;
  onOpenNewDraft: () => void;
  onDeleteDraft: (id: string | number) => void;
  onBackToStudio: () => void;
}

export const DraftsPage: React.FC<DraftsPageProps> = ({
  drafts,
  onResumeDraft,
  onOpenNewDraft,
  onDeleteDraft,
  onBackToStudio,
}) => {
  const { token } = useAuth();
  const [search, setSearch] = useState('');

  const filteredDrafts = drafts.filter(d => 
    !search.trim() || 
    (d.title || '').toLowerCase().includes(search.toLowerCase().trim()) ||
    (d.category || '').toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleDelete = async (id: string | number, title: string) => {
    if (confirm(`Are you sure you want to delete draft "${title || 'Untitled'}"?`)) {
      onDeleteDraft(id);
      await deleteRealArticle(id, token);
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EAE4D9] dark:border-[#262C3A]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <button 
              onClick={onBackToStudio}
              className="hover:text-black dark:hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Creator Studio</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-[#141416] dark:text-white">Drafts</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-[#141416] dark:text-white flex items-center gap-2">
            <span>My Drafts</span>
            <span className="text-sm font-sans font-semibold bg-[#EAE4D9] dark:bg-[#262C3A] text-[#141416] dark:text-zinc-200 px-2.5 py-0.5 rounded-full">
              {drafts.length}
            </span>
          </h1>
        </div>

        <button
          onClick={onOpenNewDraft}
          className="inline-flex items-center space-x-2 bg-[#141416] dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-[#141416] text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Draft</span>
        </button>
      </div>

      {/* Search Filter if multiple drafts */}
      {drafts.length > 3 && (
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter drafts by title or topic..."
            className="w-full max-w-sm bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] rounded-xl px-3.5 py-2 text-xs text-[#141416] dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden focus:border-[#141416] dark:focus:border-zinc-400"
          />
        </div>
      )}

      {/* Drafts List */}
      {filteredDrafts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#171B22] rounded-3xl border border-[#EAE4D9] dark:border-[#262C3A] p-8 shadow-2xs max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-900/60">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#141416] dark:text-white mb-2">
            No active drafts
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
            All your ideas and essays in progress are automatically saved to your account. Start your next story now.
          </p>
          <button
            onClick={onOpenNewDraft}
            className="bg-[#141416] dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-[#141416] text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
          >
            Create New Draft
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#171B22] rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] overflow-hidden divide-y divide-[#EAE4D9] dark:divide-[#262C3A] shadow-2xs">
          {filteredDrafts.map((draft) => (
            <div 
              key={draft.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 dark:hover:bg-[#1F2430]/60 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                    Draft
                  </span>
                  <span className="text-[11px] font-semibold text-[#9E5A38] dark:text-[#E05A30]">
                    {draft.category}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-600">&bull;</span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {draft.readingTime} min read
                  </span>
                </div>

                <h3 
                  onClick={() => onResumeDraft(draft)}
                  className="font-editorial text-lg sm:text-xl font-bold text-[#141416] dark:text-white group-hover:text-[#2E4A3E] dark:group-hover:text-emerald-400 cursor-pointer truncate"
                >
                  {draft.title || 'Untitled Draft'}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                  {draft.subtitle || draft.description || 'Draft content saved in progress...'}
                </p>

                <div className="flex items-center flex-wrap gap-y-1 gap-x-2 text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
                  <span>Last updated: {draft.updatedAt || 'Recently'}</span>
                  <span>&bull;</span>
                  <span>Cloud Synchronized</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => onResumeDraft(draft)}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white dark:text-[#141416] bg-[#141416] dark:bg-white hover:bg-black dark:hover:bg-zinc-200 px-4 py-2 rounded-full transition-colors cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </button>

                <button
                  onClick={() => handleDelete(draft.id, draft.title)}
                  className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors cursor-pointer"
                  title="Delete Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
