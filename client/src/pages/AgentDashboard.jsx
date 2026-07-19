import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FileText, Hourglass, CheckCircle2, Clock, ShieldAlert, LifeBuoy } from 'lucide-react';

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/complaints');
        if (res.data.success) {
          setTickets(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching agent tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStats = () => {
    const total = tickets.length;
    const active = tickets.filter(t => t.status === 'open' || t.status === 'assigned').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const closed = tickets.filter(t => t.status === 'closed').length;

    return { total, active, resolved, closed };
  };

  const stats = getStats();

  const filteredTickets = filterStatus === 'all'
    ? tickets
    : tickets.filter(t => t.status === filterStatus);

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  const getTypeBadge = (type) => {
    return <span className={`badge badge-${type}`}>{type}</span>;
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="title-large">Agent Support Console</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Manage and resolve tickets assigned to you. Communicate with customers directly.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="grid-stats">
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-hover)' }}>
                <FileText size={24} />
              </div>
              <div>
                <p className="stat-value">{stats.total}</p>
                <p className="stat-label">Assigned Tickets</p>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
                <Hourglass size={24} />
              </div>
              <div>
                <p className="stat-value">{stats.active}</p>
                <p className="stat-label">Active / Progress</p>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="stat-value">{stats.resolved}</p>
                <p className="stat-label">Resolved by Me</p>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(148, 163, 184, 0.15)', color: 'var(--text-muted)' }}>
                <Clock size={24} />
              </div>
              <div>
                <p className="stat-value">{stats.closed}</p>
                <p className="stat-label">Closed / History</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {['all', 'assigned', 'resolved', 'closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`btn ${filterStatus === status ? 'btn-secondary' : 'btn-outline'}`}
                style={{ textTransform: 'capitalize', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Tickets List */}
          {filteredTickets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(20, 27, 47, 0.4)' }}>
              <LifeBuoy size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No assigned tickets</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                You currently have no tickets matching the "{filterStatus}" filter category.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Customer Name</th>
                    <th>Issue Summary</th>
                    <th>Type</th>
                    <th>Date Assigned</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(ticket => (
                    <tr key={ticket._id}>
                      <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                        {ticket.complaintId || 'COMP-NEW'}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{ticket.customer?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ticket.customer?.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{ticket.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                          {ticket.description}
                        </div>
                      </td>
                      <td>{getTypeBadge(ticket.type)}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(ticket.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td>{getStatusBadge(ticket.status)}</td>
                      <td>
                        <Link to={`/tickets/${ticket._id}`} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                          Resolve Issue
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AgentDashboard;
