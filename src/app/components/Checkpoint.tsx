import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, Zap } from 'lucide-react';
import type { Screen } from '../App';

interface CheckpointProps {
  checkpointNumber: number;
  onCorrect: (xpEarned: number) => void;
  onNavigate: (screen: Screen) => void;
  xp: number;
}

const TIMER_SECONDS = 20;
const MAX_XP = 300;
const MIN_XP = 50;

const questions = [
  {
    title: 'CHECKPOINT 1 🌳',
    question: 'HVAD HJÆLPER TRÆER MED AT GØRE FOR VORES LUFT?',
    answers: ['Forurene luften', 'Rense luften og give ilt', 'Lave regn', 'Lave støj'],
    correctAnswer: 1,
    fact: 'Træer er klimahelte! De suger CO₂ ind og sender frisk ilt ud, som vi ånder. 🌳',
  },
  {
    title: 'CHECKPOINT 2 ♻️',
    question: 'HVAD GØR DU, HVIS DU FINDER PLASTIK VED SØEN?',
    answers: ['Smider det i vandet', 'Lader det ligge', 'Samler det op i skraldespanden', 'Giver det til en fugl'],
    correctAnswer: 2,
    fact: 'Plastik er farligt for fisk og fugle! Saml altid affald op – naturen siger tak! ♻️',
  },
  {
    title: 'CHECKPOINT 3 🦆',
    question: 'HVAD SPISER ÆNDER I NATUREN?',
    answers: ['Chips og brød', 'Slik og kage', 'Vandplanter og insekter', 'Pizza og pasta'],
    correctAnswer: 2,
    fact: 'Ænder spiser vandplanter, frø og insekter. Brød er faktisk usundt for dem! 🦆',
  },
  {
    title: 'CHECKPOINT 4 ☀️',
    question: 'HVAD ER GODT VED AT BRUGE SOLENERGI?',
    answers: ['Det forurener meget', 'Det er gratis og rent energi', 'Det er kun til lys', 'Det skader dyr'],
    correctAnswer: 1,
    fact: 'Solen sender gratis og ren energi! Solpaneler fanger den og laver strøm uden forurening. ☀️',
  },
  {
    title: 'CHECKPOINT 5 🐦',
    question: 'HVAD HAR FUGLENE VED BRABRAND SØ ALLERMEST BRUG FOR?',
    answers: ['Høj musik', 'Ro og rent vand', 'Mange hunde', 'At folk råber'],
    correctAnswer: 1,
    fact: 'Over 200 fuglearter bor ved søen! De har brug for ro og rent vand til reder og mad. 🐦',
  },
];

function calcXP(elapsedMs: number): number {
  const elapsed = Math.min(elapsedMs / 1000, TIMER_SECONDS);
  return Math.max(MIN_XP, Math.round(MAX_XP - (elapsed / TIMER_SECONDS) * (MAX_XP - MIN_XP)));
}

