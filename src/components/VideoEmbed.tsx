"use client";

import { useState } from 'react';

interface VideoEmbedProps {
  url: string;
}

export default function VideoEmbed({ url }: VideoEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(() => {
    try {
      // Basic extraction of YouTube video ID for embed
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      } else if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split('?')[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      // If it's already an embed link
      if (url.includes('youtube.com/embed')) return url;

      // Basic twitch embed support
      if (url.includes('twitch.tv/')) {
        const channel = url.split('twitch.tv/')[1].split('?')[0];
        return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
      }
    } catch (e) {
      console.error("Error parsing video URL", e);
    }
    return null;
  });

  if (!embedUrl) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 underline">
        Watch external video
      </a>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-slate-900" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={embedUrl}
        title="Video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}
