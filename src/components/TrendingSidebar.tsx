import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Check, 
  Plus, 
  Sparkles, 
  ArrowUpRight, 
  Flame, 
  X 
} from 'lucide-react';
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

interface TrendingStory {
  rank: string;
  title: string;
  slug: string;
  author: string;
  readingTime: number;
  reads: string;
}

const TODAY_TRENDING: TrendingStory[] = [
  {
    rank: '01',
    title: 'The Art of a Calmer Morning',
    slug: 'the-art-of-a-calmer-morning',
    author: 'David K.',
    readingTime: 4,
    reads: '1.4k reads today'
  },
  {
    rank: '02',
    title: 'How AI is Changing Everyday Creativity',
    slug: 'how-ai-is-changing-everyday-creativity',
    author: 'Marcus Vance',
    readingTime: 5,
    reads: '1.1k reads today'
  },
  {
    rank: '03',
    title: 'The Architecture of Silence: Designing Acoustic Sanctuaries',
    slug: 'the-architecture-of-silence-designing-acoustic-sanctuaries',
    author: 'Elena Rostova',
    readingTime: 6,
    reads: '980 reads today'
  },
  {
    rank: '04',
    title: 'Tactile Computing: Returning to Physical Knobs and Dials',
    slug: 'tactile-computing-returning-to-physical-knobs-and-dials',
    author: 'David K.',
    readingTime: 5,
    reads: '840 reads today'
  }
];

const PAST_WEEK_TRENDING: TrendingStory[] = [
  {
    rank: '01',
    title: 'The Architecture of Silence: Designing Acoustic Sanctuaries',
    slug: 'the-architecture-of-silence-designing-acoustic-sanctuaries',
    author: 'Elena Rostova',
    readingTime: 6,
    reads: '3.2k reads'
  },
  {
    rank: '02',
    title: 'How AI is Changing Everyday Creativity',
    slug: 'how-ai-is-changing-everyday-creativity',
    author: 'Marcus Vance',
    readingTime: 5,
    reads: '2.8k reads'
  },
  {
    rank: '03',
    title: 'The Art of a Calmer Morning',
    slug: 'the-art-of-a-calmer-morning',
    author: 'David K.',
    readingTime: 4,
    reads: '2.5k reads'
  },
  {
    rank: '04',
    title: 'The Sovereign Creator: Escaping Algorithmic Feudalism',
    slug: 'the-sovereign-creator-escaping-algorithmic-feudalism',
    author: 'Liam Patel',
    readingTime: 7,
    reads: '2.1k reads'
  }
];

