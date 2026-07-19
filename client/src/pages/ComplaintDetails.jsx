import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  ArrowLeft,
  Send,
  User,
  Shield,
  Star,
  RefreshCw,
  Clock,
  UserCheck,
  CheckCircle,
  MessageSquare,
  Sparkles
} from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [agents, setAgents] = useState([]); // For admin assignment
  const [selectedAgent, setSelectedAgent] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  // Customer Feedback Form States
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const fetchTicketDetails = async () => {
    try {
      const res = await api.get(`/complaints/${id}`);
      if (res.data.success) {
        setTicket(res.data.data);
        setStatusUpdate(res.data.data.status);
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${id}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get('/auth/users?role=agent');
      if (res.data.success) {
        setAgents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await fetchTicketDetails();
      await fetchMessages();
      if (user && user.role === 'admin') {
        await fetchAgents();
      }
      setLoading(false);
    };

    initData();

    // Start 4-second polling for new chat messages
    pollingRef.current = setInterval(() => {
      fetchMessages();
      // Also poll ticket details to reflect status updates
      fetchTicketDetails();
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [id]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post('/messages', {
        complaintId: id,
        content: newMessage,
      });

      if (res.data.success) {
        setMessages([...messages, res.data.data]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedAgent) return;

    try {
      const res = await api.put(`/complaints/${id}/assign`, { agentId: selectedAgent });
      if (res.data.success) {
        setTicket(res.data.data);
        alert('Agent assigned successfully!');
      }
    } catch (err) {
      console.error('Error assigning agent:', err);
      alert(err.response?.data?.message || 'Assignment failed.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.put(`/complaints/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setTicket(res.data.data);
        setStatusUpdate(newStatus);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Status update failed.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/complaints/${id}/feedback`, {
        rating,
        comment: feedbackComment,
      });

      if (res.data.success) {
        setTicket(res.data.data);
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert(err.response?.data?.message || 'Feedback submission failed.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: 'var(--danger)' }}>Ticket not found</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>The requested ticket does not exist or you do not have permission to view it.</p>
        <Link to="/" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>Back to Dashboard</Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  const getTypeBadge = (type) => {
    return <span className={`badge badge-${type}`}>{type}</span>;
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Ticket Details & Action Panel Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Ticket Content & Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Main Card */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)' }}>
                {ticket.complaintId}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {getTypeBadge(ticket.type)}
                {getStatusBadge(ticket.status)}
              </div>
            </div>

            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>
              {ticket.title}
            </h1>

            <div style={{ background: 'rgba(10, 15, 29, 0.4)', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem', border: '1px solid var(--border-color)', lineHeight: '1.6' }}>
              <p style={{ color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
            </div>

            {/* Render Custom Fields dynamically */}
            {ticket.customFields && Object.keys(ticket.customFields).length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Ticket Specifications</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {Object.entries(ticket.customFields).map(([key, value]) => (
                    <div key={key} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 500 }}>
                        {value === true ? 'Yes' : value === false ? 'No' : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messaging Chat Log */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <MessageSquare size={20} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Communication Registry Chat</h3>
            </div>

            <div className="chat-container">
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>No messages in chat log yet.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Send a message below to start the conversation.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.sender?._id === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`message-bubble ${isSelf ? 'message-self' : 'message-other'}`}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', opacity: 0.9 }}>
                          {msg.sender?.name} ({msg.sender?.role})
                        </div>
                        <div>{msg.content}</div>
                        <div className="message-meta">
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              {ticket.status !== 'closed' ? (
                <form onSubmit={handleSendMessage} className="chat-input-area">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-icon">
                    <Send size={18} />
                  </button>
                </form>
              ) : (
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  This ticket is closed. Chat is archived.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Info & Workflows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Support Info Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--secondary)' }} />
              <span>Ticket Summary</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Created On:</span>
                <span style={{ color: '#fff' }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{ticket.customer?.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{ticket.customer?.email}</span>
                {ticket.customer?.customProfileFields && Object.keys(ticket.customer.customProfileFields).length > 0 && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CUSTOMER PROFILE DEFAULTS</div>
                    {Object.entries(ticket.customer.customProfileFields).map(([k, v]) => (
                      <div key={k}>{k}: <span style={{ color: '#fff' }}>{v}</span></div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Agent:</span>
                {ticket.agent ? (
                  <>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{ticket.agent.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{ticket.agent.email}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--warning)', fontWeight: 600 }}>Unassigned</span>
                )}
              </div>
            </div>
          </div>

          {/* ADMIN: Assignment Control */}
          {user.role === 'admin' && (ticket.status === 'open' || ticket.status === 'assigned') && (
            <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--primary)' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={18} style={{ color: 'var(--primary-hover)' }} />
                <span>Assign Ticket Agent</span>
              </h3>
              <div className="form-group">
                <select
                  className="form-select"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value="">-- Choose Agent --</option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleAssignAgent}
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={!selectedAgent}
              >
                Assign Support Agent
              </button>
            </div>
          )}

          {/* AGENT/ADMIN: Status Control */}
          {(user.role === 'agent' || user.role === 'admin') && ticket.status !== 'closed' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={18} style={{ color: 'var(--secondary)' }} />
                <span>Update Ticket Status</span>
              </h3>
              <div className="form-group">
                <select
                  className="form-select"
                  value={statusUpdate}
                  onChange={(e) => {
                    setStatusUpdate(e.target.value);
                    handleStatusChange(e.target.value);
                  }}
                >
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}

          {/* CUSTOMER: Leave feedback and automatically close when ticket status is 'resolved' */}
          {user.role === 'customer' && ticket.status === 'resolved' && (
            <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--success)' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                <span>Provide Feedback</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                Your issue has been marked resolved. Submitting rating & comments will close the ticket.
              </p>

              <form onSubmit={handleFeedbackSubmit}>
                <div className="form-group">
                  <label className="form-label">Support Quality Rating</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                      >
                        <Star
                          size={24}
                          fill={star <= rating ? 'var(--warning)' : 'none'}
                          stroke={star <= rating ? 'var(--warning)' : 'var(--text-muted)'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comment</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    placeholder="Tell us about your experience..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                  Submit & Close Ticket
                </button>
              </form>
            </div>
          )}

          {/* Closed Ticket Feedback Display */}
          {ticket.status === 'closed' && ticket.feedback && ticket.feedback.rating && (
            <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>Customer Feedback Review</h3>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= ticket.feedback.rating ? 'var(--warning)' : 'none'}
                    stroke={star <= ticket.feedback.rating ? 'var(--warning)' : 'var(--text-muted)'}
                  />
                ))}
              </div>
              <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontStyle: 'italic', background: 'rgba(0,0,0,0.1)', padding: '0.75rem', borderRadius: '6px' }}>
                "{ticket.feedback.comment}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
