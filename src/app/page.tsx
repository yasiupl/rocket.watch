"use client";

import { useEffect, useState } from 'react';
import { fetchFromApi, fetchSources } from '@/lib/api';
import LaunchCard from '@/components/LaunchCard';
import Loading from '@/components/Loading';
import Link from 'next/link';

export default function Home() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [sources, setSources] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dataUpcoming, dataPast, sourcesData] = await Promise.all([
          fetchFromApi('launch/upcoming/', { limit: '4' }), // 1 featured + 3 cards
          fetchFromApi('launch/previous/', { limit: '3' }),
          fetchSources()
        ]);
        setUpcoming(dataUpcoming.results || []);
        setPast(dataPast.results || []);
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

  const featured = upcoming.length > 0 ? upcoming[0] : null;
  const nextLaunches = upcoming.length > 1 ? upcoming.slice(1) : [];

  return (
    <div className="space-y-12">
      {featured && (
        <section>
          <Link href={`/launch/${featured.id}`} className="block relative h-96 rounded-xl overflow-hidden shadow-lg group">
             {featured.image ? (
                <img src={featured.image} alt={featured.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             ) : (
                <div className="w-full h-full bg-slate-800"></div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
             <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-3 mb-3">
                   <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded uppercase tracking-wider">Next Launch</span>
                   <span className="text-blue-200 text-sm font-medium">{featured.launch_service_provider?.name}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{featured.name}</h1>
                <p className="text-slate-300 text-lg max-w-3xl line-clamp-2">{featured.mission?.description}</p>
             </div>
          </Link>
        </section>
      )}

      {nextLaunches.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Launches</h2>
            <Link href="/future" className="text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextLaunches.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        </section>
      )}

      {sources && sources.featuring && (
        <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Curated Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.featuring.map((feature: any, i: number) => {
              let href = feature.url;
              if (href && href.startsWith('/?search=')) {
                href = `/search?q=${href.split('=')[1]}`;
              } else if (href && href.startsWith('/?collection=')) {
                href = `/search?q=${href.split('=')[1]}`;
              } else if (href && href.startsWith('/#search=')) {
                 href = `/search?q=${href.split('=')[1]}`;
              } else if (href && href.startsWith('/#collection=')) {
                 href = `/search?q=${href.split('=')[1]}`;
              } else if (href && href.startsWith('#rocket=')) {
                 href = `/rocket/${href.split('=')[1]}`;
              } else if (href && href.startsWith('/#rocket=')) {
                 href = `/rocket/${href.split('=')[1]}`;
              }

              let imgSrc = feature.img;
              if (imgSrc && imgSrc.startsWith('./assets/')) {
                  imgSrc = imgSrc.replace('./assets/', '/assets/');
              } else if (imgSrc && imgSrc.startsWith('assets/')) {
                  imgSrc = '/' + imgSrc;
              }

              return (
                <Link key={i} href={href || '/'} className="group block text-center space-y-4">
                   <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 group-hover:border-blue-500 transition-colors">
                      <img src={imgSrc} alt={feature.name || feature.title} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{feature.name || feature.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Launches</h2>
            <Link href="/history" className="text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
