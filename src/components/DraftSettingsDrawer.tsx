import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Calendar, 
  Eye, 
  Tag, 
  Globe, 
  User as UserIcon, 
  BookMarked, 
  Check, 
  Upload,
  Layers,
  Clock
} from 'lucide-react';
import { Category, Article } from '../types';

interface DraftSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  category: Category;
  setCategory: (cat: Category) => void;
  tagsInput: string;
  setTagsInput: (tags: string) => void;
  coverImage: string;
  setCoverImage: (url: string) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingImage: boolean;
  seoTitle: string;
  setSeoTitle: (title: string) => void;
  seoDescription: string;
  setSeoDescription: (desc: string) => void;
  canonicalUrl: string;
  setCanonicalUrl: (url: string) => void;
  seriesName: string;
  setSeriesName: (series: string) => void;
  scheduledAt: string;
  setScheduledAt: (date: string) => void;
  isUnlisted: boolean;
  setIsUnlisted: (unlisted: boolean) => void;
  onPublish: () => void;
  isPublishing: boolean;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
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

const SERIES_OPTIONS = [
  'None',
  'System Design & Distributed Scalability',
  'The Architecture of Clarity & Typography',
  'Cognitive Depth & Mindful Productivity',
  'Humane Software Engineering'
];

export const DraftSettingsDrawer: React.FC<DraftSettingsDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  category,
  setCategory,
  tagsInput,
  setTagsInput,
  coverImage,
  setCoverImage,
  onUploadImage,
  uploadingImage,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  canonicalUrl,
  setCanonicalUrl,
  seriesName,
  setSeriesName,
  scheduledAt,
  setScheduledAt,
  isUnlisted,
  setIsUnlisted,
  onPublish,
  isPublishing,
  authorName,
  authorAvatar,
  authorRole,
}) => {
  const [activeTab, setActiveTab] = useState<'attribution' | 'discovery' | 'scheduling' | 'visibility'>('attribution');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dim Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over Drawer (Hashnode Draft Settings) */}
      <aside className="relative z-10 w-full max-w-md bg-[#FAF7F2] border-l border-[#EAE4D9] h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-[#EAE4D9] bg-white">
            <h2 className="font-editorial text-xl font-bold text-[#141416]">
              Draft settings
            </h2>
            <button 
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-black rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hashnode-Style Tabs */}
          <div className="flex border-b border-[#EAE4D9] bg-white px-2">
            {[
              { id: 'attribution', label: 'Attribution' },
              { id: 'discovery', label: 'Discovery' },
              { id: 'scheduling', label: 'Scheduling' },
              { id: 'visibility', label: 'Visibility' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-xs font-semibold border-b-2 text-center transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#141416] text-[#141416]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Drawer Body Scroll Container */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">

            {/* TAB 1: ATTRIBUTION */}
            {activeTab === 'attribution' && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Select a publication
                  </label>
                  <p className="text-[11px] text-zinc-500 mb-2">
                    This will assign the article to your official publication imprint.
                  </p>
                  <div className="bg-white border border-[#EAE4D9] rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-[#141416]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#9E5A38]"></span>
                      <span>Verdict Editorial Publication</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Author
                  </label>
                  <p className="text-[11px] text-zinc-500 mb-2">
                    The author and byline of the draft.
                  </p>
                  <div className="bg-white border border-[#EAE4D9] rounded-xl p-3.5 flex items-center space-x-3.5">
                    <img 
                      src={authorAvatar} 
                      alt={authorName} 
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#141416]">{authorName}</p>
                      <p className="text-[11px] text-zinc-500">{authorRole}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Add to a series
                  </label>
                  <p className="text-[11px] text-zinc-500 mb-2">
                    Group this article with related posts into a coherent editorial collection.
                  </p>
                  <select
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                    className="w-full bg-white border border-[#EAE4D9] rounded-xl px-3.5 py-2.5 text-xs text-[#141416] focus:outline-hidden focus:border-[#141416]"
                  >
                    {SERIES_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* TAB 2: DISCOVERY (TAGS & SEO) */}
            {activeTab === 'discovery' && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Topic Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-white border border-[#EAE4D9] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#141416] focus:outline-hidden focus:border-[#141416]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Tags (Up to 5 tags, comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Systems, Design, Future"
                    className="w-full bg-white border border-[#EAE4D9] rounded-xl px-3.5 py-2.5 text-xs text-[#141416] focus:outline-hidden focus:border-[#141416]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tagsInput.split(',').map(t => t.trim()).filter(Boolean).map((tag, idx) => (
                      <span key={idx} className="text-[11px] font-semibold text-zinc-700 bg-white border border-[#EAE4D9] px-2.5 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Custom SEO Title...'}
                    className="w-full bg-white border border-[#EAE4D9] rounded-xl px-3.5 py-2.5 text-xs text-[#141416] focus:outline-hidden focus:border-[#141416]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={subtitle || 'Custom Meta Description for Google & Social cards...'}
                    className="w-full bg-white border border-[#EAE4D9] rounded-xl px-3.5 py-2.5 text-xs text-[#141416] focus:outline-hidden focus:border-[#141416]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Canonical URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://original-blog.com/post-link"
                    className="w-full bg-white border border-[#EAE4D9] rounded-xl px-3.5 py-2.5 text-xs text-[#141416] focus:outline-hidden focus:border-[#141416]"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: SCHEDULING */}
            {activeTab === 'scheduling' && (
              <div className="space-y-5 animate-in fade-in">
                <div className="bg-white border border-[#EAE4D9] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#141416]">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>Publishing Schedule</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    By default, your essay is published immediately when you click Publish. You can also pick a future date and time.
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Target Schedule Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl px-3 py-2 text-xs text-[#141416] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VISIBILITY */}
            {activeTab === 'visibility' && (
              <div className="space-y-5 animate-in fade-in">
                <div className="bg-white border border-[#EAE4D9] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#141416]">Unlisted Story</h4>
                      <p className="text-[11px] text-zinc-500">
                        Anyone with the permanent link can read this essay, but it will not appear on the public Verdict home feed.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isUnlisted}
                      onChange={(e) => setIsUnlisted(e.target.checked)}
                      className="w-4 h-4 accent-[#141416] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Drawer Sticky Footer with Publish Action */}
        <div className="p-5 border-t border-[#EAE4D9] bg-white space-y-3">
          <p className="text-[10px] text-zinc-400 text-center">
            By publishing, you agree to the Verdict Editorial Code of Conduct.
          </p>
          <button
            onClick={onPublish}
            disabled={isPublishing}
            className="w-full bg-[#141416] hover:bg-black text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing Story...' : 'Publish Story'}</span>
          </button>
        </div>

      </aside>
    </div>
  );
};
