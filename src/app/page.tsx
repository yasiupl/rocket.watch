"use client";

import { useEffect, useState } from 'react';
import { fetchFromApi } from '@/lib/api';
import LaunchCard from '@/components/LaunchCard';
import Loading from '@/components/Loading';

export default function Home() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchFromApi('launch/upcoming/', { limit: '6' });
        setUpcoming(data.results || []);
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
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Upcoming Launches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      </section>
    </div>
  );
}
