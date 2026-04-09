import './Pricing.css';

// TODO: replace with real Calendly link
const CALENDLY_URL = 'https://calendly.com/spotme-demo/15min';

function Pricing() {
  return (
    <section id="pricing" className="pricing">
      <div className="pricing-inner">
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
