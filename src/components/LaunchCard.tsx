import Link from 'next/link';
import { format } from 'date-fns';
import { Rocket, MapPin, CalendarDays, Satellite } from 'lucide-react';

export default function LaunchCard({ launch }: { launch: any }) {
  const statusColor =
    launch.status?.id === 3 ? 'text-green-600 bg-green-100 dark:bg-green-900/30' :
    launch.status?.id === 4 ? 'text-red-600 bg-red-100 dark:bg-red-900/30' :
    'text-blue-600 bg-blue-100 dark:bg-blue-900/30';

  return (
    <Link href={`/launch/${launch.id}`} className="block">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-slate-200 dark:border-slate-700">
        <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
          {launch.image && (
            <img
              src={launch.image}
              alt={launch.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold uppercase ${statusColor}`}>
            {launch.status?.name || 'Unknown'}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white line-clamp-2">
            {launch.name}
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-auto">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{launch.net ? format(new Date(launch.net), 'PPP p') : 'TBD'}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{launch.pad?.location?.name || 'Unknown Location'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              <span className="line-clamp-1">{launch.rocket?.configuration?.name || 'Unknown Rocket'}</span>
            </div>
            {launch.mission && (
              <div className="flex items-center gap-2">
                <Satellite className="h-4 w-4" />
                <span className="line-clamp-1">{launch.mission.type}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
