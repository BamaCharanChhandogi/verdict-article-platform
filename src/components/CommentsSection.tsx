import React, { useState, useRef } from 'react';
import { MessageSquare, ThumbsUp, Send, LogIn, Lock, Trash2, Check, AlertCircle } from 'lucide-react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { upvoteRealComment } from '../services/api';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => Promise<void> | void;
  onDeleteComment?: (id: string | number) => Promise<void> | void;
  onOpenAuth?: () => void;
  isLoading?: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
  onDeleteComment,
  onOpenAuth,
  isLoading = false,
}) => {
  const { user, isAuthenticated, token } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('verdict_comment_likes_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [userLikedComments, setUserLikedComments] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('verdict_liked_comments');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!commentText.trim()) {
      setValidationError('Please share your perspective or counter-argument before submitting.');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      await onAddComment(commentText.trim());
      setCommentText('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleLike = (id: string | number, currentLikes: number) => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const idStr = String(id);
    const isAlreadyLiked = userLikedComments.has(idStr);

    const newLikes = isAlreadyLiked
      ? Math.max(0, (commentLikes[idStr] ?? currentLikes) - 1)
      : (commentLikes[idStr] ?? currentLikes) + 1;

    setCommentLikes(prev => {
      const next = { ...prev, [idStr]: newLikes };
      try {
        localStorage.setItem('verdict_comment_likes_counts', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    setUserLikedComments(prev => {
      const next = new Set(prev);
      if (isAlreadyLiked) {
        next.delete(idStr);
      } else {
        next.add(idStr);
      }
      try {
        localStorage.setItem('verdict_liked_comments', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });

    if (!isAlreadyLiked) {
      upvoteRealComment(id, token);
    }
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2.5">
          <MessageSquare className="w-5 h-5 text-[#2E4A3E] dark:text-emerald-400" />
          <h3 className="font-editorial text-2xl font-bold text-[#141416] dark:text-white">
            Discussion & Perspectives ({comments.length})
          </h3>
        </div>
        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-[#1F2430] px-3 py-1 rounded-full">
          Live Community Stream
        </span>
      </div>

      {/* Guest vs Authenticated Commenting Box */}
      {!isAuthenticated ? (
        <div className="mb-10 bg-white dark:bg-[#171B22] p-6 sm:p-8 rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F2430] text-[#2E4A3E] dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-[#EAE4D9] dark:border-[#262C3A]">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="font-editorial text-xl font-bold text-[#141416] dark:text-white mb-1.5">
            Join the Discussion
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-5 leading-relaxed">
            Sign in to share your perspectives, debate ideas with our authors, and leave your mark on the community.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center space-x-2 bg-[#141416] dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-[#141416] text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Comment</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-10 bg-white dark:bg-[#171B22] p-4 sm:p-5 rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs">
          <div className="flex items-start space-x-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name || 'User avatar'}
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#EAE4D9] dark:ring-[#262C3A]"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#141416] dark:text-white">
                  Posting as <span className="text-[#9E5A38] dark:text-[#E05A30]">{user?.name}</span>
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 capitalize">{user?.role || 'Author'}</span>
              </div>
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  if (validationError) setValidationError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Join the discussion. Share your perspective or counter-argument..."
                rows={3}
                className={`w-full text-xs sm:text-sm text-[#141416] dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-[#FAF7F2] dark:bg-[#1F2430] rounded-xl p-3 border transition-all resize-none focus:outline-hidden ${
                  validationError
                    ? 'border-rose-400 dark:border-rose-600 bg-rose-50/20'
                    : 'border-transparent focus:border-zinc-300 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-[#171B22]'
                }`}
              />

              {validationError && (
                <div className="flex items-center space-x-1.5 mt-2 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {showSuccessToast && (
                <div className="flex items-center space-x-1.5 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-fadeIn">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Your thought was published to the community stream!</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-2">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Tip: Press <kbd className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]">Ctrl+Enter</kbd> to publish
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 bg-[#141416] dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-[#141416] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <span>Publish Thought</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-zinc-100 dark:bg-[#1F2430] rounded-2xl animate-shimmer"></div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-zinc-400 dark:text-zinc-500 text-sm italic text-center py-6">
          No thoughts shared yet. Be the first to start this conversation!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const commentIdStr = String(comment.id);
            const likesCount = commentLikes[commentIdStr] ?? comment.likes;
            const isLikedByMe = userLikedComments.has(commentIdStr);
            const isMyComment = isAuthenticated && (user?.id === comment.user.id || user?.name === comment.user.name);

            return (
              <div
                key={comment.id}
                className="bg-white dark:bg-[#171B22] p-5 rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-sans text-xs font-bold text-[#141416] dark:text-white">
                          {comment.user.name}
                        </h4>
                        {isMyComment && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                        {comment.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Upvote & Delete */}
                  <div className="flex items-center space-x-2">
                    {isMyComment && onDeleteComment && (
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Delete your comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleLike(comment.id, comment.likes)}
                      className={`inline-flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        isLikedByMe
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-[#2E4A3E] dark:hover:text-emerald-400 hover:bg-[#EBF1EE] dark:hover:bg-[#1F2430]'
                      }`}
                      title={isAuthenticated ? (isLikedByMe ? "Unlike thought" : "Insightful thought") : "Sign in to upvote"}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLikedByMe ? 'fill-current' : ''}`} />
                      <span className="font-semibold text-[11px]">{likesCount}</span>
                    </button>
                  </div>
                </div>

                <p className="font-sans text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-11">
                  {comment.body}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
