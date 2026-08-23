import { useState } from 'react';
import { useTilt } from '../hooks/useTilt';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, inView, EASE } from '../lib/motion';
import './Services.css';

const blocks = [
  {
    key: 'operators',
    audience: 'Operators',
    primary: true,
    title: 'Recover lost revenue, without lifting a finger',
    bullets: [
      'Real-time occupancy for every spot in your lot',
      'Automatic enforcement alerts when a car parks without paying',
      'Revenue dashboard with demand-based pricing recommendations',
      '+14% projected revenue per spot (pilot data coming Q2 2026)',
    ],
  },
  {
    key: 'drivers',
    audience: 'Drivers',
    title: 'Find, book, and pay in seconds',
    bullets: [
      'SpotMe app shows live spot availability before you drive',
      'Tap to reserve, tap to pay (Stripe + Razorpay supported)',
      'No more circling or printing receipts',
    ],
  },
  {
    key: 'cities',
    audience: 'Cities',
    title: 'Deploy smart parking without construction',
    bullets: [
      'Mount on existing streetlight poles',
      'Cuts 43% off driver search time, 30% off parking emissions',
      'ParkNYC-compatible pricing and enforcement',
    ],
  },
];

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* Motion animates the wrapper, the tilt rotates the card. Putting both on one
   element means motion's inline transform wins and the tilt never shows. */
function OutcomeCard({ b }) {
  const tilt = useTilt();
  return (
    <motion.div className="tilt-wrap" variants={fadeUp(26)}>
      <article
        ref={tilt}
        className={`outcome-card card card-hover tilt-3d ${b.primary ? 'is-primary' : ''}`}
      >
        {b.primary && <span className="outcome-flag">Primary customer</span>}
        <span className="outcome-audience">For {b.audience}</span>
        <h3 className="outcome-title">{b.title}</h3>
        <ul className="outcome-bullets">
          {b.bullets.map((bullet) => (
            <li key={bullet}><Check />{bullet}</li>
          ))}
        </ul>
      </article>
    </motion.div>
  );
}

export default function Services() {
  const reduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState('operators');
  const active = blocks.find((b) => b.key === activeTab);

  return (
    <section id="services" className="section services">
      <div className="container">
        <motion.div
          className="section-head"
          variants={stagger(0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          <motion.span className="eyebrow" variants={fadeUp(12)}>Who it's for</motion.span>
          <motion.h2 className="section-title" variants={fadeUp(20)}>
            One deployment, three outcomes
          </motion.h2>
          <motion.p className="section-sub" variants={fadeUp(20)}>
            The driver app is the payment rail that closes the loop for operators.
          </motion.p>
        </motion.div>

        {/* Desktop: all three side by side. */}
        <motion.div
          className="outcome-grid"
          variants={stagger(0.1)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          {blocks.map((b) => <OutcomeCard key={b.key} b={b} />)}
        </motion.div>

        {/* Mobile: tabs, so the three don't become a long scroll. */}
        <div className="outcome-tabs">
          <div className="tab-row" role="tablist" aria-label="Audience">
            {blocks.map((b) => (
              <button
                key={b.key}
                role="tab"
                id={`tab-${b.key}`}
                aria-selected={activeTab === b.key}
                aria-controls={`panel-${b.key}`}
                className={`tab ${activeTab === b.key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(b.key)}
              >
                {b.audience}
                {activeTab === b.key && (
                  <motion.span className="tab-pill" layoutId="tab-pill"
                    transition={{ duration: 0.3, ease: EASE }} />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              id={`panel-${active.key}`}
              role="tabpanel"
              aria-labelledby={`tab-${active.key}`}
              className="card outcome-card"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <h3 className="outcome-title">{active.title}</h3>
              <ul className="outcome-bullets">
                {active.bullets.map((bullet) => (
                  <li key={bullet}><Check />{bullet}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
