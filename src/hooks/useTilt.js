import { useRef, useEffect } from 'react';

/**
 * Pointer-follow 3D tilt for a card.
 *
 * Two details separate this from the usual tilt effect. It writes CSS custom
 * properties rather than the transform itself, so a component can compose the
 * tilt with its own transforms instead of fighting them. And it drives the
 * update from rAF rather than the pointer event, so a fast mouse cannot queue
 * more style writes than the browser can paint.
 *
 * Disabled outright for coarse pointers and for anyone who has asked for
 * reduced motion — a tilt that fires on touch just feels like a bug.
 */
export function useTilt({ max = 7, scale = 1.012, glare = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return;

    let raf = 0;
    let target = { rx: 0, ry: 0, mx: 50, my: 50, on: 0 };
    let cur = { ...target };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      target = {
        rx: (0.5 - py) * max * 2,
        ry: (px - 0.5) * max * 2,
        mx: px * 100,
        my: py * 100,
        on: 1,
      };
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      target = { rx: 0, ry: 0, mx: 50, my: 50, on: 0 };
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      // Critically damped-ish easing; settles without overshoot.
      const k = 0.16;
      let moving = false;
      for (const key of ['rx', 'ry', 'mx', 'my', 'on']) {
        const d = target[key] - cur[key];
        if (Math.abs(d) > 0.01) { cur[key] += d * k; moving = true; }
        else cur[key] = target[key];
      }
      el.style.setProperty('--tilt-rx', `${cur.rx.toFixed(2)}deg`);
      el.style.setProperty('--tilt-ry', `${cur.ry.toFixed(2)}deg`);
      el.style.setProperty('--tilt-scale', (1 + (scale - 1) * cur.on).toFixed(4));
      if (glare) {
        el.style.setProperty('--glare-x', `${cur.mx.toFixed(1)}%`);
        el.style.setProperty('--glare-y', `${cur.my.toFixed(1)}%`);
        el.style.setProperty('--glare-o', (cur.on * 0.3).toFixed(3));
      }
      raf = moving ? requestAnimationFrame(tick) : 0;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max, scale, glare]);

  return ref;
}
