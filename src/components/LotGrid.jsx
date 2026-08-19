import { motion, useReducedMotion } from 'motion/react';
import { EASE } from '../lib/motion';
import './LotGrid.css';

function CarGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="lot-car">
      <path
        d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.4h7.4a2 2 0 0 1 1.9 1.4L19 11m-14 0h14m-14 0a2 2 0 0 0-2 2v3h2m14-5a2 2 0 0 1 2 2v3h-2m-2 0H7"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="7.5" cy="16" r="1.4" fill="currentColor" />
      <circle cx="16.5" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Renders the simulated lot. `columns` and `compact` let the hero use a small
 * ambient version and the demo section use a larger interactive one.
 */
export default function LotGrid({ spots, columns = 6, compact = false }) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`lot-grid ${compact ? 'is-compact' : ''}`}
      style={{ '--cols': columns }}
      role="img"
      aria-label={`Simulated parking lot: ${spots.filter((s) => s.occupied).length} of ${spots.length} spaces occupied`}
    >
      {spots.map((spot, i) => (
        <motion.div
          key={spot.id}
          className={`lot-spot ${spot.occupied ? 'is-occupied' : 'is-free'}`}
          initial={reduced ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: reduced ? 0 : Math.min(i, 20) * 0.018, ease: EASE }}
        >
          {/* The car fades/slides in when the spot fills, out when it empties. */}
          <motion.span
            className="lot-spot-inner"
            animate={{
              opacity: spot.occupied ? 1 : 0,
              y: spot.occupied ? 0 : reduced ? 0 : 8,
              scale: spot.occupied ? 1 : 0.9,
            }}
            transition={{ duration: reduced ? 0 : 0.42, ease: EASE }}
          >
            <CarGlyph />
          </motion.span>

          {/* Free spots keep a faint stall marking so the grid reads as a lot. */}
          <span className="lot-stall" aria-hidden="true" />
        </motion.div>
      ))}
    </div>
  );
}
