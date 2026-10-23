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
    <div className="relative flex items-center py-4 my-2 border-y border-[#EFECE6]">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        className="hidden sm:flex w-7 h-7 rounded-full border border-zinc-200 bg-white items-center justify-center text-zinc-600 hover:text-black transition-colors shadow-2xs mr-2 shrink-0 cursor-pointer"
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
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F3EFEA] text-zinc-600 hover:text-zinc-900 border border-[#EFECE6]'
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
        className="hidden sm:flex w-7 h-7 rounded-full border border-zinc-200 bg-white items-center justify-center text-zinc-600 hover:text-black transition-colors shadow-2xs ml-2 shrink-0 cursor-pointer"
        title="Scroll right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
