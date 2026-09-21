import { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { LoadingState, ErrorState, EmptyState, ConfirmDialog, Toast } from '../../components/ui';

export default function AdminChatPage() {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { loadRooms(); }, []);

  const loadRooms = async () => {
    try {
      const { data } = await supabase.from('chat_rooms').select('id, name').order('name');
      setRooms(data || []);
      if (data && data.length > 0) {
        setActiveRoom(data[0]);
        loadMessages(data[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Could not load chat rooms.');
      setLoading(false);
    }
  };

  const loadMessages = async (roomId) => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('chat_messages')
        .select('id, text, created_at, user_id, profiles!chat_messages_user_id_fkey(full_name, avatar_color)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(100);
      if (err) throw err;
      setMessages(data || []);
    } catch (err) {
      setError('Could not load messages.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error: err } = await supabase.from('chat_messages').delete().eq('id', deleteId);
      if (err) throw err;
      setToast('Message deleted');
      setDeleteId(null);
      if (activeRoom) loadMessages(activeRoom.id);
    } catch (err) {
      setError('Could not delete message.');
      console.error(err);
    } finally {
      setDeleting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Chat Moderation</h1>
        <p className="admin-page-subtitle">Review and remove inappropriate messages.</p>
      </div>

      {error && <div className="admin-error-banner">{error}</div>}

      <div className="admin-chat-rooms">
        {rooms.map((r) => (
          <button
            key={r.id}
            className={`admin-chat-room-btn ${activeRoom?.id === r.id ? 'active' : ''}`}
            onClick={() => { setActiveRoom(r); loadMessages(r.id); }}
          >
            {r.name}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Loading messages..." />
      ) : messages.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages in this room." />
      ) : (
        <div className="admin-chat-list">
          {messages.map((msg) => {
            const name = msg.profiles?.full_name || 'Unknown';
            const color = msg.profiles?.avatar_color || '#3b82f6';
            return (
              <div key={msg.id} className="admin-chat-item">
                <div className="admin-chat-avatar" style={{ background: color }}>
                  {name[0]?.toUpperCase()}
                </div>
                <div className="admin-chat-body">
                  <div className="admin-chat-header">
                    <span className="admin-chat-name">{name}</span>
                    <span className="admin-chat-time">{formatTime(msg.created_at)}</span>
                  </div>
                  <div className="admin-chat-text">{msg.text}</div>
                </div>
                <button className="admin-icon-btn admin-icon-btn-danger" onClick={() => setDeleteId(msg.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}
