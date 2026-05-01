import { useState } from 'react';
import { Home } from './components/Home';
import { RouteMap } from './components/RouteMap';
import { Checkpoint } from './components/Checkpoint';
import { Completion } from './components/Completion';
import { Loading } from './components/Loading';
import { Leaderboard } from './components/Leaderboard';

export type Screen = 'loading' | 'home' | 'leaderboard' | 'route' | 'checkpoint' | 'completion';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [currentCheckpoint, setCurrentCheckpoint] = useState(1);
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState<number[]>([]);
  const [xp, setXp] = useState(0);
  const streak = 7;

  // Go directly to checkpoint — no scanner step
  const handleStartCheckpoint = (n: number) => {
    setCurrentCheckpoint(n);
    setCurrentScreen('checkpoint');
  };

  // Called with the XP earned (Kahoot-style speed bonus)
  const handleCorrectAnswer = (xpEarned: number) => {
    const newAnswered = answeredCheckpoints.includes(currentCheckpoint)
      ? answeredCheckpoints
      : [...answeredCheckpoints, currentCheckpoint];
    setAnsweredCheckpoints(newAnswered);
    setXp(prev => prev + xpEarned);
    if (newAnswered.length >= 5) {
      setCurrentScreen('completion');
    } else {
      setCurrentScreen('route');
    }
  };

  return (
    <div className="size-full bg-white overflow-hidden">
      {currentScreen === 'loading' && (
        <Loading onNavigate={setCurrentScreen} />
      )}
      {currentScreen === 'home' && (
        <Home onNavigate={setCurrentScreen} xp={xp} streak={streak} />
      )}
      {currentScreen === 'leaderboard' && (
        <Leaderboard onNavigate={setCurrentScreen} xp={xp} />
      )}
      {currentScreen === 'route' && (
        <RouteMap
          onNavigate={setCurrentScreen}
          onStartCheckpoint={handleStartCheckpoint}
          answeredCheckpoints={answeredCheckpoints}
          xp={xp}
        />
      )}
      {currentScreen === 'checkpoint' && (
        <Checkpoint
          checkpointNumber={currentCheckpoint}
          onCorrect={handleCorrectAnswer}
          onNavigate={setCurrentScreen}
          xp={xp}
        />
      )}
      {currentScreen === 'completion' && (
        <Completion
          onNavigate={setCurrentScreen}
          xp={xp}
          answeredCount={answeredCheckpoints.length}
        />
      )}
    </div>
  );
}
