"use client";

import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';

// Dynamically import the map component with SSR disabled
const LocationsMap = dynamic(() => import('@/components/LocationsMap'), {
  ssr: false,
  loading: () => <Loading />
});

export default function Locations() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Global Launch Sites</h1>
         <p className="text-slate-600 dark:text-slate-400">Explore rocket launch pads around the world.</p>
      </div>

      <LocationsMap />
    </div>
  );
}
