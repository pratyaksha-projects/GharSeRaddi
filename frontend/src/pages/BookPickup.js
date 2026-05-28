import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPrices, bookPickup } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = ['9AM-12PM', '12PM-3PM', '3PM-6PM'];

export default function BookPickup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState(user?.address || { street: '', city: 'Kanpur', pincode: '' });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    getPrices().then(r => setPrices(r.data)).catch(() => {});
  }, []);

  const toggleItem = (cat, pricePerKg) => {
    if (selectedItems.find(i => i.category === cat)) {
      setSelectedItems(selectedItems.filter(i => i.category !== cat));
    } else {
      setSelectedItems([...selectedItems, { category: cat, pricePerKg, estimatedWeight: 1 }]);
    }
  };

  const updateWeight = (cat, weight) => {
    setSelectedItems(selectedItems.map(i => i.category === cat ? { ...i, estimatedWeight: parseFloat(weight) || 0 } : i));
  };

  const totalEarning = selectedItems.reduce((s, i) => s + i.estimatedWeight * i.pricePerKg, 0);

  const minDate = () => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!scheduledDate || !timeSlot) return toast.error('Please select date and time slot');
    if (!address.street) return toast.error('Please enter pickup address');
    setLoading(true);
    try {
      await bookPickup({ scrapItems: selectedItems, scheduledDate, scheduledTimeSlot: timeSlot, pickupAddress: address, notes });
      toast.success('Pickup booked! 🎉 Check your dashboard for status.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <h2 style={{ marginBottom: '0.4rem' }}>📅 Book a Pickup</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>Select your scrap items and schedule a convenient time</p>

        {/* Step indicators */}
        <div style={styles.steps}>
          {['Select Items', 'Schedule', 'Address'].map((s, i) => (
            <div key={i} style={styles.stepItem} onClick={() => i < step && setStep(i + 1)}>
              <div style={{ ...styles.stepDot, background: step > i ? 'var(--green-600)' : step === i + 1 ? 'var(--green-600)' : '#e5e7eb', color: step >= i + 1 ? 'white' : '#9ca3af' }}>{i + 1}</div>
              <span style={{ fontSize: '0.85rem', color: step >= i + 1 ? 'var(--green-700)' : 'var(--gray-400)', fontWeight: step === i + 1 ? 700 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: Select Items */}
        {step === 1 && (
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>What scrap do you have?</h3>
            <div style={styles.itemsGrid}>
              {prices.map(p => {
                const selected = selectedItems.find(i => i.category === p.category);
                return (
                  <div key={p._id} style={{ ...styles.itemCard, ...(selected ? styles.itemSelected : {}) }}
                    onClick={() => toggleItem(p.category, p.pricePerKg)}>
                    <div style={styles.itemIcon}>{p.icon}</div>
                    <div style={styles.itemLabel}>{p.label}</div>
                    <div style={styles.itemPrice}>₹{p.pricePerKg}/kg</div>
                    {selected && (
                      <div onClick={e => e.stopPropagation()} style={{ marginTop: '0.75rem' }}>
                        <input type="number" min="0.5" step="0.5" value={selected.estimatedWeight}
                          onChange={e => updateWeight(p.category, e.target.value)}
                          style={{ ...styles.wInput }} placeholder="kg" />
                        <div style={{ fontSize: '0.75rem', color: 'var(--green-700)', fontWeight: 600 }}>
                          ≈ ₹{(selected.estimatedWeight * p.pricePerKg).toFixed(0)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedItems.length > 0 && (
              <div style={styles.totalRow}>
                <span>Estimated Earning:</span>
                <strong style={{ color: 'var(--green-600)', fontSize: '1.2rem' }}>₹{totalEarning.toFixed(0)}</strong>
              </div>
            )}
            <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
              disabled={selectedItems.length === 0} onClick={() => setStep(2)}>
              Next: Schedule Pickup →
            </button>
          </div>
        )}

        {/* STEP 2: Schedule */}
        {step === 2 && (
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>When should we come?</h3>
            <div className="form-group">
              <label>Date (earliest: tomorrow)</label>
              <input type="date" min={minDate()} value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Time Slot</label>
              <div style={styles.slotGrid}>
                {TIME_SLOTS.map(s => (
                  <div key={s} style={{ ...styles.slot, ...(timeSlot === s ? styles.slotActive : {}) }}
                    onClick={() => setTimeSlot(s)}>
                    🕐 {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Special Notes (optional)</label>
              <textarea rows={3} placeholder="e.g. Call before coming, 2nd floor flat..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                disabled={!scheduledDate || !timeSlot} onClick={() => setStep(3)}>
                Next: Pickup Address →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Address + Confirm */}
        {step === 3 && (
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>Pickup Address</h3>
            <div className="form-group">
              <label>Street / House No.</label>
              <input placeholder="12, Green Park Colony" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>City</label>
                <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input placeholder="208001" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
              </div>
            </div>

            {/* Summary */}
            <div style={styles.summary}>
              <div style={styles.summaryRow}><span>Items:</span><span>{selectedItems.map(i => i.category).join(', ')}</span></div>
              <div style={styles.summaryRow}><span>Date:</span><span>{scheduledDate}</span></div>
              <div style={styles.summaryRow}><span>Time:</span><span>{timeSlot}</span></div>
              <div style={styles.summaryRow}><span className="text-green" style={{ fontWeight: 700 }}>Est. Earning:</span><strong style={{ color: 'var(--green-600)' }}>₹{totalEarning.toFixed(0)}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                disabled={loading || !address.street} onClick={handleSubmit}>
                {loading ? 'Booking...' : '✅ Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  steps: { display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem', padding: '1rem 1.5rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' },
  stepDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s' },
  itemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' },
  itemCard: { border: '2px solid #e5e7eb', borderRadius: 'var(--radius)', padding: '1rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' },
  itemSelected: { border: '2px solid var(--green-500)', background: 'var(--green-50)' },
  itemIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
  itemLabel: { fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' },
  itemPrice: { color: 'var(--green-600)', fontWeight: 700, fontSize: '0.9rem' },
  wInput: { width: '80px', padding: '0.35rem 0.5rem', border: '1.5px solid var(--green-400)', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center', marginBottom: '0.25rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--green-50)', borderRadius: 'var(--radius)', marginTop: '1rem' },
  slotGrid: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  slot: { padding: '0.6rem 1.2rem', border: '2px solid #e5e7eb', borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' },
  slotActive: { border: '2px solid var(--green-500)', background: 'var(--green-50)', color: 'var(--green-700)', fontWeight: 700 },
  summary: { background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: '1rem', marginTop: '1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.9rem' },
};
