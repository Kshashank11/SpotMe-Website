import './About.css';

function About() {
  const stats = [
    { number: '$6.7B', label: 'Market by 2029' },
    { number: '18%', label: 'Annual Growth' },
    { number: '30%', label: 'Traffic from Parking Search' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-content">
          <h2 className="section-title">About SpotMe</h2>
          <p className="about-text">
            SpotMe is revolutionizing urban parking with intelligent technology. We address the
            critical pain points that drivers, parking operators, and municipalities face daily:
            wasted time searching for spots, static pricing that doesn't reflect demand, and
            security concerns in parking facilities.
          </p>
          <p className="about-text">
            Our IoT-powered platform combines real-time availability tracking, dynamic pricing,
            guaranteed reservations, and automated enforcement to create a seamless parking
            experience. Whether you're a daily commuter, parking lot operator, or city planner,
            SpotMe delivers solutions that save time, reduce costs, and lower emissions.
          </p>
          <div className="about-values">
            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Real-Time Data</span>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span>Secure Parking</span>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Dynamic Pricing</span>
            </div>
          </div>
        </div>
        <div className="about-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
