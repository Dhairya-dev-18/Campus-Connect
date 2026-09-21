import { useEffect, useState } from 'react';
import { Package, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { LoadingState, ErrorState, EmptyState, ConfirmDialog, Toast } from '../../components/ui';

export default function AdminLostFoundPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('lost_found_items')
        .select('id, type, title, description, location, resolved, created_at, image_url, profiles!lost_found_items_user_id_fkey(full_name)')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setItems(data || []);
    } catch (err) {
      setError('Could not load lost & found items.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error: err } = await supabase.from('lost_found_items').delete().eq('id', deleteId);
      if (err) throw err;
      setToast('Item removed');
      setDeleteId(null);
      loadItems();
    } catch (err) {
      setError('Could not delete item.');
      console.error(err);
    } finally {
      setDeleting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleResolve = async (id) => {
    try {
      const { error: err } = await supabase.from('lost_found_items').update({ resolved: true }).eq('id', id);
      if (err) throw err;
      setToast('Item marked resolved');
      loadItems();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setToast(''), 3000);
    }
  };

  const formatTime = (ts) => ts ? new Date(ts).toLocaleDateString() : '—';

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Lost & Found Moderation</h1>
        <p className="admin-page-subtitle">Review, resolve, and remove lost & found posts.</p>
      </div>

      {error && <div className="admin-error-banner">{error}</div>}

      {loading ? (
        <LoadingState label="Loading items..." />
      ) : items.length === 0 ? (
        <EmptyState icon={Package} title="No lost & found items." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Location</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={`admin-badge ${item.type === 'FOUND' ? 'admin-badge-open' : 'admin-badge-closed'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.location || '—'}</td>
                  <td>{item.profiles?.full_name || 'Unknown'}</td>
                  <td>{formatTime(item.created_at)}</td>
                  <td>
                    {item.resolved
                      ? <span className="admin-badge admin-badge-admin">Resolved</span>
                      : <span className="admin-badge admin-badge-closed">Open</span>}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      {!item.resolved && (
                        <button className="admin-icon-btn" title="Mark resolved" onClick={() => handleResolve(item.id)}>
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="admin-icon-btn admin-icon-btn-danger" title="Delete" onClick={() => setDeleteId(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Item"
        message="Are you sure you want to remove this lost & found post?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}
