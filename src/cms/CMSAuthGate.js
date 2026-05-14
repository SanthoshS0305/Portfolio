import React, { useState } from 'react';
import sha256 from 'js-sha256';
import AdminPanel from './AdminPanel';

const SESSION_KEY = 'cms_authed';
const COOKIE_NAME = 'cms_authed';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

const getCookie = (name) => {
  const match = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
  return match ? match.split('=')[1] : null;
};

const isAuthed = () =>
  sessionStorage.getItem(SESSION_KEY) === 'true' ||
  getCookie(COOKIE_NAME) === 'true';

const CMSAuthGate = () => {
  const [authed, setAuthed] = useState(isAuthed);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; SameSite=Strict`;
    setAuthed(false);
    setUsername('');
    setPassword('');
  };

  if (authed) return <AdminPanel onLogout={handleLogout} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const expectedUser = process.env.REACT_APP_ADMIN_USERNAME;
    const expectedHash = process.env.REACT_APP_ADMIN_PASSWORD_HASH;

    if (!expectedUser || !expectedHash) {
      setError('Admin credentials not configured. Set REACT_APP_ADMIN_USERNAME and REACT_APP_ADMIN_PASSWORD_HASH in .env');
      setLoading(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 400));

    const passwordHash = sha256(password);

    if (username === expectedUser && passwordHash === expectedHash) {
      if (staySignedIn) {
        document.cookie = `${COOKIE_NAME}=true; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Strict`;
      } else {
        sessionStorage.setItem(SESSION_KEY, 'true');
      }
      setAuthed(true);
    } else {
      setError('Invalid username or password.');
    }
    setLoading(false);
  };

  const s = {
    page: {
      minHeight: '100vh',
      background: '#141414',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    card: {
      background: '#1e1e1e',
      border: '1px solid rgba(247,247,247,0.12)',
      borderRadius: '14px',
      padding: '40px 36px',
      width: '360px',
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
    },
    heading: { margin: 0, fontSize: '22px', fontWeight: 700, color: '#FFD873', textAlign: 'center' },
    sub: { margin: 0, fontSize: '13px', color: '#888', textAlign: 'center' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', color: '#aaa' },
    input: {
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(247,247,247,0.2)',
      color: '#F7F7F7',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
    },
    checkRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      userSelect: 'none',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      accentColor: '#FFD873',
      cursor: 'pointer',
      flexShrink: 0,
    },
    checkLabel: { fontSize: '13px', color: '#aaa', cursor: 'pointer' },
    submitBtn: {
      padding: '12px',
      background: '#FFD873',
      border: 'none',
      color: '#1a1a1a',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: '15px',
      marginTop: '4px',
    },
    error: {
      padding: '10px 14px',
      background: 'rgba(255,80,80,0.12)',
      border: '1px solid rgba(255,80,80,0.3)',
      borderRadius: '8px',
      color: '#ff9a9a',
      fontSize: '13px',
    },
    backLink: { textAlign: 'center', fontSize: '13px', color: '#666' },
    anchor: { color: '#FFD873', textDecoration: 'none' },
  };

  return (
    <div style={s.page}>
      <form style={s.card} onSubmit={handleSubmit}>
        <div>
          <h1 style={s.heading}>Portfolio CMS</h1>
          <p style={s.sub}>Sign in to manage your content</p>
        </div>

        <div style={s.field}>
          <label style={s.label}>Username</label>
          <input
            style={s.input}
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <label style={s.checkRow}>
          <input
            type="checkbox"
            style={s.checkbox}
            checked={staySignedIn}
            onChange={(e) => setStaySignedIn(e.target.checked)}
          />
          <span style={s.checkLabel}>Stay signed in for 30 days</span>
        </label>

        {error && <div style={s.error}>{error}</div>}

        <button style={s.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p style={s.backLink}>
          <a href="/" style={s.anchor}>← Back to portfolio</a>
        </p>
      </form>
    </div>
  );
};

export default CMSAuthGate;
