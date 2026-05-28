import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyPickups, cancelPickup } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_ORDER = ['pending','confirmed','in_progress','completed','cancelled'];

export default function Dashboard() {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchPickups = () => {
    getMyPickups()
      .then(r => { setPickups(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPickups(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this pickup?')) return;
    try {
      await cancelPickup(id);
      toast.success('Pickup cancelled');
      fetchPickups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel');
    }
  };

  const filtered = filter === 'all' ? pickups : pickups.filter(p => p.status === filter);

  const stats = {
    total: pickups.length,
    completed: pickups.filter(p => p.status === 'completed').length,
    pending: pickups.filter(p => p.status === 'pending').length,
    earned: pickups.filter(p => p.status === 'completed').reduce((s, p) => s + (p.actualEarning || 0), 0),
  };

  return (
    <div className="page-enter" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2>👋 Hello, {user?.name.split(' ')[0]}!</h2>
            <p className="text-muted">Track all your pickup requests here</p>
          </div>
          <Link to="/book" className="btn btn-primary">+ Book New Pickup</Link>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Pickups', value: stats.total, icon: '📦', color: 'var(--green-600)' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: '#2563eb' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: '#d97706' },
            { label: 'Total Earned', value: `₹${stats.earned}`, icon: '💰', color: 'var(--green-700)' },
          ].map((s, i) => (
            <div key={i} className="card" style={styles.statCard}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={styles.filterRow}>
          {['all', ...STATUS_ORDER].map(f => (
            <button key={f} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Pickups list */}
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♻️</div>
            <h3>No pickups yet</h3>
            <p className="text-muted">Book your first pickup and start earning!</p>
            <Link to="/book" className="btn btn-primary" style={{ marginTop: '1rem' }}>Book Now</Link>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map(p => (
              <div key={p._id} className="card" style={styles.pickupCard}>
                <div style={styles.pickupTop}>
                  <div>
                    <div style={styles.pickupDate}>
                      📅 {new Date(p.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      &nbsp;&nbsp;🕐 {p.scheduledTimeSlot}
                    </div>
                    <div style={styles.pickupItems}>
                      {p.scrapItems.map(i => <span key={i.category} style={styles.itemChip}>{i.category} ({i.estimatedWeight}kg)</span>)}
                    </div>
                  </div>
                  <span className={`badge badge-${p.status}`}>{p.status.replace('_', ' ')}</span>
                </div>

                <div style={styles.pickupBottom}>
                  <div style={styles.earning}>
                    <span className="text-muted">Est. Earning</span>
                    <strong className="text-green">₹{p.totalEstimatedEarning?.toFixed(0)}</strong>
                    {p.status === 'completed' && (
                      <><span className="text-muted" style={{ marginLeft: '1rem' }}>Actual</span>
                      <strong className="text-green">₹{p.actualEarning}</strong></>
                    )}
                  </div>
                  {(p.status === 'pending' || p.status === 'confirmed') && (
                    <button className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => handleCancel(p._id)}>
                      Cancel
                    </button>
                  )}
                </div>

                {p.agentName && (
                  <div style={styles.agentRow}>👷 Agent: <strong>{p.agentName}</strong></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: { textAlign: 'center', padding: '1.5rem' },
  statIcon: { fontSize: '1.8rem', marginBottom: '0.5rem' },
  statVal: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem' },
  statLabel: { color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: '0.25rem' },
  filterRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  filterBtn: { padding: '0.4rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '999px', background: 'var(--white)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)', transition: 'all 0.15s' },
  filterActive: { background: 'var(--green-600)', color: 'var(--white)', borderColor: 'var(--green-600)' },
  empty: { textAlign: 'center', padding: '4rem 2rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  pickupCard: { padding: '1.25rem' },
  pickupTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' },
  pickupDate: { fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.95rem' },
  pickupItems: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  itemChip: { background: 'var(--green-100)', color: 'var(--green-900)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize' },
  pickupBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' },
  earning: { display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' },
  agentRow: { marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-600)' },
};
