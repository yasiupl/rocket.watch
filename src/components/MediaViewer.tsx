"use client";

import { useState } from 'react';
import { Tweet } from 'react-tweet';
import { Play, ExternalLink, AudioLines, Columns } from 'lucide-react';

interface MediaItem {
  title: string;
  url: string;
  type: 'youtube' | 'twitch' | 'twitter' | 'audio' | 'external';
  videoId?: string;
}

interface MediaViewerProps {
  media: MediaItem[];
  bgImage?: string;
}

export default function MediaViewer({ media, bgImage }: MediaViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [splitMode, setSplitMode] = useState(false);
  const [secondaryIndex, setSecondaryIndex] = useState(media.length > 1 ? 1 : 0);

  if (!media || media.length === 0) return null;

  const activeMedia = media[activeIndex];
  const secondaryMedia = media[secondaryIndex];

  const renderPlayer = (m: MediaItem) => {
    switch (m.type) {
      case 'youtube':
        return (
          <div className="relative w-full h-full bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full z-10"
              src={`https://www.youtube.com/embed/${m.videoId}?autoplay=1`}
              title={m.title}
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
              className="absolute top-0 left-0 w-full h-full z-10"
              src={`https://player.twitch.tv/?channel=${m.videoId}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true`}
              title={m.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'twitter':
        return (
          <div className="relative w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 flex justify-center items-start pt-4 z-10">
            <div className="w-full max-w-md">
               <Tweet id={m.videoId!} />
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900 overflow-hidden">
            {bgImage && (
              <>
                 <img src={bgImage} alt="background" className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-0"></div>
              </>
            )}
            <div className="relative z-10 space-y-6 w-full max-w-md">
              <AudioLines className="h-16 w-16 text-blue-500 mx-auto" />
              <h3 className="text-2xl font-bold text-white">{m.title}</h3>
              <audio controls className="w-full" autoPlay>
                 <source src={m.url} type="audio/mpeg" />
                 Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-6 overflow-hidden">
             {bgImage && (
              <>
                 <img src={bgImage} alt="background" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm z-0" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-0"></div>
              </>
             )}
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <ExternalLink className="h-16 w-16 text-white" />
              <h3 className="text-2xl font-bold text-white">{m.title}</h3>
              <p className="text-blue-100 max-w-md">
                This media source cannot be embedded directly.
              </p>
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                Open in new tab <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Player Section */}
      <div className={`flex-grow relative flex ${splitMode ? 'flex-col md:flex-row' : ''}`} style={{ minHeight: '400px' }}>
        <div className="flex-1 w-full" style={!splitMode ? { aspectRatio: '16/9' } : {}}>
            {renderPlayer(activeMedia)}
        </div>
        {splitMode && (
          <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-slate-700">
            {renderPlayer(secondaryMedia)}
          </div>
        )}
      </div>

      {/* Playlist Section */}
      <div className="lg:w-1/4 flex flex-col max-h-[400px] lg:max-h-auto lg:h-auto border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white flex justify-between items-center">
          <span>Available Streams</span>
          {media.length > 1 && (
            <button
              onClick={() => setSplitMode(!splitMode)}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors"
              title="Toggle split view"
            >
              <Columns className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {media.map((item, index) => {
            let Icon = Play;
            if (item.type === 'external') Icon = ExternalLink;
            if (item.type === 'audio') Icon = AudioLines;

            const isPrimary = index === activeIndex;
            const isSecondary = splitMode && index === secondaryIndex;

            return (
              <button
                key={index}
                onClick={() => {
                   if (splitMode) {
                      if (!isPrimary) setSecondaryIndex(index);
                   } else {
                      setActiveIndex(index);
                   }
                }}
                className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                  isPrimary
                    ? 'bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-500'
                    : isSecondary ? 'bg-indigo-50 dark:bg-slate-700/80 border-l-4 border-indigo-400'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 border-transparent'
                }`}
              >
                <div className={`mt-1 flex-shrink-0 ${isPrimary ? 'text-blue-500' : isSecondary ? 'text-indigo-400' : 'text-slate-400'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium line-clamp-2 ${isPrimary ? 'text-blue-700 dark:text-blue-400' : isSecondary ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 capitalize mt-1">
                    {item.type} {isPrimary && '(Primary)'} {isSecondary && '(Secondary)'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
