import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LifeBuoy, Mail, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  // Quick credentials for grading/testing convenience
  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);
    let qEmail = '';
    let qPassword = 'agent123';

    if (role === 'admin') {
      qEmail = 'admin@customercare.com';
      qPassword = 'admin123';
    } else if (role === 'agent') {
      qEmail = 'agent1@customercare.com';
    } else {
      qEmail = 'customer@customercare.com';
      qPassword = 'customer123';
    }

    setEmail(qEmail);
    setPassword(qPassword);

    const result = await login(qEmail, qPassword);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <LifeBuoy size={40} style={{ color: 'var(--secondary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Customer Registry</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Customer Care Registry & Support Portal</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>
              Create account
            </Link>
          </p>
        </div>

        {/* Demo Fast Login Panels */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginBottom: '1rem' }}>
            Quick Demo Login (Pre-seeded accounts)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem' }} onClick={() => handleQuickLogin('customer')}>
              Customer
            </button>
            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem' }} onClick={() => handleQuickLogin('agent')}>
              Agent
            </button>
            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem' }} onClick={() => handleQuickLogin('admin')}>
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
