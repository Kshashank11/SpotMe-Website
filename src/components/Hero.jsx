import './Hero.css';
import HeroIllustration from './HeroIllustration';

// TODO: replace with real Calendly link
const CALENDLY_URL = 'https://calendly.com/spotme-demo/15min';
const FOUNDER_MAILTO = 'mailto:admin@spot-me.net?subject=SpotMe%20Demo%20Request';

function Hero() {
  const stats = [
    { value: '±1m', desc: 'Spot-level detection accuracy' },
    { value: '<2%', desc: 'False positive rate' },
    { value: '20 min', desc: 'Per-device deploy time' },
    { value: '8', desc: 'Spots covered per $300 device' },
  ];

  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <span className="patent-badge">Patent Pending (US)</span>
          <h1 className="hero-title">
            Know every spot in your lot.{' '}
            <span className="highlight">Close the revenue leak.</span>{' '}
            Deploy in 20 minutes.
          </h1>
          <p className="hero-subtitle">
            SpotMe is an IoT + mobile platform for private parking operators.
            Radar sensors track occupancy in real time, the SpotMe app lets drivers
            book and pay on the spot, and you get a full revenue and enforcement
            dashboard — no trenching, no pavement sensors, no construction.
          </p>
          <div className="hero-buttons">
            <a
              className="btn btn-primary"
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a 15-min demo
            </a>
            <a className="btn btn-ghost" href={FOUNDER_MAILTO}>
              Email the founder
            </a>
          </div>
          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.value} className="hero-stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-desc">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

export default Hero;
