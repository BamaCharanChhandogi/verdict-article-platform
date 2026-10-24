import React, { useState, useEffect } from 'react';
import { Bookmark, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface EditorsPicksProps {
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
  onBookmarkToggle: (article: Article) => void;
  isBookmarked: (id: string | number) => boolean;
  onSeeAllClick: () => void;
}

interface LiveIncomingPost {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  readingTime: number;
  slug: string;
  timeAgo: string;
  views: number;
}

const INITIAL_LIVE_POSTS: LiveIncomingPost[] = [
  {
    id: 'live-1',
    title: 'The Art of a Calmer Morning in a Hyperconnected World',
    authorName: 'David K.',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    category: 'Lifestyle',
    readingTime: 6,
    slug: 'slow-living-in-a-fast-world',
    timeAgo: 'Just now',
    views: 142
  },
  {
    id: 'live-2',
    title: 'The Architecture of Resilient Cloud Infrastructure',
    authorName: 'Dr. Aris Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    category: 'Technology',
    readingTime: 9,
    slug: 'the-architecture-of-sustainable-systems',
    timeAgo: '42s ago',
    views: 318
  },
  {
    id: 'live-3',
    title: 'Cognitive Depth & Mindful Productivity Under Pressure',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'Productivity',
    readingTime: 7,
    slug: 'the-psychology-of-deep-work',
    timeAgo: '2m ago',
    views: 589
  },
  {
    id: 'live-4',
    title: 'Design Lessons from Living Systems: Biophilic Principles',
    authorName: 'Marcus Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    category: 'Design',
    readingTime: 5,
    slug: 'design-lessons-from-nature',
    timeAgo: '4m ago',
    views: 420
  }
];

export const EditorsPicks: React.FC<EditorsPicksProps> = ({
  articles,
  onSelectArticle,
  onBookmarkToggle,
  isBookmarked,
}) => {
  const [livePosts, setLivePosts] = useState<LiveIncomingPost[]>(INITIAL_LIVE_POSTS);

  // Periodic simulation of real-time dispatches
  useEffect(() => {
    const interval = setInterval(() => {
      const sampleTitles = [
        { title: 'Designing Resilient Distributed Cloud Systems', author: 'Maya Lin', category: 'Technology', slug: 'the-architecture-of-sustainable-systems' },
        { title: 'The Psychology of Essentialism in Modern Leadership', author: 'Sarah Jenkins', category: 'Business', slug: 'the-future-of-remote-work' },
        { title: 'Slow Living in a Fast World: Finding Stillness', author: 'David K.', category: 'Lifestyle', slug: 'slow-living-in-a-fast-world' },
      ];
      const randomSample = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
      const newPost: LiveIncomingPost = {
        id: `incoming-${Date.now()}`,
        title: randomSample.title,
        authorName: randomSample.author,
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        category: randomSample.category,
        readingTime: 5,
        slug: randomSample.slug,
        timeAgo: 'Just now',
        views: Math.floor(Math.random() * 25) + 120
      };

      setLivePosts(prev => [newPost, ...prev.slice(0, 3)]);
    }, 24000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-transparent rounded-2xl">
      {/* Clean Editorial Title */}
      <div className="flex items-center justify-between mb-4 border-b border-[#EAE4D9] dark:border-[#262C3A] pb-3">
        <h3 className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5]">
          Trending Now
        </h3>
      </div>

      {/* Live Stories List */}
      <div className="space-y-3">
        {livePosts.map((post) => (
          <Link
            key={post.id}
            to={`/article/${post.slug}`}
            className="block p-3.5 rounded-2xl bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] hover:border-[#141416] dark:hover:border-zinc-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer group no-underline text-inherit"
          >
            {/* Author Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center space-x-2 min-w-0">
                <img 
                  src={post.authorAvatar} 
                  alt={post.authorName} 
                  className="w-4 h-4 rounded-full object-cover shrink-0 aspect-square ring-1 ring-zinc-200 dark:ring-zinc-700"
                />
                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                  {post.authorName}
                </span>
              </div>
              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 shrink-0 whitespace-nowrap">
                {post.timeAgo}
              </span>
            </div>

            {/* Title */}
            <h4 className="font-editorial text-xs sm:text-sm font-bold text-[#141416] dark:text-white group-hover:text-[#2E4A3E] dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-2">
              {post.title}
            </h4>

            {/* Metadata Footer */}
            <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
              <span className="font-bold text-[#9E5A38] dark:text-[#E05A30]">
                #{post.category}
              </span>
              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>{post.readingTime} min</span>
                </span>
                <span>&bull;</span>
                <span>{post.views} readers</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
