import { MapPin, Clock, Plus, Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { lostFoundItems } from '../data/activities';

export default function LostFound() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section" id="lost-found" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Lost & Found</div>
          <h2 className="section-title">Lost Something? Found Something?</h2>
          <p className="section-subtitle">
            Help reconnect lost belongings with their owners across the ABES campus.
          </p>
        </div>

        <div className={`lostfound-grid reveal ${visible ? 'visible' : ''}`}>
          {lostFoundItems.map((item, i) => {
            const Icon = Icons[item.icon] || Icons.Search;
            return (
              <div key={i} className="lostfound-card">
                <div className={`lostfound-type ${item.type.toLowerCase()}`}>
                  {item.type}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div
                    className="feature-icon"
                    style={{
                      background: item.type === 'FOUND' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      color: item.type === 'FOUND' ? '#10b981' : '#f87171',
                      width: 44,
                      height: 44,
                      marginBottom: 0,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="lostfound-title" style={{ marginBottom: 0 }}>
                    {item.title}
                  </h3>
                </div>
                <div className="lostfound-meta">
                  <span className="lostfound-meta-item">
                    <MapPin size={14} /> {item.location}
                  </span>
                  <span className="lostfound-meta-item">
                    <Clock size={14} /> {item.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`lostfound-actions reveal ${visible ? 'visible' : ''}`}>
          <button className="btn btn-primary">
            <Plus size={18} /> Report Lost Item
          </button>
          <button className="btn btn-secondary">
            <Search size={18} /> Report Found Item
          </button>
        </div>
      </div>
    </section>
  );
}
