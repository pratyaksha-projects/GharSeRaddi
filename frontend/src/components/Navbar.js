import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>♻️</span>
          <span style={styles.logoText}>GharSeRaddi</span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          <Link to="/prices" style={{ ...styles.link, ...(isActive('/prices') ? styles.linkActive : {}) }}>
            Live Prices
          </Link>
          {user && (
            <>
              <Link to="/book" style={{ ...styles.link, ...(isActive('/book') ? styles.linkActive : {}) }}>
                Book Pickup
              </Link>
              <Link to="/dashboard" style={{ ...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {}) }}>
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.linkActive : {}) }}>
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        <div style={styles.actions}>
          {user ? (
            <>
              <span style={styles.userName}>👋 {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/prices" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Live Prices</Link>
          {user ? (
            <>
              <Link to="/book" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Book Pickup</Link>
              <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              {isAdmin && <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button style={{ ...styles.mobileLink, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--red-500)' }} onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { background: 'var(--white)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoIcon: { fontSize: '1.5rem' },
  logoText: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--green-700)' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center', '@media(max-width:768px)': { display: 'none' } },
  link: { color: 'var(--gray-600)', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.15s' },
  linkActive: { color: 'var(--green-600)', fontWeight: 700 },
  actions: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  userName: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--green-700)' },
  hamburger: { display: 'none', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', '@media(max-width:768px)': { display: 'block' } },
  mobileMenu: { padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' },
  mobileLink: { color: 'var(--gray-800)', fontWeight: 500, fontSize: '1rem', display: 'block' },
};
