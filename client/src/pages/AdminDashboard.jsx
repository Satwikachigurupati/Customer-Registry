import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  FileText,
  UserCheck,
  Star,
  Settings,
  Plus,
  Trash2,
  Users,
  Grid,
  TrendingUp,
  BarChart,
  LifeBuoy,
  ShieldAlert
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, custom-fields, users
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [agents, setAgents] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom Field Form States
  const [customFields, setCustomFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldTarget, setNewFieldTarget] = useState('complaint');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // Assignment states
  const [assignState, setAssignState] = useState({}); // ticketId -> agentId

  const fetchData = async () => {
    try {
      // 1. Fetch complaints
      const complaintsRes = await api.get('/complaints');
      if (complaintsRes.data.success) {
        setTickets(complaintsRes.data.data);
      }

      // 2. Fetch analytics
      const analyticsRes = await api.get('/complaints/analytics/summary');
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }

      // 3. Fetch agents
      const agentsRes = await api.get('/auth/users?role=agent');
      if (agentsRes.data.success) {
        setAgents(agentsRes.data.data);
      }

      // 4. Fetch all users
      const usersRes = await api.get('/auth/users');
      if (usersRes.data.success) {
        setUsersList(usersRes.data.data);
      }

      // 5. Fetch Custom Fields
      const fieldsRes = await api.get('/custom-fields');
      if (fieldsRes.data.success) {
        setCustomFields(fieldsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCustomField = async (e) => {
    e.preventDefault();
    if (!newFieldName.trim() || !newFieldLabel.trim()) return;

    try {
      const res = await api.post('/custom-fields', {
        name: newFieldName,
        label: newFieldLabel,
        target: newFieldTarget,
        type: newFieldType,
        required: newFieldRequired,
      });

      if (res.data.success) {
        setCustomFields([...customFields, res.data.data]);
        setNewFieldName('');
        setNewFieldLabel('');
        setNewFieldRequired(false);
        alert('Custom field created successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating custom field.');
    }
  };

  const handleDeleteCustomField = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom field definition?')) return;

    try {
      const res = await api.delete(`/custom-fields/${id}`);
      if (res.data.success) {
        setCustomFields(customFields.filter(f => f._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleAssignSelect = (ticketId, agentId) => {
    setAssignState({ ...assignState, [ticketId]: agentId });
  };

  const handleExecuteAssignment = async (ticketId) => {
    const agentId = assignState[ticketId];
    if (!agentId) return;

    try {
      const res = await api.put(`/complaints/${ticketId}/assign`, { agentId });
      if (res.data.success) {
        alert('Agent assigned successfully!');
        fetchData(); // Refresh lists
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  // Derived variables
  const unassignedTickets = tickets.filter(t => !t.agent);
  const activeTickets = tickets.filter(t => t.status !== 'closed');

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="title-large">Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            System configurations, custom fields, ticket queues, and agent performance metrics.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: <TrendingUp size={16} /> },
          { id: 'custom-fields', label: 'Custom Fields Creator', icon: <Settings size={16} /> },
          { id: 'users', label: 'User Directory', icon: <Users size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-secondary' : 'btn-outline'}`}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem', gap: '0.5rem' }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Key Metrics Grid */}
          <div className="grid-stats">
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-hover)' }}>
                <FileText size={24} />
              </div>
              <div>
                <p className="stat-value">{tickets.length}</p>
                <p className="stat-label">Total Interactions</p>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                <ShieldAlert size={24} style={{ color: 'var(--danger)' }} />
              </div>
              <div>
                <p className="stat-value">{unassignedTickets.length}</p>
                <p className="stat-label">Unassigned Tickets</p>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <p className="stat-value">{activeTickets.length}</p>
                <p className="stat-label">Pending Resolution</p>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.15)', color: 'var(--secondary)' }}>
                <Star size={24} />
              </div>
              <div>
                <p className="stat-value">
                  {analytics && analytics.averageRating ? analytics.averageRating.toFixed(1) : '0.0'}
                </p>
                <p className="stat-label">Avg. Service Rating</p>
              </div>
            </div>
          </div>

          {/* SVG-based Beautiful Visual Indicators Panel */}
          {analytics && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              {/* Ticket Status Share */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart size={18} style={{ color: 'var(--primary-hover)' }} />
                  <span>Ticket Status Distribution</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {Object.entries(analytics.statusCounts).map(([status, count]) => {
                    const percentage = tickets.length > 0 ? (count / tickets.length) * 100 : 0;
                    let color = 'var(--primary)';
                    if (status === 'open') color = 'var(--danger)';
                    if (status === 'assigned') color = 'var(--warning)';
                    if (status === 'resolved') color = 'var(--success)';
                    if (status === 'closed') color = 'var(--text-muted)';

                    return (
                      <div key={status}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>{status}</span>
                          <span style={{ fontWeight: 700, color: '#fff' }}>{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interaction Types Share */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Grid size={18} style={{ color: 'var(--secondary)' }} />
                  <span>Interaction Categorization</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {Object.entries(analytics.typeCounts).map(([type, count]) => {
                    const percentage = tickets.length > 0 ? (count / tickets.length) * 100 : 0;
                    let color = 'var(--primary)';
                    if (type === 'complaint') color = 'var(--danger)';
                    if (type === 'inquiry') color = 'var(--primary-hover)';
                    if (type === 'feedback') color = 'var(--secondary)';
                    if (type === 'request') color = 'var(--info)';

                    return (
                      <div key={type}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>{type}</span>
                          <span style={{ fontWeight: 700, color: '#fff' }}>{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Unassigned tickets quick assignment table */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Pending Assignment Queue
            </h3>
            {unassignedTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                All incoming tickets are currently assigned to agents!
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Title</th>
                      <th>Customer</th>
                      <th>Type</th>
                      <th>Assignment Agent Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unassignedTickets.map(ticket => (
                      <tr key={ticket._id}>
                        <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>{ticket.complaintId}</td>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{ticket.title}</td>
                        <td>{ticket.customer?.name}</td>
                        <td>
                          <span className={`badge badge-${ticket.type}`}>{ticket.type}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                              className="form-select"
                              style={{ width: '180px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                              value={assignState[ticket._id] || ''}
                              onChange={(e) => handleAssignSelect(ticket._id, e.target.value)}
                            >
                              <option value="">-- Choose Agent --</option>
                              {agents.map(a => (
                                <option key={a._id} value={a._id}>{a.name}</option>
                              ))}
                            </select>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                              onClick={() => handleExecuteAssignment(ticket._id)}
                              disabled={!assignState[ticket._id]}
                            >
                              Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: CUSTOM FIELDS CREATOR */}
      {activeTab === 'custom-fields' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          {/* Left: Create Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Create Custom Field
            </h3>
            <form onSubmit={handleCreateCustomField}>
              <div className="form-group">
                <label className="form-label">Field ID (camelCase)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. orderId, officeLocation"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Label</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Order ID, Office Location"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Applies To (Target)</label>
                <select className="form-select" value={newFieldTarget} onChange={(e) => setNewFieldTarget(e.target.value)}>
                  <option value="complaint">Complaint Tickets</option>
                  <option value="customer">Customer Profile</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Input Value Type</label>
                <select className="form-select" value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
                  <option value="text">Short Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date Selector</option>
                  <option value="boolean">Yes / No Selector</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0' }}>
                <input
                  type="checkbox"
                  id="required-check"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="required-check" style={{ color: 'var(--text-main)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                  Mandatory Field (Required)
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Plus size={16} />
                <span>Create Field Definition</span>
              </button>
            </form>
          </div>

          {/* Right: Active Fields list */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Active Customizable Fields
            </h3>
            {customFields.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No custom fields defined yet.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Field ID</th>
                      <th>Target</th>
                      <th>Value Type</th>
                      <th>Required</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customFields.map((field) => (
                      <tr key={field._id}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{field.label}</td>
                        <td style={{ color: 'var(--secondary)', fontFamily: 'monospace' }}>{field.name}</td>
                        <td>
                          <span className={`badge ${field.target === 'customer' ? 'badge-feedback' : 'badge-inquiry'}`}>
                            {field.target}
                          </span>
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{field.type}</td>
                        <td>{field.required ? 'Yes' : 'No'}</td>
                        <td>
                          <button
                            className="btn btn-outline btn-icon"
                            style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                            onClick={() => handleDeleteCustomField(field._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            System Accounts
          </h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role Role</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((usr) => (
                  <tr key={usr._id}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{usr.name}</td>
                    <td>{usr.email}</td>
                    <td>{usr.phone}</td>
                    <td>
                      <span className={`badge ${usr.role === 'admin' ? 'badge-open' : usr.role === 'agent' ? 'badge-assigned' : 'badge-closed'}`}>
                        {usr.role}
                      </span>
                    </td>
                    <td>{new Date(usr.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
