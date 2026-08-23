import { motion, useReducedMotion } from 'motion/react';
import { useTilt } from '../hooks/useTilt';
import { stagger, fadeUp, inView, EASE } from '../lib/motion';
import './HowItWorks.css';

const steps = [
  {
    n: '1',
    title: 'Mount',
    desc: 'Attach one device to an existing pole or wall. No trenching, no pavement cuts, no power run.',
    meta: '~5 min',
    icon: <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />,
  },
  {
    n: '2',
    title: 'Calibrate',
    desc: "Zones auto-learn your lot's layout in 10 minutes from the admin dashboard.",
    meta: '~10 min',
    icon: <path d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M3 12h2m14 0h2M5.6 18.4L7 17m10-10l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z" />,
  },
  {
    n: '3',
    title: 'Go live',
    desc: 'Occupancy streams to your dashboard and to drivers in the SpotMe app. Payments settle through Stripe.',
    meta: 'Same day',
    icon: <path d="M5 12l4 4L19 6" />,
  },
];

/** One step. Its own component so the tilt hook runs once per card rather
 *  than once per render of the list, which the Rules of Hooks forbid. */
function HowCard({ s }) {
  const tilt = useTilt();
  return (
    <motion.div className="tilt-wrap" variants={fadeUp(26)}>
      <article className="how-card card tilt-3d" ref={tilt}>
      <div className="how-badge lift-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {s.icon}
        </svg>
        <span className="how-n">{s.n}</span>
      </div>
      <h3 className="how-title lift-1">{s.title}</h3>
      <p className="how-desc">{s.desc}</p>
        <span className="how-meta">{s.meta}</span>
      </article>
    </motion.div>
  );
}

export default function HowItWorks() {
  const reduced = useReducedMotion();

  return (
    <section id="how-it-works" className="section section-alt how">
      <div className="container">
        <motion.div
          className="section-head"
          variants={stagger(0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          <motion.span className="eyebrow" variants={fadeUp(12)}>Deployment</motion.span>
          <motion.h2 className="section-title" variants={fadeUp(20)}>
            Live in under 20 minutes
          </motion.h2>
          <motion.p className="section-sub" variants={fadeUp(20)}>
            Three steps, one device, no contractors. The whole lot is reporting before
            the crew would normally finish marking out a trench.
          </motion.p>
        </motion.div>

        <div className="how-track">
          {/* The connecting line draws itself as the section enters view. */}
          <motion.span
            className="how-line"
            aria-hidden="true"
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={inView}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          />

          <motion.div
            className="how-grid"
            variants={stagger(0.14)}
            initial={reduced ? false : 'hidden'}
            whileInView="show"
            viewport={inView}
          >
            {steps.map((s) => <HowCard key={s.n} s={s} />)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
