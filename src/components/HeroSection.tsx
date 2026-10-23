import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:py-8 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Editorial Headline & Call to Action (6 cols) */}
        <div className="lg:col-span-6 z-10 pr-0 lg:pr-4">
          <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#E05A30] dark:text-[#F28C69] bg-[#E05A30]/10 dark:bg-[#E05A30]/20 px-2.5 py-1 rounded-full mb-4">
            <span>Issue 48 &bull; October 2026</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#18181B] dark:text-[#F1F3F5] leading-[1.08] mb-5">
            Stories for a <br className="hidden sm:inline" />
            <span className="italic font-normal">Brighter</span> Mind
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mb-8">
            Discover ideas, experiences and insights from around the world &mdash; thoughtfully curated for curious minds.
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={onExploreClick}
              className="group inline-flex items-center space-x-3 bg-[#18181B] dark:bg-[#F1F3F5] hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-[#0E1116] text-xs sm:text-sm font-semibold pl-5 pr-2 py-2 rounded-full transition-all shadow-md cursor-pointer"
            >
              <span>Explore Articles</span>
              <span className="w-7 h-7 rounded-full bg-white/20 dark:bg-black/15 group-hover:bg-white/30 dark:group-hover:bg-black/25 flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-white dark:text-[#0E1116] group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Architectural Organic Shape Masked Imagery (6 cols) */}
        <div className="lg:col-span-6 relative">
          
          {/* Main Visual Container */}
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-[#EFECE6] dark:bg-zinc-800 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 group">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
              alt="Architectural modern lake sanctuary"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-1000 ease-out"
            />
            {/* Subtle Gradient Veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

            {/* Inner Floating Caption */}
            <div className="absolute bottom-5 left-6 right-6 text-white text-xs flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">Sanctuary Architecture</span>
                <p className="font-serif text-sm font-semibold mt-0.5">The Cantilever House &bull; Swiss Alps</p>
              </div>
            </div>
          </div>

          {/* Artistic Vertical Text Callout */}
          <div className="hidden xl:flex flex-col items-center absolute -right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
            <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 font-semibold font-sans space-y-1 text-center [writing-mode:vertical-lr] rotate-180">
              Good Ideas Travel Further
            </div>
            <div className="w-px h-8 bg-zinc-300 dark:bg-zinc-700 mt-2"></div>
          </div>

        </div>

      </div>
    </section>
  );
};
