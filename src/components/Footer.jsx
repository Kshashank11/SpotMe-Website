import './Footer.css';

/**
 * NOTE: the previous footer shipped LinkedIn / Twitter / GitHub icons all
 * pointing at href="#". Links that go nowhere are worse than no links —
 * they cost trust and trap keyboard users. They are removed until real URLs
 * exist; SHASHANK: send me the handles and I'll wire them back in.
 */
const CALENDLY_URL = 'https://calendly.com/admin-spot-me/30min';

const nav = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Live demo', href: '#live-demo' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'ROI estimate', href: '#roi' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'The problem', href: '#about' },
      { label: "Who it's for", href: '#services' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/SpotMeLogo-transparent.png" alt="SpotMe" className="footer-logo" loading="lazy" />
          <p className="footer-tagline">
            Radar-based occupancy for private parking operators. Know every spot,
            close the revenue leak, deploy in 20 minutes.
          </p>
          <a className="btn btn-primary btn-sm" href={CALENDLY_URL}
             target="_blank" rel="noopener noreferrer">
            Book a demo
          </a>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {nav.map((col) => (
            <div className="footer-col" key={col.heading}>
              <h2 className="footer-heading">{col.heading}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col">
            <h2 className="footer-heading">Contact</h2>
            <ul>
              <li><a href="mailto:admin@spot-me.net">admin@spot-me.net</a></li>
              <li><a href="tel:+17654097957">+1 (765) 409-7957</a></li>
              <li className="footer-plain">New York City, NY</li>
              <li className="footer-plain">Spot-Me Solutions, Inc.</li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {currentYear} SpotMe. All rights reserved.</p>
        <span className="footer-patent">Patent Pending (US)</span>
      </div>
    </footer>
  );
}

export default Footer;
