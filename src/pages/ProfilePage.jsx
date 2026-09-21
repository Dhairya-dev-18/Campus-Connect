import { useEffect, useState } from 'react';
import { User, Mail, Hash, GraduationCap, Calendar, Save, Loader2, Edit2, X, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LoadingState, ErrorState, Toast } from '../components/ui';

const branches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EEE'];
const avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#f97316', '#06b6d4', '#84cc16'];

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [myResources, setMyResources] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        roll_number: profile.roll_number || '',
        branch: profile.branch || 'CSE',
        semester: profile.semester || '',
        bio: profile.bio || '',
        avatar_color: profile.avatar_color || '#3b82f6',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      loadMyData();
    }
  }, [user]);

  const loadMyData = async () => {
    const [resources, regs] = await Promise.all([
      supabase.from('academic_resources').select('id, title, subject').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('event_registrations').select('id, event_id, events:event_id(title, event_date)').eq('user_id', user.id).order('registered_at', { ascending: false }),
    ]);
    if (resources.data) setMyResources(resources.data);
    if (regs.data) setMyRegistrations(regs.data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(formData);
      setEditing(false);
      setToast('Profile updated successfully');
    } catch (err) {
      setError('Could not update profile. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  if (!user) {
    return <div className="auth-loading-screen"><div className="auth-loading-spinner" /></div>;
  }

  return (
    <div className="profile-page" style={{ paddingTop: 80 }}>
      <div className="container">
        <div className="profile-header-card">
          <div className="profile-avatar-large" style={{ background: profile?.avatar_color || '#3b82f6' }}>
            {profile?.full_name?.[0]?.toUpperCase() || <User size={36} />}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{profile?.full_name || 'Student'}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-header-meta">
              {profile?.roll_number && <span><Hash size={14} /> {profile.roll_number}</span>}
              {profile?.branch && <span><GraduationCap size={14} /> {profile.branch}</span>}
              {profile?.role === 'admin' && <span className="admin-badge admin-badge-admin">Admin</span>}
            </div>
          </div>
          {!editing && (
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>

        {error && <div className="admin-error-banner">{error}</div>}

        <div className="profile-grid">
          <div className="profile-card">
            <h2 className="profile-card-title">Personal Information</h2>
            {editing ? (
              <form onSubmit={handleSave} className="profile-form">
                <div className="login-field">
                  <label className="login-label">Full Name</label>
                  <div className="login-input-wrap">
                    <User size={18} />
                    <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
                  </div>
                </div>
                <div className="login-field-row">
                  <div className="login-field">
                    <label className="login-label">Roll Number</label>
                    <div className="login-input-wrap">
                      <Hash size={18} />
                      <input type="text" value={formData.roll_number} onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })} />
                    </div>
                  </div>
                  <div className="login-field">
                    <label className="login-label">Branch</label>
                    <div className="login-input-wrap">
                      <GraduationCap size={18} />
                      <select value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })}>
                        {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="login-field">
                  <label className="login-label">Semester</label>
                  <div className="login-input-wrap">
                    <Calendar size={18} />
                    <input type="text" placeholder="e.g. 5th" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} />
                  </div>
                </div>
                <div className="login-field">
                  <label className="login-label">Bio</label>
                  <div className="login-input-wrap" style={{ alignItems: 'flex-start', padding: '12px 16px' }}>
                    <textarea className="modal-textarea" placeholder="Tell us about yourself..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
                  </div>
                </div>
                <div className="login-field">
                  <label className="login-label">Avatar Color</label>
                  <div className="profile-color-picker">
                    {avatarColors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`profile-color-dot ${formData.avatar_color === c ? 'selected' : ''}`}
                        style={{ background: c }}
                        onClick={() => setFormData({ ...formData, avatar_color: c })}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><Loader2 size={18} className="spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                    <X size={18} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info-list">
                <div className="profile-info-row"><span className="profile-info-label">Full Name</span><span className="profile-info-value">{profile?.full_name || '—'}</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Email</span><span className="profile-info-value">{user.email}</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Roll Number</span><span className="profile-info-value">{profile?.roll_number || '—'}</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Branch</span><span className="profile-info-value">{profile?.branch || '—'}</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Semester</span><span className="profile-info-value">{profile?.semester || '—'}</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Bio</span><span className="profile-info-value">{profile?.bio || '—'}</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Member Since</span><span className="profile-info-value">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</span></div>
              </div>
            )}
          </div>

          <div className="profile-card">
            <h2 className="profile-card-title">My Event Registrations</h2>
            {myRegistrations.length === 0 ? (
              <p className="profile-empty">No event registrations yet.</p>
            ) : (
              <div className="profile-list">
                {myRegistrations.map((r) => (
                  <div key={r.id} className="profile-list-item">
                    <Calendar size={18} color="#8b5cf6" />
                    <div>
                      <div className="profile-list-title">{r.events?.title || 'Event'}</div>
                      <div className="profile-list-meta">{r.events?.event_date || ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-card">
            <h2 className="profile-card-title">My Academic Resources</h2>
            {myResources.length === 0 ? (
              <p className="profile-empty">No resources shared yet.</p>
            ) : (
              <div className="profile-list">
                {myResources.map((r) => (
                  <div key={r.id} className="profile-list-item">
                    <BookOpen size={18} color="#10b981" />
                    <div>
                      <div className="profile-list-title">{r.title}</div>
                      <div className="profile-list-meta">{r.subject}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}
