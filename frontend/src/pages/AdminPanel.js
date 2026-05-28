import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminStats, getAllPickups, updatePickup, getAllUsers, updatePrice, getPrices, seedPrices } from '../utils/api';

const TABS = ['Dashboard', 'Pickups', 'Users', 'Prices'];

export default function AdminPanel() {
  const [tab, setTab] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [users, setUsers] = useState([]);
  const [prices, setPrices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'Dashboard') getAdminStats().then(r => setStats(r.data)).catch(() => {});
    if (tab === 'Pickups') getAllPickups({ status: statusFilter }).then(r => setPickups(r.data.pickups)).catch(() => {});
    if (tab === 'Users') getAllUsers().then(r => setUsers(r.data)).catch(() => {});
    if (tab === 'Prices') getPrices().then(r => setPrices(r.data)).catch(() => {});
  }, [tab, statusFilter]);

  const handleStatusUpdate = async (id, status, extra = {}) => {
    try {
      await updatePickup(id, { status, ...extra });
      toast.success('Pickup updated');
      getAllPickups({ status: statusFilter }).then(r => setPickups(r.data.pickups));
    } catch { toast.error('Update failed'); }
  };

  const handleSeedPrices = async () => {
    setLoading(true);
    try {
      await seedPrices();
      toast.success('Prices seeded!');
      getPrices().then(r => setPrices(r.data));
    } catch { toast.error('Seed failed'); }
    finally { setLoading(false); }
  };

  const handlePriceUpdate = async (id, pricePerKg) => {
    try {
      await updatePrice(id, { pricePerKg: parseFloat(pricePerKg) });
      toast.success('Price updated');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="page-enter" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <h2 style={{ marginBottom: '0.4rem' }}>🛡️ Admin Panel</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>Manage pickups, users, and pricing</p>

        {/* Tabs */}
        <div style={styles.tabs}>
          {TABS.map(t => (
            <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === 'Dashboard' && stats && (
          <div style={styles.statsGrid}>
            {[
              { label: 'Total Users', val: stats.totalUsers, icon: '👥', color: '#2563eb' },
              { label: 'Total Pickups', val: stats.totalPickups, icon: '📦', color: 'var(--green-600)' },
              { label: 'Pending Pickups', val: stats.pendingPickups, icon: '⏳', color: '#d97706' },
              { label: 'Completed', val: stats.completedPickups, icon: '✅', color: '#059669' },
              { label: 'Total Revenue', val: `₹${stats.totalRevenue}`, icon: '💰', color: 'var(--green-700)' },
            ].map((s, i) => (
              <div key={i} className="card" style={styles.statCard}>
                <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: s.color }}>{s.val}</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* PICKUPS TAB */}
        {tab === 'Pickups' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '0.5rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                <option value="">All Status</option>
                {['pending','confirmed','in_progress','completed','cancelled'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            {pickups.length === 0 ? <p className="text-muted">No pickups found</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pickups.map(p => (
                  <div key={p._id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <strong>{p.user?.name}</strong> — {p.user?.phone}
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{p.user?.email}</div>
                        <div style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
                          📅 {new Date(p.scheduledDate).toLocaleDateString('en-IN')} &nbsp; 🕐 {p.scheduledTimeSlot}
                        </div>
                        <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                          {p.scrapItems?.map(i => `${i.category} (${i.estimatedWeight}kg)`).join(' | ')}
                        </div>
                        <div style={{ marginTop: '0.4rem' }}>
                          Est: <strong className="text-green">₹{p.totalEstimatedEarning?.toFixed(0)}</strong>
                          {p.status === 'completed' && <> &nbsp; Actual: <strong className="text-green">₹{p.actualEarning}</strong></>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <span className={`badge badge-${p.status}`}>{p.status.replace('_', ' ')}</span>
                        {p.status === 'pending' && (
                          <button className="btn btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
                            onClick={() => handleStatusUpdate(p._id, 'confirmed')}>Confirm</button>
                        )}
                        {p.status === 'confirmed' && (
                          <button className="btn btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
                            onClick={() => handleStatusUpdate(p._id, 'in_progress')}>Start Pickup</button>
                        )}
                        {p.status === 'in_progress' && (
                          <MarkComplete pickupId={p._id} onComplete={handleStatusUpdate} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'Users' && (
          <div>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>{users.length} registered users</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Pickups</th><th>Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={styles.tr}>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>{u.phone}</td>
                      <td style={styles.td}>{u.address?.city || '—'}</td>
                      <td style={styles.td}>{u.totalPickups}</td>
                      <td style={styles.td}>₹{u.totalEarnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRICES TAB */}
        {tab === 'Prices' && (
          <div>
            {prices.length === 0 && (
              <button className="btn btn-primary" style={{ marginBottom: '1rem' }} onClick={handleSeedPrices} disabled={loading}>
                {loading ? 'Seeding...' : '🌱 Seed Default Prices'}
              </button>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {prices.map(p => (
                <PriceEditor key={p._id} price={p} onSave={handlePriceUpdate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceEditor({ price, onSave }) {
  const [val, setVal] = useState(price.pricePerKg);
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.8rem' }}>{price.icon}</span>
        <div>
          <div style={{ fontWeight: 700 }}>{price.label}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{price.category}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input type="number" value={val} onChange={e => setVal(e.target.value)}
          style={{ width: '90px', padding: '0.45rem 0.6rem', border: '1.5px solid #e5e7eb', borderRadius: '8px' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>₹/kg</span>
        <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
          onClick={() => onSave(price._id, val)}>Save</button>
      </div>
    </div>
  );
}

function MarkComplete({ pickupId, onComplete }) {
  const [weight, setWeight] = useState('');
  const [earning, setEarning] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <input type="number" placeholder="Actual kg" value={weight} onChange={e => setWeight(e.target.value)}
        style={{ padding: '0.35rem 0.5rem', border: '1.5px solid #e5e7eb', borderRadius: '6px', width: '120px', fontSize: '0.82rem' }} />
      <input type="number" placeholder="Actual ₹" value={earning} onChange={e => setEarning(e.target.value)}
        style={{ padding: '0.35rem 0.5rem', border: '1.5px solid #e5e7eb', borderRadius: '6px', width: '120px', fontSize: '0.82rem' }} />
      <button className="btn btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
        onClick={() => onComplete(pickupId, 'completed', { actualWeight: weight, actualEarning: earning })}>
        Mark Complete
      </button>
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', gap: '0.25rem', marginBottom: '2rem', background: 'var(--white)', padding: '0.4rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', width: 'fit-content' },
  tab: { padding: '0.5rem 1.25rem', border: 'none', borderRadius: '8px', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--gray-600)', transition: 'all 0.15s' },
  tabActive: { background: 'var(--green-600)', color: 'var(--white)', fontWeight: 700 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' },
  statCard: { textAlign: 'center', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'var(--white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' },
  thead: { background: 'var(--green-50)' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '0.75rem 1rem', fontSize: '0.88rem' },
};
