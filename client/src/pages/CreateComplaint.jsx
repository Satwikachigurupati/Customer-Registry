import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'complaint',
    customFields: {},
  });
  const [customFieldDefs, setCustomFieldDefs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch custom fields defined for complaints
    const fetchCustomFields = async () => {
      try {
        const res = await api.get('/custom-fields?target=complaint');
        if (res.data.success) {
          setCustomFieldDefs(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching custom field definitions:', error);
      }
    };

    fetchCustomFields();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomChange = (e) => {
    setFormData({
      ...formData,
      customFields: {
        ...formData.customFields,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/complaints', formData);
      if (res.data.success) {
        navigate('/customer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket. Please check parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/customer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Tickets</span>
        </Link>
      </div>

      <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="title-large">Raise a Support Ticket</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Submit a new inquiry, complaint, request, or feedback. An agent will be assigned to assist you.
          </p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px', padding: '2.5rem' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--danger)', fontSize: '0.95rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Subject / Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Brief summary of the issue"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interaction Type</label>
              <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                <option value="complaint">Complaint</option>
                <option value="inquiry">Inquiry</option>
                <option value="request">Service Request</option>
                <option value="feedback">General Feedback</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              name="description"
              className="form-input"
              style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'inherit', padding: '1rem' }}
              placeholder="Provide as much detail as possible to help our agents resolve your issue quickly."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Dynamic Custom Fields for Complaint */}
          {customFieldDefs.length > 0 && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Additional Ticket Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {customFieldDefs.map((field) => (
                  <div key={field._id} className="form-group">
                    <label className="form-label">
                      {field.label} {field.required && <span style={{ color: 'var(--danger)' }}>*</span>}
                    </label>
                    {field.type === 'boolean' ? (
                      <select
                        name={field.name}
                        className="form-select"
                        value={formData.customFields[field.name] || 'false'}
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
                        value={formData.customFields[field.name] || ''}
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

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/customer" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={16} />
              <span>{loading ? 'Submitting...' : 'Submit Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
