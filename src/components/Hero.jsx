import { motion, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, EASE } from '../lib/motion';
import { useCountUp } from '../hooks/useCountUp';
import { useLotSim } from '../hooks/useLotSim';
import LotGrid from './LotGrid';
import './Hero.css';

const CALENDLY_URL = 'https://calendly.com/admin-spot-me/30min';
const FOUNDER_MAILTO = 'mailto:admin@spot-me.net?subject=SpotMe%20Demo%20Request';

const stats = [
  { value: 1, prefix: '±', suffix: 'm', desc: 'Spot-level detection accuracy' },
  { value: 2, prefix: '<', suffix: '%', desc: 'False positive rate' },
  { value: 20, suffix: ' min', desc: 'Per-device deploy time' },
  { value: 5, desc: 'Spots covered per $500 device' },
];

function Stat({ value, prefix = '', suffix = '', desc }) {
  const [ref, display] = useCountUp(value);
  return (
    <div className="hero-stat" ref={ref}>
      <span className="stat-value">{prefix}{display}{suffix}</span>
      <span className="stat-desc">{desc}</span>
    </div>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  const lot = useLotSim({ count: 24, intervalMs: 2400 });

  return (
    <section id="hero" className="hero mesh">
      <div className="container hero-inner">
        <motion.div
          className="hero-content"
          variants={stagger(0.09, 0.1)}
          initial={reduced ? false : 'hidden'}
          animate="show"
        >
          <motion.span className="eyebrow" variants={fadeUp(14)}>
            <span className="dot-pulse" aria-hidden="true" />
            Patent Pending (US)
          </motion.span>

          <motion.h1 className="hero-title" variants={fadeUp(24)}>
            Know every spot in your lot.{' '}
            <span className="highlight">Close the revenue leak.</span>{' '}
            Deploy in 20 minutes.
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp(20)}>
            SpotMe is an IoT + mobile platform for private parking operators.
            Radar sensors track occupancy in real time, the SpotMe app lets drivers
            book and pay on the spot, and you get a full revenue and enforcement
            dashboard — no trenching, no pavement sensors, no construction.
          </motion.p>

          <motion.div className="hero-buttons" variants={fadeUp(18)}>
            <a className="btn btn-primary" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a 15-min demo
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
                   strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn btn-ghost" href={FOUNDER_MAILTO}>Email the founder</a>
          </motion.div>

          <motion.div className="hero-stats" variants={fadeUp(18)}>
            {stats.map((s) => <Stat key={s.desc} {...s} />)}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={reduced ? false : { opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
        >
          <div className="lot-card card">
            <div className="lot-card-head">
              <div className="lot-card-title">
                <span className="live-badge">
                  <span className="dot-pulse" aria-hidden="true" />
                  Live
                </span>
                <span className="lot-card-name">Riverside Garage · Level 2</span>
              </div>
              <div className="lot-card-count">
                <strong>{lot.occupied}</strong>
                <span>/{lot.total}</span>
              </div>
            </div>

            <LotGrid spots={lot.spots} columns={6} compact />

            <div className="lot-card-foot">
              <div className="lot-meter" aria-hidden="true">
                <motion.span
                  className="lot-meter-fill"
                  animate={{ width: `${lot.utilization}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>
              <span className="lot-card-util">{lot.utilization}% utilised</span>
            </div>
            <p className="lot-card-note">Illustrative simulation</p>
          </div>

          <div className="hero-glow" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
