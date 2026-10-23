import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center py-4 my-2 border-y border-[#EFECE6] dark:border-[#222733] transition-colors">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        className="hidden sm:flex w-7 h-7 rounded-full border border-zinc-200 dark:border-[#262C3A] bg-white dark:bg-[#171B22] items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-2xs mr-2 shrink-0 cursor-pointer"
        title="Scroll left"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Pills Container */}
      <div
        ref={scrollRef}
        className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1 flex-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
                ${isSelected
                  ? 'bg-[#18181B] dark:bg-[#F1F3F5] text-white dark:text-[#0E1116] shadow-xs'
                  : 'bg-white dark:bg-[#171B22] hover:bg-[#F3EFEA] dark:hover:bg-[#1E232B] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-[#EFECE6] dark:border-[#262C3A]'
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        className="hidden sm:flex w-7 h-7 rounded-full border border-zinc-200 dark:border-[#262C3A] bg-white dark:bg-[#171B22] items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-2xs ml-2 shrink-0 cursor-pointer"
        title="Scroll right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
