import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Plus, Search, X, Loader2, CheckCircle, Package } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function LostFound() {
  const navigate = useNavigate();
  const { ref, visible } = useScrollReveal();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('LOST');
  const [formData, setFormData] = useState({ title: '', location: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lost_found_items')
      .select('id, type, title, description, location, icon, resolved, created_at, profiles!lost_found_items_user_id_fkey(full_name)')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) {
      console.error('Lost&found fetch error:', error.message);
      setLoading(false);
      return;
    }
    setItems(data || []);
    setLoading(false);
  };

  const handleReport = (type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormType(type);
    setFormData({ title: '', location: '', description: '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('lost_found_items').insert({
      type: formType,
      title: formData.title.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      icon: formType === 'LOST' ? 'Wallet' : 'CreditCard',
    });
    if (error) {
      console.error('Submit error:', error.message);
      setSubmitting(false);
      return;
    }
    setShowForm(false);
    setSubmitting(false);
    loadItems();
  };

  const markResolved = async (id) => {
    const { error } = await supabase
      .from('lost_found_items')
      .update({ resolved: true })
      .eq('id', id);
    if (!error) loadItems();
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <section className="section" id="lost-found" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Lost & Found</div>
          <h2 className="section-title">Lost Something? Found Something?</h2>
          <p className="section-subtitle">
            Help reconnect lost belongings with their owners across the ABES campus.
          </p>
        </div>

        <div className={`lostfound-grid reveal ${visible ? 'visible' : ''}`}>
          {loading ? (
            <div className="loading-state"><Loader2 size={28} className="spin" /></div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Package size={48} color="var(--gray-500)" />
              <p>No lost or found items reported yet.</p>
              <p className="empty-state-sub">Be the first to report one!</p>
            </div>
          ) : (
            items.map((item) => {
              const Icon = Icons[item.icon] || Icons.Search;
              return (
                <div key={item.id} className={`lostfound-card ${item.resolved ? 'resolved' : ''}`}>
                  <div className={`lostfound-type ${item.type.toLowerCase()}`}>
                    {item.type}
                  </div>
                  {item.resolved && (
                    <div className="lostfound-resolved-badge">
                      <CheckCircle size={14} /> Resolved
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div
                      className="feature-icon"
                      style={{
                        background: item.type === 'FOUND' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: item.type === 'FOUND' ? '#10b981' : '#f87171',
                        width: 44,
                        height: 44,
                        marginBottom: 0,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="lostfound-title" style={{ marginBottom: 0 }}>
                        {item.title}
                      </h3>
                      {item.profiles?.full_name && (
                        <div className="lostfound-reporter">by {item.profiles.full_name}</div>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="lostfound-desc">{item.description}</p>
                  )}
                  <div className="lostfound-meta">
                    {item.location && (
                      <span className="lostfound-meta-item">
                        <MapPin size={14} /> {item.location}
                      </span>
                    )}
                    <span className="lostfound-meta-item">
                      <Clock size={14} /> {formatTime(item.created_at)}
                    </span>
                  </div>
                  {user && !item.resolved && (
                    <button className="lostfound-resolve-btn" onClick={() => markResolved(item.id)}>
                      Mark as resolved
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className={`lostfound-actions reveal ${visible ? 'visible' : ''}`}>
          <button className="btn btn-primary" onClick={() => handleReport('LOST')}>
            <Plus size={18} /> Report Lost Item
          </button>
          <button className="btn btn-secondary" onClick={() => handleReport('FOUND')}>
            <Search size={18} /> Report Found Item
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">
              Report {formType === 'LOST' ? 'Lost' : 'Found'} Item
            </h2>
            <p className="modal-subtitle">
              {formType === 'LOST'
                ? 'Tell us what you lost so others can help find it.'
                : 'Help a fellow student recover their belonging.'}
            </p>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-input-group">
                <Package size={18} />
                <input
                  type="text"
                  placeholder="Item name (e.g. Black Wallet)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="modal-input-group">
                <MapPin size={18} />
                <input
                  type="text"
                  placeholder="Location (e.g. Library, Block C)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="modal-input-group modal-textarea-group">
                <textarea
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="modal-textarea"
                />
              </div>
              <button type="submit" className="btn btn-primary modal-submit" disabled={submitting}>
                {submitting ? (
                  <><Loader2 size={18} className="spin" /> Reporting...</>
                ) : (
                  `Report ${formType === 'LOST' ? 'Lost' : 'Found'} Item`
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