const ALL_TIME_TRENDING: TrendingStory[] = [
  {
    rank: '01',
    title: 'The Monastic Workplace: Deep Work in the Age of Noise',
    slug: 'the-monastic-workplace-deep-work-in-the-age-of-noise',
    author: 'Marcus Vance',
    readingTime: 8,
    reads: '18.4k reads'
  },
  {
    rank: '02',
    title: 'Designing for Cognitive Flow in Digital Interfaces',
    slug: 'designing-for-cognitive-flow-in-digital-interfaces',
    author: 'Sarah Jenkins',
    readingTime: 6,
    reads: '15.2k reads'
  },
  {
    rank: '03',
    title: 'Tactile Computing: Returning to Physical Knobs and Dials',
    slug: 'tactile-computing-returning-to-physical-knobs-and-dials',
    author: 'David K.',
    readingTime: 5,
    reads: '12.7k reads'
  },
  {
    rank: '04',
    title: 'Slow Living in a Fast World: Pacing as Resistance',
    slug: 'slow-living-in-a-fast-world-pacing-as-resistance',
    author: 'Elena Rostova',
    readingTime: 5,
    reads: '11.9k reads'
  }
];

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  onSelectTag,
  selectedTag,
  onOpenAuthors,
  onOpenAuth,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [trendingTab, setTrendingTab] = useState<'day' | 'week' | 'all'>('day');

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
                type="button"
                onClick={() => onSelectTag(item.name)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-colors duration-150 cursor-pointer group text-left select-none border ${
                  isSelected
                    ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] border-[#141416] dark:border-white'
                    : 'border-transparent hover:bg-[#FAF7F2] dark:hover:bg-[#1F2430]'
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

            const isSelf = Boolean(
              isAuthenticated && user && (
                (user.name && writer.name && user.name.toLowerCase() === writer.name.toLowerCase()) ||
                (user.id && (user.id === writer.handle || (user.id === 'user-demo-1' && writer.name === 'Elena Rostova')))
              )
            );

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

                {isSelf ? (
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    You
                  </span>
                ) : (
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
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 24-Day Highlights Widget (Human-written, relatable editorial recap) */}
      <div className="bg-white dark:bg-[#171B22] rounded-3xl p-5 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#FAF7F2] dark:border-[#202633]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#9E5A38] dark:text-[#E05A30]" />
            <h4 className="text-sm font-bold text-[#141416] dark:text-[#F1F3F5] tracking-tight">
              24-Day Highlights
            </h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            Monthly Recap
          </span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3.5">
          What readers spent the most time talking about and reading over the last 24 days:
        </p>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-start space-x-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E5A38] dark:bg-[#E05A30] mt-1.5 shrink-0"></span>
            <span><strong>AI That Takes Action:</strong> People are moving past simple chat prompts to tools that write, run, and test code directly.</span>
          </div>
          <div className="flex items-start space-x-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E4A3E] dark:bg-emerald-400 mt-1.5 shrink-0"></span>
            <span><strong>Calmer Work Routines:</strong> Stories on distraction-free mornings and quiet desks became our most saved reads.</span>
          </div>
          <div className="flex items-start space-x-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
            <span><strong>Long Reads Are Winning:</strong> Readers spent 6+ minutes per essay, skipping quick news for thoughtful breakdowns.</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSummaryModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] hover:bg-zinc-200/70 dark:hover:bg-[#262C3A] text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-[#EAE4D9]/60 dark:border-[#262C3A]"
        >
          <span>View 24-Day Recap</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Trending Stories Widget (Day, Week, All Time) */}
      <div className="bg-white dark:bg-[#171B22] rounded-3xl p-5 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FAF7F2] dark:border-[#202633]">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <h4 className="text-sm font-bold text-[#141416] dark:text-[#F1F3F5] tracking-tight">
              {trendingTab === 'day' ? 'Trending Today' : trendingTab === 'week' ? 'Trending This Week' : 'Trending All Time'}
            </h4>
          </div>

          {/* Day / Week / All Time Tab Toggle */}
          <div className="inline-flex p-0.5 rounded-full bg-zinc-100 dark:bg-[#1F2430] border border-[#EAE4D9]/60 dark:border-[#262C3A]">
            <button
              type="button"
              onClick={() => setTrendingTab('day')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold transition-colors duration-150 cursor-pointer select-none ${
                trendingTab === 'day'
                  ? 'bg-white dark:bg-[#141416] text-[#141416] dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setTrendingTab('week')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold transition-colors duration-150 cursor-pointer select-none ${
                trendingTab === 'week'
                  ? 'bg-white dark:bg-[#141416] text-[#141416] dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setTrendingTab('all')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold transition-colors duration-150 cursor-pointer select-none ${
                trendingTab === 'all'
                  ? 'bg-white dark:bg-[#141416] text-[#141416] dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Stories list */}
        <div className="space-y-3.5">
          {(trendingTab === 'day' ? TODAY_TRENDING : trendingTab === 'week' ? PAST_WEEK_TRENDING : ALL_TIME_TRENDING).map((story) => (
            <Link
              key={story.slug}
              to={`/article/${story.slug}`}
              className="flex items-start space-x-3.5 group no-underline text-inherit cursor-pointer"
            >
              <span className="font-editorial text-2xl font-bold text-zinc-300 dark:text-zinc-600 group-hover:text-[#9E5A38] dark:group-hover:text-[#E05A30] transition-colors shrink-0 w-7 leading-none pt-0.5">
                {story.rank}
              </span>
              <div className="min-w-0 flex-1">
                <h5 className="font-editorial text-sm font-bold text-[#141416] dark:text-zinc-200 group-hover:text-[#9E5A38] dark:group-hover:text-[#E05A30] transition-colors leading-snug line-clamp-2">
                  {story.title}
                </h5>
                <div className="flex items-center space-x-2 mt-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  <span className="text-zinc-600 dark:text-zinc-400 font-semibold">{story.author}</span>
                  <span>&bull;</span>
                  <span>{story.readingTime} min</span>
                  <span>&bull;</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{story.reads}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 24-Day Briefing Modal (Human, relatable, easy to read) */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsSummaryModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white dark:bg-[#171B22] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xl z-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#FAF7F2] dark:border-[#202633] pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-widest text-[#9E5A38] dark:text-[#E05A30] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Recap</span>
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#141416] dark:text-white">
                  What Readers Explored Over the Past 24 Days
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  A human look at the biggest conversations across 840+ stories &bull; October 2026
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(false)}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Findings Breakdown */}
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] border border-[#EAE4D9]/60 dark:border-[#262C3A]">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#141416] dark:text-white mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#9E5A38]"></span>
                  <span>1. Moving from prompt tricks to real tools</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  The most discussed stories were not about clever prompt tricks, but about software agents that can browse, code, and test independently. Readers are interested in what actually saves time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] border border-[#EAE4D9]/60 dark:border-[#262C3A]">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#141416] dark:text-white mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#2E4A3E]"></span>
                  <span>2. Creating quiet space in a noisy world</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Essays about calm morning routines, phone-free hours, and comfortable physical workspaces saw high engagement and personal stories shared in the comments.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] border border-[#EAE4D9]/60 dark:border-[#262C3A]">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#141416] dark:text-white mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>3. Choosing depth over endless scrolling</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Average reading time reached 6.2 minutes. Rather than skim dozens of tweets or headlines, people showed a clear appetite for 1 or 2 thorough, well-reasoned perspectives each day.
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#13171F] border border-[#EAE4D9]/40 dark:border-[#262C3A] text-center">
              <div>
                <p className="font-editorial text-xl font-bold text-[#141416] dark:text-white">842</p>
                <p className="text-[10px] text-zinc-400 font-medium">Stories Published</p>
              </div>
              <div>
                <p className="font-editorial text-xl font-bold text-emerald-600 dark:text-emerald-400">14.8k</p>
                <p className="text-[10px] text-zinc-400 font-medium">Hours of Reading</p>
              </div>
              <div>
                <p className="font-editorial text-xl font-bold text-[#9E5A38] dark:text-[#E05A30]">94%</p>
                <p className="text-[10px] text-zinc-400 font-medium">Returning Readers</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#141416] text-white hover:bg-zinc-800 dark:bg-white dark:text-[#141416] dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-sm"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};