import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Heart, 
  Share2, 
  Check,
  Sparkles
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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
        name: 'You (Curious Reader)',
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

        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#2E4A3E] bg-[#EBF1EE] px-2.5 py-1 rounded-full">
            {article.category}
          </span>
          <span className="text-zinc-300">&bull;</span>
          <span className="text-xs text-zinc-500 font-medium">
            {article.readingTime} min read
          </span>
        </div>
      </div>

      {/* Article Header & Typography */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8 text-center sm:text-left">
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-[#141416] leading-[1.12] tracking-tight mb-5">
          {article.title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed mb-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
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
        <div className="prose prose-zinc max-w-none text-zinc-800 font-sans text-base sm:text-lg leading-[1.8] space-y-6">
          {/* Key Insights Highlight Box */}
          <div className="bg-[#FAF7F2] border-l-4 border-[#2E4A3E] p-5 rounded-r-2xl mb-8">
            <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#2E4A3E] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Takeaway</span>
            </div>
            <p className="font-editorial text-base sm:text-lg text-[#141416] italic leading-snug">
              "{article.description}"
            </p>
          </div>

          {/* Formatted Paragraphs */}
          <p className="first-letter:font-editorial first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#141416] leading-relaxed">
            Every breakthrough begins with the courage to question consensus. In an age saturated by instant algorithmic validation, true depth emerges not from consuming more, but from thinking more rigorously about what is essential.
          </p>

          <p>
            When we examine the trajectory of technological and cultural movements, the inflection points are rarely characterized by sheer computational scale alone. Rather, they are defined by a shift in human perception—a renewed appreciation for intentional constraint, tactile craftsmanship, and systemic clarity.
          </p>

          {/* Editorial Pull Quote */}
          <blockquote className="my-8 py-4 px-6 border-y border-[#EAE4D9] text-center">
            <p className="font-editorial text-2xl sm:text-3xl text-[#141416] italic font-normal leading-snug">
              "True craftsmanship is not how much you can add, but the disciplined grace of knowing what to leave untouched."
            </p>
            <cite className="block text-xs font-sans not-italic text-zinc-400 uppercase tracking-widest mt-2">
              &mdash; {article.author.name}
            </cite>
          </blockquote>

          <h3 className="font-editorial text-2xl font-bold text-[#141416] pt-4">
            The Geometry of Intentional Focus
          </h3>

          <p>
            Cognitive overload is not an unavoidable byproduct of modern civilization; it is a design flaw in our information architecture. By deliberately structuring our creative sanctums, setting digital quarantines, and respecting the natural rhythms of biological attention, we reclaim sovereignty over our time and imagination.
          </p>

          <p>
            As {article.author.name} observes, the tools we build inevitably shape the thoughts we can entertain. When our systems prioritize depth over velocity, the work we produce leaves an indelible mark.
          </p>
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#EAE4D9]">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold text-zinc-600 bg-[#FAF7F2] border border-[#EAE4D9] px-3 py-1 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
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
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-sans text-base font-bold text-[#141416]">
                  Written by {article.author.name}
                </h4>
                <p className="text-xs text-[#2E4A3E] font-semibold">
                  {article.author.role}
                </p>
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className="bg-[#141416] hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer self-center sm:self-auto"
              >
                {isFollowing ? 'Following' : 'Follow Author'}
              </button>
            </div>
            <p className="text-xs text-zinc-600 mt-2.5 leading-relaxed">
              {article.author.bio}
            </p>
            <div className="flex items-center space-x-4 text-xs text-zinc-400 mt-3 justify-center sm:justify-start">
              <span>{article.author.followers.toLocaleString()} readers</span>
              <span>&bull;</span>
              <span>{article.author.articlesCount} published essays</span>
              {article.author.twitter && (
                <>
                  <span>&bull;</span>
                  <span className="text-[#2E4A3E] font-medium">{article.author.twitter}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section (API 3) */}
        <CommentsSection
          comments={comments}
          onAddComment={handleAddComment}
          isLoading={commentsLoading}
        />
      </div>

      {/* Related Stories Grid at the Bottom */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 pt-12 border-t border-[#EAE4D9]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-editorial text-2xl font-bold text-[#141416]">
              More Stories You Might Value
            </h3>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors"
            >
              Explore All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectRelated(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#EAE4D9] hover:border-zinc-300 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 overflow-hidden bg-zinc-100">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">
                      {item.category}
                    </span>
                    <h4 className="font-sans text-sm font-bold text-[#141416] group-hover:text-[#9E5A38] transition-colors line-clamp-2 mt-1 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </div>
                <div className="px-4 pb-4 text-[11px] text-zinc-400">
                  {item.readingTime} min read &bull; {item.author.name}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
