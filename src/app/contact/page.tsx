'use client';

import Link from 'next/link';
import VideoBg from '@/shared/components/VideoBg';
import { useState, useEffect } from 'react';
import { useNotification } from '@/shared/contexts/NotificationContext';
import { useAnalyticsTracking } from '@/shared/analytics/useTracking';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const { notify } = useNotification();
  const { trackFormStart, trackFormComplete, trackFormError } =
    useAnalyticsTracking();

  // Track form page view
  useEffect(() => {
    trackFormStart('contact_form');
  }, [trackFormStart]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Connect to your backend API
      console.log('Form submitted:', formData);

      // ✅ Track successful form submission
      trackFormComplete('contact_form', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        messageLength: formData.message.length,
      });

      setSubmitStatus('success');
      notify(
        "Message sent successfully! We'll get back to you soon.",
        'success',
        6000
      );
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Submission error:', error);

      // ✅ Track form errors
      trackFormError(
        'contact_form',
        (error as Error)?.message || 'Unknown error'
      );

      setSubmitStatus('error');
      notify('Failed to send message. Please try again.', 'error', 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '80vh' }}>
        <VideoBg
          src="/videos/hero.mp4"
          overlay={true}
          overlayOpacity={0.35}
          autoPlay={true}
          muted={true}
          loop={true}
        />
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            We'd love to hear from you
          </div>

          <h1 className="hero-title">
            Get in
            <br />
            <em>Touch</em>
          </h1>

          <p className="hero-sub">
            Have questions, prayer requests, or want to connect with our
            community? We're here to serve you.
          </p>
        </div>
      </section>

      {/* Contact Info Bar */}
      <div className="times-bar">
        <div className="time-item">
          <div className="time-icon">📍</div>
          <div>
            <div className="time-label">Location</div>
            <div className="time-val">Honor Gardens, Lekki-Epe, Lagos</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">📞</div>
          <div>
            <div className="time-label">Phone</div>
            <div className="time-val">0706 999 5333</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">✉️</div>
          <div>
            <div className="time-label">Email</div>
            <div className="time-val">Wisdomhousehq@gmail.com</div>
          </div>
        </div>
        <div className="time-sep" />

        <div className="time-item">
          <div className="time-icon">⏰</div>
          <div>
            <div className="time-label">Hours</div>
            <div className="time-val">Mon-Fri 10 AM - 5 PM</div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <section>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="section-tag">Contact Form</span>
          <h2 className="section-title" style={{ marginBottom: '2rem' }}>
            Send us a
            <br />
            <em>Message</em>
          </h2>

          <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
            {/* Name Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="name"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  marginBottom: '0.5rem',
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                style={{
                  width: '100%',
                  background: 'var(--charcoal)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  fontSize: '15px',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>

            {/* Email & Phone Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    background: 'var(--charcoal)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '2px',
                    padding: '12px 14px',
                    fontSize: '15px',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234..."
                  style={{
                    width: '100%',
                    background: 'var(--charcoal)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '2px',
                    padding: '12px 14px',
                    fontSize: '15px',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
            </div>

            {/* Subject Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="subject"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  marginBottom: '0.5rem',
                }}
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  background: 'var(--charcoal)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  fontSize: '15px',
                  color: formData.subject
                    ? 'var(--text)'
                    : 'var(--text-subtle)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <option value="">Select a subject...</option>
                <option value="general">General Inquiry</option>
                <option value="prayer">Prayer Request</option>
                <option value="pastoral">Pastoral Care</option>
                <option value="event">Event Registration</option>
                <option value="giving">Giving & Donations</option>
                <option value="ministry">Ministry Involvement</option>
                <option value="feedback">Feedback & Suggestions</option>
              </select>
            </div>

            {/* Message Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                htmlFor="message"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  marginBottom: '0.5rem',
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us what's on your heart..."
                rows={6}
                style={{
                  width: '100%',
                  background: 'var(--charcoal)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  fontSize: '15px',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-sans)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '0.5px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  marginBottom: '1.5rem',
                  color: '#10B981',
                  fontSize: '14px',
                }}
              >
                ✓ Thank you! Your message has been sent. We'll get back to you
                soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '0.5px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  marginBottom: '1.5rem',
                  color: '#EF4444',
                  fontSize: '14px',
                }}
              >
                ✗ Something went wrong. Please try again or call us directly.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Additional Contact Methods */}
      <section style={{ background: 'var(--charcoal)' }}>
        <span className="section-tag">Other Ways to Connect</span>
        <h2 className="section-title" style={{ marginBottom: '3rem' }}>
          Reach us through
          <br />
          <em>other channels</em>
        </h2>

        <div className="giving-grid">
          <div className="giving-card">
            <div className="giving-icon">📦</div>
            <div className="giving-title">Prayer Request</div>
            <div className="giving-desc">
              Submit prayer requests and let our community pray with you. Your
              prayers matter to us.
            </div>
            <Link href="/forms/prayer" className="giving-btn">
              Submit Prayer →
            </Link>
          </div>

          <div className="giving-card">
            <div className="giving-icon">🤝</div>
            <div className="giving-title">Ministry Opportunities</div>
            <div className="giving-desc">
              Interested in serving? Explore ways to get involved in our various
              ministries and programs.
            </div>
            <Link href="/ministries" className="giving-btn">
              Learn More →
            </Link>
          </div>

          <div className="giving-card">
            <div className="giving-icon">👨‍⚖️</div>
            <div className="giving-title">Pastoral Care</div>
            <div className="giving-desc">
              Need pastoral guidance for weddings, counseling, or special
              occasions? We're here to help.
            </div>
            <Link href="/pastoral" className="giving-btn">
              Request Care →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="nav-logo">
              <div className="nav-logo-icon">W</div>
              <span className="nav-logo-text">The Wisdom Church</span>
            </div>
            <p className="footer-brand-desc" style={{ marginTop: '1rem' }}>
              We're here to serve and support your spiritual journey at every
              step.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/resources">Resources</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Service Times</div>
            <div className="footer-contact-item">
              Sunday Worship
              <br />
              9:00 AM (WAT)
            </div>
            <div className="footer-contact-item">
              Midweek Service
              <br />
              Thursday · 6:00 PM
            </div>
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-contact-item">
              Honor Gardens, Alasia, Lekki-Epe Expressway, Lagos
            </div>
            <div className="footer-contact-item">0706 999 5333</div>
            <div className="footer-contact-item">Wisdomhousehq@gmail.com</div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 The Wisdom House Church. All Rights Reserved.</span>
          <div className="footer-bottom-links">
            <Link href="/terms">Privacy Policy</Link>
            <Link href="/cookies">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
