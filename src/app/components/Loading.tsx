import type { Screen } from '../App';
import { useEffect, useState } from 'react';

interface LoadingProps {
  onNavigate: (screen: Screen) => void;
}

export function Loading({ onNavigate }: LoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 2));
    }, 55);
    const timer = setTimeout(() => onNavigate('home'), 3000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onNavigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white p-8">
      <div className="text-center mb-10">
        <h1 className="text-7xl font-black leading-tight">EXPLORE</h1>
        <h1 className="text-7xl font-black text-lime-500 leading-tight">BRABRAND</h1>
        <p className="text-gray-400 mt-2 text-lg">Opdager naturen omkring dig</p>
      </div>

      <div className="flex gap-8 mb-12">
        {['🌿', '🦆', '🌊'].map((emoji, i) => (
          <span
            key={i}
            className="text-5xl animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="w-full max-w-xs">
        <div className="h-5 bg-gray-200 border-4 border-black rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-lime-400 transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-gray-500 text-sm">HENTER INDHOLD... {progress}%</p>
      </div>
    </div>
  );
}
