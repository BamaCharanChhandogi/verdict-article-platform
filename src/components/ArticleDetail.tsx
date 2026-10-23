import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Heart, 
  Share2, 
  Check, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Type, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  MoreHorizontal,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { Article, Comment } from '../types';
import { ReadingProgress } from './ReadingProgress';
import { CommentsSection } from './CommentsSection';
import { fetchCommentsForArticle, createRealComment, deleteRealComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isAuthorFollowed, toggleAuthorFollow } from '../utils/follows';

interface ArticleDetailProps {
  article?: Article | null;
  onBack?: () => void;
  onBookmarkToggle: (article: Article) => void;
  isBookmarked: (id: string | number) => boolean;
  onSelectRelated?: (article: Article) => void;
  allArticles: Article[];
  onOpenAuth?: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article: propArticle,
  onBack,
  onBookmarkToggle,
  isBookmarked,
  onSelectRelated,
  allArticles,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, token } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Find active article from route slug or fallback to prop
  const article = propArticle || 
    allArticles.find(a => a.slug === slug || String(a.id) === slug) || 
    allArticles[0];

  const [likes, setLikes] = useState(article?.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFollowing, setIsFollowing] = useState(() => isAuthorFollowed(article.author.name));
  const [comments, setComments] = useState<Comment[]>([]);

  const handleToggleFollow = () => {
    const next = toggleAuthorFollow(article.author.name);
    setIsFollowing(next);
  };
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Audio Speech Synthesis Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [audioSupported, setAudioSupported] = useState(true);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Reading Experience Preferences
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSerifFont, setIsSerifFont] = useState(false);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      setAudioSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  // Fetch comments via API 3
  useEffect(() => {
    let isMounted = true;
    setCommentsLoading(true);
    fetchCommentsForArticle(article.id).then((res) => {
      if (isMounted) {
        setComments(res);
        setCommentsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [article.id]);

  // Audio Player Handlers (Interactive Web Speech API)
  const startAudioNarration = (rate: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Prepare clean narrative text stripping markdown and HTML tags
    const cleanContent = article.content
      ? article.content.replace(/<[^>]*>/g, ' ').replace(/[#*`_>]/g, ' ').replace(/\s+/g, ' ').trim()
      : article.description;
    const cleanText = `${article.title}. By ${article.author.name}. ${article.description}. ${cleanContent}`;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      setIsPlayingAudio(false);
      speechUtteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      speechUtteranceRef.current = null;
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      speechUtteranceRef.current = null;
    } else {
      startAudioNarration(speechRate);
    }
  };

  const handleChangeRate = (newRate: number) => {
    setSpeechRate(newRate);
    if (isPlayingAudio) {
      startAudioNarration(newRate);
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikes(prev => Math.max(0, prev - 1));
      setHasLiked(false);
    }
  };

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    onBookmarkToggle(article);
  };

  const handleScrollToComments = () => {
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = () => {
    const canonicalUrl = `${window.location.origin}/article/${article.slug}`;
    navigator.clipboard.writeText(canonicalUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleAddComment = async (text: string) => {
    if (!isAuthenticated || !user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    const created = await createRealComment(
      article.id,
      text,
      {
        id: user.id || 'usr_reader',
        name: user.name || 'Reader',
        avatar: user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: user.role || 'Member'
      },
      token
    );
    setComments(prev => [created, ...prev.filter(c => c.id !== created.id)]);
  };

  const handleDeleteComment = async (commentId: string | number) => {
    await deleteRealComment(article.id, commentId, token);
    setComments(prev => prev.filter(c => String(c.id) !== String(commentId)));
  };

  const related = allArticles
    .filter(a => a.id !== article.id && (a.category === article.category || a.isEditorPick))
    .slice(0, 3);

  // Dynamic Content Parser supporting Markdown and HTML formats
  const parseContent = (raw: string) => {
    if (!raw) return [];
    if (/<[a-z][\s\S]*>/i.test(raw)) {
      const cleaned = raw
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/h[1-6]>/gi, '\n\n')
        .replace(/<\/blockquote>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n');
      return cleaned
        .split('\n\n')
        .map(p => p.replace(/<[^>]+>/g, '').trim())
        .filter(p => p.length > 0);
    }
    return raw
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  };

  const paragraphs = parseContent(article.content);

  // Executive Takeaway points synthesized for editorial value
  const keyTakeaways = [
    article.description || 'Systemic breakthroughs require intentional constraint over raw velocity.',
    `Core discipline in ${article.category} demands human discernment rather than following algorithmic trends.`,
    `Curated by ${article.author.name} for modern practitioners and intellectual leaders.`
  ];

  return (
    <article className="min-h-screen pb-20 relative">
      {/* Scroll Reading Progress Bar at the top */}
      <ReadingProgress />

      {/* LEFT FROSTED GLASS CAPSULE: HOME & SOCIAL INTERACTIONS */}
      <aside 
        className="fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center frosted-glass-dock py-5 px-2.5 rounded-full space-y-4 w-16"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Home / Return to Feed */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={() => navigate(isAuthenticated ? '/feed' : '/')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-white/10 border border-zinc-300/80 dark:border-zinc-700/80 transition-all cursor-pointer"
            aria-label="Return to Home Feed"
          >
            <Home className="w-4.5 h-4.5 stroke-[1.8]" />
          </button>
          <div className="absolute left-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {isAuthenticated ? 'Back to Feed' : 'Back to Home'}
          </div>
        </div>

        {/* Divider */}
        <div className="w-6 h-px bg-zinc-300/60 dark:bg-zinc-700/60 my-0.5"></div>

        {/* Like */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center group cursor-pointer"
          title="Heart / React to Story"
        >
          <Heart className={`w-5 h-5 stroke-[1.8] transition-transform group-hover:scale-115 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-800 dark:text-zinc-100'}`} />
          <span className="text-[11px] font-bold mt-1 text-zinc-800 dark:text-zinc-100">{likes}</span>
        </button>

        {/* Comment */}
        <button
          onClick={handleScrollToComments}
          className="flex flex-col items-center group cursor-pointer"
          title="Jump to Discussion"
        >
          <MessageSquare className="w-5 h-5 stroke-[1.8] text-zinc-800 dark:text-zinc-100 transition-transform group-hover:scale-115" />
          <span className="text-[11px] font-bold mt-1 text-zinc-800 dark:text-zinc-100">{comments.length}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmarkClick}
          className="flex flex-col items-center group cursor-pointer"
          title={isBookmarked(article.id) ? "Remove from Reading List" : "Save to Reading List"}
        >
          <Bookmark className={`w-5 h-5 stroke-[1.8] transition-transform group-hover:scale-115 ${isBookmarked(article.id) ? 'fill-current text-[#9E5A38] dark:text-[#E05A30]' : 'text-zinc-800 dark:text-zinc-100'}`} />
          <span className="text-[11px] font-bold mt-1 text-zinc-800 dark:text-zinc-100">{isBookmarked(article.id) ? 1 : 0}</span>
        </button>

        {/* Share */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-800 dark:text-zinc-100 hover:bg-white/40 dark:hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Share Story"
          >
            {copiedShare ? <Check className="w-5 h-5 text-emerald-600 stroke-[2.2]" /> : <Share2 className="w-5 h-5 stroke-[1.8] group-hover:scale-115 transition-transform" />}
          </button>
          <div className="absolute left-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {copiedShare ? 'Copied Link!' : 'Share Story'}
          </div>
        </div>
      </aside>

      {/* RIGHT FROSTED GLASS CAPSULE: AUDIO NARRATION & READING ENGINE (Matches Left Symmetrically) */}
      {audioSupported && (
        <aside 
          className="fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center frosted-glass-dock py-5 px-2.5 rounded-full space-y-4 w-16"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Audio Play / Pause */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={handleToggleAudio}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isPlayingAudio 
                  ? 'bg-[#2E4A3E] dark:bg-emerald-600 text-white animate-pulse' 
                  : 'bg-white dark:bg-white text-black hover:scale-105'
              }`}
              aria-label={isPlayingAudio ? "Pause Audio" : "Listen to Story"}
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
            <div className="absolute right-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {isPlayingAudio ? 'Pause Narration' : 'Listen to Story'}
            </div>
          </div>

          {/* Equalizer Visualizer when playing */}
          {isPlayingAudio && (
            <div className="flex items-end justify-center space-x-0.5 h-3">
              <span className="w-1 bg-emerald-500 rounded-full animate-bounce h-2"></span>
              <span className="w-1 bg-emerald-600 rounded-full animate-bounce h-3 delay-75"></span>
              <span className="w-1 bg-emerald-500 rounded-full animate-bounce h-1.5 delay-150"></span>
            </div>
          )}

          {/* Speed Toggle */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => handleChangeRate(speechRate === 1 ? 1.25 : speechRate === 1.25 ? 1.5 : speechRate === 1.5 ? 2 : 1)}
              className="px-2 py-0.5 rounded-full text-[11px] font-bold text-zinc-800 dark:text-zinc-100 bg-white/40 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Playback Speed"
            >
              {speechRate}x
            </button>
            <div className="absolute right-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Speed: {speechRate}x
            </div>
          </div>

          {/* Divider */}
          <div className="w-6 h-px bg-zinc-300/60 dark:bg-zinc-700/60 my-0.5"></div>

          {/* Font Size Toggle */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal')}
              className="w-10 h-10 rounded-full flex flex-col items-center justify-center text-zinc-800 dark:text-zinc-100 hover:bg-white/40 dark:hover:bg-white/10 transition-all cursor-pointer font-bold"
              aria-label="Font Size"
            >
              <span className={`transition-all font-bold ${fontSize === 'normal' ? 'text-xs' : fontSize === 'large' ? 'text-sm scale-110' : 'text-base scale-125'}`}>
                Aa
              </span>
              <span className="text-[8px] font-sans text-zinc-400 dark:text-zinc-500 uppercase -mt-0.5 tracking-tighter">
                {fontSize === 'normal' ? '1x' : fontSize === 'large' ? '1.2x' : '1.5x'}
              </span>
            </button>
            <div className="absolute right-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Font Size: {fontSize === 'normal' ? 'Standard (18px)' : fontSize === 'large' ? 'Large (22px)' : 'Extra Large (26px)'}
            </div>
          </div>

          {/* Serif / Sans Toggle */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => setIsSerifFont(prev => !prev)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                isSerifFont 
                  ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416] border-[#141416] dark:border-white shadow-xs font-serif' 
                  : 'bg-white/50 dark:bg-zinc-800/50 text-[#9E5A38] dark:text-[#E05A30] border-zinc-300 dark:border-zinc-700 font-sans'
              }`}
              aria-label="Toggle Font Style"
            >
              {isSerifFont ? 'Serif' : 'Sans'}
            </button>
            <div className="absolute right-14 bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Font: {isSerifFont ? 'Editorial Serif (Cormorant Garamond)' : 'Clean Sans (Manrope)'}
            </div>
          </div>
        </aside>
      )}

      {/* DEV.TO STYLE MOBILE BOTTOM FLOATING ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#0E1116]/95 backdrop-blur-md border-t border-[#EAE4D9] dark:border-[#262C3A] px-6 py-2.5 flex items-center justify-around shadow-lg">
        <button onClick={() => navigate(isAuthenticated ? '/feed' : '/')} className="p-2 text-zinc-600 dark:text-zinc-300 cursor-pointer">
          <Home className="w-4 h-4" />
        </button>
        <button onClick={handleLike} className="flex items-center space-x-1.5 text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer">
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-rose-500' : ''}`} />
          <span className="font-bold">{likes}</span>
        </button>
        <button onClick={handleScrollToComments} className="flex items-center space-x-1.5 text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer">
          <MessageSquare className="w-4 h-4" />
          <span className="font-bold">{comments.length}</span>
        </button>
        <button onClick={handleBookmarkClick} className="p-2 text-zinc-600 dark:text-zinc-300 cursor-pointer">
          <Bookmark className={`w-4 h-4 ${isBookmarked(article.id) ? 'fill-current text-[#9E5A38]' : ''}`} />
        </button>
        <button onClick={handleShare} className="p-2 text-zinc-600 dark:text-zinc-300 cursor-pointer">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Top Navigation Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#EAE4D9] dark:border-[#262C3A]">
        <button
          onClick={() => {
            if (onBack) onBack();
            navigate(isAuthenticated ? '/feed' : '/');
          }}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-[#FAF7F2] dark:hover:bg-[#1F2430] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isAuthenticated ? 'Back to Feed' : 'Back to Stories'}</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#2E4A3E] dark:text-emerald-400 bg-[#EBF1EE] dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
            {article.category}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {article.readingTime} min read
          </span>
        </div>
      </div>

      {/* Article Header & Typography */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center sm:text-left">
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-[#141416] dark:text-white leading-[1.12] tracking-tight mb-5">
          {article.title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
          {article.description}
        </p>

        {/* Author Metadata Bar */}
        <div className="flex items-center justify-between py-4 border-y border-[#EAE4D9] dark:border-[#262C3A]">
          {/* Author Info */}
          <div className="flex items-center space-x-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-sans text-sm font-bold text-[#141416] dark:text-white">
                  {article.author.name}
                </h3>
                <button
                  onClick={handleToggleFollow}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    isFollowing
                      ? 'bg-[#2E4A3E] dark:bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-[#1F2430] hover:bg-zinc-200 dark:hover:bg-[#262C3A] text-zinc-700 dark:text-zinc-200'
                  }`}
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Published {article.publishedAt} &bull; {article.readingTime} min read
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="rounded-[28px] overflow-hidden shadow-xl aspect-16/9 bg-zinc-200 dark:bg-zinc-800">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Editorial Content Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Executive AI TL;DR Takeaways Card */}
        <div className="bg-white dark:bg-[#171B22] rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] p-5 sm:p-6 mb-8 shadow-xs">
          <div 
            onClick={() => setShowExecutiveSummary(!showExecutiveSummary)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#2E4A3E] dark:text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Executive Brief &amp; Key Takeaways</span>
            </div>
            {showExecutiveSummary ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </div>

          {showExecutiveSummary && (
            <div className="mt-4 pt-4 border-t border-[#FAF7F2] dark:border-[#262C3A] space-y-2.5">
              {keyTakeaways.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E5A38] dark:bg-[#E05A30] mt-2 shrink-0"></span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Content Typography Engine */}
        <div 
          className="max-w-none text-zinc-800 dark:text-zinc-200 space-y-6 transition-all duration-200"
          style={{
            fontSize: fontSize === 'normal' ? '1.125rem' : fontSize === 'large' ? '1.35rem' : '1.65rem',
            lineHeight: fontSize === 'normal' ? '1.8' : fontSize === 'large' ? '1.85' : '1.9',
            fontFamily: isSerifFont ? '"Cormorant Garamond", Georgia, serif' : '"Manrope", system-ui, -apple-system, sans-serif',
          }}
        >
          {paragraphs.length > 0 ? (
            paragraphs.map((p, idx) => {
              if (p.startsWith('# ')) {
                return (
                  <h2 
                    key={idx} 
                    className="font-bold text-[#141416] dark:text-white pt-4 transition-all"
                    style={{ 
                      fontSize: fontSize === 'normal' ? '1.875rem' : fontSize === 'large' ? '2.25rem' : '2.65rem',
                      fontFamily: isSerifFont ? '"Cormorant Garamond", Georgia, serif' : 'inherit'
                    }}
                  >
                    {p.replace(/^#\s*/, '')}
                  </h2>
                );
              }
              if (p.startsWith('## ') || p.startsWith('### ')) {
                return (
                  <h3 
                    key={idx} 
                    className="font-bold text-[#141416] dark:text-white pt-3 transition-all"
                    style={{ 
                      fontSize: fontSize === 'normal' ? '1.5rem' : fontSize === 'large' ? '1.75rem' : '2.1rem',
                      fontFamily: isSerifFont ? '"Cormorant Garamond", Georgia, serif' : 'inherit'
                    }}
                  >
                    {p.replace(/^###?\s*/, '')}
                  </h3>
                );
              }
              if (p.startsWith('>')) {
                return (
                  <blockquote key={idx} className="my-8 py-4 px-6 border-y border-[#EAE4D9] dark:border-[#262C3A] text-center">
                    <p 
                      className="text-[#141416] dark:text-white italic font-normal leading-snug transition-all"
                      style={{ 
                        fontSize: fontSize === 'normal' ? '1.5rem' : fontSize === 'large' ? '1.75rem' : '2.1rem',
                        fontFamily: isSerifFont ? '"Cormorant Garamond", Georgia, serif' : 'inherit'
                      }}
                    >
                      "{p.replace(/^>\s*/, '')}"
                    </p>
                  </blockquote>
                );
              }
              return (
                <p 
                  key={idx}
                  className={`leading-relaxed transition-all ${idx === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#141416] dark:first-letter:text-white" : ""}`}
                  style={{
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    lineHeight: 'inherit',
                  }}
                >
                  {p}
                </p>
              );
            })
          ) : (
            <p 
              className="leading-relaxed transition-all"
              style={{ fontSize: 'inherit', fontFamily: 'inherit', lineHeight: 'inherit' }}
            >
              {article.description}
            </p>
          )}
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#EAE4D9] dark:border-[#262C3A]">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] px-3 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Card */}
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div>
                <h4 className="font-editorial text-xl font-bold text-[#141416] dark:text-white">
                  {article.author.name}
                </h4>
                <p className="text-xs text-[#9E5A38] dark:text-[#E05A30] font-semibold">
                  {article.author.role}
                </p>
              </div>
              <button
                onClick={handleToggleFollow}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer self-center sm:self-auto ${
                  isFollowing
                    ? 'bg-[#2E4A3E] dark:bg-emerald-600 text-white'
                    : 'bg-[#FAF7F2] dark:bg-[#1F2430] hover:bg-zinc-200 dark:hover:bg-[#262C3A] text-[#141416] dark:text-white border border-[#EAE4D9] dark:border-[#262C3A]'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Author'}
              </button>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
              {article.author.bio}
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-4 mt-3 text-xs text-zinc-400 dark:text-zinc-500">
              <span>{(article.author.followers + (isFollowing ? 1 : 0)).toLocaleString()} readers</span>
              <span>&bull;</span>
              <span>{article.author.articlesCount} published essays</span>
            </div>
          </div>
        </div>

        {/* First-Time Visitor Intent & Discovery Invitation Card */}
        <div className="mt-12 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE6] dark:from-[#171B22] dark:to-[#12151B] border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9E5A38] dark:text-[#E05A30]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Enjoying Verdict?' : 'First time on Verdict?'}</span>
            </div>
            <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#141416] dark:text-white">
              {isAuthenticated
                ? 'Share your perspective or explore new dispatches.'
                : 'A home for deep long-form essays, tech strategy & design.'}
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-lg">
              {isAuthenticated
                ? 'Write a new essay or bookmark pieces to your personal reading list.'
                : 'Explore our curated feed of in-depth writing or join 12,000+ intellectual readers.'}
            </p>
          </div>
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => navigate(isAuthenticated ? '/feed' : '/')}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-[#1F2430] border border-[#EAE4D9] dark:border-[#262C3A] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#262C3A] transition-colors cursor-pointer"
            >
              Explore Feed
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/write')}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#2E4A3E] dark:bg-emerald-600 hover:bg-[#233a30] dark:hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
              >
                Write Story
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#2E4A3E] dark:bg-emerald-600 hover:bg-[#233a30] dark:hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
              >
                Join Free
              </button>
            )}
          </div>
        </div>

        {/* Comments Section (API 3 Integration) */}
        <div id="comments-section" className="mt-12 pt-8 border-t border-[#EAE4D9] dark:border-[#262C3A]">
          <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onOpenAuth={onOpenAuth}
            isLoading={commentsLoading}
          />
        </div>

        {/* Related Articles Rail */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#EAE4D9] dark:border-[#262C3A]">
            <h3 className="font-editorial text-2xl font-bold text-[#141416] dark:text-white mb-6">
              More Perspectives in {article.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/article/${rel.slug}`}
                  onClick={() => onSelectRelated && onSelectRelated(rel)}
                  className="group cursor-pointer flex flex-col justify-between block no-underline text-inherit"
                >
                  <div className="rounded-xl overflow-hidden aspect-16/10 mb-3 bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E5A38] dark:text-[#E05A30]">
                      {rel.category}
                    </span>
                    <h4 className="font-editorial text-base font-bold text-[#141416] dark:text-white group-hover:text-[#2E4A3E] dark:group-hover:text-emerald-400 transition-colors mt-1 line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {rel.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
