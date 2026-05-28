import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrices } from '../utils/api';

const STEPS = [
  { icon: '📅', title: 'Book a Pickup', desc: 'Choose your scrap items, weight estimate, and convenient time slot.' },
  { icon: '🚗', title: 'We Come to You', desc: 'Our verified agent arrives at your doorstep on the scheduled date.' },
  { icon: '⚖️', title: 'Weigh & Pay', desc: 'Scrap is weighed on-spot at transparent market rates. Cash handed over instantly.' },
];

const WHYS = [
  { icon: '💰', title: 'Best Market Rates', desc: 'We update rates daily. No haggling, no cheating.' },
  { icon: '🏠', title: 'Doorstep Service', desc: 'No need to carry heavy scrap. We come to you.' },
  { icon: '🌱', title: 'Eco-Friendly', desc: 'All scrap goes to certified recyclers. Zero landfill.' },
  { icon: '📱', title: 'Track Everything', desc: 'Live status updates on every pickup in your dashboard.' },
];

export default function Home() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    getPrices().then(r => setPrices(r.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div className="page-enter">
      {/* HERO */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroInner}>
          <div style={styles.heroContent}>
            <div style={styles.heroBadge}>🇮🇳 Made for Indian Homes</div>
            <h1 style={{ color: 'var(--white)', marginBottom: '1rem' }}>
              Ghar Ka Raddi,<br />
              <span style={{ color: 'var(--green-500)' }}>Seedha Cash</span>
            </h1>
            <p style={styles.heroSubtitle}>
              India's smartest doorstep scrap collection service. Book a pickup in 60 seconds, 
              get paid at your door — transparent rates, zero hassle.
            </p>
            <div style={styles.heroBtns}>
              <Link to="/book" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                📅 Book Free Pickup
              </Link>
              <Link to="/prices" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--white)', fontSize: '1rem', padding: '0.85rem 2rem' }}>
                📊 Live Prices
              </Link>
            </div>
            <div style={styles.heroStats}>
              <div style={styles.stat}><strong>500+</strong><span>Pickups Done</span></div>
              <div style={styles.stat}><strong>98%</strong><span>Satisfied Users</span></div>
              <div style={styles.stat}><strong>₹50K+</strong><span>Paid to Users</span></div>
            </div>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.heroBigIcon}>♻️</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <div className="container">
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Three simple steps to turn your scrap into cash</p>
          <div style={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={i} className="card" style={styles.stepCard}>
                <div style={styles.stepNum}>{i + 1}</div>
                <div style={styles.stepIcon}>{s.icon}</div>
                <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                <p className="text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE PRICES TEASER */}
      {prices.length > 0 && (
        <section style={{ ...styles.section, background: 'var(--green-50)' }}>
          <div className="container">
            <h2 style={styles.sectionTitle}>Today's Scrap Rates</h2>
            <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Updated daily at market rates</p>
            <div style={styles.pricesGrid}>
              {prices.map((p) => (
                <div key={p._id} className="card" style={styles.priceCard}>
                  <span style={styles.priceIcon}>{p.icon}</span>
                  <div style={styles.priceInfo}>
                    <div style={styles.priceLabel}>{p.label}</div>
                    <div style={styles.priceAmt}>₹{p.pricePerKg}<span>/kg</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/prices" className="btn btn-outline">See All Prices →</Link>
            </div>
          </div>
        </section>
      )}

      {/* WHY US */}
      <section style={styles.section}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Why GharSeRaddi?</h2>
          <div style={styles.whyGrid}>
            {WHYS.map((w, i) => (
              <div key={i} style={styles.whyCard}>
                <div style={styles.whyIcon}>{w.icon}</div>
                <h3 style={{ marginBottom: '0.4rem' }}>{w.title}</h3>
                <p className="text-muted">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: '1rem' }}>Ready to Clear Your Clutter?</h2>
          <p style={{ color: 'var(--green-100)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Join hundreds of households already earning from their waste.
          </p>
          <Link to="/register" className="btn" style={{ background: 'var(--white)', color: 'var(--green-700)', fontSize: '1rem', padding: '0.85rem 2.5rem', fontWeight: 700 }}>
            Get Started — It's Free
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 100%)', padding: '5rem 0 4rem' },
  heroInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' },
  heroContent: { flex: '1 1 500px' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: 'var(--green-100)', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1rem' },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '480px' },
  heroBtns: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' },
  heroStats: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', color: 'var(--white)', fontFamily: 'var(--font-display)' },
  heroVisual: { flex: '0 0 200px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroBigIcon: { fontSize: '8rem', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.3))', animation: 'spin 8s linear infinite' },
  section: { padding: '4rem 0' },
  sectionTitle: { textAlign: 'center', marginBottom: '0.5rem' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  stepCard: { textAlign: 'center', padding: '2rem' },
  stepNum: { width: '36px', height: '36px', borderRadius: '50%', background: 'var(--green-600)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, margin: '0 auto 1rem', fontFamily: 'var(--font-display)' },
  stepIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  pricesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' },
  priceCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' },
  priceIcon: { fontSize: '2rem' },
  priceInfo: {},
  priceLabel: { fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' },
  priceAmt: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--green-600)' },
  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginTop: '2rem' },
  whyCard: { textAlign: 'center' },
  whyIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  ctaSection: { background: 'linear-gradient(135deg, var(--green-700), var(--green-900))', padding: '4rem 0' },
};
