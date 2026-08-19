import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import LiveDemo from './components/LiveDemo';
import Services from './components/Services';
import ROICalculator from './components/ROICalculator';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

/**
 * Section order follows the operator's decision path:
 * hook -> credibility -> problem -> how -> proof -> fit -> money -> price ->
 * objections -> contact.
 */
function App() {
  return (
    <div className="app">
      <Navbar />
      <main id="main">
        <Hero />
        <TrustStrip />
        <About />
        <HowItWorks />
        <LiveDemo />
        <Services />
        <ROICalculator />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
