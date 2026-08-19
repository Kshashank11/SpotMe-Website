import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, inView, EASE } from '../lib/motion';
import { useLotSim } from '../hooks/useLotSim';
import LotGrid from './LotGrid';
import './LiveDemo.css';

const ago = (t) => {
  const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  return s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;
};

export default function LiveDemo() {
  const reduced = useReducedMotion();
  const lot = useLotSim({ count: 40, intervalMs: 1800, initialFill: 0.6 });

  return (
    <section id="live-demo" className="section section-alt live-demo">
      <div className="container">
        <motion.div
          className="section-head"
          variants={stagger(0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          <motion.span className="eyebrow" variants={fadeUp(12)}>
            <span className="dot-pulse" aria-hidden="true" />
            See it working
          </motion.span>
          <motion.h2 className="section-title" variants={fadeUp(20)}>
            This is what your dashboard sees
          </motion.h2>
          <motion.p className="section-sub" variants={fadeUp(20)}>
            Every arrival and departure, spot by spot, the moment it happens — the same
            event stream that drives enforcement alerts and demand pricing.
          </motion.p>
        </motion.div>

        <motion.div
          className="demo-shell card"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="demo-bar">
            <div className="demo-bar-left">
              <span className="live-badge">
                <span className="dot-pulse" aria-hidden="true" />
                {lot.playing ? 'Live' : 'Paused'}
              </span>
              <span className="demo-lot-name">Riverside Garage · Level 2</span>
            </div>

            <div className="demo-bar-right">
              <button
                className="demo-btn"
                onClick={() => lot.setPlaying((p) => !p)}
                aria-pressed={lot.playing}
              >
                {lot.playing ? (
                  <><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="5" width="3.4" height="14" rx="1"/><rect x="13.6" y="5" width="3.4" height="14" rx="1"/></svg>Pause</>
                ) : (
                  <><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>Play</>
                )}
              </button>
              <button className="demo-btn" onClick={lot.step}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5.5v13l9-6.5z"/><rect x="16" y="5.5" width="2.6" height="13" rx="1"/></svg>
                Step
              </button>
            </div>
          </div>

          <div className="demo-body">
            <div className="demo-lot">
              <LotGrid spots={lot.spots} columns={8} />
              <div className="demo-legend">
                <span><i className="sw sw-occupied" aria-hidden="true" />Occupied</span>
                <span><i className="sw sw-free" aria-hidden="true" />Available</span>
                <span className="demo-note">Illustrative simulation, not a live deployment feed</span>
              </div>
            </div>

            <aside className="demo-side">
              <div className="demo-metrics">
                <div className="demo-metric">
                  <span className="demo-metric-label">Occupied</span>
                  <span className="demo-metric-value">
                    {lot.occupied}<small>/{lot.total}</small>
                  </span>
                </div>
                <div className="demo-metric">
                  <span className="demo-metric-label">Utilisation</span>
                  <span className="demo-metric-value">{lot.utilization}<small>%</small></span>
                </div>
                <div className="demo-metric">
                  <span className="demo-metric-label">Available</span>
                  <span className="demo-metric-value">{lot.total - lot.occupied}</span>
                </div>
              </div>

              <div className="demo-meter" aria-hidden="true">
                <motion.span
                  className="demo-meter-fill"
                  animate={{ width: `${lot.utilization}%` }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>

              <h3 className="demo-feed-title">Event stream</h3>
              <div className="demo-feed">
                <AnimatePresence initial={false}>
                  {lot.events.map((e) => (
                    <motion.div
                      key={e.id}
                      className="demo-event"
                      initial={reduced ? false : { opacity: 0, x: -14, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={reduced ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                    >
                      <span className={`demo-event-icon ${e.type === 'park_start' ? 'in' : 'out'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={e.type === 'park_start' ? 'M12 5v14M6 13l6 6 6-6' : 'M12 19V5M6 11l6-6 6 6'} />
                        </svg>
                      </span>
                      <span className="demo-event-text">
                        <strong>{e.type === 'park_start' ? 'Vehicle parked' : 'Vehicle departed'}</strong>
                        <span>Spot {e.index + 1}</span>
                      </span>
                      <span className="demo-event-time">{ago(e.at)}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {lot.events.length === 0 && (
                  <p className="demo-empty">
                    {lot.reduced
                      ? 'Motion is reduced — press Step to advance the simulation.'
                      : 'Waiting for the next event…'}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
