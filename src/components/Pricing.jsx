import { useScrollReveal } from '../hooks/useScrollReveal';
import './Pricing.css';

const CALENDLY_URL = 'https://calendly.com/admin-spot-me/30min';

function Pricing() {
  const ref = useScrollReveal();

  return (
    <section id="pricing" className="pricing">
      <div ref={ref} className="pricing-inner scroll-reveal">
        <p className="pricing-line">
          Pilot pricing: <strong>free for 30 days</strong>, then <strong>$8/spot/month</strong>.
          No hardware lock-in, no multi-year contracts.
        </p>
        <a
          className="btn btn-primary"
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a 15-min demo
        </a>
      </div>
    </section>
  );
}

export default Pricing;
