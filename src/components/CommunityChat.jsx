import { useState, useEffect, useRef } from 'react';
import {
  Send, Smile, Paperclip, Search, Phone, MoreVertical,
  ArrowRight, Hash, Users,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { chatMessages } from '../data/chatMessages';
import { chatRooms, chatStats } from '../data/communities';

const avatarColors = {
  Rahul: '#3b82f6',
  Ananya: '#8b5cf6',
  Arjun: '#10b981',
  Priya: '#f59e0b',
};

export default function CommunityChat() {
  const { ref, visible } = useScrollReveal();
  const [activeRoom, setActiveRoom] = useState('DSA');
  const [messages, setMessages] = useState(chatMessages);
  const [showTyping, setShowTyping] = useState(false);
  const msgEndRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setShowTyping(true), 1000);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

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
          {chatStats.map((s, i) => (
            <div key={i} className="chat-stat">
              <div className="chat-stat-value">{s.value}</div>
              <div className="chat-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className={`chat-app reveal ${visible ? 'visible' : ''}`}>
          <div className="chat-app-header">
            <div className="chat-app-title">
              <Hash size={18} style={{ display: 'inline', marginRight: 6 }} />
              {activeRoom} Community
            </div>
            <div className="chat-app-online">
              <span className="online-dot" />
              128 students online
            </div>
          </div>

          <div className="chat-app-body">
            <div className="chat-sidebar">
              <div className="chat-sidebar-header">Communities</div>
              {chatRooms.map((room) => (
                <div
                  key={room}
                  className={`chat-room ${room === activeRoom ? 'active' : ''}`}
                  onClick={() => setActiveRoom(room)}
                >
                  <span className="chat-room-dot" />
                  {room}
                </div>
              ))}
            </div>

            <div className="chat-main">
              <div className="chat-main-header">
                <Users size={16} style={{ display: 'inline', marginRight: 8, color: '#10b981' }} />
                {activeRoom} Community
              </div>

              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className="chat-message">
                    <div
                      className="chat-message-avatar"
                      style={{ background: msg.color || avatarColors[msg.user] }}
                    >
                      {msg.user[0]}
                    </div>
                    <div className="chat-message-bubble">
                      <div className="chat-message-user" style={{ color: msg.color }}>
                        {msg.user}
                      </div>
                      <div className="chat-message-text">{msg.text}</div>
                      <div className="chat-message-time">{msg.time}</div>
                    </div>
                  </div>
                ))}

                {showTyping && (
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                    Someone is typing...
                  </div>
                )}
                <div ref={msgEndRef} />
              </div>

              <div className="chat-input-bar">
                <div className="chat-input-icons">
                  <span className="chat-input-icon"><Smile size={20} /></span>
                  <span className="chat-input-icon"><Paperclip size={20} /></span>
                </div>
                <input
                  className="chat-input-field"
                  placeholder="Type a message..."
                  readOnly
                />
                <button className="chat-send-btn">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <span className="btn btn-primary">
            Enter Community Chat <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </section>
  );
}
