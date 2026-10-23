import React, { useState } from 'react';
import { TrendingUp, Users, Check, Plus, ExternalLink } from 'lucide-react';
import { Category } from '../types';
import { useAuth } from '../context/AuthContext';

interface TrendingSidebarProps {
  onSelectTag: (tag: Category) => void;
  selectedTag?: Category;
  onOpenAuthors?: () => void;
  onOpenAuth?: () => void;
}

interface TrendingTagItem {
  name: Category;
  tag: string;
  count: number;
  avatars: string[];
}

const TRENDING_TAGS: TrendingTagItem[] = [
  {
    name: 'AI & Future',
    tag: '#ai',
    count: 292,
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    name: 'Technology',
    tag: '#technology',
    count: 248,
    avatars: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    name: 'Design',
    tag: '#design',
    count: 195,
    avatars: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    name: 'Business',
    tag: '#business',
    count: 162,
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    name: 'Lifestyle',
    tag: '#lifestyle',
    count: 124,
    avatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    ],
  },
  {
    name: 'Productivity',
    tag: '#productivity',
    count: 110,
    avatars: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    ],
  },
];

const FEATURED_WRITERS = [
  {
    name: 'Elena Rostova',
    handle: '@elena_arch',
    role: 'Architectural Critic & Fellow',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Marcus Vance',
    handle: '@marcusvance',
    role: 'Principal Systems Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Aria Chen',
    handle: '@ariachen',
    role: 'Human-AI Interfaces Lead',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
  },
];

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  onSelectTag,
  selectedTag,
  onOpenAuthors,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuth();
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});

  const toggleFollow = (handle: string) => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setFollowingState(prev => ({
      ...prev,
      [handle]: !prev[handle],
    }));
  };

  return (
    <aside className="space-y-6">
      {/* 1. Trending Tags Widget (Hashnode Style) */}
      <div className="bg-white dark:bg-[#171B22] rounded-3xl p-5 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FAF7F2] dark:border-[#202633]">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#9E5A38] dark:text-[#E05A30]" />
            <h4 className="text-sm font-bold text-[#141416] dark:text-[#F1F3F5] tracking-tight">
              Trending tags this week
            </h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Live
          </span>
        </div>

        <div className="space-y-2">
          {TRENDING_TAGS.map((item) => {
            const isSelected = selectedTag === item.name;

            return (
              <button
                key={item.tag}
                onClick={() => onSelectTag(item.name)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group text-left ${
                  isSelected
                    ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416]'
                    : 'hover:bg-[#FAF7F2] dark:hover:bg-[#1F2430]'
                }`}
              >
                {/* Left: Tag name */}
                <div className="flex items-center space-x-2 min-w-0">
                  <span className={`text-xs font-semibold ${
                    isSelected
                      ? 'text-white dark:text-[#141416]'
                      : 'text-zinc-700 dark:text-zinc-300 group-hover:text-[#9E5A38] dark:group-hover:text-[#E05A30]'
                  }`}>
                    {item.tag}
                  </span>
                </div>

                {/* Right: Overlapping avatars & post count */}
                <div className="flex items-center space-x-2.5 shrink-0">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {item.avatars.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Contributor"
                        className="w-4 h-4 rounded-full ring-1 ring-white dark:ring-[#171B22] object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                  <span className={`text-[11px] font-medium ${
                    isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
                  }`}>
                    {item.count} posts
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Top Writers Widget */}
      <div className="bg-white dark:bg-[#171B22] rounded-3xl p-5 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FAF7F2] dark:border-[#202633]">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#2E4A3E] dark:text-emerald-400" />
            <h4 className="text-sm font-bold text-[#141416] dark:text-[#F1F3F5] tracking-tight">
              Featured Writers
            </h4>
          </div>
          {onOpenAuthors && (
            <button
              onClick={onOpenAuthors}
              className="text-[11px] font-semibold text-[#9E5A38] dark:text-[#E05A30] hover:underline cursor-pointer"
            >
              See all
            </button>
          )}
        </div>

        <div className="space-y-3.5">
          {FEATURED_WRITERS.map((writer) => {
            const isFollowing = followingState[writer.handle];

            return (
              <div key={writer.handle} className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={writer.avatar}
                    alt={writer.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-black/5 dark:border-white/10"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#141416] dark:text-white truncate">
                      {writer.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                      {writer.role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollow(writer.handle)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                    isFollowing
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                      : 'bg-[#141416] hover:bg-zinc-800 text-white dark:bg-white dark:text-[#141416] dark:hover:bg-zinc-200 shadow-2xs'
                  }`}
                >
                  {isFollowing ? (
                    <span className="inline-flex items-center space-x-1">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Following</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1">
                      <Plus className="w-3 h-3" />
                      <span>Follow</span>
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
};