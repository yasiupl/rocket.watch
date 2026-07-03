"use client";

import { useState, useEffect } from 'react';
import { fetchFromApi } from '@/lib/api';
import LaunchCard from '@/components/LaunchCard';
import Loading from '@/components/Loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginatedLaunchListProps {
  endpoint: string;
  baseParams?: Record<string, string>;
  title?: string;
  defaultSort?: string;
}

export default function PaginatedLaunchList({ endpoint, baseParams = {}, title, defaultSort = '' }: PaginatedLaunchListProps) {
  const [launches, setLaunches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState(defaultSort);

  const limit = 24;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          ...baseParams,
          limit: limit.toString(),
          offset: offset.toString()
        };
        if (sort) {
          params.ordering = sort;
        }

        const data = await fetchFromApi(endpoint, params);
        setLaunches(data.results || []);
        setTotal(data.count || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLaunches([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [endpoint, JSON.stringify(baseParams), offset, sort]);

  const handlePrev = () => setOffset((prev) => Math.max(0, prev - limit));
  const handleNext = () => setOffset((prev) => Math.min(total - (total % limit === 0 ? limit : total % limit), prev + limit));

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {title && <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>}

        <div className="flex items-center gap-4 ml-auto">
           <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setOffset(0); }}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
              <option value="">Default Sorting</option>
              <option value="net">Date (Ascending)</option>
              <option value="-net">Date (Descending)</option>
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
           </select>
        </div>
      </div>

      {loading && <Loading />}

      {!loading && launches.length === 0 && (
        <div className="text-center py-12 text-slate-600 dark:text-slate-400">
          No launches found.
        </div>
      )}

      {!loading && launches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {launches.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}

      {total > limit && (
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6 mt-8">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Showing <span className="font-medium">{offset + 1}</span> to <span className="font-medium">{Math.min(offset + limit, total)}</span> of <span className="font-medium">{total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={offset === 0 || loading}
              className="p-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium px-2">
               Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={offset + limit >= total || loading}
              className="p-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
