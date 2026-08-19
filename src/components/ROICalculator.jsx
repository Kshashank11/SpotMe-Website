import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, inView, EASE } from '../lib/motion';
import './ROICalculator.css';

const CALENDLY_URL = 'https://calendly.com/admin-spot-me/30min';

/**
 * Operator ROI estimator.
 *
 * Every figure here is either entered by the operator or is a number SpotMe
 * already publishes on this page ($8/spot/month; +14% projected revenue per
 * spot, pilot data due Q2 2026). Nothing is invented, the uplift assumption is
 * a slider rather than a fixed promise, and the disclaimer stays visible —
 * an ROI widget that quietly overstates is worse than no widget at all.
 */
const PRICE_PER_SPOT = 8;      // software, $/spot/month
const SPOTS_PER_DEVICE = 5;    // radar coverage per unit

const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function Field({ label, hint, value, min, max, step, suffix, prefix, onChange, id }) {
  return (
    <div className="roi-field">
      <label htmlFor={id} className="roi-label">
        {label}
        <span className="roi-value">{prefix}{value.toLocaleString()}{suffix}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-range"
        aria-describedby={`${id}-hint`}
      />
      <span className="roi-hint" id={`${id}-hint`}>{hint}</span>
    </div>
  );
}

export default function ROICalculator() {
  const reduced = useReducedMotion();
  const [spots, setSpots] = useState(120);
  const [revPerSpot, setRevPerSpot] = useState(140);
  const [uplift, setUplift] = useState(14);

  const r = useMemo(() => {
    const gross = spots * revPerSpot;
    const recovered = gross * (uplift / 100);
    const cost = spots * PRICE_PER_SPOT;
    const net = recovered - cost;
    return { gross, recovered, cost, net, annual: net * 12, devices: Math.ceil(spots / SPOTS_PER_DEVICE) };
  }, [spots, revPerSpot, uplift]);

  const positive = r.net >= 0;

  return (
    <section id="roi" className="section roi">
      <div className="container">
        <motion.div
          className="section-head"
          variants={stagger(0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          <motion.span className="eyebrow" variants={fadeUp(12)}>Estimate</motion.span>
          <motion.h2 className="section-title" variants={fadeUp(20)}>
            What the leak is costing you
          </motion.h2>
          <motion.p className="section-sub" variants={fadeUp(20)}>
            Set your own numbers. Nothing here is pre-filled with a figure we can't stand behind.
          </motion.p>
        </motion.div>

        <motion.div
          className="roi-shell card"
          initial={reduced ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div className="roi-inputs">
            <Field
              id="roi-spots"
              label="Spots in your lot"
              hint={`About ${r.devices} device${r.devices === 1 ? '' : 's'} at ${SPOTS_PER_DEVICE} spots each`}
              value={spots} min={10} max={1000} step={10}
              onChange={setSpots}
            />
            <Field
              id="roi-rev"
              label="Monthly revenue per spot"
              hint="Your current average — we don't assume this one"
              value={revPerSpot} min={20} max={600} step={10}
              prefix="$"
              onChange={setRevPerSpot}
            />
            <Field
              id="roi-uplift"
              label="Expected uplift"
              hint="SpotMe projects +14%. Pilot data due Q2 2026."
              value={uplift} min={0} max={25} step={1}
              suffix="%"
              onChange={setUplift}
            />
          </div>

          <div className="roi-output">
            <div className="roi-headline">
              <span className="roi-out-label">Projected net gain / year</span>
              <motion.span
                key={r.annual}
                className={`roi-out-value ${positive ? '' : 'is-negative'}`}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {money(r.annual)}
              </motion.span>
            </div>

            <dl className="roi-lines">
              <div>
                <dt>Gross monthly revenue</dt>
                <dd>{money(r.gross)}</dd>
              </div>
              <div>
                <dt>Recovered at {uplift}%</dt>
                <dd className="pos">+{money(r.recovered)}</dd>
              </div>
              <div>
                <dt>SpotMe at ${PRICE_PER_SPOT}/spot/mo</dt>
                <dd className="neg">−{money(r.cost)}</dd>
              </div>
              <div className="roi-total">
                <dt>Net per month</dt>
                <dd className={positive ? 'pos' : 'neg'}>
                  {positive ? '+' : ''}{money(r.net)}
                </dd>
              </div>
            </dl>

            <a className="btn btn-primary roi-cta" href={CALENDLY_URL}
               target="_blank" rel="noopener noreferrer">
              Check these numbers with us
            </a>
          </div>
        </motion.div>

        <p className="roi-disclaimer">
          Illustrative projection only, based on figures you enter and SpotMe's published
          +14% per-spot estimate — not a guarantee of results. Pilot data expected Q2 2026.
          First 30 days are free, so the cost line above starts in month two.
        </p>
      </div>
    </section>
  );
}
