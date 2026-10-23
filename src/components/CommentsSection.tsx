import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, LogIn, Lock } from 'lucide-react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onOpenAuth?: () => void;
  isLoading?: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
  onOpenAuth,
  isLoading = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  const handleLike = (id: string | number, currentLikes: number) => {
    setCommentLikes(prev => ({
      ...prev,
      [id]: (prev[id] ?? currentLikes) + 1
    }));
  };

  return (
    <section className="mt-12 pt-10 border-t border-[#EAE4D9] dark:border-[#262C3A]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2.5">
          <MessageSquare className="w-5 h-5 text-[#2E4A3E] dark:text-emerald-400" />
          <h3 className="font-editorial text-2xl font-bold text-[#141416] dark:text-white">
            Discussion & Perspectives ({comments.length})
          </h3>
        </div>
        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-[#1F2430] px-3 py-1 rounded-full">
          API 3: Community Stream
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
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Join the discussion. Share your perspective or counter-argument..."
                rows={3}
                className="w-full text-xs sm:text-sm text-[#141416] dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-[#FAF7F2] dark:bg-[#1F2430] rounded-xl p-3 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-[#171B22] focus:outline-hidden transition-all resize-none"
              />
              <div className="flex items-center justify-between mt-3 pt-2">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Be respectful, insightful, and constructive.
                </span>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="inline-flex items-center space-x-2 bg-[#141416] dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-[#141416] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer"
                >
                  <span>Publish Thought</span>
                  <Send className="w-3.5 h-3.5" />
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
            const likesCount = commentLikes[comment.id] ?? comment.likes;
            return (
              <div
                key={comment.id}
                className="bg-white dark:bg-[#171B22] p-5 rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                    />
                    <div>
                      <h4 className="font-sans text-xs font-bold text-[#141416] dark:text-white">
                        {comment.user.name}
                      </h4>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                        {comment.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => handleLike(comment.id, comment.likes)}
                    className="inline-flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-[#2E4A3E] dark:hover:text-emerald-400 px-2.5 py-1 rounded-full hover:bg-[#EBF1EE] dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
                    title="Insightful thought"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[11px]">{likesCount}</span>
                  </button>
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
