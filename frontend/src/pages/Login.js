import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login as loginAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAPI(form);
      login(data);
      toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <div style={styles.top}>
          <div style={styles.icon}>♻️</div>
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to your GharSeRaddi account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchLink}>
          Don't have an account? <Link to="/register" className="text-green" style={{ fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' },
  card: { width: '100%', maxWidth: '420px', padding: '2.5rem' },
  top: { textAlign: 'center', marginBottom: '2rem' },
  icon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  switchLink: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--gray-600)' },
};
