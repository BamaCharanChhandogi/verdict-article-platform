import React, { useState, useEffect, useRef } from 'react';
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
  ChevronUp 
} from 'lucide-react';
import { Article, Comment } from '../types';
import { ReadingProgress } from './ReadingProgress';
import { CommentsSection } from './CommentsSection';
import { fetchCommentsForArticle } from '../services/api';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onBookmarkToggle: (article: Article) => void;
  isBookmarked: boolean;
  onSelectRelated: (article: Article) => void;
  allArticles: Article[];
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  onBookmarkToggle,
  isBookmarked,
  onSelectRelated,
  allArticles,
}) => {
  const [likes, setLikes] = useState(article.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

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
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      // Prepare clean narrative text
      const cleanText = `${article.title}. By ${article.author.name}. ${article.description}. ${article.content.replace(/[#*`_>]/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleChangeRate = (newRate: number) => {
    setSpeechRate(newRate);
    if (isPlayingAudio && speechUtteranceRef.current) {
      window.speechSynthesis.cancel();
      speechUtteranceRef.current.rate = newRate;
      window.speechSynthesis.speak(speechUtteranceRef.current);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: `local-c-${Date.now()}`,
      articleId: article.id,
      user: {
        id: 'current-user',
        name: 'You (Editorial Fellow)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      },
      body: text,
      likes: 1,
      createdAt: 'Just now',
    };
    setComments(prev => [newComment, ...prev]);
  };

  const related = allArticles
    .filter(a => a.id !== article.id && (a.category === article.category || a.isEditorPick))
    .slice(0, 3);

  // Dynamic Content Parser
  const parseContent = (raw: string) => {
    if (!raw) return [];
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
    <article className="min-h-screen pb-20">
      {/* Scroll Reading Progress Bar at the top */}
      <ReadingProgress />

      {/* Top Navigation & Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#EAE4D9]">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-600 hover:text-black transition-colors py-1.5 px-3 rounded-full hover:bg-[#FAF7F2] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stories</span>
        </button>

        {/* Reading Controls Toolbar (Font Size & Typography) */}
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-1 bg-white border border-[#EAE4D9] rounded-full px-2 py-1 text-xs">
            <button
              onClick={() => setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal')}
              className="px-2 py-0.5 text-zinc-600 hover:text-black font-semibold cursor-pointer"
              title="Toggle font size"
            >
              <span className={fontSize === 'normal' ? 'text-xs' : fontSize === 'large' ? 'text-sm font-bold' : 'text-base font-black'}>
                Aa
              </span>
            </button>
            <span className="text-zinc-300">|</span>
            <button
              onClick={() => setIsSerifFont(!isSerifFont)}
              className={`px-2 py-0.5 rounded-full font-medium cursor-pointer ${isSerifFont ? 'text-[#9E5A38] font-bold' : 'text-zinc-500'}`}
              title="Toggle Serif/Sans font"
            >
              {isSerifFont ? 'Serif' : 'Sans'}
            </button>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-[#2E4A3E] bg-[#EBF1EE] px-2.5 py-1 rounded-full">
            {article.category}
          </span>
          <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
            {article.readingTime} min read
          </span>
        </div>
      </div>

      {/* Sticky Audio Narration Bar */}
      {audioSupported && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-white rounded-2xl border border-[#EAE4D9] p-3 sm:px-5 sm:py-3.5 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <button
                onClick={handleToggleAudio}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isPlayingAudio 
                    ? 'bg-[#2E4A3E] text-white shadow-sm' 
                    : 'bg-[#FAF7F2] hover:bg-zinc-200 text-[#141416]'
                }`}
                title={isPlayingAudio ? "Pause Audio" : "Listen to this article"}
              >
                {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#141416]">
                    {isPlayingAudio ? 'Listening to Article...' : 'Listen to this Article'}
                  </span>
                  {isPlayingAudio && (
                    <span className="flex items-end space-x-0.5 h-3">
                      <span className="w-1 bg-emerald-500 rounded-full animate-bounce h-2"></span>
                      <span className="w-1 bg-emerald-600 rounded-full animate-bounce h-3 delay-75"></span>
                      <span className="w-1 bg-emerald-500 rounded-full animate-bounce h-1.5 delay-150"></span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 truncate">
                  AI Narration &bull; ~{article.readingTime} mins total
                </p>
              </div>
            </div>

            {/* Audio Speed Controls */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {[1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleChangeRate(rate)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    speechRate === rate 
                      ? 'bg-[#141416] text-white' 
                      : 'bg-[#FAF7F2] text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article Header & Typography */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center sm:text-left">
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-[#141416] leading-[1.12] tracking-tight mb-5">
          {article.title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed mb-6">
          {article.description}
        </p>

        {/* Author Metadata Bar + Social Engagement Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-y border-[#EAE4D9] gap-4">
          {/* Author Info */}
          <div className="flex items-center space-x-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-200"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-sans text-sm font-bold text-[#141416]">
                  {article.author.name}
                </h3>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    isFollowing
                      ? 'bg-[#2E4A3E] text-white'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {isFollowing ? 'Following' : '+ Follow'}
                </button>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Published {article.publishedAt} &bull; {article.readingTime} min read
              </p>
            </div>
          </div>

          {/* Action Pills (Like, Bookmark, Share) */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={handleLike}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                hasLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-[#EAE4D9]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-rose-600' : ''}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => onBookmarkToggle(article)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-[#F7EFE9] border-[#9E5A38] text-[#9E5A38]'
                  : 'bg-white hover:bg-zinc-100 border-[#EAE4D9] text-zinc-700'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-zinc-100 text-zinc-700 border border-[#EAE4D9] transition-colors cursor-pointer"
              title="Share article link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="rounded-[28px] overflow-hidden shadow-xl aspect-16/9 bg-zinc-200">
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
        <div className="bg-white rounded-2xl border border-[#EAE4D9] p-5 sm:p-6 mb-8 shadow-xs">
          <div 
            onClick={() => setShowExecutiveSummary(!showExecutiveSummary)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#2E4A3E]">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Executive Brief &amp; Key Takeaways</span>
            </div>
            {showExecutiveSummary ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </div>

          {showExecutiveSummary && (
            <div className="mt-4 pt-4 border-t border-[#FAF7F2] space-y-2.5">
              {keyTakeaways.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-zinc-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E5A38] mt-2 shrink-0"></span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Content Typography Engine */}
        <div className={`prose prose-zinc max-w-none text-zinc-800 leading-[1.8] space-y-6 ${
          fontSize === 'large' ? 'text-lg sm:text-xl' : fontSize === 'xlarge' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
        } ${isSerifFont ? 'font-editorial' : 'font-sans'}`}>
          {paragraphs.length > 0 ? (
            paragraphs.map((p, idx) => {
              if (p.startsWith('# ')) {
                return (
                  <h2 key={idx} className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] pt-4">
                    {p.replace(/^#\s*/, '')}
                  </h2>
                );
              }
              if (p.startsWith('## ') || p.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-editorial text-xl sm:text-2xl font-bold text-[#141416] pt-3">
                    {p.replace(/^###?\s*/, '')}
                  </h3>
                );
              }
              if (p.startsWith('>')) {
                return (
                  <blockquote key={idx} className="my-8 py-4 px-6 border-y border-[#EAE4D9] text-center">
                    <p className="font-editorial text-xl sm:text-2xl text-[#141416] italic font-normal leading-snug">
                      "{p.replace(/^>\s*/, '')}"
                    </p>
                  </blockquote>
                );
              }
              return (
                <p 
                  key={idx}
                  className={idx === 0 ? "first-letter:font-editorial first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#141416] leading-relaxed" : "leading-relaxed"}
                >
                  {p}
                </p>
              );
            })
          ) : (
            <p className="leading-relaxed">
              {article.description}
            </p>
          )}
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#EAE4D9]">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold text-zinc-600 bg-white border border-[#EAE4D9] px-3 py-1 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Card */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[#EAE4D9] shadow-xs flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-zinc-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div>
                <h4 className="font-editorial text-xl font-bold text-[#141416]">
                  {article.author.name}
                </h4>
                <p className="text-xs text-[#9E5A38] font-semibold">
                  {article.author.role}
                </p>
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer self-center sm:self-auto ${
                  isFollowing
                    ? 'bg-[#2E4A3E] text-white'
                    : 'bg-[#FAF7F2] hover:bg-zinc-200 text-[#141416] border border-[#EAE4D9]'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Author'}
              </button>
            </div>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              {article.author.bio}
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-4 mt-3 text-xs text-zinc-400">
              <span>{article.author.followers.toLocaleString()} readers</span>
              <span>&bull;</span>
              <span>{article.author.articlesCount} published essays</span>
            </div>
          </div>
        </div>

        {/* Comments Section (API 3 Integration) */}
        <div className="mt-12 pt-8 border-t border-[#EAE4D9]">
          <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            isLoading={commentsLoading}
          />
        </div>

        {/* Related Articles Rail */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#EAE4D9]">
            <h3 className="font-editorial text-2xl font-bold text-[#141416] mb-6">
              More Perspectives in {article.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div className="rounded-xl overflow-hidden aspect-16/10 mb-3 bg-zinc-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E5A38]">
                      {rel.category}
                    </span>
                    <h4 className="font-editorial text-base font-bold text-[#141416] group-hover:text-[#2E4A3E] transition-colors mt-1 line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {rel.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
