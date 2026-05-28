import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <div style={styles.brand}>
          <span style={{ fontSize: '1.5rem' }}>♻️</span>
          <div>
            <div style={styles.logoText}>GharSeRaddi</div>
            <div style={styles.tagline}>Ghar Ka Raddi, Seedha Cash</div>
          </div>
        </div>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/prices" style={styles.link}>Prices</Link>
          <Link to="/book" style={styles.link}>Book Pickup</Link>
          <Link to="/register" style={styles.link}>Sign Up</Link>
        </div>
        <div style={styles.copy}>
          © 2024 GharSeRaddi. Made with 💚 for a cleaner India.
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: 'var(--gray-900)', color: 'var(--gray-400)', marginTop: '4rem', padding: '2.5rem 0' },
  inner: { display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  logoText: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--white)' },
  tagline: { fontSize: '0.8rem', color: 'var(--green-500)' },
  links: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  link: { color: 'var(--gray-400)', fontSize: '0.9rem', transition: 'color 0.15s' },
  copy: { fontSize: '0.82rem', width: '100%', marginTop: '1rem', borderTop: '1px solid #374151', paddingTop: '1rem' },
};
