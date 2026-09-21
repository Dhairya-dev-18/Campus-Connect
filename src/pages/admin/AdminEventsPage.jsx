import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Loader2, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { LoadingState, ErrorState, EmptyState, ConfirmDialog, Toast } from '../../components/ui';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', status: 'open', event_date: '', description: '', capacity: 100, icon: 'Calendar' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('events')
        .select('id, title, category, status, event_date, description, icon, capacity, created_at')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setEvents(data || []);
    } catch (err) {
      setError('Could not load events.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: '', category: '', status: 'open', event_date: '', description: '', capacity: 100, icon: 'Calendar' });
    setShowForm(true);
  };

  const openEdit = (e) => {
    setEditing(e);
    setFormData({ title: e.title, category: e.category, status: e.status, event_date: e.event_date, description: e.description, capacity: e.capacity, icon: e.icon });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        const { error: err } = await supabase.from('events').update(formData).eq('id', editing.id);
        if (err) throw err;
        setToast('Event updated successfully');
      } else {
        const { error: err } = await supabase.from('events').insert(formData);
        if (err) throw err;
        setToast('Event created successfully');
      }
      setShowForm(false);
      loadEvents();
    } catch (err) {
      setError('Could not save event. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error: err } = await supabase.from('events').delete().eq('id', deleteId);
      if (err) throw err;
      setToast('Event deleted');
      setDeleteId(null);
      loadEvents();
    } catch (err) {
      setError('Could not delete event.');
      console.error(err);
    } finally {
      setDeleting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Event Management</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Create Event
        </button>
      </div>

      {error && <div className="admin-error-banner">{error}</div>}

      {loading ? (
        <LoadingState label="Loading events..." />
      ) : events.length === 0 ? (
        <EmptyState icon={Calendar} title="No events yet." subtitle="Create your first event." />
      ) : (
        <div className="admin-cards-grid">
          {events.map((e) => (
            <div key={e.id} className="admin-event-card">
              <div className="admin-event-card-header">
                <span className={`admin-badge admin-badge-${e.status}`}>{e.status}</span>
                <div className="admin-card-actions">
                  <button className="admin-icon-btn" onClick={() => openEdit(e)}><Edit2 size={16} /></button>
                  <button className="admin-icon-btn admin-icon-btn-danger" onClick={() => setDeleteId(e.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="admin-event-title">{e.title}</h3>
              <p className="admin-event-meta">{e.event_date} • {e.category}</p>
              <p className="admin-event-desc">{e.description}</p>
              <div className="admin-event-capacity">Capacity: {e.capacity}</div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            <h2 className="modal-title">{editing ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-input-group">
                <input type="text" placeholder="Event Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="modal-input-row">
                <div className="modal-input-group">
                  <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                </div>
                <div className="modal-input-group modal-select-group">
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="open">Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="modal-input-row">
                <div className="modal-input-group">
                  <input type="text" placeholder="Date (e.g. Jan 2026)" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} required />
                </div>
                <div className="modal-input-group">
                  <input type="number" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} required min={1} />
                </div>
              </div>
              <div className="modal-input-group modal-textarea-group">
                <textarea className="modal-textarea" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <button type="submit" className="btn btn-primary modal-submit" disabled={submitting}>
                {submitting ? <><Loader2 size={18} className="spin" /> Saving...</> : editing ? 'Update Event' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Event"
        message="Are you sure you want to delete this event? This will also remove all registrations for it."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}
