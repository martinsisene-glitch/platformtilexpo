import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import type { Screen } from '../App';

interface CompletionProps {
  onNavigate: (screen: Screen) => void;
  xp: number;
  answeredCount: number;
}

export function Completion({ onNavigate, xp, answeredCount }: CompletionProps) {
  const [revealed, setRevealed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fire = () =>
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#a3e635', '#facc15', '#22d3ee', '#f97316', '#ec4899'],
      });
    fire();
    const t = setTimeout(fire, 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-lime-50 to-cyan-50 p-6 overflow-y-auto">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.6 }}
        className="text-8xl mb-4"
      >
        🏆
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-black text-center border-b-8 border-black pb-4 mb-6"
      >
        RUTEN FULDFØRT!
      </motion.h1>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-white border-4 border-black p-3 text-center">
          <CheckCircle className="w-6 h-6 mx-auto text-lime-500 mb-1" />
          <p className="text-2xl font-black">{answeredCount}</p>
          <p className="text-xs font-bold text-gray-500">Checkpoints</p>
        </div>
        <div className="bg-white border-4 border-black p-3 text-center">
          <Star className="w-6 h-6 mx-auto text-yellow-400 fill-yellow-400 mb-1" />
          <p className="text-2xl font-black">{xp}</p>
          <p className="text-xs font-bold text-gray-500">XP Total</p>
        </div>
        <div className="bg-white border-4 border-black p-3 text-center">
          <MapPin className="w-6 h-6 mx-auto text-cyan-500 mb-1" />
          <p className="text-2xl font-black">4.2</p>
          <p className="text-xs font-bold text-gray-500">km</p>
        </div>
      </motion.div>

      {/* Gift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full max-w-sm mb-5"
      >
        <p className="text-center text-lg font-black mb-3">DIN BELØNNING 🎁</p>
        <button
          onClick={() => setRevealed(true)}
          className="w-full border-4 border-black rounded-xl py-6 hover:scale-[1.02] active:scale-95 transition-all text-center"
          style={{ background: revealed ? '#fef08a' : 'linear-gradient(135deg, #a3e635, #22d3ee)' }}
        >
          {!revealed ? (
            <span className="text-3xl font-black animate-pulse">🎁 TRYK FOR AT ÅBNE</span>
          ) : (
            <div>
              <div className="text-5xl mb-2">☕</div>
              <div className="text-2xl font-black">50% PÅ KAFFE!</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Gælder hos Café Brabrand</div>
            </div>
          )}
        </button>
      </motion.div>

      {/* "Tilbage" åbner feedback-modal — herefter forsiden */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        onClick={() => setShowFeedback(true)}
        className="w-full max-w-sm bg-white border-4 border-black rounded-full py-4 text-xl font-black hover:bg-gray-100 active:scale-95 transition-all"
      >
        🏠 TILBAGE TIL FORSIDEN
      </motion.button>

      {showFeedback && (
        <FeedbackModal onClose={() => onNavigate('home')} />
      )}
    </div>
  );
}
