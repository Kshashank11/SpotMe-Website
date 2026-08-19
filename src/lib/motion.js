/**
 * Shared motion vocabulary.
 *
 * One place for durations/easings so the whole site moves as a single system
 * rather than each component inventing its own timing. Every consumer pairs
 * these with `useReducedMotion()` from motion/react and falls back to the
 * final state when the user has asked for less motion.
 */

export const EASE = [0.16, 1, 0.3, 1];

/** Section-level container: reveals children in sequence. */
export const stagger = (each = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: each, delayChildren },
  },
});

/** The default reveal — used for headings, paragraphs, cards. */
export const fadeUp = (y = 22, duration = 0.6) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
});

export const fadeIn = (duration = 0.5) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration, ease: EASE } },
});

export const scaleIn = (from = 0.94, duration = 0.5) => ({
  hidden: { opacity: 0, scale: from },
  show: { opacity: 1, scale: 1, transition: { duration, ease: EASE } },
});

/** Standard viewport trigger: fire once, slightly before fully in view. */
export const inView = { once: true, margin: '0px 0px -12% 0px' };

/**
 * Collapses any variant set to its final state.
 * Spread onto a motion component when useReducedMotion() is true.
 */
export const staticProps = {
  initial: false,
  animate: 'show',
  variants: undefined,
};
