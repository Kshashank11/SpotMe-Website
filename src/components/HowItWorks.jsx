import { useScrollReveal } from '../hooks/useScrollReveal';
import './HowItWorks.css';

const steps = [
  {
    n: '1',
    title: 'MOUNT',
    desc: 'Attach one device to an existing pole or wall. No trenching, no pavement cuts, no power run.',
  },
  {
    n: '2',
    title: 'CALIBRATE',
    desc: "Zones auto-learn your lot's layout in 10 minutes from our admin dashboard.",
  },
  {
    n: '3',
    title: 'GO LIVE',
    desc: 'Real-time occupancy streams to your dashboard and to drivers via the SpotMe app. Payments settle through Stripe.',
  },
];

function HowItWorks() {
  const ref = useScrollReveal();

  return (
    <section id="how-it-works" className="how-it-works">
      <div ref={ref} className="how-container scroll-reveal">
        <h2 className="section-title">How it works</h2>
        <div className="how-grid">
          {steps.map((s) => (
            <div key={s.n} className="how-card">
              <div className="how-number">{s.n}</div>
              <h3 className="how-title">{s.title}</h3>
              <p className="how-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
