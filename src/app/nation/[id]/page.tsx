"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromApi } from '@/lib/api';
import Loading from '@/components/Loading';
import LaunchCard from '@/components/LaunchCard';

export default function NationDetail() {
  const params = useParams();
  const id = params.id as string;
  const [launches, setLaunches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const launchData = await fetchFromApi('launch/', { location__country_code: id, limit: '12' });
        setLaunches(launchData.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
         <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Country Code: {id}</h1>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent & Upcoming Launches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {launches.map(launch => <LaunchCard key={launch.id} launch={launch} />)}
      </div>
    </div>
  );
}
