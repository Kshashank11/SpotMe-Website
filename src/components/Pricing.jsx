import { Suspense, lazy, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, inView } from '../lib/motion';
import './Pricing.css';

const CoverageGlobe = lazy(() => import('./CoverageGlobe'));

const CALENDLY_URL = 'https://calendly.com/admin-spot-me/30min';

const includes = [
  'Radar device + mounting hardware',
  'Admin dashboard & enforcement alerts',
  'Driver app listing with Stripe payments',
  'Occupancy API and CDS-compatible feed',
];

export default function Pricing() {
  const reduced = useReducedMotion();
  const [covered, setCovered] = useState(0);

  return (
    <section id="pricing" className="section section-alt pricing mesh">
      <div className="container pricing-inner">
        <motion.div
          className="pricing-globe"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inView}
          transition={{ duration: 0.8 }}
        >
          <Suspense fallback={<div className="globe-placeholder" aria-hidden="true" />}>
            <CoverageGlobe reduced={reduced} onProgress={setCovered} />
          </Suspense>
          <div className="globe-caption">
            <span className="globe-caption-label">Spots covered</span>
            <span className="globe-caption-bar" aria-hidden="true">
              <i style={{ transform: `scaleX(${Math.min(1, covered)})` }} />
            </span>
            <p>One device covers five spots. Start with one lot — the map grows from there.</p>
          </div>
        </motion.div>

        <motion.div
          className="pricing-card card"
          variants={stagger(0.09)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          <motion.span className="eyebrow" variants={fadeUp(12)}>Pilot pricing</motion.span>

          <motion.div className="pricing-figure" variants={fadeUp(20)}>
            <span className="pricing-free">Free for 30 days</span>
            <span className="pricing-then">
              then <strong>$8</strong><span>/spot/month</span>
            </span>
          </motion.div>

          <motion.p className="pricing-terms" variants={fadeUp(18)}>
            No hardware lock-in. No multi-year contracts. Cancel any time.
          </motion.p>

          <motion.ul className="pricing-includes" variants={fadeUp(18)}>
            {includes.map((i) => (
              <li key={i}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {i}
              </li>
            ))}
          </motion.ul>

          <motion.a
            className="btn btn-primary pricing-cta"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeUp(16)}
          >
            Book a 15-min demo
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
