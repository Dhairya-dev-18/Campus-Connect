import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Loader2, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { LoadingState, ErrorState, EmptyState, ConfirmDialog, Toast } from '../../components/ui';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ subject: '', title: '', resource_type: 'Notes', semester: '', description: '', file_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { loadResources(); }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('academic_resources')
        .select('id, subject, title, resource_type, semester, description, file_url, created_at')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setResources(data || []);
    } catch (err) {
      setError('Could not load resources.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ subject: '', title: '', resource_type: 'Notes', semester: '', description: '', file_url: '' });
    setShowForm(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setFormData({ subject: r.subject, title: r.title, resource_type: r.resource_type, semester: r.semester || '', description: r.description || '', file_url: r.file_url || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        const { error: err } = await supabase.from('academic_resources').update(formData).eq('id', editing.id);
        if (err) throw err;
        setToast('Resource updated');
      } else {
        const { error: err } = await supabase.from('academic_resources').insert(formData);
        if (err) throw err;
        setToast('Resource added');
      }
      setShowForm(false);
      loadResources();
    } catch (err) {
      setError('Could not save resource.');
      console.error(err);
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error: err } = await supabase.from('academic_resources').delete().eq('id', deleteId);
      if (err) throw err;
      setToast('Resource deleted');
      setDeleteId(null);
      loadResources();
    } catch (err) {
      setError('Could not delete resource.');
      console.error(err);
    } finally {
      setDeleting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Academic Resources</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Resource
        </button>
      </div>

      {error && <div className="admin-error-banner">{error}</div>}

      {loading ? (
        <LoadingState label="Loading resources..." />
      ) : resources.length === 0 ? (
        <EmptyState icon={BookOpen} title="No resources yet." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Subject</th><th>Type</th><th>Semester</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.subject}</td>
                  <td><span className="admin-badge">{r.resource_type}</span></td>
                  <td>{r.semester || '—'}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(r)}><Edit2 size={16} /></button>
                      <button className="admin-icon-btn admin-icon-btn-danger" onClick={() => setDeleteId(r.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            <h2 className="modal-title">{editing ? 'Edit Resource' : 'Add Resource'}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-input-group">
                <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="modal-input-row">
                <div className="modal-input-group">
                  <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                </div>
                <div className="modal-input-group modal-select-group">
                  <select value={formData.resource_type} onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}>
                    <option>Notes</option>
                    <option>Previous Year Papers</option>
                    <option>Assignments</option>
                    <option>Lab Material</option>
                    <option>Study Material</option>
                  </select>
                </div>
              </div>
              <div className="modal-input-group">
                <input type="text" placeholder="Semester (e.g. 3rd)" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} />
              </div>
              <div className="modal-input-group modal-textarea-group">
                <textarea className="modal-textarea" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
              </div>
              <div className="modal-input-group">
                <input type="text" placeholder="File URL (optional)" value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary modal-submit" disabled={submitting}>
                {submitting ? <><Loader2 size={18} className="spin" /> Saving...</> : editing ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Resource"
        message="Are you sure you want to delete this resource?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}
