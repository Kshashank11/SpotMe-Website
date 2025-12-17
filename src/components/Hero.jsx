import './Hero.css';

function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Smart Parking
          <span className="highlight"> Made Simple</span>
        </h1>
        <p className="hero-subtitle">
          Find affordable, secure parking in seconds. SpotMe offers real-time availability,
          dynamic pricing, and guaranteed reservations powered by advanced IoT technology.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={scrollToContact}>
            Get Started
          </button>
          <button className="btn btn-secondary" onClick={scrollToServices}>
            Our Solutions
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-value">43%</span>
            <span className="stat-desc">Less Search Time</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">30%</span>
            <span className="stat-desc">Reduced Emissions</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">24/7</span>
            <span className="stat-desc">Real-Time Data</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-graphic">
          <div className="graphic-circle circle-1"></div>
          <div className="graphic-circle circle-2"></div>
          <div className="graphic-circle circle-3"></div>
          <div className="parking-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
