"use client";

import { useState, useEffect, useRef } from 'react';
import { Rocket } from 'lucide-react';

interface CountdownProps {
  date: string;
  updateTitle?: boolean;
  launchName?: string;
}

export default function Countdown({ date, updateTitle = false, launchName }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLaunched, setIsLaunched] = useState(false);
  const originalTitleRef = useRef<string>('');

  useEffect(() => {
    if (typeof document !== 'undefined') {
       originalTitleRef.current = document.title;
    }
  }, []);

  useEffect(() => {
    const launchDate = new Date(date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      let prefix = '';
      let absDistance = 0;
      if (distance < 0) {
        setIsLaunched(true);
        absDistance = Math.abs(distance);
        prefix = 'L+';
      } else {
        setIsLaunched(false);
        absDistance = distance;
        prefix = 'L-';
      }

      const days = Math.floor(absDistance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDistance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absDistance % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');

      let formatted = prefix;
      if (days > 0) formatted += ` ${days}d`;
      formatted += ` ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

      setTimeLeft(formatted);

      if (updateTitle && typeof document !== 'undefined') {
          // Bypassing Next.js `<title>` override behavior
          const headTitle = document.querySelector('head > title');
          if (headTitle) {
              headTitle.textContent = `[${formatted}] ${launchName || 'rocket.watch'}`;
          }
          document.title = `[${formatted}] ${launchName || 'rocket.watch'}`;
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => {
        clearInterval(interval);
    };
  }, [date, updateTitle, launchName]);

  return (
    <div className={`text-4xl md:text-5xl font-mono font-bold flex items-center justify-center gap-4 ${isLaunched ? 'text-green-500' : 'text-blue-500'}`}>
      <Rocket className={`h-10 w-10 ${!isLaunched && 'animate-pulse'}`} />
      {timeLeft}
    </div>
  );
}
