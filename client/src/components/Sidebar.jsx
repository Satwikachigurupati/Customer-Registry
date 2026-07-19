import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  User,
  LogOut,
  LifeBuoy,
  Settings,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Admin Dashboard', icon: <LayoutDashboard size={20} /> },
          { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
        ];
      case 'agent':
        return [
          { path: '/agent', label: 'Agent Dashboard', icon: <LayoutDashboard size={20} /> },
          { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
        ];
      case 'customer':
      default:
        return [
          { path: '/customer', label: 'My Tickets', icon: <LayoutDashboard size={20} /> },
          { path: '/tickets/create', label: 'Raise a Ticket', icon: <PlusCircle size={20} /> },
          { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="sidebar">
      <div>
        <Link to="/" className="brand">
          <LifeBuoy size={28} style={{ color: 'var(--secondary)' }} />
          <span>Customer Registry</span>
        </Link>

        <nav>
          <ul className="nav-links">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                  <Link to={link.path}>
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.name}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
            {user.role}
          </p>
        </div>

        <button className="btn btn-outline" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
