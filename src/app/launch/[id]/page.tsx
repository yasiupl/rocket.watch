"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromApi, fetchSources } from '@/lib/api';
import Loading from '@/components/Loading';
import Countdown from '@/components/Countdown';
import MediaViewer from '@/components/MediaViewer';
import { format } from 'date-fns';
import { MapPin, Rocket, CalendarDays, Satellite, Info, Building2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Helper to parse media URLs
function parseMedia(url: string, defaultTitle: string = "Stream") {
  if (!url) return null;

  let cleanUrl = url;
  if (cleanUrl.startsWith('//')) {
    cleanUrl = `https:${cleanUrl}`;
  }

  const result = {
    title: defaultTitle,
    url: cleanUrl,
    type: 'external' as 'external' | 'youtube' | 'twitch' | 'twitter' | 'audio',
    videoId: ''
  };

  try {
    const urlObj = new URL(cleanUrl);
    const host = urlObj.hostname.toLowerCase();

    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      result.type = 'youtube';
      result.videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop() || '';
    } else if (host.includes('twitch.tv')) {
      result.type = 'twitch';
      result.videoId = urlObj.pathname.split('/')[1];
    } else if (host.includes('twitter.com') || host.includes('x.com')) {
       if (urlObj.pathname.includes('/status/')) {
          result.type = 'twitter';
          result.videoId = urlObj.pathname.split('/').pop() || '';
       }
    } else if (cleanUrl.endsWith('.mp3') || cleanUrl.endsWith('.m3u8')) {
        result.type = 'audio';
    }
  } catch (e) {}

  return result;
}

export default function LaunchDetail() {
  const params = useParams();
  const id = params.id as string;
  const [launch, setLaunch] = useState<any>(null);
  const [sources, setSources] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const originalTitleRef = useRef<string>('');

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [data, sourcesData] = await Promise.all([
          fetchFromApi(`launch/${id}/`),
          fetchSources()
        ]);
        setLaunch(data);
        setSources(sourcesData);
        // Initially set the title.
        const isUpcomingGo = data.status?.id === 1 || data.status?.id === 6;
        if (!isUpcomingGo || !data.net) {
            document.title = `${data.name} | rocket.watch`;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (typeof document !== 'undefined') {
       originalTitleRef.current = document.title;
    }
    loadData();

    return () => {
       if (typeof document !== 'undefined') {
          document.title = originalTitleRef.current || 'rocket.watch';
       }
    };
  }, [id]);

  if (loading) return <Loading />;
  if (!launch) return <div className="text-center py-12">Launch not found</div>;

  // Aggregate Media List
  const mediaList: any[] = [];

  if (launch.vidURLs) {
    launch.vidURLs.forEach((vid: any, idx: number) => {
      const parsed = parseMedia(vid.url, vid.title || `Official Stream ${idx + 1}`);
      if (parsed) mediaList.push(parsed);
    });
  }

  const customLinks: any[] = [];
  if (sources && sources.custom) {
    const pushCustom = (arr: any[]) => {
      arr.forEach(item => {
        if (item.url) {
           if (item.is === 'video' || item.is === 'audio' || item.name?.toLowerCase().includes('live')) {
              const parsed = parseMedia(item.url, item.name || "Custom Stream");
              if (parsed) {
                  if (item.is === 'audio') parsed.type = 'audio';
                  mediaList.push(parsed);
              }
           } else {
              customLinks.push(item);
           }
        }
      });
    };

    if (launch.launch_service_provider?.abbrev && sources.custom.byAgency && sources.custom.byAgency[launch.launch_service_provider.abbrev.toLowerCase()]) {
      pushCustom(sources.custom.byAgency[launch.launch_service_provider.abbrev.toLowerCase()]);
    }
    if (launch.pad?.location?.id && sources.custom.byLocationID && sources.custom.byLocationID[launch.pad.location.id]) {
      pushCustom(sources.custom.byLocationID[launch.pad.location.id]);
    }
    if (launch.mission?.name && sources.custom.byMissionName && sources.custom.byMissionName[launch.mission.name]) {
      pushCustom(sources.custom.byMissionName[launch.mission.name]);
    }
    if (sources.custom.byMissionId && sources.custom.byMissionId[id]) {
      pushCustom(sources.custom.byMissionId[id]);
    }
  }

  const hasMedia = mediaList.length > 0;

  // Decide whether to show countdown or status text
  const isUpcomingGo = launch.status?.id === 1 || launch.status?.id === 6; // 1: Go for Launch, 6: In Flight
  const isTBD = launch.status?.id === 2 || launch.status?.id === 8;
  const isSuccess = launch.status?.id === 3;
  const isFailure = launch.status?.id === 4;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {launch.image && !hasMedia && (
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto">
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

      {hasMedia && (
        <div className="space-y-4 max-w-6xl mx-auto">
           <MediaViewer media={mediaList} bgImage={launch.image} />
           <div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">{launch.name}</h1>
              <p className="text-blue-600 dark:text-blue-400 text-lg">{launch.launch_service_provider?.name}</p>
           </div>
        </div>
      )}

      {!launch.image && !hasMedia && (
        <div className="max-w-4xl mx-auto">
           <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">{launch.name}</h1>
           <p className="text-blue-600 dark:text-blue-400 text-lg">{launch.launch_service_provider?.name}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {(isUpcomingGo && launch.net) && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700 text-center">
            {/* The `updateTitle` prop explicitly tells the Countdown component to take over the document title */}
            <Countdown date={launch.net} updateTitle={true} launchName={launch.name} />
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl shadow border border-green-200 dark:border-green-800 text-center text-green-800 dark:text-green-200">
             <h3 className="text-2xl font-bold uppercase tracking-wider">{launch.status.name}</h3>
             <p className="mt-2">This mission completed successfully.</p>
          </div>
        )}

        {isFailure && (
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow border border-red-200 dark:border-red-800 flex items-center justify-center gap-3 text-red-800 dark:text-red-200">
            <AlertCircle className="h-8 w-8 flex-shrink-0" />
            <div className="text-left">
                <p className="font-bold text-xl uppercase tracking-wider">Launch Failure</p>
                <p className="mt-1">{launch.status.description || "The launch did not succeed."}</p>
            </div>
          </div>
        )}

        {isTBD && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl shadow border border-yellow-200 dark:border-yellow-800 flex items-center justify-center gap-3 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-8 w-8 flex-shrink-0" />
            <div className="text-left">
                <p className="font-bold text-xl uppercase tracking-wider">{launch.status.name}</p>
                <p className="mt-1">{launch.status.description || "The launch date is not yet confirmed."}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

          {customLinks.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <LinkIcon className="h-5 w-5 text-blue-500" />
                 Curated Resources
               </h2>
               <div className="flex flex-col gap-3">
                 {customLinks.map((link: any, i: number) => {
                    let href = link.url;
                    if (href && href.startsWith('//')) {
                       href = `https:${href}`;
                    }
                    return href && (
                      <a key={i} href={href} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-start gap-2">
                        <LinkIcon className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span>{link.name || href}</span>
                      </a>
                    );
                 })}
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
                <Link href={`/rocket/${launch.rocket?.configuration?.id}`} className="text-blue-500 hover:underline block">
                  {launch.rocket?.configuration?.name}
                </Link>
                {launch.rocket?.configuration?.family && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">Family: {launch.rocket.configuration.family}</span>
                )}
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
