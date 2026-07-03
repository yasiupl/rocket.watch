"use client";

import { useParams } from 'next/navigation';
import PaginatedLaunchList from '@/components/PaginatedLaunchList';

export default function NationDetail() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
         <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Country Code: {id}</h1>
      </div>

      <PaginatedLaunchList
         endpoint="launch/"
         baseParams={{ location__country_code: id }}
         title="Recent & Upcoming Launches"
         defaultSort="-net"
      />
    </div>
  );
}
