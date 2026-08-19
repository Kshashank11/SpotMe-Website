import { motion, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, inView } from '../lib/motion';
import './TrustStrip.css';

/**
 * Credibility strip.
 *
 * Deliberately limited to claims already made elsewhere on this site or backed
 * by the codebase (Stripe + Razorpay are both integrated in the SpotMe app).
 * No customer logos or testimonials are shown, because there are none to show
 * yet — inventing them would be the fastest way to lose an operator's trust.
 */
const items = [
  {
    label: 'Patent Pending (US)',
    sub: 'Radar occupancy method',
    icon: (
      <path d="M12 2l2.4 5.2 5.6.7-4.2 3.9 1.1 5.6L12 14.8 7.1 17.4l1.1-5.6L4 7.9l5.6-.7L12 2z" />
    ),
  },
  {
    label: 'Stripe & Razorpay',
    sub: 'Payments settled in-app',
    icon: <path d="M2 9h20M2 9a2 2 0 012-2h16a2 2 0 012 2m-20 0v8a2 2 0 002 2h16a2 2 0 002-2V9M6 15h4" />,
  },
  {
    label: 'ParkNYC-compatible',
    sub: 'Pricing & enforcement',
    icon: <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />,
  },
  {
    label: 'No construction',
    sub: 'Pole or wall mount only',
    icon: <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />,
  },
];

export default function TrustStrip() {
  const reduced = useReducedMotion();

  return (
    <section className="trust" aria-label="Product credentials">
      <motion.div
        className="container trust-inner"
        variants={stagger(0.07)}
        initial={reduced ? false : 'hidden'}
        whileInView="show"
        viewport={inView}
      >
        {items.map((it) => (
          <motion.div className="trust-item" key={it.label} variants={fadeUp(14, 0.5)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {it.icon}
            </svg>
            <div>
              <span className="trust-label">{it.label}</span>
              <span className="trust-sub">{it.sub}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
