import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrices } from '../utils/api';

export default function Prices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calc, setCalc] = useState({});

  useEffect(() => {
    getPrices()
      .then(r => { setPrices(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = prices.reduce((sum, p) => sum + (parseFloat(calc[p.category] || 0) * p.pricePerKg), 0);

  return (
    <div className="page-enter" style={{ padding: '3rem 0' }}>
      <div className="container">
        <div style={styles.header}>
          <h2>📊 Live Scrap Rates</h2>
          <p className="text-muted">Updated daily at market rates — Kanpur & nearby areas</p>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            <div style={styles.grid}>
              {prices.map(p => (
                <div key={p._id} className="card" style={styles.card}>
                  <div style={styles.cardTop}>
                    <span style={styles.icon}>{p.icon}</span>
                    <div>
                      <div style={styles.label}>{p.label}</div>
                      {p.labelHindi && <div style={styles.labelHindi}>{p.labelHindi}</div>}
                    </div>
                  </div>
                  <div style={styles.price}>₹{p.pricePerKg}<span style={styles.perKg}>/kg</span></div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>{p.description}</p>
                  <div style={styles.calcRow}>
                    <input
                      type="number" min="0" step="0.5" placeholder="Enter kg"
                      value={calc[p.category] || ''}
                      onChange={e => setCalc({ ...calc, [p.category]: e.target.value })}
                      style={styles.calcInput}
                    />
                    {calc[p.category] > 0 && (
                      <span style={styles.calcResult}>
                        = ₹{(parseFloat(calc[p.category]) * p.pricePerKg).toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {total > 0 && (
              <div className="card" style={styles.totalCard}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Estimated Total Earning</div>
                <div style={styles.totalAmt}>₹{total.toFixed(0)}</div>
                <Link to="/book" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Book Pickup Now →
                </Link>
              </div>
            )}

            <div style={styles.note}>
              <strong>📌 Note:</strong> These are estimated rates. Final payment is based on actual weight measured at doorstep. Our agents carry calibrated weighing scales.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { textAlign: 'center', marginBottom: '2.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' },
  card: { padding: '1.5rem' },
  cardTop: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' },
  icon: { fontSize: '2.2rem' },
  label: { fontWeight: 700, fontSize: '1rem' },
  labelHindi: { color: 'var(--gray-600)', fontSize: '0.82rem' },
  price: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--green-600)', marginBottom: '0.4rem' },
  perKg: { fontSize: '0.9rem', fontWeight: 400, color: 'var(--gray-600)' },
  calcRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  calcInput: { padding: '0.5rem 0.75rem', border: '1.5px solid #e5e7eb', borderRadius: '8px', width: '110px', fontSize: '0.9rem', outline: 'none' },
  calcResult: { fontWeight: 700, color: 'var(--green-600)', fontSize: '1rem' },
  totalCard: { marginTop: '2rem', textAlign: 'center', padding: '2rem', background: 'var(--green-50)', border: '2px solid var(--green-200)' },
  totalAmt: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: 'var(--green-700)' },
  note: { marginTop: '2rem', padding: '1rem 1.5rem', background: 'var(--amber-100)', borderRadius: 'var(--radius)', color: '#78350f', fontSize: '0.9rem' },
};
