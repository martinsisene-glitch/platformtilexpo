import { ArrowLeft, Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { Screen } from '../App';

interface RouteMapProps {
  onNavigate: (screen: Screen) => void;
  onStartCheckpoint: (n: number) => void;
  answeredCheckpoints: number[];
  xp: number;
}

// Checkpoints placed clockwise around the lake
// CP0=START(east), CP1-5=quiz points, CP6=finish(star)
const CHECKPOINTS = [
  { id: 0, x: 368, y: 155, label: 'START' },
  { id: 1, x: 300, y: 228 },  // SE
  { id: 2, x: 118, y: 224 },  // SW
  { id: 3, x: 52,  y: 155 },  // W  — moved in from edge
  { id: 4, x: 172, y: 82 },   // NW
  { id: 5, x: 310, y: 82 },   // NE
  { id: 6, x: 368, y: 155, label: '★' }, // finish
];

// Walking path around the lake — leftmost point now x≈44 (was x=24)
const WALK_PATH =
  'M 368,155 C 368,188 348,220 308,234 L 228,242 C 168,244 114,238 72,216 C 52,204 44,184 44,156 C 44,130 58,112 82,100 C 118,82 170,74 220,73 C 276,72 330,82 358,112 C 368,128 368,142 368,155 Z';

export function RouteMap({ onNavigate, onStartCheckpoint, answeredCheckpoints, xp }: RouteMapProps) {
  const nextCheckpoint = [1, 2, 3, 4, 5].find(n => !answeredCheckpoints.includes(n));

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b-4 border-black">
        <button onClick={() => onNavigate('home')} className="p-2 hover:bg-gray-200 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-black">BRABRAND SØ RUTE</h2>
        <div className="flex items-center gap-1 text-yellow-600 font-bold">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          {xp}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex justify-around bg-white border-b-4 border-black py-2 px-4">
        <div className="flex items-center gap-1.5 text-sm font-bold">
          <MapPin className="w-4 h-4 text-cyan-500" />
          4.2 km
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold">
          <Clock className="w-4 h-4 text-lime-600" />
          ~60 min
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-lime-600" />
          {answeredCheckpoints.length}/5
        </div>
      </div>

      {/* Google Maps-style map — "meet" ensures nothing is clipped */}
      <div className="flex-1 relative overflow-hidden border-b-4 border-black" style={{ backgroundColor: '#f2f0eb' }}>
        <svg
          viewBox="0 0 420 300"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Land background */}
          <rect width="420" height="300" fill="#f2f0eb" />

          {/* North green park/forest */}
          <path d="M 0,0 L 420,0 L 420,75 C 360,68 290,62 222,62 C 154,62 85,68 0,75 Z" fill="#c8dda8" />

          {/* South green strip */}
          <rect x="0" y="255" width="420" height="45" fill="#c8dda8" opacity="0.7" />

          {/* Silkeborgvej (main road south of lake) */}
          <rect x="0" y="260" width="420" height="9" fill="#ffffff" />
          <rect x="0" y="260" width="420" height="1" fill="#d0cdc8" />
          <rect x="0" y="268" width="420" height="1" fill="#d0cdc8" />
          <text x="210" y="267" textAnchor="middle" fontSize="7" fill="#888" fontFamily="Arial, sans-serif">Silkeborgvej</text>

          {/* East road (Ravnsbjergvej) */}
          <rect x="402" y="0" width="8" height="300" fill="#ffffff" />
          <rect x="402" y="0" width="1" height="300" fill="#d0cdc8" />

          {/* North road */}
          <rect x="0" y="62" width="420" height="7" fill="#e8e4dc" />

          {/* Brabrand city blocks (east) */}
          {[[406, 120], [406, 140], [406, 160], [406, 180], [406, 200]].map(([x, y], i) => (
            <rect key={i} x={x} y={y - 8} width="14" height="14" fill="#d8d4cc" rx="1" />
          ))}
          <text x="411" y="165" textAnchor="middle" fontSize="6" fill="#666" fontFamily="Arial, sans-serif" transform="rotate(90,411,165)">Brabrand</text>

          {/* Tree dots north */}
          {[40, 90, 140, 190, 240, 290, 340, 385].map((x, i) => (
            <circle key={i} cx={x} cy={42} r={9} fill="#6db356" opacity="0.65" />
          ))}
          {[65, 115, 165, 215, 265, 315, 365].map((x, i) => (
            <circle key={i} cx={x} cy={56} r={7} fill="#5a9e45" opacity="0.5" />
          ))}

          {/* Tree dots south */}
          {[30, 80, 130, 180, 230, 280, 330, 380].map((x, i) => (
            <circle key={i} cx={x} cy={280} r={8} fill="#6db356" opacity="0.55" />
          ))}

          {/* Lake shadow/depth */}
          <path
            d="M 62,162 C 64,140 85,122 120,114 C 156,106 200,102 242,102 C 284,102 328,106 360,117 C 382,126 393,144 391,165 C 389,186 376,202 355,211 C 322,220 279,224 240,224 C 198,224 155,220 119,213 C 82,206 60,186 62,162 Z"
            fill="#7bbfe8"
            opacity="0.4"
            transform="translate(3,3)"
          />

          {/* Lake */}
          <path
            d="M 60,161 C 62,138 84,120 119,112 C 155,104 199,100 241,100 C 283,100 327,104 359,115 C 381,124 392,142 390,163 C 388,185 375,201 354,210 C 321,219 278,222 239,222 C 197,222 154,218 118,211 C 81,204 58,186 60,161 Z"
            fill="#a8d4f5"
            stroke="#6badd6"
            strokeWidth="1.5"
          />

          {/* Lake highlight/ripple */}
          <path
            d="M 120,140 C 150,133 200,130 250,132 C 290,134 330,140 355,150"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Lake label */}
          <text x="222" y="165" textAnchor="middle" fontSize="12" fill="#1d6fa4" fontWeight="bold" fontFamily="Arial, sans-serif" opacity="0.85">
            Brabrand Sø
          </text>
          <text x="222" y="180" textAnchor="middle" fontSize="8" fill="#4a9ac9" fontFamily="Arial, sans-serif" opacity="0.7">
            3.5 km lang
          </text>

          {/* Walking route path */}
          <path
            d={WALK_PATH}
            fill="none"
            stroke="#f97316"
            strokeWidth="3.5"
            strokeDasharray="10,6"
            strokeLinecap="round"
          />

          {/* Completed path segments (solid green) */}
          {answeredCheckpoints.length > 0 && (
            <path
              d={WALK_PATH}
              fill="none"
              stroke="#84cc16"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${answeredCheckpoints.length * 14}%, 100%`}
            />
          )}

          {/* Checkpoint markers */}
          {CHECKPOINTS.map((cp, i) => {
            if (cp.label === '★') {
              // Finish star — only show clearly if all done
              return (
                <text
                  key={i}
                  x={cp.x}
                  y={cp.y + 5}
                  textAnchor="middle"
                  fontSize="18"
                  opacity={answeredCheckpoints.length >= 5 ? 1 : 0.25}
                >
                  ⭐
                </text>
              );
            }

            if (cp.label === 'START') {
              return (
                <g key={i}>
                  <circle cx={cp.x} cy={cp.y} r={14} fill="#84cc16" stroke="#000" strokeWidth="2.5" />
                  <text x={cp.x} y={cp.y + 4} textAnchor="middle" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif">START</text>
                </g>
              );
            }

            const isAnswered = answeredCheckpoints.includes(i);
            const isNext = i === nextCheckpoint;

            return (
              <g key={i}>
                {isNext ? (
                  // Pulsing next checkpoint — rendered in foreignObject for Framer Motion
                  <foreignObject x={cp.x - 18} y={cp.y - 18} width="36" height="36">
                    <motion.div
                      className="w-9 h-9 rounded-full bg-lime-300 border-4 border-lime-600 flex items-center justify-center shadow-lg cursor-pointer"
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: ['0 0 0px #84cc16', '0 0 14px #84cc16', '0 0 0px #84cc16'],
                      }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      onClick={() => onStartCheckpoint(i)}
                    >
                      <span className="text-sm font-black text-lime-800">{i}</span>
                    </motion.div>
                  </foreignObject>
                ) : (
                  <g onClick={() => isNext && onStartCheckpoint(i)} style={{ cursor: isNext ? 'pointer' : 'default' }}>
                    <circle
                      cx={cp.x}
                      cy={cp.y}
                      r={14}
                      fill={isAnswered ? '#84cc16' : '#e5e7eb'}
                      stroke="#000"
                      strokeWidth="2.5"
                    />
                    <text
                      x={cp.x}
                      y={cp.y + 5}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="Arial, sans-serif"
                      fill={isAnswered ? '#fff' : '#374151'}
                    >
                      {isAnswered ? '✓' : i}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Compass */}
          <g transform="translate(388, 90)">
            <circle cx="0" cy="0" r="13" fill="white" stroke="#ccc" strokeWidth="1" opacity="0.9" />
            <text x="0" y="-4" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#333" fontFamily="Arial, sans-serif">N</text>
            <polygon points="0,-10 -3,-2 0,0 3,-2" fill="#e53e3e" />
            <polygon points="0,10 -3,2 0,0 3,2" fill="#888" />
          </g>

          {/* Scale bar */}
          <g transform="translate(10, 285)">
            <rect x="0" y="0" width="60" height="4" fill="#555" />
            <text x="0" y="-2" fontSize="6" fill="#555" fontFamily="Arial, sans-serif">0</text>
            <text x="54" y="-2" fontSize="6" fill="#555" fontFamily="Arial, sans-serif">500m</text>
          </g>
        </svg>
      </div>

      {/* Checkpoint progress dots */}
      <div className="flex justify-center gap-3 px-4 pt-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full border-4 border-black flex items-center justify-center font-bold transition-colors ${
              answeredCheckpoints.includes(i) ? 'bg-lime-400' : i === nextCheckpoint ? 'bg-lime-200' : 'bg-white'
            }`}
          >
            {answeredCheckpoints.includes(i) ? '✓' : <span className="text-sm">{i}</span>}
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div className="p-4">
        <button
          onClick={() => nextCheckpoint && onStartCheckpoint(nextCheckpoint)}
          disabled={!nextCheckpoint}
          className="w-full bg-lime-400 border-4 border-black rounded-full py-4 text-2xl font-black hover:bg-lime-500 active:scale-95 transition-all disabled:opacity-40"
        >
          {answeredCheckpoints.length === 0
            ? 'START TUR →'
            : nextCheckpoint
            ? `GÅ TIL CHECKPOINT ${nextCheckpoint} →`
            : '✓ RUTEN FULDFØRT!'}
        </button>
      </div>
    </div>
  );
}
