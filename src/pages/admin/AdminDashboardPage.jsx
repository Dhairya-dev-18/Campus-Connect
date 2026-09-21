import { useEffect, useState } from 'react';
import { Users, Calendar, UsersRound, Package, BookOpen, ClipboardList, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { LoadingState, ErrorState } from '../../components/ui';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [students, events, communities, lostFound, resources, registrations] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('communities').select('id', { count: 'exact', head: true }),
        supabase.from('lost_found_items').select('id', { count: 'exact', head: true }),
        supabase.from('academic_resources').select('id', { count: 'exact', head: true }),
        supabase.from('event_registrations').select('id', { count: 'exact', head: true }),
      ]);

      if (students.error) throw students.error;

      setStats({
        students: students.count || 0,
        events: events.count || 0,
        communities: communities.count || 0,
        lostFound: lostFound.count || 0,
        resources: resources.count || 0,
        registrations: registrations.count || 0,
      });

      // Recent activity: latest lost/found + events + messages
      const [recentLF, recentEvents, recentMsgs] = await Promise.all([
        supabase.from('lost_found_items')
          .select('id, title, type, created_at, profiles!lost_found_items_user_id_fkey(full_name)')
          .order('created_at', { ascending: false }).limit(5),
        supabase.from('events')
          .select('id, title, event_date').order('created_at', { ascending: false }).limit(5),
        supabase.from('chat_messages')
          .select('id, text, created_at, profiles!chat_messages_user_id_fkey(full_name)')
          .order('created_at', { ascending: false }).limit(5),
      ]);

      const activity = [];
      (recentLF.data || []).forEach((r) => activity.push({
        type: 'lost-found', label: `${r.type}: ${r.title}`, who: r.profiles?.full_name || 'Student', time: r.created_at,
      }));
      (recentEvents.data || []).forEach((r) => activity.push({
        type: 'event', label: `Event: ${r.title}`, who: 'System', time: r.created_at,
      }));
      (recentMsgs.data || []).forEach((r) => activity.push({
        type: 'chat', label: `Chat: ${r.text?.slice(0, 40)}`, who: r.profiles?.full_name || 'Student', time: r.created_at,
      }));
      activity.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(activity.slice(0, 8));
    } catch (err) {
      setError('Could not load dashboard data. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats?.students ?? 0, icon: Users, color: '#3b82f6' },
    { label: 'Total Events', value: stats?.events ?? 0, icon: Calendar, color: '#8b5cf6' },
    { label: 'Communities', value: stats?.communities ?? 0, icon: UsersRound, color: '#10b981' },
    { label: 'Lost & Found Posts', value: stats?.lostFound ?? 0, icon: Package, color: '#f59e0b' },
    { label: 'Academic Resources', value: stats?.resources ?? 0, icon: BookOpen, color: '#ec4899' },
    { label: 'Event Registrations', value: stats?.registrations ?? 0, icon: ClipboardList, color: '#f97316' },
  ];

  const formatTime = (ts) => {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <p className="admin-page-subtitle">Real-time statistics and recent activity across the campus platform.</p>
      </div>

      {loading ? (
        <LoadingState label="Loading dashboard..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="admin-stats-grid">
            {statCards.map((s, i) => (
              <div key={i} className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
                  <s.icon size={22} />
                </div>
                <div className="admin-stat-value">{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="admin-section">
            <h2 className="admin-section-title">
              <TrendingUp size={20} /> Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
              <p className="admin-empty">No recent activity.</p>
            ) : (
              <div className="admin-activity-list">
                {recentActivity.map((a, i) => (
                  <div key={i} className="admin-activity-item">
                    <div className="admin-activity-dot" />
                    <div className="admin-activity-content">
                      <div className="admin-activity-label">{a.label}</div>
                      <div className="admin-activity-meta">{a.who} • {formatTime(a.time)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
