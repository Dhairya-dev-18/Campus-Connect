import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, UsersRound, Loader2, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { LoadingState, ErrorState, EmptyState, ConfirmDialog, Toast } from '../../components/ui';

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', icon: 'Users', color: '#3b82f6' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { loadCommunities(); }, []);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('communities')
        .select('id, name, slug, description, icon, color, created_at')
        .order('name');
      if (err) throw err;
      setCommunities(data || []);
    } catch (err) {
      setError('Could not load communities.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: '', slug: '', description: '', icon: 'Users', color: '#3b82f6' });
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setFormData({ name: c.name, slug: c.slug, description: c.description, icon: c.icon, color: c.color });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        const { error: err } = await supabase.from('communities').update(formData).eq('id', editing.id);
        if (err) throw err;
        setToast('Community updated');
      } else {
        const { error: err } = await supabase.from('communities').insert(formData);
        if (err) throw err;
        setToast('Community created');
      }
      setShowForm(false);
      loadCommunities();
    } catch (err) {
      setError('Could not save community.');
      console.error(err);
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error: err } = await supabase.from('communities').delete().eq('id', deleteId);
      if (err) throw err;
      setToast('Community deleted');
      setDeleteId(null);
      loadCommunities();
    } catch (err) {
      setError('Could not delete community.');
      console.error(err);
    } finally {
      setDeleting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Community Management</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Create Community
        </button>
      </div>

      {error && <div className="admin-error-banner">{error}</div>}

      {loading ? (
        <LoadingState label="Loading communities..." />
      ) : communities.length === 0 ? (
        <EmptyState icon={UsersRound} title="No communities yet." />
      ) : (
        <div className="admin-cards-grid">
          {communities.map((c) => (
            <div key={c.id} className="admin-community-card">
              <div className="admin-community-card-header">
                <div className="admin-community-icon" style={{ background: `${c.color}15`, color: c.color }}>
                  <UsersRound size={20} />
                </div>
                <div className="admin-card-actions">
                  <button className="admin-icon-btn" onClick={() => openEdit(c)}><Edit2 size={16} /></button>
                  <button className="admin-icon-btn admin-icon-btn-danger" onClick={() => setDeleteId(c.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="admin-event-title">{c.name}</h3>
              <p className="admin-event-desc">{c.description}</p>
              <div className="admin-event-capacity">Slug: {c.slug}</div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            <h2 className="modal-title">{editing ? 'Edit Community' : 'Create Community'}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-input-group">
                <input type="text" placeholder="Community Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="modal-input-group">
                <input type="text" placeholder="Slug (e.g. coding-club)" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
              </div>
              <div className="modal-input-group modal-textarea-group">
                <textarea className="modal-textarea" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="modal-input-row">
                <div className="modal-input-group">
                  <input type="text" placeholder="Icon (lucide name)" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
                </div>
                <div className="modal-input-group">
                  <input type="text" placeholder="Color (hex)" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary modal-submit" disabled={submitting}>
                {submitting ? <><Loader2 size={18} className="spin" /> Saving...</> : editing ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Community"
        message="Are you sure? This will remove all member associations."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}
