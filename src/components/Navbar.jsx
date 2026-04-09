import { useState } from 'react';
import './Navbar.css';

const CALENDLY_URL = 'https://calendly.com/admin-spot-me/30min';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const links = [
    { label: 'Home', id: 'hero' },
    { label: 'How it works', id: 'how-it-works' },
    { label: "Who it's for", id: 'services' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <a href="#hero" className="navbar-logo" onClick={(e) => handleNavClick(e, 'hero')}>
          <img src="/SpotMeLogo.png" alt="SpotMe - Smart Parking Solutions" className="logo-image" />
        </a>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={(e) => handleNavClick(e, l.id)}>{l.label}</a>
            </li>
          ))}
        </ul>

        <a
          className="navbar-cta btn btn-primary"
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="cta-label-full">Book a demo</span>
          <span className="cta-label-short">Demo</span>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
