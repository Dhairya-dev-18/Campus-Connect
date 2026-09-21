import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Smile, Paperclip, Search, Phone, MoreVertical,
  ArrowRight, Hash, Users, Loader2,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { chatStats } from '../data/communities';

const avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#f97316'];

export default function CommunityChat() {
  const navigate = useNavigate();
  const { ref, visible } = useScrollReveal();
  const { user, profile } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const msgEndRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('id, name')
        .order('name');
      if (error) {
        console.error('Rooms fetch error:', error.message);
        setLoadingRooms(false);
        return;
      }
      setRooms(data || []);
      if (data && data.length > 0) {
        setActiveRoom(data[0]);
      }
      setLoadingRooms(false);
    })();
  }, []);

  const loadMessages = useCallback(async (roomId) => {
    if (!roomId) return;
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, text, created_at, user_id, profiles!chat_messages_user_id_fkey(full_name, avatar_color)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100);
    if (error) {
      console.error('Messages fetch error:', error.message);
      setLoadingMessages(false);
      return;
    }
    setMessages(data || []);
    setLoadingMessages(false);
  }, []);

  useEffect(() => {
    if (activeRoom) loadMessages(activeRoom.id);
  }, [activeRoom, loadMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!activeRoom) return;
    const channel = supabase
      .channel(`chat-${activeRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${activeRoom.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeRoom]);

  // Simulate online count
  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 50) + 80);
  }, [activeRoom]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user || !activeRoom) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    const { error } = await supabase.from('chat_messages').insert({
      room_id: activeRoom.id,
      text,
    });
    if (error) {
      console.error('Send error:', error.message);
      setInput(text);
    }
    setSending(false);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <section className="section chat-section" id="chat" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Community Chat</div>
          <h2 className="section-title">The Campus Conversation Starts Here.</h2>
          <p className="section-subtitle">
            Ask questions, share resources, find teammates, discuss projects, or simply talk with other ABES students.
          </p>
        </div>

        <div className={`chat-stats-row reveal ${visible ? 'visible' : ''}`}>
          <div className="chat-stat">
            <div className="chat-stat-value">{onlineCount}</div>
            <div className="chat-stat-label">Students Online</div>
          </div>
          <div className="chat-stat">
            <div className="chat-stat-value">{rooms.length}</div>
            <div className="chat-stat-label">Active Rooms</div>
          </div>
          <div className="chat-stat">
            <div className="chat-stat-value">1,200+</div>
            <div className="chat-stat-label">Conversations</div>
          </div>
        </div>

        <div className={`chat-app reveal ${visible ? 'visible' : ''}`}>
          <div className="chat-app-header">
            <div className="chat-app-title">
              <Hash size={18} style={{ display: 'inline', marginRight: 6 }} />
              {activeRoom ? `${activeRoom.name} Community` : 'Loading...'}
            </div>
            <div className="chat-app-online">
              <span className="online-dot" />
              {onlineCount} students online
            </div>
          </div>

          <div className="chat-app-body">
            <div className="chat-sidebar">
              <div className="chat-sidebar-header">Communities</div>
              {loadingRooms ? (
                <div className="chat-loading"><Loader2 size={20} className="spin" /></div>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`chat-room ${activeRoom?.id === room.id ? 'active' : ''}`}
                    onClick={() => setActiveRoom(room)}
                  >
                    <span className="chat-room-dot" />
                    {room.name}
                  </div>
                ))
              )}
            </div>

            <div className="chat-main">
              <div className="chat-main-header">
                <Users size={16} style={{ display: 'inline', marginRight: 8, color: '#10b981' }} />
                {activeRoom ? `${activeRoom.name} Community` : ''}
              </div>

              <div className="chat-messages">
                {loadingMessages ? (
                  <div className="chat-loading"><Loader2 size={24} className="spin" /></div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty">
                    No messages yet. Be the first to start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const msgProfile = msg.profiles;
                    const name = msgProfile?.full_name || 'Student';
                    const color = msgProfile?.avatar_color || avatarColors[msg.user_id?.charCodeAt(0) % avatarColors.length] || '#3b82f6';
                    return (
                      <div key={msg.id} className="chat-message">
                        <div
                          className="chat-message-avatar"
                          style={{ background: color }}
                        >
                          {name[0].toUpperCase()}
                        </div>
                        <div className="chat-message-bubble">
                          <div className="chat-message-user" style={{ color }}>
                            {name}
                          </div>
                          <div className="chat-message-text">{msg.text}</div>
                          <div className="chat-message-time">{formatTime(msg.created_at)}</div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={msgEndRef} />
              </div>

              <div className="chat-input-bar">
                {user ? (
                  <>
                    <div className="chat-input-icons">
                      <span className="chat-input-icon"><Smile size={20} /></span>
                      <span className="chat-input-icon"><Paperclip size={20} /></span>
                    </div>
                    <input
                      className="chat-input-field"
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <button className="chat-send-btn" onClick={handleSend} disabled={sending || !input.trim()}>
                      {sending ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
                    </button>
                  </>
                ) : (
                  <div className="chat-login-prompt">
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
                      Sign in to chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
