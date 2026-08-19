import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, inView, EASE } from '../lib/motion';
import './FAQ.css';

/**
 * Procurement-objection FAQ.
 *
 * Answers are grounded in claims already published on this site or in physical
 * properties of radar sensing. Two intentionally hedge rather than promise:
 * weather tolerance and PARCS/gate integration — SHASHANK: confirm those two
 * against real test data before launch and tighten the wording if you can back
 * a stronger claim.
 */
const faqs = [
  {
    q: 'Do we have to dig up or close the lot to install it?',
    a: 'No. Each device mounts to an existing pole or wall and covers about 5 spots. There is no trenching, no pavement cutting, and no power run — which is what keeps deployment to roughly 20 minutes per device instead of a multi-day construction job.',
  },
  {
    q: 'How accurate is the detection?',
    a: 'Spot-level accuracy of about ±1 metre with a false-positive rate under 2%. That is precise enough to say which specific space a car is in, not just that the lot got busier.',
  },
  {
    q: 'What if a driver never opens the SpotMe app?',
    a: 'The radar sees the car either way — detection is completely independent of the app. That is the point: the sensor tells you a space is occupied, your records tell you whether it was paid for, and the gap between those two is the revenue leak. The app is how you make paying easy, not how you detect.',
  },
  {
    q: 'Does it work at night?',
    a: 'Yes. Radar does not depend on ambient light the way a camera does, so performance is the same at 3am as at noon. For heavy snow or debris build-up we would rather show you results from your own site during the free trial than quote a number here.',
  },
  {
    q: 'Are you recording video or reading licence plates?',
    a: 'No. The sensor is radar, not a camera — it measures range and motion, so there is no image, no footage, and no plate capture to store, secure, or disclose. For many operators that materially shortens the privacy review.',
  },
  {
    q: 'How many devices will our lot need, and what do they cost?',
    a: 'Roughly one device per 5 spots, at $500 per device. A 120-space lot is about 24 devices. Software is $8 per spot per month after a free 30-day pilot, with no hardware lock-in and no multi-year contract.',
  },
  {
    q: 'Can it work with the payment system or gate we already run?',
    a: 'Payments in the SpotMe app settle through Stripe and Razorpay, and occupancy is available as an API and a CDS-compatible feed, which is how city systems consume it. For a specific PARCS or gate vendor, bring it to the demo — integration depends on what that system exposes.',
  },
  {
    q: 'What happens when the pilot ends?',
    a: 'You keep the hardware you paid for and decide whether to continue at $8/spot/month. There is no clawback and no auto-renewing multi-year term — if the numbers do not hold up on your own lot, that should be visible within the 30 days.',
  },
];

function Chevron({ open }) {
  return (
    <motion.svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <path d="M6 9l6 6 6-6" />
    </motion.svg>
  );
}

export default function FAQ() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section faq">
      <div className="container">
        <motion.div
          className="section-head"
          variants={stagger(0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          <motion.span className="eyebrow" variants={fadeUp(12)}>Questions</motion.span>
          <motion.h2 className="section-title" variants={fadeUp(20)}>
            The things operators actually ask
          </motion.h2>
        </motion.div>

        <motion.div
          className="faq-list"
          variants={stagger(0.05)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={f.q} variants={fadeUp(16, 0.45)}>
                <h3>
                  <button
                    className="faq-q"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-q-${i}`}
                  >
                    <span>{f.q}</span>
                    <Chevron open={isOpen} />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      className="faq-a-wrap"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      <p className="faq-a">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
