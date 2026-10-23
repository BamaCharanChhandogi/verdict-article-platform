import React, { useState, useEffect } from 'react';
import { Users, Search, Check, Plus, ExternalLink, BookOpen, Award, ArrowUpRight } from 'lucide-react';
import { Author } from '../types';
import { fetchAuthors } from '../services/api';

interface AuthorDirectoryProps {
  onSelectAuthorArticles?: (authorName: string) => void;
}

export const AuthorDirectory: React.FC<AuthorDirectoryProps> = ({ onSelectAuthorArticles }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchAuthors().then((data) => {
      if (isMounted) {
        setAuthors(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFollow = (id: string | number) => {
    setFollowingMap(prev => ({
      ...prev,
      [String(id)]: !prev[String(id)]
    }));
  };

  const filteredAuthors = authors.filter((author) => {
    const matchesSearch = !search || 
      author.name.toLowerCase().includes(search.toLowerCase()) ||
      author.role.toLowerCase().includes(search.toLowerCase()) ||
      author.bio.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Editorial Header */}
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#2E4A3E] dark:text-emerald-400 bg-[#2E4A3E]/10 dark:bg-emerald-950/40 px-3 py-1 rounded-full mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Editorial Fellows &amp; Voices</span>
        </div>
        <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#141416] dark:text-[#F1F3F5] tracking-tight">
          Contributors &amp; Essayists
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
          Meet the multidisciplinary minds, cognitive scientists, systems engineers, and architectural critics shaping the essays across Verdict.
        </p>
      </div>

      {/* Search Input Filter */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fellows by name, thesis or discipline..."
            className="w-full bg-white dark:bg-[#171B22] border border-[#EAE4D9] dark:border-[#262C3A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#141416] dark:text-[#F1F3F5] placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden focus:border-[#141416] dark:focus:border-zinc-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-[#171B22] rounded-2xl p-6 border border-[#EAE4D9] dark:border-[#262C3A] animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-sm w-3/4"></div>
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-700 rounded-sm w-1/2"></div>
                </div>
              </div>
              <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-sm"></div>
              <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : filteredAuthors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#171B22] rounded-2xl border border-[#EAE4D9] dark:border-[#262C3A] p-8 max-w-md mx-auto">
          <p className="font-editorial text-2xl text-[#141416] dark:text-[#F1F3F5]">No contributors found</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Try searching with a different name or specialty keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => {
            const isFollowing = !!followingMap[String(author.id)];
            return (
              <div
                key={author.id}
                className="bg-white dark:bg-[#171B22] rounded-2xl p-6 border border-[#EAE4D9] dark:border-[#262C3A] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Avatar & Follow Button */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-[#FAF7F2] dark:ring-zinc-700 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-editorial text-xl font-bold text-[#141416] dark:text-[#F1F3F5] leading-tight">
                          {author.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-[#9E5A38] dark:text-[#D98A62] uppercase tracking-wider mt-0.5">
                          {author.role}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollow(author.id)}
                      className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center space-x-1 ${
                        isFollowing
                          ? 'bg-[#2E4A3E] text-white hover:bg-[#233a30]'
                          : 'bg-[#FAF7F2] dark:bg-[#1E232B] hover:bg-zinc-200 dark:hover:bg-[#252B36] text-[#141416] dark:text-[#F1F3F5] border border-[#EAE4D9] dark:border-[#262C3A]'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                    {author.bio}
                  </p>
                </div>

                {/* Footer Metrics & Action */}
                <div className="pt-4 border-t border-[#FAF7F2] dark:border-[#1F242E] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{author.articlesCount}</span>
                      <span>stories</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{author.followers.toLocaleString()}</span>
                      <span>readers</span>
                    </div>
                  </div>

                  {onSelectAuthorArticles && (
                    <button
                      onClick={() => onSelectAuthorArticles(author.name)}
                      className="text-[#2E4A3E] dark:text-emerald-400 hover:text-[#141416] dark:hover:text-white font-semibold flex items-center space-x-1 group/btn cursor-pointer"
                    >
                      <span>Read stories</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
