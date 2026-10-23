import React from 'react';

export const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#EAE4D9] shadow-2xs p-0 flex flex-col justify-between">
      <div>
        <div className="aspect-16/10 bg-zinc-200 animate-shimmer"></div>
        <div className="p-5 space-y-3">
          <div className="w-16 h-3 bg-zinc-200 rounded-full animate-shimmer"></div>
          <div className="w-full h-5 bg-zinc-200 rounded-md animate-shimmer"></div>
          <div className="w-3/4 h-5 bg-zinc-200 rounded-md animate-shimmer"></div>
          <div className="w-full h-3 bg-zinc-100 rounded-md animate-shimmer"></div>
        </div>
      </div>
      <div className="px-5 pb-4 pt-1 flex justify-between items-center border-t border-zinc-100">
        <div className="w-16 h-3 bg-zinc-200 rounded-full animate-shimmer"></div>
        <div className="w-7 h-7 rounded-full bg-zinc-200 animate-shimmer"></div>
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="pt-4 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-6 space-y-4">
        <div className="w-24 h-4 bg-zinc-200 rounded-full animate-shimmer"></div>
        <div className="w-4/5 h-12 bg-zinc-200 rounded-lg animate-shimmer"></div>
        <div className="w-3/5 h-12 bg-zinc-200 rounded-lg animate-shimmer"></div>
        <div className="w-full h-16 bg-zinc-100 rounded-lg animate-shimmer"></div>
        <div className="w-36 h-10 bg-zinc-200 rounded-full animate-shimmer"></div>
      </div>
      <div className="lg:col-span-6">
        <div className="rounded-[32px] bg-zinc-200 aspect-4/3 animate-shimmer shadow-lg"></div>
      </div>
    </div>
  );
};

export const EditorsPicksSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="w-32 h-6 bg-zinc-200 rounded-md animate-shimmer mb-4"></div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-3 p-2">
          <div className="w-4 h-4 bg-zinc-200 rounded-full animate-shimmer"></div>
          <div className="w-14 h-14 rounded-xl bg-zinc-200 animate-shimmer shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="w-full h-3.5 bg-zinc-200 rounded animate-shimmer"></div>
            <div className="w-1/2 h-2.5 bg-zinc-100 rounded animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
