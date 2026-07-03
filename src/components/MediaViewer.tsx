"use client";

import { useState } from 'react';
import { Tweet } from 'react-tweet';
import { Play, ExternalLink } from 'lucide-react';

interface MediaItem {
  title: string;
  url: string;
  type: 'youtube' | 'twitch' | 'twitter' | 'external';
  videoId?: string;
}

interface MediaViewerProps {
  media: MediaItem[];
}

export default function MediaViewer({ media }: MediaViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media || media.length === 0) return null;

  const activeMedia = media[activeIndex];

  const renderPlayer = () => {
    switch (activeMedia.type) {
      case 'youtube':
        return (
          <div className="relative w-full h-full bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${activeMedia.videoId}?autoplay=1`}
              title={activeMedia.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'twitch':
        return (
          <div className="relative w-full h-full bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://player.twitch.tv/?channel=${activeMedia.videoId}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true`}
              title={activeMedia.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'twitter':
        return (
          <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 flex justify-center items-start pt-4">
            <div className="w-full max-w-md">
               <Tweet id={activeMedia.videoId!} />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <ExternalLink className="h-16 w-16 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeMedia.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              This media source cannot be embedded directly.
            </p>
            <a
              href={activeMedia.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Open in new tab <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Player Section */}
      <div className="flex-grow lg:w-3/4 relative" style={{ minHeight: '300px', aspectRatio: '16/9' }}>
        {renderPlayer()}
      </div>

      {/* Playlist Section */}
      <div className="lg:w-1/4 flex flex-col max-h-[500px] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white">
          Available Streams
        </div>
        <div className="flex-1 overflow-y-auto">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                index === activeIndex
                  ? 'bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-500'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 border-transparent'
              }`}
            >
              <div className={`mt-1 flex-shrink-0 ${index === activeIndex ? 'text-blue-500' : 'text-slate-400'}`}>
                {item.type === 'external' ? <ExternalLink className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium line-clamp-2 ${index === activeIndex ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 capitalize mt-1">
                  {item.type}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
