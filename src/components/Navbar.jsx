import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { EASE } from '../lib/motion';
import './Navbar.css';

const CALENDLY_URL = 'https://calendly.com/admin-spot-me/30min';

const links = [
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Live demo', id: 'live-demo' },
  { label: "Who it's for", id: 'services' },
  { label: 'ROI', id: 'roi' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'FAQ', id: 'faq' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const reduced = useReducedMotion();

  // Reading-progress bar across the top of the page.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const ids = ['hero', ...links.map((l) => l.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const go = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <motion.nav
        className={`navbar ${scrolled ? 'is-scrolled' : ''}`}
        role="navigation"
        aria-label="Main"
        initial={reduced ? false : { y: -70 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div className="navbar-inner container">
          <a href="#hero" className="navbar-logo" onClick={(e) => go(e, 'hero')}>
            <img src="/SpotMeLogo-transparent.png" alt="SpotMe — smart parking" className="logo-image" />
            {/* A car slides in and the bay locks green — the whole promise of
                the product in 26 pixels, next to the name. */}
            <span className="logo-park" aria-hidden="true"><i /><i /><i /><b /></span>
          </a>

          <ul className="navbar-links">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  className={active === l.id ? 'is-active' : ''}
                  aria-current={active === l.id ? 'true' : undefined}
                >
                  {l.label}
                  {active === l.id && (
                    <motion.span className="nav-underline" layoutId="nav-underline"
                      transition={{ duration: 0.35, ease: EASE }} />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar-right">
            <a className="navbar-cta btn btn-primary btn-sm" href={CALENDLY_URL}
               target="_blank" rel="noopener noreferrer">
              Book a demo
            </a>
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`hamburger ${isMenuOpen ? 'open' : ''}`} aria-hidden="true">
                <i /><i /><i />
              </span>
            </button>
          </div>
        </div>

        {/* Reading progress — purely decorative, hidden from AT. */}
        <motion.div className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="mobile-scrim"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              className="mobile-menu glass"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {links.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  initial={reduced ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3, ease: EASE }}
                >
                  {l.label}
                </motion.a>
              ))}
              <a className="btn btn-primary mobile-cta" href={CALENDLY_URL}
                 target="_blank" rel="noopener noreferrer">
                Book a 15-min demo
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
