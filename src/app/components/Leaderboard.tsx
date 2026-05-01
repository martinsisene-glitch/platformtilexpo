import { ArrowLeft, Star, Trophy } from 'lucide-react';
import type { Screen } from '../App';

interface LeaderboardProps {
  onNavigate: (screen: Screen) => void;
  xp: number;
}

const MEDAL = ['🥇', '🥈', '🥉'];
const ROW_BG = ['bg-yellow-50 border-yellow-400', 'bg-gray-50 border-gray-400', 'bg-orange-50 border-orange-300'];

export function Leaderboard({ onNavigate, xp }: LeaderboardProps) {
  const userScore = 950 + xp;

  const players = [
    { name: 'Elefant', score: 1420, isUser: false },
    { name: 'Tapir', score: 1100, isUser: false },
    { name: 'Bæner123', score: userScore, isUser: true },
    { name: 'Sølove', score: 850, isUser: false },
    { name: 'Tiger', score: 720, isUser: false },
    { name: 'Panda', score: 680, isUser: false },
  ]
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, position: i + 1 }));

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b-4 border-black">
        <button onClick={() => onNavigate('home')} className="p-2 mr-3 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
        <h1 className="text-2xl font-black flex-1">LEADERBOARD</h1>
        <div className="flex items-center gap-1 text-yellow-600 font-bold">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          {xp}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {players.map((player) => (
          <div
            key={player.name}
            className={`flex items-center gap-4 p-4 border-4 ${
              player.isUser
                ? 'border-lime-500 bg-lime-50'
                : player.position <= 3
                ? ROW_BG[player.position - 1]
                : 'border-black bg-white'
            }`}
          >
            {/* Rank */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-black text-2xl font-black ${
              player.position <= 3 ? 'bg-white' : 'bg-gray-100'
            }`}>
              {player.position <= 3 ? MEDAL[player.position - 1] : player.position}
            </div>

            {/* Name */}
            <div className="flex-1">
              <p className="font-black text-lg">{player.name}</p>
              {player.isUser && <p className="text-xs text-lime-600 font-bold uppercase">Dig</p>}
            </div>

            {/* Score */}
            <div className="flex items-center gap-1 font-black text-xl">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {player.score}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-cyan-50 border-t-4 border-black">
        <p className="text-center font-bold">Fuldfør flere ruter for at klatre på listen! 🏆</p>
      </div>
    </div>
  );
}
