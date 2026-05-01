import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Zap } from 'lucide-react';
import type { Screen } from '../App';

interface ScannerProps {
  onNavigate: (screen: Screen) => void;
}

export function Scanner({ onNavigate }: ScannerProps) {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => onNavigate('checkpoint'), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => onNavigate('route')}
          className="p-2 text-white hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-white text-lg font-bold tracking-widest">SCAN CHECKPOINT</span>
        <div className="w-10" />
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-gray-950 mx-4 mb-4">
        {/* Corner brackets */}
        <div className="absolute top-5 left-5 w-14 h-14 border-l-4 border-t-4 border-lime-400 z-10" />
        <div className="absolute top-5 right-5 w-14 h-14 border-r-4 border-t-4 border-lime-400 z-10" />
        <div className="absolute bottom-5 left-5 w-14 h-14 border-l-4 border-b-4 border-lime-400 z-10" />
        <div className="absolute bottom-5 right-5 w-14 h-14 border-r-4 border-b-4 border-lime-400 z-10" />

        {/* Dark camera overlay grid */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="grid grid-cols-3 gap-0 w-full h-full">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-gray-500" />
            ))}
          </div>
        </div>

        {/* Laser scan line */}
        <motion.div
          className="absolute left-8 right-8 h-0.5 bg-lime-400 z-20"
          style={{ boxShadow: '0 0 12px 4px rgba(163,230,53,0.7)' }}
          animate={{ top: ['12%', '88%', '12%'] }}
          transition={{
            duration: scanning ? 0.7 : 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Scan flash overlay */}
        {scanning && (
          <motion.div
            className="absolute inset-0 bg-lime-400 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0, 0.2, 0, 0.3, 0] }}
            transition={{ duration: 1.8 }}
          >
            <div className="text-black font-black text-3xl flex items-center gap-3">
              <Zap className="w-10 h-10" />
              SCANNER...
            </div>
          </motion.div>
        )}

        {/* Target reticle center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-2 h-2 rounded-full bg-lime-400 opacity-60" />
        </div>
      </div>

      {/* Bottom */}
      <div className="px-4 pb-8 space-y-4">
        {!scanning ? (
          <motion.button
            onClick={handleScan}
            className="w-full bg-lime-400 border-4 border-lime-300 rounded-full py-5 text-3xl font-black text-black flex items-center justify-center gap-3"
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-8 h-8" />
            SCAN
          </motion.button>
        ) : (
          <div className="w-full bg-gray-900 border-4 border-lime-400 rounded-full py-5 text-xl font-bold text-lime-400 text-center animate-pulse">
            SCANNER CHECKPOINT...
          </div>
        )}

        <div className="flex justify-around items-center">
          <button className="px-5 py-2 bg-gray-800 rounded-full text-white text-sm font-bold hover:bg-gray-700">VIDEO</button>
          <div className="w-14 h-14 bg-gray-800 rounded-full border-4 border-gray-600" />
          <button className="px-5 py-2 bg-gray-800 rounded-full text-white text-sm font-bold hover:bg-gray-700">FOTO</button>
        </div>
      </div>
    </div>
  );
}
