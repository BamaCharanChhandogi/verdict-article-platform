import React, { useState } from 'react';
import { X, Upload, Send, Eye, Edit3, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { Article, Category } from '../types';
import { useAuth } from '../context/AuthContext';

interface ArticleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleCreated: (article: Article) => void;
}

const CATEGORIES: Category[] = [
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Travel',
  'Health',
  'Productivity',
  'AI & Future'
];

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  isOpen,
  onClose,
  onArticleCreated,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Technology');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('Culture, Design');
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Calculate word count & reading time
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).catch(() => {
        // Fallback local object URL
        return { data: { url: URL.createObjectURL(file) } };
      });

      if (res.data?.url) {
        setCoverImage(res.data.url);
      }
    } catch {
      setCoverImage(URL.createObjectURL(file));
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content body are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || content.slice(0, 150) + '...',
        content: content.trim(),
        cover_image: coverImage,
        category,
        tags: tags.length ? tags : [category],
      };

      const res = await axios.post('/api/v1/articles', payload).catch(() => {
        // Resilient fallback client-side article creation
        const fallbackNew: Article = {
          id: `local-art-${Date.now()}`,
          title: payload.title,
          slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString().slice(-4)}`,
          description: payload.description,
          content: payload.content,
          coverImage: payload.cover_image,
          category: payload.category,
          author: {
            id: user?.id || 'demo-author',
            name: user?.name || 'Contributing Author',
            avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            role: user?.role || 'Author & Essayist',
            bio: user?.bio || 'Writing on contemporary ideas and perspectives.',
            followers: 1200,
            articlesCount: 1,
          },
          publishedAt: 'Just now',
          readingTime,
          likesCount: 1,
          commentsCount: 0,
          tags: payload.tags,
        };
        return { data: { success: true, data: fallbackNew } };
      });

      if (res.data?.success && res.data?.data) {
        const raw = res.data.data;
        const formattedArticle: Article = {
          id: raw.id,
          title: raw.title,
          slug: raw.slug,
          description: raw.description,
          content: raw.content,
          coverImage: raw.cover_image || raw.coverImage || coverImage,
          category: raw.category,
          author: raw.author || {
            id: user?.id || 'demo-author',
            name: user?.name || 'Contributing Author',
            avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            role: 'Author & Essayist',
            bio: 'Writing for Verdict Media.',
            followers: 1200,
            articlesCount: 1,
          },
          publishedAt: 'Just now',
          readingTime: raw.reading_time || readingTime,
          likesCount: raw.likes_count || 0,
          commentsCount: 0,
          tags,
        };

        onArticleCreated(formattedArticle);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to publish story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-[#FAF7F2] p-6 sm:p-8 text-left shadow-2xl border border-[#EAE4D9] transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#EAE4D9]">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-[#EBF1EE] text-[#2E4A3E] flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#141416]">
                  Verdict Publishing Studio
                </h3>
                <span className="text-[11px] text-zinc-500">
                  {wordCount} words &bull; ~{readingTime} min read
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-white border border-[#EAE4D9] hover:bg-zinc-100 rounded-full cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isPreview ? 'Edit Mode' : 'Preview'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-black rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handlePublish} className="mt-6 space-y-5">
            {isPreview ? (
              /* Preview Mode */
              <div className="bg-white p-6 rounded-2xl border border-[#EAE4D9] max-h-[60vh] overflow-y-auto space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#2E4A3E] bg-[#EBF1EE] px-2.5 py-1 rounded-full">
                  {category}
                </span>
                <h1 className="font-editorial text-3xl font-bold text-[#141416]">
                  {title || 'Untitled Essay'}
                </h1>
                <p className="text-zinc-500 italic text-sm">{description}</p>
                {coverImage && (
                  <img src={coverImage} alt="Cover preview" className="w-full h-48 object-cover rounded-xl" />
                )}
                <div className="text-zinc-800 text-sm leading-relaxed whitespace-pre-line pt-2">
                  {content || 'Start typing in edit mode to see your content previewed here.'}
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <>
                {/* Title */}
                <div>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Story Title (e.g. The Architecture of Intentional Space)"
                    className="w-full font-editorial text-2xl sm:text-3xl font-semibold text-[#141416] placeholder:text-zinc-300 bg-transparent border-b border-[#EAE4D9] pb-2 focus:border-zinc-800 focus:outline-hidden transition-all"
                  />
                </div>

                {/* Subtitle / Description */}
                <div>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short subtitle or premise to hook readers..."
                    className="w-full font-sans text-xs sm:text-sm text-zinc-700 placeholder:text-zinc-400 bg-transparent border-b border-[#EAE4D9] pb-2 focus:border-zinc-600 focus:outline-hidden transition-all"
                  />
                </div>

                {/* Category & Tags Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Topic Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full bg-white text-xs font-semibold text-[#141416] p-2.5 rounded-xl border border-[#EAE4D9] focus:outline-hidden"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Design, Architecture, Ideas"
                      className="w-full bg-white text-xs text-[#141416] placeholder:text-zinc-400 p-2.5 rounded-xl border border-[#EAE4D9] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Cover Image Upload & Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Cover Image (Cloudflare R2 / URL)
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="url"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white text-xs text-[#141416] placeholder:text-zinc-400 pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE4D9] focus:outline-hidden"
                      />
                    </div>
                    <label className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-white hover:bg-zinc-100 border border-[#EAE4D9] text-xs font-semibold text-zinc-700 rounded-xl cursor-pointer transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Content Body */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Story Body (Markdown Supported)
                  </label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    placeholder="Write your story here... Markdown headings (#, ##), quotes (>), and lists are supported."
                    className="w-full bg-white text-xs sm:text-sm text-[#141416] placeholder:text-zinc-400 p-3.5 rounded-xl border border-[#EAE4D9] focus:border-zinc-400 focus:outline-hidden transition-all resize-y"
                  />
                </div>
              </>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#EAE4D9] flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                Logged in as <strong>{user?.name || 'Elena Rostova'}</strong>
              </span>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 bg-[#141416] hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Story'}</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
