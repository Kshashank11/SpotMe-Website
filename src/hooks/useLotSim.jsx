import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Simulated parking-lot occupancy.
 *
 * This is an illustrative simulation for the marketing site, not a feed from a
 * real deployment — kept deterministic-ish and calm so it reads as a product
 * demo rather than a slot machine. Consumers label it as a simulation in the UI.
 *
 * Under prefers-reduced-motion it does not auto-run; the caller can still step
 * it manually, and a static snapshot is rendered instead.
 */
export function useLotSim({
  count = 24,
  initialFill = 0.55,
  intervalMs = 2100,
  autoPlay = true,
} = {}) {
  const reduced = useReducedMotion();

  const [spots, setSpots] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      occupied: (i * 7919) % 100 < initialFill * 100, // stable pseudo-random seed
      since: 0,
    }))
  );
  const [events, setEvents] = useState([]);
  const [playing, setPlaying] = useState(autoPlay && !reduced);
  const tickRef = useRef(0);

  const step = useCallback(() => {
    tickRef.current += 1;
    setSpots((prev) => {
      const next = [...prev];
      // Flip one or two spots per tick — enough to feel alive, not chaotic.
      const flips = 1 + (tickRef.current % 3 === 0 ? 1 : 0);
      const changed = [];
      for (let f = 0; f < flips; f++) {
        const i = Math.floor(Math.random() * next.length);
        const spot = next[i];
        next[i] = { ...spot, occupied: !spot.occupied, since: tickRef.current };
        changed.push({ index: i, occupied: !spot.occupied });
      }
      if (changed.length) {
        setEvents((ev) =>
          [
            ...changed.map((c) => ({
              id: `${tickRef.current}-${c.index}`,
              index: c.index,
              type: c.occupied ? 'park_start' : 'park_end',
              at: Date.now(),
            })),
            ...ev,
          ].slice(0, 12)
        );
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(step, intervalMs);
    return () => clearInterval(iv);
  }, [playing, intervalMs, step]);

  // Honour a mid-session change to the reduced-motion preference.
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);

  const occupied = spots.filter((s) => s.occupied).length;

  return {
    spots,
    events,
    occupied,
    total: spots.length,
    utilization: spots.length ? Math.round((occupied / spots.length) * 100) : 0,
    playing,
    setPlaying,
    step,
    reduced,
  };
}
