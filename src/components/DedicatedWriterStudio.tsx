import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Redo,
  Settings,
  ChevronDown,
  Layout,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import axios from 'axios';
import { Article, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { createRealArticle, updateRealArticle, fetchSingleArticle } from '../services/api';
import { DraftSettingsDrawer } from './DraftSettingsDrawer';

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
  const { draftId } = useParams<{ draftId?: string }>();
  const navigate = useNavigate();

  // Active Draft ID in PostgreSQL
  const [activeDraftId, setActiveDraftId] = useState<string | number | undefined>(
    initialDraft?.id || draftId
  );

  // Metadata states
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [subtitle, setSubtitle] = useState(initialDraft?.subtitle || initialDraft?.description || '');
  const [showSubtitleInput, setShowSubtitleInput] = useState(!!(initialDraft?.subtitle || initialDraft?.description));
  const [showCoverSection, setShowCoverSection] = useState(!!initialDraft?.coverImage);
  const [category, setCategory] = useState<Category>((initialDraft?.category as Category) || 'Technology');
  const [coverImage, setCoverImage] = useState(initialDraft?.coverImage || COVER_PRESETS[0].url);
  const [tagsInput, setTagsInput] = useState(initialDraft?.tags ? initialDraft.tags.join(', ') : 'Engineering, Design');
  const [seriesName, setSeriesName] = useState(initialDraft?.seriesName || 'None');
  const [seoTitle, setSeoTitle] = useState(initialDraft?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialDraft?.seoDescription || '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialDraft?.canonicalUrl || '');
  const [scheduledAt, setScheduledAt] = useState(initialDraft?.scheduledAt || '');
  const [isUnlisted, setIsUnlisted] = useState(initialDraft?.isUnlisted || false);

  // UI Drawer & Preview States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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
        placeholder: "Type '/' for commands or start writing your essay...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[420px] text-zinc-800 dark:text-zinc-200 font-sans text-base sm:text-lg leading-[1.8]',
      },
    },
    onUpdate: () => {
      setSaveStatus('saving');
    },
  });

  // Load draft from DB if draftId route param provided
  useEffect(() => {
    if (draftId && (!initialDraft || initialDraft.id !== draftId)) {
      fetchSingleArticle(draftId).then((loaded) => {
        if (loaded) {
          setActiveDraftId(loaded.id);
          setTitle(loaded.title);
          setSubtitle(loaded.subtitle || loaded.description);
          setCategory(loaded.category as Category);
          if (loaded.coverImage) setCoverImage(loaded.coverImage);
          if (loaded.tags) setTagsInput(loaded.tags.join(', '));
          if (loaded.seriesName) setSeriesName(loaded.seriesName);
          if (editor && loaded.content) {
            editor.commands.setContent(loaded.content);
          }
        }
      });
    }
  }, [draftId]);

  // Live word count & reading time
  const textContent = editor?.getText() || '';
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-Save Draft to PostgreSQL & LocalStorage Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!title.trim() && !textContent.trim()) return;

      setSaveStatus('saving');
      const htmlContent = editor?.getHTML() || '';
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const draftPayload = {
        title: title.trim() || 'Untitled Draft',
        subtitle: subtitle.trim(),
        description: subtitle.trim() || textContent.slice(0, 160).replace(/[#*`_]/g, '') + '...',
        content: htmlContent,
        cover_image: coverImage,
        category,
        tags: tags.length ? tags : ['Culture', 'Perspective'],
        status: 'draft' as const,
        seo_title: seoTitle,
        seo_description: seoDescription,
        canonical_url: canonicalUrl,
        series_name: seriesName,
        is_unlisted: isUnlisted,
        scheduled_at: scheduledAt || null,
      };

      try {
        if (activeDraftId && !String(activeDraftId).startsWith('local-')) {
          // Update in-place in PostgreSQL
          await updateRealArticle(activeDraftId, draftPayload, token);
        } else {
          // First-time save to PostgreSQL
          const created = await createRealArticle(draftPayload, token);
          if (created?.id) {
            setActiveDraftId(created.id);
          }
        }

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(timeStr);
        setSaveStatus('saved');
        localStorage.setItem('verdict_active_draft', JSON.stringify({ ...draftPayload, id: activeDraftId }));
      } catch (err) {
        setSaveStatus('idle');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, subtitle, category, coverImage, textContent, tagsInput, seriesName, seoTitle, seoDescription, canonicalUrl, isUnlisted, scheduledAt, editor]);

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
      setShowCoverSection(true);
    }
  };

  // Submit Handler: Publish Story
  const handlePublish = async () => {
    if (!title.trim()) {
      setErrorMessage('Please provide an essay title before publishing.');
      setIsSettingsOpen(false);
      return;
    }

    const htmlContent = editor?.getHTML() || '';
    if (!htmlContent.trim() || htmlContent === '<p></p>') {
      setErrorMessage('Please write some content for your story.');
      setIsSettingsOpen(false);
      return;
    }

    setErrorMessage('');
    setIsPublishing(true);

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const articlePayload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: subtitle.trim() || textContent.slice(0, 160).replace(/[#*`_]/g, '') + '...',
      content: htmlContent,
      cover_image: coverImage,
      category,
      tags: tags.length ? tags : ['Technology', 'Ideas'],
      status: 'published' as const,
      seo_title: seoTitle,
      seo_description: seoDescription,
      canonical_url: canonicalUrl,
      series_name: seriesName,
      is_unlisted: isUnlisted,
      scheduled_at: scheduledAt || null,
    };

    let finalArticle: Article | null = null;

    if (activeDraftId && !String(activeDraftId).startsWith('local-')) {
      finalArticle = await updateRealArticle(activeDraftId, articlePayload, token);
    } else {
      finalArticle = await createRealArticle(articlePayload, token);
    }

    const authorName = user?.name || 'Elena Rostova';
    const fallbackArticle: Article = {
      id: activeDraftId || `art_${Date.now()}`,
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
        role: user?.role || 'Staff Author',
        bio: user?.bio || 'Writing on craft and architecture.',
        followers: 14200,
        articlesCount: 28,
      },
      publishedAt: 'Just now',
      readingTime: estimatedReadingTime,
      likesCount: 1,
      commentsCount: 0,
      tags: articlePayload.tags,
      status: 'published',
      seriesName,
    };

    setIsPublishing(false);
    setIsSettingsOpen(false);
    localStorage.removeItem('verdict_active_draft');
    onArticlePublished(finalArticle || fallbackArticle);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-[#141416] dark:text-[#F1F3F5] flex flex-col">
      {/* 1. HASHNODE-STYLE TOP BREADCRUMB CONTROLS BAR */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#0E1116]/95 backdrop-blur-md border-b border-[#EAE4D9] dark:border-[#262C3A] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Author / Drafts Breadcrumb */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-200/60 dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
            title="Back to Studio"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 truncate">
            <span className="text-[#141416] dark:text-white font-bold truncate">
              {user?.name || 'Elena Rostova'}
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">/</span>
            <button 
              onClick={onBack}
              className="hover:text-black dark:hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              <span>Drafts</span>
              <ChevronDown className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            </button>
            <span className="text-zinc-300 dark:text-zinc-600">/</span>
            <span className="text-zinc-400 dark:text-zinc-500 font-normal truncate max-w-[120px] sm:max-w-xs">
              {title || '+ Untitled'}
            </span>
          </div>

          {/* Auto-Save Indicator */}
          <div className="hidden md:flex items-center space-x-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 pl-2">
            {saveStatus === 'saving' ? (
              <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Saving to PostgreSQL...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-zinc-400 dark:text-zinc-500">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Saved ({lastSavedTime})</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Word Count, Preview, Settings Drawer Trigger, Publish Button */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium hidden lg:inline mr-1">
            {wordCount} words &bull; ~{estimatedReadingTime} min read
          </span>

          {/* Preview Toggle */}
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
              isPreview 
                ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416] border-transparent' 
                : 'bg-white dark:bg-[#171B22] hover:bg-zinc-100 dark:hover:bg-[#1F2430] text-zinc-700 dark:text-zinc-300 border-[#EAE4D9] dark:border-[#262C3A]'
            }`}
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPreview ? 'Edit' : 'Preview'}</span>
          </button>

          {/* Draft Settings Drawer Trigger (Hashnode ⚙️) */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white dark:bg-[#171B22] hover:bg-zinc-100 dark:hover:bg-[#1F2430] text-zinc-700 dark:text-zinc-300 border border-[#EAE4D9] dark:border-[#262C3A] transition-colors cursor-pointer"
            title="Draft Settings"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
            <span className="hidden sm:inline">Draft settings</span>
          </button>

          {/* Primary Publish CTA */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-4 sm:px-5 py-2 rounded-full bg-[#141416] dark:bg-emerald-600 hover:bg-black dark:hover:bg-emerald-500 text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </header>

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-900/60 px-4 py-2.5 text-center text-xs font-semibold text-rose-700 dark:text-rose-400">
          {errorMessage}
        </div>
      )}

      {/* 2. MAIN DISTRACTION-FREE CANVAS */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8">
        {isPreview ? (
          /* LIVE PREVIEW */
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center sm:text-left space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E5A38] dark:text-[#E05A30] bg-[#9E5A38]/10 dark:bg-[#E05A30]/10 px-3 py-1 rounded-full">
                {category}
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#141416] dark:text-white leading-tight">
                {title || 'Untitled Essay'}
              </h1>
              {subtitle && (
                <p className="font-sans text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {coverImage && (
              <div className="rounded-2xl overflow-hidden aspect-16/9 bg-zinc-100 dark:bg-zinc-800 shadow-md">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div 
              className="prose prose-zinc dark:prose-invert max-w-none text-base sm:text-lg leading-[1.8] space-y-6"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
            />
          </div>
        ) : (
          /* WRITER STUDIO CANVAS */
          <div className="space-y-6">
            
            {/* Hashnode-Style Inline Action Prompts: [Cover] [Subheading] */}
            <div className="flex items-center space-x-3 text-xs text-zinc-500 dark:text-zinc-400 pb-1">
              <button
                type="button"
                onClick={() => setShowCoverSection(!showCoverSection)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-[#1F2430] transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{showCoverSection ? 'Hide Cover' : 'Cover'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSubtitleInput(!showSubtitleInput)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-[#1F2430] transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300"
              >
                <span className="font-editorial font-bold text-xs">H₂</span>
                <span>{showSubtitleInput ? 'Hide Subheading' : 'Subheading'}</span>
              </button>
            </div>

            {/* Optional Cover Upload Banner */}
            {showCoverSection && (
              <div className="space-y-2 animate-in fade-in">
                <div className="relative group rounded-2xl overflow-hidden aspect-21/9 bg-[#FAF7F2] dark:bg-[#171B22] border-2 border-dashed border-[#EAE4D9] dark:border-[#262C3A] flex items-center justify-center">
                  {coverImage ? (
                    <>
                      <img src={coverImage} alt="Article cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                        <label className="bg-white dark:bg-[#171B22] hover:bg-zinc-100 dark:hover:bg-[#1F2430] text-[#141416] dark:text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer shadow-md flex items-center space-x-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Uploading...' : 'Change Cover (Cloudflare R2)'}</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="text-center cursor-pointer p-6">
                      <ImageIcon className="w-8 h-8 text-zinc-400 dark:text-zinc-500 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Click to upload story cover image</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-zinc-500 dark:text-zinc-400 overflow-x-auto pb-1">
                  <span className="shrink-0 font-medium">Presets:</span>
                  {COVER_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className="px-2.5 py-0.5 bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] rounded-full hover:bg-zinc-100 dark:hover:bg-[#1F2430] shrink-0 cursor-pointer text-zinc-700 dark:text-zinc-300"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title Input (Hashnode: Huge, Minimal, Distraction-Free) */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title..."
                className="w-full font-editorial text-4xl sm:text-5xl font-bold text-[#141416] dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 bg-transparent border-none outline-hidden leading-tight"
              />
            </div>

            {/* Subheading Input (Shown when toggled or has value) */}
            {showSubtitleInput && (
              <div className="animate-in fade-in">
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Add a subheading..."
                  className="w-full font-sans text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 bg-transparent border-none outline-hidden"
                />
              </div>
            )}

            {/* TIPTAP FORMATTING TOOLBAR */}
            {editor && (
              <div className="sticky top-16 z-30 bg-white dark:bg-[#171B22] rounded-xl border border-[#EAE4D9] dark:border-[#262C3A] p-1.5 shadow-2xs flex flex-wrap items-center gap-1 text-zinc-600 dark:text-zinc-300">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('heading', { level: 1 }) ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('heading', { level: 2 }) ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('heading', { level: 3 }) ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>

                <span className="text-zinc-300 dark:text-zinc-600 mx-0.5">|</span>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('bold') ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('italic') ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('code') ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Inline Code"
                >
                  <Code className="w-4 h-4" />
                </button>

                <span className="text-zinc-300 dark:text-zinc-600 mx-0.5">|</span>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('blockquote') ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Pull Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('bulletList') ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded-lg cursor-pointer ${editor.isActive('orderedList') ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]' : 'hover:bg-zinc-100 dark:hover:bg-[#1F2430]'}`}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#1F2430] rounded-lg cursor-pointer text-zinc-600 dark:text-zinc-300"
                  title="Horizontal Divider"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="text-zinc-300 dark:text-zinc-600 mx-0.5">|</span>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#1F2430] rounded-lg cursor-pointer text-zinc-600 dark:text-zinc-300"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#1F2430] rounded-lg cursor-pointer text-zinc-600 dark:text-zinc-300"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TipTap Editor Content */}
            <div className="bg-white dark:bg-[#171B22] rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] p-6 sm:p-8 shadow-xs">
              <EditorContent editor={editor} />
            </div>

          </div>
        )}
      </main>

      {/* 3. DRAFT SETTINGS SLIDE-OVER DRAWER (Hashnode 4-Tab Panel) */}
      <DraftSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title={title}
        subtitle={subtitle}
        category={category}
        setCategory={setCategory}
        tagsInput={tagsInput}
        setTagsInput={setTagsInput}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        onUploadImage={handleImageUpload}
        uploadingImage={uploadingImage}
        seoTitle={seoTitle}
        setSeoTitle={setSeoTitle}
        seoDescription={seoDescription}
        setSeoDescription={setSeoDescription}
        canonicalUrl={canonicalUrl}
        setCanonicalUrl={setCanonicalUrl}
        seriesName={seriesName}
        setSeriesName={setSeriesName}
        scheduledAt={scheduledAt}
        setScheduledAt={setScheduledAt}
        isUnlisted={isUnlisted}
        setIsUnlisted={setIsUnlisted}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        authorName={user?.name || 'Elena Rostova'}
        authorAvatar={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
        authorRole={user?.role || 'Staff Author'}
      />
    </div>
  );
};
