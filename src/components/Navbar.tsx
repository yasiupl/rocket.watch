"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Rocket, Search, Settings, Menu, X, Rocket as RocketIcon, MapPin, CalendarDays, History } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Home', icon: RocketIcon },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/future', label: 'Upcoming', icon: CalendarDays },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Rocket className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-xl tracking-tight">rocket.watch</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center">
             <Link
                href="/settings"
                className="p-2 rounded-full text-slate-500 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <Settings className="h-5 w-5" />
             </Link>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 pl-3 pr-4 py-3 border-l-4 text-base font-medium ${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-slate-700/50 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
             <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Settings className="h-5 w-5" />
                Settings
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
