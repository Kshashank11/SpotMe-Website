import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

/**
 * Counts a number up once it scrolls into view.
 *
 * `margin` is exposed because the default pulls the trigger line 15% up from the
 * bottom of the viewport — right through the hero stats, which then sit at zero
 * until the visitor happens to scroll. Above-the-fold callers pass '0px'.
 *
 * Returns [ref, displayValue]. Attach ref to the element that should trigger it.
 * When the user prefers reduced motion the final value is rendered immediately —
 * the number is information, so it must never be withheld for the sake of an effect.
 */
export function useCountUp(target, { duration = 1400, decimals = 0, margin = '0px 0px -15% 0px' } = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (reduced) { setValue(target); return; }

    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo — fast start, gentle settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration, reduced]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return [ref, display];
}
