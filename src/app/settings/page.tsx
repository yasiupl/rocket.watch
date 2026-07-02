"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function Settings() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check local storage or html class
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">

        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Appearance
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Toggle between light and dark themes.
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'bg-blue-600' : 'bg-slate-200'}`}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">About</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            rocket.watch v2.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
