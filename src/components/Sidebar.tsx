import React from 'react';
import { 
  Home, 
  Compass, 
  Hash, 
  Users, 
  Bookmark, 
  Mail, 
  X,
  Sparkles
} from 'lucide-react';
import { NavTab, Category } from '../types';

interface SidebarProps {
  activeNav: NavTab;
  setActiveNav: (nav: NavTab) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  bookmarksCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenBookmarks: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  selectedCategory,
  setSelectedCategory,
  bookmarksCount,
  isOpenMobile,
  setIsOpenMobile,
  onOpenBookmarks,
}) => {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home, badge: '•' },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'topics', label: 'Topics', icon: Hash },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, count: bookmarksCount },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
  ];

  const popularTopics: Category[] = [
    'Technology',
    'Design',
    'Productivity',
    'Business',
    'Lifestyle',
    'AI & Future',
    'Travel',
    'Health',
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FBF9F5] border-r border-[#EFECE6] p-6 flex flex-col justify-between
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Logo "Verdict." */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => { setActiveNav('home'); setSelectedCategory('All'); setIsOpenMobile(false); }}
              className="text-left group cursor-pointer"
            >
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#18181B] flex items-baseline">
                Verdict
                <span className="text-[#E05A30] font-black text-3xl ml-0.5 group-hover:scale-125 transition-transform">.</span>
              </h1>
            </button>
            
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1 mb-8">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'bookmarks') {
                      onOpenBookmarks();
                    } else {
                      setActiveNav(item.id as NavTab);
                    }
                    setIsOpenMobile(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-[#EFECE6] text-[#18181B] font-semibold shadow-xs' 
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-[#F3EFEA]'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#18181B]' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E05A30]"></span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#18181B] text-white">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Popular Topics Section */}
          <div className="pt-6 border-t border-[#EFECE6]">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3 px-3">
              Popular Topics
            </h2>
            <div className="space-y-1">
              {popularTopics.map((topic) => {
                const isSelected = selectedCategory === topic;
                return (
                  <button
                    key={topic}
                    onClick={() => {
                      setSelectedCategory(topic);
                      setActiveNav('home');
                      setIsOpenMobile(false);
                    }}
                    className={`
                      w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer
                      ${isSelected 
                        ? 'text-[#E05A30] font-bold bg-[#E05A30]/5' 
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-[#F3EFEA]'
                      }
                    `}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Bottom Card: "Stories that move you forward." */}
        <div className="mt-8 pt-4">
          <div className="relative rounded-2xl overflow-hidden shadow-md p-5 text-white flex flex-col justify-end min-h-[170px] group">
            {/* Background image with dark gradient */}
            <img 
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=80" 
              alt="Mountain nature"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

            <div className="relative z-10">
              <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold tracking-widest text-emerald-300 mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Verdict Plus</span>
              </span>
              <p className="font-serif text-sm font-semibold leading-snug mb-3">
                Stories that move you forward.
              </p>
              <button 
                onClick={() => alert("Thank you for joining Verdict! Free trial activated.")}
                className="w-full bg-white hover:bg-zinc-100 text-[#18181B] font-semibold text-xs py-2 px-3 rounded-full transition-colors shadow-xs cursor-pointer"
              >
                Join Free
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
