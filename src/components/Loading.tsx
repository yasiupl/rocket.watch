import { Rocket } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <div className="animate-bounce mb-4">
        <Rocket className="h-16 w-16 text-blue-500" />
      </div>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Loading...</h2>
    </div>
  );
}
