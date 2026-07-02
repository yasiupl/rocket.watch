"use client";

import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';

interface CountdownProps {
  date: string;
}

export default function Countdown({ date }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const launchDate = new Date(date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        setIsLaunched(true);
        const absDistance = Math.abs(distance);
        formatTime(absDistance, 'L+');
      } else {
        setIsLaunched(false);
        formatTime(distance, 'L-');
      }
    };

    const formatTime = (ms: number, prefix: string) => {
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');

      let formatted = prefix;
      if (days > 0) formatted += ` ${days}d`;
      formatted += ` ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

      setTimeLeft(formatted);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className={`text-4xl md:text-5xl font-mono font-bold flex items-center justify-center gap-4 ${isLaunched ? 'text-green-500' : 'text-blue-500'}`}>
      <Rocket className={`h-10 w-10 ${!isLaunched && 'animate-pulse'}`} />
      {timeLeft}
    </div>
  );
}
