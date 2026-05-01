import { useState } from 'react';
import { motion } from 'motion/react';

interface FeedbackModalProps {
  /** Called after the user submits — navigate to home here */
  onClose: () => void;
}

interface Ratings {
  oplevelse: number;       // Hvordan var oplevelsen?
  renhed: number;          // Var der rent på turen?
  tilgaengelighed: number; // Var det let at færdes?
}

const QUESTIONS: { key: keyof Ratings; label: string; emoji: string }[] = [
  { key: 'oplevelse',       label: 'Hvordan var oplevelsen?',          emoji: '😊' },
  { key: 'renhed',          label: 'Var der rent på turen?',           emoji: '🌿' },
  { key: 'tilgaengelighed', label: 'Var det let at færdes på ruten?',  emoji: '🚶' },
]

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-4xl transition-transform active:scale-125 hover:scale-110"
          aria-label={`${star} stjerner`}
        >
          {star <= active ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  )
}

export function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [ratings, setRatings] = useState<Ratings>({ oplevelse: 0, renhed: 0, tilgaengelighed: 0 })
  const [submitting, setSubmitting] = useState(false)

  const setRating = (key: keyof Ratings, value: number) =>
    setRatings(prev => ({ ...prev, [key]: value }))

  const allRated = Object.values(ratings).every(r => r > 0)

  const handleSubmit = async () => {
    if (!allRated || submitting) return
    setSubmitting(true)

    const payload = { ...ratings, timestamp: new Date().toISOString() }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('API fejl')
    } catch {
      // Fallback: persist in localStorage if the dev-server API isn't reachable
      const stored = JSON.parse(localStorage.getItem('UserData') ?? '[]')
      stored.push(payload)
      localStorage.setItem('UserData', JSON.stringify(stored))
    }

    onClose()
  }

  return (
    /* Dark backdrop */
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4">
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        className="bg-white border-4 border-black rounded-2xl p-6 w-full max-w-sm"
      >
        {/* Header */}
        <h2 className="text-2xl font-black text-center mb-1">DIN MENING TÆLLER!</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Besvar 3 hurtige spørgsmål om turen 🌿
        </p>

        {/* Questions */}
        <div className="space-y-6">
          {QUESTIONS.map(q => (
            <div key={q.key} className="border-b-2 border-gray-100 pb-5 last:border-0">
              <p className="font-black text-center mb-1">
                {q.emoji} {q.label}
              </p>
              {ratings[q.key] > 0 && (
                <p className="text-center text-xs text-gray-400 mb-1 font-bold">
                  {ratings[q.key]} / 5 stjerner
                </p>
              )}
              <StarRating
                value={ratings[q.key]}
                onChange={v => setRating(q.key, v)}
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!allRated || submitting}
          className="w-full mt-6 bg-lime-400 border-4 border-black rounded-full py-4 text-xl font-black disabled:opacity-40 hover:bg-lime-500 active:scale-95 transition-all"
        >
          {submitting ? 'SENDER...' : 'SEND FEEDBACK →'}
        </button>

        {!allRated && (
          <p className="text-center text-gray-400 text-xs mt-2 font-bold">
            Giv alle 3 spørgsmål en stjernebedømmelse
          </p>
        )}
      </motion.div>
    </div>
  )
}
