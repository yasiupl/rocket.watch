"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromApi } from '@/lib/api';
import Loading from '@/components/Loading';
import PaginatedLaunchList from '@/components/PaginatedLaunchList';

export default function RocketDetail() {
  const params = useParams();
  const id = params.id as string;
  const [rocket, setRocket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const configData = await fetchFromApi(`config/launcher/${id}/`);
        setRocket(configData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (!rocket) return <div className="text-center py-12">Rocket not found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
         <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{rocket.name}</h1>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
           {rocket.description || "No description available."}
         </p>
         <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
            {rocket.family && <span>Family: {rocket.family}</span>}
            {rocket.variant && <span>Variant: {rocket.variant}</span>}
            {rocket.leo_capacity && <span>LEO: {rocket.leo_capacity}kg</span>}
            {rocket.gto_capacity && <span>GTO: {rocket.gto_capacity}kg</span>}
         </div>
      </div>

      <PaginatedLaunchList
         endpoint="launch/"
         baseParams={{ rocket__configuration__id: id }}
         title="Recent & Upcoming Launches"
         defaultSort="-net"
      />
    </div>
  );
}
