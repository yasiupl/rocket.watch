"use client";

import { useState, useEffect, Suspense } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { fetchFromApi, fetchSources } from '@/lib/api';
import LaunchCard from '@/components/LaunchCard';
import Loading from '@/components/Loading';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sources, setSources] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const sourcesData = await fetchSources();
        setSources(sourcesData);
      } catch (e) {
        console.error("Failed to load sources", e);
      }
    }
    init();
  }, []);

  const handleSearch = async (e?: React.FormEvent, q?: string) => {
    if (e) e.preventDefault();
    const searchQuery = q !== undefined ? q : query;
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await fetchFromApi('launch/', { search: searchQuery, limit: '24' });
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(undefined, initialQuery);
    }
  }, [initialQuery]);

  const collectionInfo = sources?.info?.search?.[query.toLowerCase()];

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search launches, missions, rockets..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-slate-50 dark:bg-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:text-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {collectionInfo && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6 p-6">
          {collectionInfo.img && (
            <img src={collectionInfo.img} alt={collectionInfo.name} className="h-32 object-contain" />
          )}
          <div className="flex-grow">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{collectionInfo.name}</h2>
             <p className="text-slate-700 dark:text-slate-300 mb-4">{collectionInfo.desc}</p>

             {collectionInfo.badges && collectionInfo.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                   {collectionInfo.badges.map((badge: any, i: number) => {
                      let href = badge.url;
                      if (href && href.startsWith('/#rocket=')) {
                          href = `/rocket/${href.split('=')[1]}`;
                      } else if (href && href.startsWith('#rocket=')) {
                          href = `/rocket/${href.split('=')[1]}`;
                      } else if (href && href.startsWith('/#collection=')) {
                          href = `/search?q=${href.split('=')[1]}`;
                      }

                      return (
                        <Link
                           key={i}
                           href={href || '#'}
                           className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                           title={badge.tip}
                        >
                           {badge.img && <img src={badge.img} alt={badge.name} className="h-4 w-4" />}
                           {badge.name}
                        </Link>
                      );
                   })}
                </div>
             )}
          </div>
        </div>
      )}

      {loading && <Loading />}

      {!loading && hasSearched && results.length === 0 && (
        <div className="text-center py-12 text-slate-600 dark:text-slate-400">
          No launches found for "{query}"
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}
    </>
  );
}

export default function Search() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Suspense fallback={<Loading />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