export function Checkpoint({ checkpointNumber, onCorrect, onNavigate, xp }: CheckpointProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const startTimeRef = useRef(Date.now());

  const question = questions[checkpointNumber - 1] ?? questions[0];
  const isWrong   = submitted && selectedAnswer !== question.correctAnswer;
  const isCorrect = submitted && selectedAnswer === question.correctAnswer;

  // Timer starts once on mount and runs continuously —
  // wrong answers and PRØV IGEN do NOT pause or reset it.
  useEffect(() => {
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // empty deps = mount only

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    const earned = calcXP(Date.now() - startTimeRef.current);
    setSubmitted(true);

    if (selectedAnswer === question.correctAnswer) {
      setEarnedXP(earned);
      setShowXP(true);
      setTimeout(() => onCorrect(earned), 1600);
    }
    // Wrong: stay on screen, timer keeps running
  };

  const handleRetry = () => {
    setSubmitted(false);
    setSelectedAnswer(null);
    // Timer intentionally NOT reset — XP keeps decreasing
  };

  // Timer bar colour: green → yellow → red
  const timerFrac = timeLeft / TIMER_SECONDS;
  const timerColor =
    timerFrac > 0.65 ? 'bg-lime-400' :
    timerFrac > 0.30 ? 'bg-yellow-400' : 'bg-red-400';

  const getButtonClass = (i: number) => {
    if (!submitted) {
      return selectedAnswer === i
        ? 'bg-yellow-200 border-yellow-500 scale-[1.02]'
        : 'bg-white border-black hover:bg-gray-50';
    }
    if (isCorrect) {
      // Only reveal correct/wrong colours after a right answer
      if (i === question.correctAnswer) return 'bg-lime-400 border-lime-600';
      if (i === selectedAnswer)          return 'bg-red-400 border-red-600 text-white';
      return 'bg-white border-gray-300 opacity-50';
    }
    // Wrong answer: only mark their choice red, no green hint
    if (i === selectedAnswer) return 'bg-red-400 border-red-600 text-white';
    return 'bg-white border-black opacity-70';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b-4 border-black">
        <button onClick={() => onNavigate('route')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-black text-lg">{question.title}</span>
        <div className="flex items-center gap-1 text-yellow-600 font-bold">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          {xp}
        </div>
      </div>

      {/* Checkpoint progress dots */}
      <div className="flex gap-1.5 px-4 py-3 bg-white border-b-4 border-black">
        {[1, 2, 3, 4, 5].map(n => (
          <div
            key={n}
            className={`h-3 flex-1 rounded-full border-2 border-black transition-colors ${
              n < checkpointNumber ? 'bg-lime-500' :
              n === checkpointNumber ? 'bg-lime-400' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Kahoot-style timer */}
      <div className="px-4 pt-3 pb-1 bg-white border-b-4 border-black">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-sm font-bold text-gray-500">
            <Zap className="w-4 h-4 text-yellow-500" />
            SVAR HURTIGT FOR FLERE POINT
          </div>
          <span className={`font-black text-lg ${timeLeft <= 6 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="h-4 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
          <div
            className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`}
            style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
          />
        </div>
        {/* XP preview */}
        <div className="flex justify-between text-xs text-gray-400 mt-1 font-bold">
          <span>{MIN_XP} XP</span>
          <span>Potentielt: {submitted ? earnedXP : calcXP(Date.now() - startTimeRef.current)} XP</span>
          <span>{MAX_XP} XP</span>
        </div>
      </div>

      {/* Question + answers */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-yellow-300 border-4 border-black p-4">
          <h3 className="text-xl text-center font-bold">{question.question}</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.answers.map((answer, i) => (
            <motion.button
              key={i}
              onClick={() => !submitted && setSelectedAnswer(i)}
              className={`border-4 p-5 text-lg font-bold transition-all ${getButtonClass(i)}`}
              whileTap={!submitted ? { scale: 0.95 } : {}}
            >
              {answer}
            </motion.button>
          ))}
        </div>

        {/* Wrong feedback — ingen hint om korrekt svar */}
        <AnimatePresence>
          {isWrong && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border-4 border-red-500 p-4 text-center"
            >
              <p className="text-red-600 text-xl font-black">FORKERT SVAR!</p>
              <p className="text-red-500 mt-1">Prøv igen – du kan godt! 💪</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Correct feedback */}
        <AnimatePresence>
          {isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-lime-50 border-4 border-lime-500 p-4 text-center"
            >
              <p className="text-lime-600 text-xl font-black">RIGTIGT! 🎉</p>
              <p className="text-lime-500 mt-1">{question.fact}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-white border-t-4 border-black">
        {isWrong ? (
          <button
            onClick={handleRetry}
            className="w-full bg-red-400 border-4 border-black rounded-full py-4 text-2xl font-black hover:bg-red-500 transition-colors"
          >
            PRØV IGEN
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isCorrect}
            className="w-full bg-lime-400 border-4 border-black rounded-full py-4 text-2xl font-black disabled:opacity-40 hover:bg-lime-500 transition-colors"
          >
            {isCorrect ? '✓ RIGTIGT!' : 'SVAR'}
          </button>
        )}
      </div>

      {/* Speed XP popup */}
      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-lime-400 border-4 border-black rounded-2xl px-10 py-6 text-center shadow-2xl">
              <div className="text-5xl mb-2">
                {earnedXP >= 250 ? '⚡' : earnedXP >= 150 ? '🎉' : '✓'}
              </div>
              <p className="text-5xl font-black">+{earnedXP} XP</p>
              <p className="text-lg font-bold mt-1">
                {earnedXP >= 250 ? 'LYNHURTIGT! 🚀' :
                 earnedXP >= 150 ? 'GODT SVAR!' :
                 'RIGTIGT SVAR!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
