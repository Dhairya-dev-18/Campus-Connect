import { useEffect, useState } from 'react';
import { Search, Loader2, Users } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui';

const PAGE_SIZE = 20;

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadStudents();
  }, [page, branchFilter]);

  useEffect(() => {
    setPage(0);
  }, [search, branchFilter]);

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      let query = supabase
        .from('profiles')
        .select('id, full_name, roll_number, branch, role, created_at, avatar_color', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (branchFilter) query = query.eq('branch', branchFilter);

      const { data, error: err, count } = await query;
      if (err) throw err;
      setStudents(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError('Could not load students. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = search
    ? students.filter((s) =>
        s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.roll_number?.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase())
      )
    : students;

  const branches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EEE'];
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Student Management</h1>
        <p className="admin-page-subtitle">View and search all registered students.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, roll number, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="admin-filter-select"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">All Branches</option>
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingState label="Loading students..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No students found." subtitle="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Branch</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="admin-table-user">
                        <div className="admin-table-avatar" style={{ background: s.avatar_color || '#3b82f6' }}>
                          {s.full_name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        {s.full_name || 'Unknown'}
                      </div>
                    </td>
                    <td>{s.roll_number || '—'}</td>
                    <td>{s.branch || '—'}</td>
                    <td>
                      <span className={`admin-badge ${s.role === 'admin' ? 'admin-badge-admin' : ''}`}>
                        {s.role || 'student'}
                      </span>
                    </td>
                    <td>{s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </button>
              <span className="admin-pagination-info">
                Page {page + 1} of {totalPages} ({total} total)
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
