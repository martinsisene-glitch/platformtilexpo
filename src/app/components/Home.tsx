import { Flame, Star, Lock, MapPin, Trophy } from 'lucide-react';
import type { Screen } from '../App';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
  xp: number;
  streak: number;
}

const XP_PER_LEVEL = 500;

export function Home({ onNavigate, xp, streak }: HomeProps) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const levelProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL;

  const routes = [
    {
      name: 'Brabrand Søen',
      color: 'bg-cyan-400',
      active: true,
      distance: '4.2 km',
      difficulty: 'Let',
    },
    {
      name: 'Sølyst',
      color: 'bg-lime-300',
      active: false,
      distance: '2.8 km',
      difficulty: 'Let',
    },
    {
      name: 'Hasle Bakker',
      color: 'bg-green-400',
      active: false,
      distance: '6.1 km',
      difficulty: 'Moderat',
    },
  ];

  // 3 badges — Søfarer removed
  const badges = [
    { emoji: '🌿', name: 'Naturven', earned: true },
    { emoji: '🦆', name: 'Fuglekigger', earned: true },
    { emoji: '🏃', name: 'Løber', earned: false },
  ];

  const friends = [
    { name: 'Sølove', score: 850 },
    { name: 'Elefant', score: 1420 },
    { name: 'Tapir', score: 1100 },
  ].sort((a, b) => b.score - a.score);

  // Podium order: silver (2nd), gold (1st), bronze (3rd)
  const podiumOrder = [friends[1], friends[0], friends[2]];
  const podiumHeights = ['h-20', 'h-32', 'h-16'];
  const podiumColors  = ['bg-gray-300', 'bg-yellow-300', 'bg-orange-300'];
  const podiumMedals  = ['🥈', '🥇', '🥉'];

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Top bar — no hearts */}
      <div className="bg-white border-b-4 border-black p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-1 bg-orange-100 border-2 border-orange-400 rounded-full px-3 py-1">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span className="font-bold text-orange-600">{streak} dage</span>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 border-2 border-yellow-400 rounded-full px-3 py-1">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-yellow-600">{xp} XP</span>
        </div>
        <button onClick={() => onNavigate('leaderboard')} className="p-1">
          <Trophy className="w-6 h-6" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* User + level */}
        <div>
          <h1 className="text-2xl font-black mb-3">VELKOMMEN BÆNER123!</h1>
          <div className="bg-white border-4 border-black p-3">
            <div className="flex justify-between text-sm font-bold mb-1">
              <span>NIVEAU {level}</span>
              <span>{xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP</span>
            </div>
            <div className="h-4 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-400 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Routes */}
        <section>
          <div className="border-b-4 border-black pb-2 mb-4">
            <h2 className="text-xl font-black">TILGÆNGELIGE RUTER</h2>
          </div>
          <div className="space-y-3">
            {routes.map((route, i) => (
              <button
                key={i}
                onClick={() => route.active && onNavigate('route')}
                disabled={!route.active}
                className={`w-full flex items-center gap-4 p-4 border-4 border-black bg-white transition-all
                  ${route.active
                    ? 'hover:bg-gray-50 active:scale-95 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed grayscale'
                  }`}
              >
                {/* Icon circle */}
                <div className={`w-14 h-14 rounded-full ${route.color} border-4 border-black flex items-center justify-center flex-shrink-0 relative`}>
                  {route.active ? (
                    <MapPin className="w-6 h-6" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-600" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <p className="font-black text-lg">{route.name}</p>
                  <p className="text-sm text-gray-500">{route.distance} · {route.difficulty}</p>
                  {!route.active && (
                    <p className="text-xs text-gray-400 mt-0.5 font-bold">🔒 Kommer snart</p>
                  )}
                </div>

                {route.active && <span className="text-2xl font-black">→</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Badges — 3 badges, no Søfarer */}
        <section>
          <div className="border-b-4 border-black pb-2 mb-4">
            <h2 className="text-xl font-black">BADGES</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-20 h-20 rounded-full border-4 border-black flex items-center justify-center text-4xl
                    ${badge.earned ? 'bg-yellow-300' : 'bg-gray-200 opacity-40 grayscale'}`}
                >
                  {badge.emoji}
                </div>
                <span className="text-xs text-center font-bold">{badge.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Friends podium */}
        <section>
          <div className="border-b-4 border-black pb-2 mb-4">
            <h2 className="text-xl font-black">VENNER</h2>
          </div>
          <button onClick={() => onNavigate('leaderboard')} className="w-full">
            <div className="flex justify-center gap-3 items-end hover:opacity-80 transition-opacity">
              {podiumOrder.map((friend, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-2xl mb-1">{podiumMedals[i]}</span>
                  <div
                    className={`w-20 ${podiumHeights[i]} ${podiumColors[i]} border-4 border-black flex items-end justify-center pb-2`}
                  >
                    <span className="font-black text-sm">{friend.score}</span>
                  </div>
                  <span className="text-xs mt-1 font-bold">{friend.name}</span>
                </div>
              ))}
            </div>
          </button>
        </section>
      </div>
    </div>
  );
}
