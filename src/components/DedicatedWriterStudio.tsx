import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Send, 
  Eye, 
  Edit3, 
  Image as ImageIcon, 
  Check, 
  Save, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Code, 
  List, 
  ListOrdered, 
  Minus, 
  Undo, 
  Redo 
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import axios from 'axios';
import { Article, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { createRealArticle } from '../services/api';

interface DedicatedWriterStudioProps {
  onBack: () => void;
  onArticlePublished: (article: Article) => void;
  initialDraft?: Partial<Article> | null;
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

const COVER_PRESETS = [
  { label: 'Modern Architecture', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Minimalist Interior', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Misty Mountains', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Coffee & Journal', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80' },
];

export const DedicatedWriterStudio: React.FC<DedicatedWriterStudioProps> = ({
  onBack,
  onArticlePublished,
  initialDraft,
}) => {
  const { user, token } = useAuth();
  
  // Metadata states
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [subtitle, setSubtitle] = useState(initialDraft?.description || '');
  const [category, setCategory] = useState<Category>((initialDraft?.category as Category) || 'Technology');
  const [coverImage, setCoverImage] = useState(initialDraft?.coverImage || COVER_PRESETS[0].url);
  const [tagsInput, setTagsInput] = useState(initialDraft?.tags ? initialDraft.tags.join(', ') : 'Ideas, Design');
  
  // UI states
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initial Content Setup
  const initialContent = initialDraft?.content 
    ? initialDraft.content.replace(/^#\s+/gm, '<h1>').replace(/^##\s+/gm, '<h2>').replace(/^###\s+/gm, '<h3>').replace(/\n\n/g, '<p></p>')
    : `<h2>The Architecture of Clarity</h2><p>Every breakthrough begins with the courage to question consensus. In an age saturated by instant algorithmic validation, true depth emerges not from consuming more, but from thinking more rigorously about what is essential.</p><blockquote>"The ultimate elegance in software and design is not how much you can add, but the disciplined restraint of knowing what to leave untouched."</blockquote><p>When our systems prioritize depth over velocity, the work we produce leaves an indelible mark on culture.</p>`;

  // TipTap Rich-Text Engine
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Tell your story... write with clarity, intellectual rigor, and disciplined restraint.',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-zinc max-w-none focus:outline-none min-h-[360px] text-zinc-800 font-sans text-base sm:text-lg leading-[1.8]',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('saving');
    },
  });

  // Calculate live word count & reading time from editor
  const textContent = editor?.getText() || '';
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-Save Draft to LocalStorage & Database Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || textContent) {
        setSaveStatus('saving');
        const draftData = {
          title,
          subtitle,
          category,
          coverImage,
          content: editor?.getHTML() || '',
          tagsInput,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        try {
          localStorage.setItem('verdict_active_draft', JSON.stringify(draftData));
          setLastSavedTime(draftData.updatedAt);
          setSaveStatus('saved');
        } catch {
          setSaveStatus('idle');
        }
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [title, subtitle, category, coverImage, textContent, tagsInput, editor]);

  // Direct Cloudflare R2 Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (res.data?.success && res.data?.url) {
        setCoverImage(res.data.url);
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setCoverImage(localUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Handler: Publish or Draft to Real Database
  const handleSave = async (status: 'published' | 'draft') => {
    if (!title.trim()) {
      setErrorMessage('Please provide an essay title before proceeding.');
      return;
    }

    const htmlContent = editor?.getHTML() || '';
    if (!htmlContent.trim() || htmlContent === '<p></p>') {
      setErrorMessage('Please write some content for your story.');
      return;
    }

    setErrorMessage('');
    if (status === 'published') {
      setIsPublishing(true);
    } else {
      setIsSavingDraft(true);
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const articlePayload = {
      title: title.trim(),
      description: subtitle.trim() || textContent.slice(0, 160).replace(/[#*`_]/g, '') + '...',
      content: htmlContent,
      cover_image: coverImage,
      category,
      tags: tags.length ? tags : ['Culture', 'Perspective'],
      status,
    };

    // Post to PostgreSQL Database
    const dbResult = await createRealArticle(articlePayload, token);

    const authorName = user?.name || 'Elena Rostova';
    const finalArticle: Article = dbResult || {
      id: `art_${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: articlePayload.description,
      content: htmlContent,
      coverImage,
      category,
      author: {
        id: user?.id || 'user-demo-1',
        name: authorName,
        avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: user?.role || 'Editor in Chief',
        bio: user?.bio || 'Writing on craft and architecture.',
        followers: 14200,
        articlesCount: 28,
      },
      publishedAt: 'Just now',
      readingTime: estimatedReadingTime,
      likesCount: 1,
      commentsCount: 0,
      tags: articlePayload.tags,
      status,
    };

    setIsPublishing(false);
    setIsSavingDraft(false);

    localStorage.removeItem('verdict_active_draft');
    onArticlePublished(finalArticle);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141416] flex flex-col">
      {/* 1. TOP STICKY CONTROLS BAR */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4D9] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 hover:text-black py-1.5 px-3 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stories</span>
          </button>

          <span className="text-zinc-300">|</span>

          {/* Draft Auto-Save Status */}
          <div className="flex items-center space-x-2 text-xs text-zinc-500">
            {saveStatus === 'saving' ? (
              <span className="flex items-center space-x-1 text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Saving to database...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-zinc-400">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved ({lastSavedTime})</span>
              </span>
            )}
          </div>
        </div>

        {/* Readability Stats & Publishing Controls */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-zinc-400 font-medium hidden md:inline">
            {wordCount} words &bull; ~{estimatedReadingTime} min read
          </span>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
              isPreview 
                ? 'bg-[#141416] text-white border-transparent' 
                : 'bg-white hover:bg-zinc-100 text-zinc-700 border-[#EAE4D9]'
            }`}
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreview ? 'Back to Editor' : 'Live Preview'}</span>
          </button>

          <button
            onClick={() => handleSave('draft')}
            disabled={isSavingDraft || isPublishing}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 border border-[#EAE4D9] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSave('published')}
            disabled={isPublishing || isSavingDraft}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-5 py-2 rounded-full bg-[#2E4A3E] hover:bg-[#233a30] text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Story'}</span>
          </button>
        </div>
      </header>

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-center text-xs font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* 2. MAIN WRITER CANVAS */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-10">
        {isPreview ? (
          /* LIVE PREVIEW MODE */
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center sm:text-left space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#2E4A3E] bg-[#2E4A3E]/10 px-3 py-1 rounded-full">
                {category}
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#141416] leading-tight">
                {title || 'Untitled Essay'}
              </h1>
              {subtitle && (
                <p className="font-sans text-lg text-zinc-600 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden aspect-16/9 bg-zinc-100 shadow-md">
              <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
            </div>

            <div 
              className="prose prose-zinc max-w-none text-base sm:text-lg leading-[1.8] space-y-6"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
            />
          </div>
        ) : (
          /* DISTRACTION-FREE TIPTAP WYSIWYG CANVAS */
          <div className="space-y-8">
            {/* Cover Image Upload / Selection */}
            <div className="space-y-3">
              <div className="relative group rounded-2xl overflow-hidden aspect-21/9 bg-[#FAF7F2] border-2 border-dashed border-[#EAE4D9] flex items-center justify-center">
                {coverImage ? (
                  <>
                    <img src={coverImage} alt="Article cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                      <label className="bg-white hover:bg-zinc-100 text-[#141416] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer shadow-md flex items-center space-x-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change Cover (Cloudflare R2)</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="text-center cursor-pointer p-6">
                    <ImageIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-zinc-600">Click to upload story cover image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Cover Presets */}
              <div className="flex items-center space-x-2 text-[11px] text-zinc-500 overflow-x-auto pb-1">
                <span className="shrink-0 font-medium">Curated presets:</span>
                {COVER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className="px-2.5 py-1 bg-white border border-[#EAE4D9] rounded-full hover:bg-zinc-100 shrink-0 cursor-pointer text-zinc-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title your essay..."
                className="w-full font-editorial text-4xl sm:text-5xl font-bold text-[#141416] placeholder:text-zinc-300 bg-transparent border-none outline-hidden leading-tight"
              />
            </div>

            {/* Subtitle / Deck Input */}
            <div>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Add a subtitle or editorial premise..."
                className="w-full font-sans text-lg sm:text-xl text-zinc-600 placeholder:text-zinc-300 bg-transparent border-none outline-hidden"
              />
            </div>

            {/* TIPTAP RICH-TEXT FORMATTING RIBBON */}
            {editor && (
              <div className="sticky top-16 z-30 bg-white rounded-xl border border-[#EAE4D9] p-1.5 shadow-2xs flex flex-wrap items-center gap-1 text-zinc-600">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('heading', { level: 1 }) ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('heading', { level: 2 }) ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('heading', { level: 3 }) ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>

                <span className="text-zinc-300 mx-0.5">|</span>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('bold') ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('italic') ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('code') ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Inline Code"
                >
                  <Code className="w-4 h-4" />
                </button>

                <span className="text-zinc-300 mx-0.5">|</span>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('blockquote') ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Pull Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('bulletList') ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('orderedList') ? 'bg-[#141416] text-white' : 'hover:bg-zinc-100'}`}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg cursor-pointer"
                  title="Horizontal Divider"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="text-zinc-300 mx-0.5">|</span>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg cursor-pointer"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg cursor-pointer"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TIPTAP ACTIVE CANVAS */}
            <div className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-xs">
              <EditorContent editor={editor} />
            </div>

            {/* Publishing Metadata (Category & Tags) */}
            <div className="pt-6 border-t border-[#EAE4D9] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Editorial Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-white border border-[#EAE4D9] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#141416] focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Systems, Design, Ethics"
                  className="w-full bg-white border border-[#EAE4D9] rounded-xl px-3.5 py-2 text-xs text-[#141416] focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
