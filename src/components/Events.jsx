import * as Icons from 'lucide-react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { events } from '../data/events';

const eventColors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export default function Events() {
  const { ref, visible } = useScrollReveal();

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
          {events.map((e, i) => {
            const Icon = Icons[e.icon] || Icons.Calendar;
            const color = eventColors[i % eventColors.length];
            return (
              <div key={i} className="event-card">
                <div className="event-card-header">
                  <div
                    className="event-icon"
                    style={{ background: `${color}15`, color }}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="event-badge">{e.status}</span>
                </div>
                <div className="event-date">
                  <Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />
                  {e.date} • {e.category}
                </div>
                <h3 className="event-title">{e.title}</h3>
                <p className="event-desc">{e.description}</p>
                <div className="event-attendees">
                  <Users size={14} /> {e.attendees}
                </div>
                <button className="event-register">Register</button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
