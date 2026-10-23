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
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

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

  const specialties = ['All', 'Systems & Architecture', 'Design & Typography', 'AI & Neural Systems', 'Philosophy & Culture'];

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
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#2E4A3E] bg-[#2E4A3E]/10 px-3 py-1 rounded-full mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Editorial Fellows &amp; Voices</span>
        </div>
        <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#141416] tracking-tight">
          Contributors &amp; Essayists
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base mt-3 leading-relaxed">
          Meet the engineers, theorists, and creative directors shaping the discourse on technology, ethics, and human craft. Powered by real-time author profiles (API 2).
        </p>
      </div>

      {/* Controls Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EAE4D9]">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search authors by name, role or topic..."
            className="w-full bg-white border border-[#EAE4D9] rounded-full pl-9 pr-4 py-2 text-xs text-[#141416] placeholder:text-zinc-400 focus:outline-hidden focus:border-zinc-400 shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-zinc-500 overflow-x-auto pb-1 sm:pb-0">
          <span className="font-semibold text-zinc-700 shrink-0">Specialty:</span>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-[#141416] text-white font-semibold'
                  : 'bg-white border border-[#EAE4D9] text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#EAE4D9] animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-zinc-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-zinc-200 rounded-sm w-3/4"></div>
                  <div className="h-3 bg-zinc-100 rounded-sm w-1/2"></div>
                </div>
              </div>
              <div className="h-12 bg-zinc-100 rounded-sm"></div>
              <div className="h-8 bg-zinc-200 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : filteredAuthors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#EAE4D9] p-8 max-w-md mx-auto">
          <p className="font-editorial text-2xl text-zinc-800">No contributors found</p>
          <p className="text-xs text-zinc-500 mt-2">Try searching with a different name or specialty keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => {
            const isFollowing = !!followingMap[String(author.id)];
            return (
              <div
                key={author.id}
                className="bg-white rounded-2xl p-6 border border-[#EAE4D9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Avatar & Follow Button */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-[#FAF7F2] group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-editorial text-xl font-bold text-[#141416] leading-tight">
                          {author.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-[#9E5A38] uppercase tracking-wider mt-0.5">
                          {author.role}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollow(author.id)}
                      className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center space-x-1 ${
                        isFollowing
                          ? 'bg-[#2E4A3E] text-white hover:bg-[#233a30]'
                          : 'bg-[#FAF7F2] hover:bg-zinc-200 text-[#141416] border border-[#EAE4D9]'
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
                  <p className="text-xs text-zinc-600 leading-relaxed mb-4 line-clamp-3">
                    {author.bio}
                  </p>
                </div>

                {/* Footer Metrics & Action */}
                <div className="pt-4 border-t border-[#FAF7F2] flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-zinc-800">{author.articlesCount}</span>
                      <span>stories</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-zinc-800">{author.followers.toLocaleString()}</span>
                      <span>readers</span>
                    </div>
                  </div>

                  {onSelectAuthorArticles && (
                    <button
                      onClick={() => onSelectAuthorArticles(author.name)}
                      className="text-[#2E4A3E] hover:text-[#141416] font-semibold flex items-center space-x-1 group/btn cursor-pointer"
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
