"use client";

import { useEffect, useState } from 'react';
import { fetchFromApi, fetchSources } from '@/lib/api';
import LaunchCard from '@/components/LaunchCard';
import Loading from '@/components/Loading';
import Link from 'next/link';

export default function Home() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [sources, setSources] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [data, sourcesData] = await Promise.all([
          fetchFromApi('launch/upcoming/', { limit: '6' }),
          fetchSources()
        ]);
        setUpcoming(data.results || []);
        setSources(sourcesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-12">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Launches</h2>
          <Link href="/future" className="text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      </section>

      {sources && sources.featuring && (
        <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Curated Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sources.featuring.map((feature: any, i: number) => {
              // The original JSON structure for featuring is like {"url": "?search=starship", "img": "url", "title": "Starship"}
              let href = feature.url;
              if (href && href.startsWith('?search=')) {
                href = `/search?q=${href.split('=')[1]}`;
              } else if (href && href.startsWith('?collection=')) {
                href = `/search?q=${href.split('=')[1]}`;
              }

              return (
                <Link key={i} href={href || '/'} className="group block text-center space-y-4">
                   <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 group-hover:border-blue-500 transition-colors">
                      <img src={feature.img} alt={feature.title} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{feature.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
