"use client";

import PaginatedLaunchList from '@/components/PaginatedLaunchList';

export default function History() {
  return (
    <div className="max-w-7xl mx-auto">
      <PaginatedLaunchList
         endpoint="launch/previous/"
         title="Past Launches"
         defaultSort="-net"
      />
    </div>
  );
}
