import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Phone, Mail, Award, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    customProfileFields: {},
  });
  const [customFieldDefs, setCustomFieldDefs] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        customProfileFields: user.customProfileFields || {},
      });
    }

    // Fetch custom fields for customer profile
    const fetchCustomFields = async () => {
      try {
        const res = await api.get('/custom-fields?target=customer');
        if (res.data.success) {
          setCustomFieldDefs(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching custom field definitions', error);
      }
    };

    fetchCustomFields();
  }, [user]);

  const handleStandardChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomChange = (e) => {
    setFormData({
      ...formData,
      customProfileFields: {
        ...formData.customProfileFields,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    setLoading(true);

    const result = await updateProfile(formData);
    setLoading(false);

    if (result.success) {
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="title-large">My Profile</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Manage your personal settings and contact preferences.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Card: Summary */}
        <div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.25rem' }}>{user.name}</h3>
            <span className="badge badge-assigned" style={{ textTransform: 'capitalize', fontSize: '0.8rem', padding: '0.35rem 1rem', marginBottom: '2rem' }}>
              {user.role}
            </span>

            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Mail size={16} />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Phone size={16} />
                <span>{user.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Award size={16} />
                <span>Account Created: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Edit Form */}
        <div>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Account Settings
            </h3>

            {feedback.message && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: feedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
                fontSize: '0.95rem'
              }}>
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleStandardChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleStandardChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleStandardChange}
                  required
                />
              </div>

              {/* Dynamic Custom Profile Fields */}
              {customFieldDefs.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>Additional Profile Info</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {customFieldDefs.map((field) => (
                      <div key={field._id} className="form-group">
                        <label className="form-label">
                          {field.label} {field.required && <span style={{ color: 'var(--danger)' }}>*</span>}
                        </label>
                        {field.type === 'boolean' ? (
                          <select
                            name={field.name}
                            className="form-select"
                            value={formData.customProfileFields[field.name] || 'false'}
                            onChange={handleCustomChange}
                            required={field.required}
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : (
                          <input
                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                            name={field.name}
                            className="form-input"
                            value={formData.customProfileFields[field.name] || ''}
                            onChange={handleCustomChange}
                            required={field.required}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
