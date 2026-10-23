import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Radio, 
  Zap, 
  X, 
  Layers, 
  Cpu, 
  Globe, 
  Database, 
  Server, 
  Activity, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
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
    slug: 'the-art-of-a-calmer-morning',
    timeAgo: 'Just now',
    views: 142
  },
  {
    id: 'live-2',
    title: 'Distributed Consensus & Raft Protocol in Cloud Systems',
    authorName: 'Dr. Aris Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    category: 'Technology',
    readingTime: 9,
    slug: 'the-architecture-of-resilient-systems',
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
    slug: 'the-neuroscience-of-uninterrupted-focus',
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
  onSeeAllClick,
}) => {
  const [activeTab, setActiveTab] = useState<'picks' | 'live'>('picks');
  const [currentPage, setCurrentPage] = useState(0);
  const [showSystemDesignModal, setShowSystemDesignModal] = useState(false);
  const [livePosts, setLivePosts] = useState<LiveIncomingPost[]>(INITIAL_LIVE_POSTS);
  const [incomingAlert, setIncomingAlert] = useState<string | null>(null);

  const pageSize = 4;
  const picks = articles.filter(a => a.isEditorPick);
  const displayPicks = picks.length > 0 ? picks : articles.slice(0, 8);
  const totalPages = Math.ceil(displayPicks.length / pageSize);
  const currentPicks = displayPicks.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Periodic simulation of real-time incoming dispatches
  useEffect(() => {
    const interval = setInterval(() => {
      const sampleTitles = [
        { title: 'Designing Zero-Downtime PostgreSQL Schema Migrations', author: 'Maya Lin', category: 'Technology', slug: 'designing-zero-downtime-migrations' },
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
        views: Math.floor(Math.random() * 20) + 1
      };

      setLivePosts(prev => [newPost, ...prev.slice(0, 4)]);
      setIncomingAlert(newPost.title);
      setTimeout(() => setIncomingAlert(null), 4000);
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="bg-transparent rounded-2xl">
      {/* Header Tabs: Editor's Picks vs Live Wire */}
      <div className="flex items-center justify-between mb-3 border-b border-[#EAE4D9] dark:border-[#262C3A] pb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('picks')}
            className={`font-editorial text-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'picks'
                ? 'text-[#141416] dark:text-[#F1F3F5] border-b-2 border-[#141416] dark:border-white pb-1 -mb-3'
                : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Editor's Picks
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`font-editorial text-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'live'
                ? 'text-[#141416] dark:text-[#F1F3F5] border-b-2 border-emerald-600 dark:border-emerald-400 pb-1 -mb-3'
                : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Wire</span>
          </button>
        </div>

        {/* System Design Scale Trigger */}
        <button
          onClick={() => setShowSystemDesignModal(true)}
          className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
          title="View System Design & Scaling Architecture"
        >
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>Scale</span>
        </button>
      </div>

      {/* Real-time Incoming Post Notification Pill */}
      {incomingAlert && (
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 shrink-0">New Story:</span>
            <span className="font-editorial font-medium truncate text-xs">{incomingAlert}</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 shrink-0 ml-2">Just now</span>
        </div>
      )}

      {/* TAB 1: CURATED EDITOR'S PICKS */}
      {activeTab === 'picks' && (
        <>
          <div className="space-y-4">
            {currentPicks.map((article, index) => {
              const globalIndex = currentPage * pageSize + index + 1;
              const rankStr = globalIndex < 10 ? `0${globalIndex}` : `${globalIndex}`;
              const bookmarked = isBookmarked(article.id);

              return (
                <Link
                  key={article.id}
                  to={`/article/${article.slug}`}
                  onClick={() => onSelectArticle && onSelectArticle(article)}
                  className="group flex items-center space-x-3 p-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#1A1F29] transition-colors cursor-pointer block no-underline text-inherit"
                >
                  {/* Number Rank */}
                  <span className="font-sans text-xs font-bold text-zinc-400 group-hover:text-[#141416] dark:group-hover:text-white transition-colors w-5 shrink-0">
                    {rankStr}
                  </span>

                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>

                  {/* Title & Reading Time */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="font-editorial text-xs font-bold text-[#141416] dark:text-[#F1F3F5] leading-snug group-hover:text-[#2E4A3E] dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                      <span>{article.readingTime} min read</span>
                      <span>&bull;</span>
                      <span>{article.category}</span>
                    </div>
                  </div>

                  {/* Bookmark Action */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onBookmarkToggle(article);
                    }}
                    className={`p-1.5 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer ${
                      bookmarked ? 'text-[#9E5A38] dark:text-[#D98A62]' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                    title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 mt-4 pt-3 border-t border-[#EAE4D9] dark:border-[#222733]">
              <button
                onClick={onSeeAllClick}
                className="text-xs font-semibold text-zinc-500 hover:text-[#141416] dark:hover:text-white transition-colors cursor-pointer"
              >
                See All
              </button>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handlePrev}
                  className="w-7 h-7 rounded-full border border-[#EAE4D9] dark:border-[#262C3A] flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-[#141416] dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-7 h-7 rounded-full border border-[#EAE4D9] dark:border-[#262C3A] flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-[#141416] dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: LIVE WIRE INCOMING POSTS STREAM */}
      {activeTab === 'live' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 px-1">
            <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Real-Time Ingestion</span>
            </span>
            <span>Auto-refresh &bull; 42ms latency</span>
          </div>

          <div className="space-y-2.5">
            {livePosts.map((post) => (
              <Link
                key={post.id}
                to={`/article/${post.slug}`}
                className="block p-3 rounded-xl bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] hover:border-emerald-500 dark:hover:border-emerald-500/60 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      className="w-4 h-4 rounded-full object-cover ring-1 ring-zinc-300"
                    />
                    <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      {post.authorName}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {post.timeAgo}
                  </span>
                </div>

                <h5 className="font-editorial text-xs font-bold text-[#141416] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h5>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-2">
                  <span className="font-semibold text-[#9E5A38] dark:text-[#E05A30]">
                    #{post.category}
                  </span>
                  <span>{post.views} readers right now</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM DESIGN & SCALING ARCHITECTURE MODAL */}
      {showSystemDesignModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            onClick={() => setShowSystemDesignModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EAE4D9] dark:border-[#262C3A] pb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>Enterprise System Design</span>
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#141416] dark:text-white">
                  Scaling Real-Time Post Ingestion
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Architectural blueprint to ingest and distribute 25,000+ posts/sec to 500,000+ concurrent readers with &lt;50ms latency.
                </p>
              </div>

              <button
                onClick={() => setShowSystemDesignModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] border border-[#EAE4D9] dark:border-[#262C3A]">
                <Globe className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
                <h6 className="font-bold text-xs text-[#141416] dark:text-white">1. Edge Ingestion</h6>
                <p className="text-[10px] text-zinc-500 mt-1 leading-snug">
                  Cloudflare Anycast Workers validate JWT auth &amp; rate limits.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] border border-[#EAE4D9] dark:border-[#262C3A]">
                <Activity className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                <h6 className="font-bold text-xs text-[#141416] dark:text-white">2. Event Queue</h6>
                <p className="text-[10px] text-zinc-500 mt-1 leading-snug">
                  Apache Kafka partitioned topics guarantee ordering.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] border border-[#EAE4D9] dark:border-[#262C3A]">
                <Server className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                <h6 className="font-bold text-xs text-[#141416] dark:text-white">3. Redis Pub/Sub</h6>
                <p className="text-[10px] text-zinc-500 mt-1 leading-snug">
                  Redis Streams fanout to distributed WebSocket gateways.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] border border-[#EAE4D9] dark:border-[#262C3A]">
                <Database className="w-5 h-5 text-cyan-500 mx-auto mb-1.5" />
                <h6 className="font-bold text-xs text-[#141416] dark:text-white">4. Neon WAL CDC</h6>
                <p className="text-[10px] text-zinc-500 mt-1 leading-snug">
                  Debezium streams commit logs to Elasticsearch &amp; S3 archive.
                </p>
              </div>
            </div>

            {/* Key Scalability Principles */}
            <div className="space-y-3 bg-[#FAF7F2] dark:bg-[#1F2430] p-4 rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] text-xs">
              <h5 className="font-bold text-xs text-[#141416] dark:text-white flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Production Scaling Benchmarks</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2 bg-white dark:bg-[#171B22] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                  <span className="block text-base font-bold text-emerald-600 font-editorial">&lt; 38ms</span>
                  <span className="text-[10px] text-zinc-400 font-medium">P99 Fanout Latency</span>
                </div>
                <div className="p-2 bg-white dark:bg-[#171B22] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                  <span className="block text-base font-bold text-[#141416] dark:text-white font-editorial">500,000+</span>
                  <span className="text-[10px] text-zinc-400 font-medium">Concurrent Readers</span>
                </div>
                <div className="p-2 bg-white dark:bg-[#171B22] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                  <span className="block text-base font-bold text-[#141416] dark:text-white font-editorial">99.99%</span>
                  <span className="text-[10px] text-zinc-400 font-medium">SLA Availability</span>
                </div>
                <div className="p-2 bg-white dark:bg-[#171B22] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A]">
                  <span className="block text-base font-bold text-[#141416] dark:text-white font-editorial">Zero</span>
                  <span className="text-[10px] text-zinc-400 font-medium">Data Loss (WAL CDC)</span>
                </div>
              </div>
            </div>

            {/* Close button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSystemDesignModal(false)}
                className="bg-[#141416] dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-[#141416] text-xs font-semibold px-6 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
              >
                Close Architecture View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
