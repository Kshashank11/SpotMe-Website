import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';

function About() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="about">
      <div ref={ref} className="about-container about-single scroll-reveal">
        <div className="about-content about-content-wide">
          <h2 className="section-title">Built for private parking operators</h2>
          <p className="about-text">
            Private lot and garage operators lose an estimated <strong>15–25% of
            potential revenue</strong> to unpaid stays, manual enforcement, and static
            pricing that doesn't match demand. SpotMe fixes all three at once.
          </p>
          <p className="about-text">
            Our radar sensors — mounted on existing poles or walls in minutes —
            detect every car that parks, whether the driver paid or not. Our app
            lets drivers book and pay in seconds, closing the loop between detection
            and revenue. And our dashboard gives you real-time occupancy,
            enforcement alerts, and demand-based pricing recommendations.
            <strong> No construction. No pavement sensors. Dramatically reduce manual enforcement by automated occupancy monitoring.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
