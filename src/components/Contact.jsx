import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { stagger, fadeUp, inView, EASE } from '../lib/motion';
import './Contact.css';

const EMAILJS_SERVICE_ID = 'service_qkb0hmn';
const EMAILJS_TEMPLATE_ID = 'template_3pj9qwe';
const EMAILJS_PUBLIC_KEY = 'OIXseEg65VLn1sWVw';

const CALENDLY_URL = 'https://calendly.com/admin-spot-me/30min';

function Contact() {
  const reduced = useReducedMotion();
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Reject rather than repair.
   *
   * The control-character check on the email matters most: a newline in an
   * address is how header injection gets attempted against anything that later
   * builds a mail header from it.
   */
  const validate = ({ name, email, company, message }) => {
    const CONTROL = /[\u0000-\u001F\u007F]/;
    if (!name.trim()) return 'Please enter your name.';
    if (name.trim().length > 80) return 'Name is too long.';
    if (!email.trim()) return 'Please enter your email address.';
    if (email.length > 254) return 'Email address is too long.';
    if (CONTROL.test(email)) return 'That email address is not valid.';
    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (company.length > 120) return 'Company name is too long.';
    if (!message.trim()) return 'Please include a message.';
    if (message.length > 4000) return 'Message is too long (4000 characters max).';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const problem = validate(formData);
    if (problem) {
      setError(problem);
      return;
    }

    setIsLoading(true);
    setError('');

    const templateParams = {
      from_name: formData.name.trim(),
      from_email: formData.email.trim().toLowerCase(),
      company: formData.company.trim() || 'Not provided',
      message: formData.message.trim(),
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch (err) {
      setError('Failed to send message. Please try again, or email admin@spot-me.net directly.');
      console.error('EmailJS error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container contact-grid">
        <motion.div
          className="contact-info"
          variants={stagger(0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inView}
        >
          <motion.span className="eyebrow" variants={fadeUp(12)}>Get in touch</motion.span>
          <motion.h2 className="section-title contact-title" variants={fadeUp(20)}>
            Let's look at your lot
          </motion.h2>
          <motion.p className="contact-text" variants={fadeUp(20)}>
            The fastest path is a 15-minute call — bring your spot count and current
            monthly revenue and we'll walk through what the leak looks like on your site.
          </motion.p>

          <motion.a
            className="btn btn-primary contact-calendly"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeUp(18)}
          >
            Book a 15-min demo
          </motion.a>

          <motion.div className="contact-details" variants={fadeUp(18)}>
            <a className="contact-item" href="mailto:admin@spot-me.net">
              <span className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>
                <strong>Email</strong>
                admin@spot-me.net
              </span>
            </a>
            <a className="contact-item" href="tel:+17654097957">
              <span className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span>
                <strong>Phone</strong>
                +1 (765) 409-7957
              </span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="contact-form-wrapper card"
          initial={reduced ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                className="success-message"
                role="status"
                initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>Thank you</h3>
                <p>We've received your message and will get back to you shortly.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="contact-form"
                onSubmit={handleSubmit}
                initial={false}
                exit={reduced ? undefined : { opacity: 0 }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full name</label>
                    <input type="text" id="name" name="name" value={formData.name}
                           onChange={handleChange} required autoComplete="name" maxLength={80} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email" name="email" value={formData.email}
                           onChange={handleChange} required autoComplete="email" maxLength={254} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company <span className="optional">(optional)</span></label>
                  <input type="text" id="company" name="company" value={formData.company}
                         onChange={handleChange} autoComplete="organization" maxLength={120} />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" value={formData.message}
                            onChange={handleChange} required rows="4" maxLength={4000}
                            placeholder="How many spots do you operate, and where?" />
                </div>

                {/* Announced to screen readers the moment a send fails. */}
                <div aria-live="polite">
                  {error && <p className="error-message" role="alert">{error}</p>}
                </div>

                <button type="submit" className="btn btn-primary btn-submit" disabled={isLoading}>
                  {isLoading ? 'Sending…' : 'Send message'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
