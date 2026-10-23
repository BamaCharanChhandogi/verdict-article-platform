import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface FeaturedCarouselProps {
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  articles,
  onSelectArticle,
}) => {
  const featured = articles.filter(a => a.isFeatured).slice(0, 3);

  return (
    <div className="py-4">
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#9E5A38] animate-pulse"></span>
        <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-800 font-sans">
          Featured This Week
        </h3>
      </div>

      {/* 3 Horizontal Overlay Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            onClick={() => onSelectArticle && onSelectArticle(article)}
            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between p-5 block no-underline text-inherit"
          >
            {/* Background Image */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
            />
            
            {/* Multi-tier Gradient for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 group-hover:from-black/90 transition-colors"></div>

            {/* Top: Category Tag */}
            <div className="relative z-10">
              <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                {article.category}
              </span>
            </div>

            {/* Bottom: Title & Action Circle */}
            <div className="relative z-10 flex items-end justify-between gap-3">
              <div>
                <h4 className="font-editorial text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-amber-200 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center space-x-2 text-[11px] text-zinc-300 mt-2 font-sans">
                  <span>{article.readingTime} min read</span>
                  <span>&bull;</span>
                  <span>{article.author.name}</span>
                </div>
              </div>

              {/* Action Circle with Arrow */}
              <div className="w-9 h-9 rounded-full bg-white group-hover:bg-[#2E4A3E] text-[#141416] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-md">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
