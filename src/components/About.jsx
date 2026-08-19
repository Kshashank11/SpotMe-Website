import { motion, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, inView } from '../lib/motion';
import { useCountUp } from '../hooks/useCountUp';
import './About.css';

/* The three losses named in the original copy, made scannable. */
const leaks = [
  {
    stat: 'Unpaid stays',
    body: 'Cars that park without ever paying, invisible to a lot that has no per-spot detection.',
  },
  {
    stat: 'Manual enforcement',
    body: 'Staff walking the lot to find violations, on a schedule that misses most of them.',
  },
  {
    stat: 'Static pricing',
    body: "Rates that don't move with demand, leaving money on the table at peak and spots empty off-peak.",
  },
];

function LeakHeadline() {
  const [ref, low] = useCountUp(15);
  return (
    <span className="leak-figure" ref={ref}>
      {low}–25%
    </span>
  );
}

export default function About() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="section about">
      <div className="container">
        <motion.div
          className="section-head"
          variants={stagger(0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          <motion.span className="eyebrow" variants={fadeUp(12)}>The problem</motion.span>
          <motion.h2 className="section-title" variants={fadeUp(20)}>
            Built for private parking operators
          </motion.h2>
          <motion.p className="section-sub" variants={fadeUp(20)}>
            Private lot and garage operators lose an estimated <LeakHeadline /> of potential
            revenue to unpaid stays, manual enforcement, and static pricing that doesn't
            match demand. SpotMe fixes all three at once.
          </motion.p>
        </motion.div>

        <motion.div
          className="leak-grid"
          variants={stagger(0.1)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          {leaks.map((l, i) => (
            <motion.article className="leak-card card card-hover" key={l.stat} variants={fadeUp(24)}>
              <span className="leak-index" aria-hidden="true">0{i + 1}</span>
              <h3 className="leak-title">{l.stat}</h3>
              <p className="leak-body">{l.body}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          className="about-close"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.6 }}
        >
          Radar sensors mount on existing poles or walls in minutes and detect every car that
          parks — paid or not. The app closes the loop from detection to payment, and the
          dashboard turns it into real-time occupancy, enforcement alerts, and demand-based
          pricing. <strong>No construction. No pavement sensors.</strong>
        </motion.p>
      </div>
    </section>
  );
}
