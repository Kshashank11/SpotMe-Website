import './Services.css';

const blocks = [
  {
    audience: 'For Operators',
    primary: true,
    title: 'Recover lost revenue, without lifting a finger',
    bullets: [
      'Real-time occupancy for every spot in your lot',
      'Automatic enforcement alerts when a car parks without paying',
      'Revenue dashboard with demand-based pricing recommendations',
      '+14% projected revenue per spot (pilot data coming Q2 2026)',
    ],
  },
  {
    audience: 'For Drivers',
    primary: false,
    title: 'Find, book, and pay in seconds',
    bullets: [
      'SpotMe app shows live spot availability before you drive',
      'Tap to reserve, tap to pay (Stripe + Razorpay supported)',
      'No more circling or printing receipts',
    ],
  },
  {
    audience: 'For Cities',
    primary: false,
    title: 'Deploy smart parking without construction',
    bullets: [
      'Mount on existing streetlight poles',
      'Cuts 43% off driver search time, 30% off parking emissions',
      'ParkNYC-compatible pricing and enforcement',
    ],
  },
];

function Services() {
  return (
    <section id="services" className="services">
      <div className="services-container">
        <h2 className="section-title">Who it's for</h2>
        <p className="section-subtitle">
          One deployment, three outcomes. The driver app is the payment rail that
          closes the loop for operators.
        </p>
        <div className="services-grid outcome-grid">
          {blocks.map((b) => (
            <div
              key={b.audience}
              className={`service-card outcome-card ${b.primary ? 'outcome-primary' : ''}`}
            >
              <span className="outcome-audience">{b.audience}</span>
              <h3 className="outcome-title">{b.title}</h3>
              <ul className="outcome-bullets">
                {b.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
