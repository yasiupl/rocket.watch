"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromApi } from '@/lib/api';
import Loading from '@/components/Loading';
import Countdown from '@/components/Countdown';
import VideoEmbed from '@/components/VideoEmbed';
import { format } from 'date-fns';
import { MapPin, Rocket, CalendarDays, Satellite, Info, Video, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LaunchDetail() {
  const params = useParams();
  const id = params.id as string;
  const [launch, setLaunch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const data = await fetchFromApi(`launch/${id}/`);
        setLaunch(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (!launch) return <div className="text-center py-12">Launch not found</div>;

  const hasVideo = launch.vidURLs && launch.vidURLs.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {launch.image && !hasVideo && (
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
          <img
            src={launch.image}
            alt={launch.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{launch.name}</h1>
            <p className="text-blue-200 text-lg">{launch.launch_service_provider?.name}</p>
          </div>
        </div>
      )}

      {hasVideo && (
        <div className="space-y-4">
           <VideoEmbed url={launch.vidURLs[0].url} />
           <div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">{launch.name}</h1>
              <p className="text-blue-600 dark:text-blue-400 text-lg">{launch.launch_service_provider?.name}</p>
           </div>
        </div>
      )}

      {!launch.image && !hasVideo && (
        <div>
           <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">{launch.name}</h1>
           <p className="text-blue-600 dark:text-blue-400 text-lg">{launch.launch_service_provider?.name}</p>
        </div>
      )}

      {launch.net && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700 text-center">
          <Countdown date={launch.net} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Mission Details
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {launch.mission?.description || 'No mission description available.'}
            </p>
          </div>

          {hasVideo && launch.vidURLs.length > 1 && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <Video className="h-5 w-5 text-blue-500" />
                 Other Streams
               </h2>
               <div className="flex flex-col gap-2">
                 {launch.vidURLs.slice(1).map((vid: any, i: number) => (
                    <a key={i} href={vid.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{vid.title || vid.url}</a>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700 space-y-4">
            <h2 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Launch Info</h2>

            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Date</p>
                <p className="text-slate-600 dark:text-slate-400">
                  {launch.net ? format(new Date(launch.net), 'PPP p') : 'TBD'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Location</p>
                <Link href={`/pad/${launch.pad?.id}`} className="text-blue-500 hover:underline block">
                  {launch.pad?.name}
                </Link>
                <Link href={`/location/${launch.pad?.location?.id}`} className="text-slate-600 dark:text-slate-400 hover:underline text-sm block">
                  {launch.pad?.location?.name}
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Rocket className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Rocket</p>
                <Link href={`/rocket/${launch.rocket?.configuration?.id}`} className="text-blue-500 hover:underline">
                  {launch.rocket?.configuration?.name}
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Agency</p>
                <Link href={`/agency/${launch.launch_service_provider?.id}`} className="text-blue-500 hover:underline">
                  {launch.launch_service_provider?.name}
                </Link>
              </div>
            </div>

            {launch.mission && (
              <div className="flex items-start gap-3">
                <Satellite className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Mission Type</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {launch.mission.type}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
