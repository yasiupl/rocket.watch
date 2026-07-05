"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromApi } from '@/lib/api';
import Loading from '@/components/Loading';
import PaginatedLaunchList from '@/components/PaginatedLaunchList';

export default function LocationDetail() {
  const params = useParams();
  const id = params.id as string;
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const locData = await fetchFromApi(`location/${id}/`);
        setLocation(locData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (!location) return <div className="text-center py-12">Location not found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
         <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{location.name}</h1>
         <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
            {location.country_code && <span>Country Code: {location.country_code}</span>}
            {location.total_launch_count !== undefined && <span>Total Launches: {location.total_launch_count}</span>}
         </div>
      </div>

      <PaginatedLaunchList
         endpoint="launch/"
         baseParams={{ location__id: id }}
         title="Recent & Upcoming Launches"
         defaultSort="-net"
      />
    </div>
  );
}
