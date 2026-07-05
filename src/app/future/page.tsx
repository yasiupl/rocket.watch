"use client";

import PaginatedLaunchList from '@/components/PaginatedLaunchList';

export default function Future() {
  return (
    <div className="max-w-7xl mx-auto">
      <PaginatedLaunchList
         endpoint="launch/upcoming/"
         title="Upcoming Launches"
         defaultSort="net"
      />
    </div>
  );
}
