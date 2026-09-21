import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Calendar, Users, Check, Loader2, X } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const eventColors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export default function Events({ onLoginClick }) {
  const { ref, visible } = useScrollReveal();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState({});
  const [registering, setRegistering] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);

  useEffect(() => {
    loadEvents();
    if (user) loadRegistrations();
  }, [user]);

  const loadEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('id, title, category, status, event_date, description, icon, capacity')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Events fetch error:', error.message);
      setLoading(false);
      return;
    }
    // Get registration counts for each event
    const eventsWithCounts = await Promise.all(
      (data || []).map(async (e) => {
        const { count } = await supabase
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', e.id);
        return { ...e, registered_count: count || 0 };
      })
    );
    setEvents(eventsWithCounts);
    setLoading(false);
  };

  const loadRegistrations = async () => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', user.id);
    if (error) return;
    const map = {};
    (data || []).forEach((r) => { map[r.event_id] = true; });
    setRegistrations(map);
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      onLoginClick();
      return;
    }
    if (registrations[eventId]) return;

    setRegistering(eventId);
    const { error } = await supabase.from('event_registrations').insert({
      event_id: eventId,
    });
    if (error) {
      console.error('Registration error:', error.message);
      setRegistering(null);
      return;
    }
    setRegistrations((prev) => ({ ...prev, [eventId]: true }));
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, registered_count: e.registered_count + 1 } : e
      )
    );
    setRegistering(null);
    setShowSuccess(eventId);
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleUnregister = async (eventId) => {
    if (!user) return;
    setRegistering(eventId);
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);
    if (error) {
      console.error('Unregister error:', error.message);
      setRegistering(null);
      return;
    }
    setRegistrations((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, registered_count: Math.max(0, e.registered_count - 1) } : e
      )
    );
    setRegistering(null);
  };

  return (
    <section className="section" id="events" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Events</div>
          <h2 className="section-title">What's Happening at ABES?</h2>
          <p className="section-subtitle">
            Stay updated on hackathons, workshops, fests and campus activities.
          </p>
        </div>

        <div className={`events-grid reveal ${visible ? 'visible' : ''}`}>
          {loading ? (
            <div className="loading-state"><Loader2 size={28} className="spin" /></div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} color="var(--gray-500)" />
              <p>No events scheduled right now. Check back soon!</p>
            </div>
          ) : (
            events.map((e, i) => {
              const Icon = Icons[e.icon] || Icons.Calendar;
              const color = eventColors[i % eventColors.length];
              const isRegistered = registrations[e.id];
              const isFull = e.registered_count >= e.capacity;
              return (
                <div key={e.id} className="event-card">
                  <div className="event-card-header">
                    <div
                      className="event-icon"
                      style={{ background: `${color}15`, color }}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="event-badge">{e.status === 'open' ? 'Open' : e.status}</span>
                  </div>
                  <div className="event-date">
                    <Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />
                    {e.event_date} • {e.category}
                  </div>
                  <h3 className="event-title">{e.title}</h3>
                  <p className="event-desc">{e.description}</p>
                  <div className="event-attendees">
                    <Users size={14} /> {e.registered_count} / {e.capacity} registered
                  </div>
                  <button
                    className={`event-register ${isRegistered ? 'registered' : ''} ${isFull && !isRegistered ? 'disabled' : ''}`}
                    onClick={() => isRegistered ? handleUnregister(e.id) : handleRegister(e.id)}
                    disabled={registering === e.id || (isFull && !isRegistered)}
                  >
                    {registering === e.id ? (
                      <Loader2 size={16} className="spin" />
                    ) : isRegistered ? (
                      <><Check size={16} /> Registered — Click to cancel</>
                    ) : isFull ? (
                      'Event Full'
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {showSuccess && (
          <div className="toast toast-success">
            <Check size={18} /> Successfully registered!
          </div>
        )}
      </div>
    </section>
  );
}
