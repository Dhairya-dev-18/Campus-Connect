import * as Icons from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { activities } from '../data/activities';

export default function ActivityFeed() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Live Feed</div>
          <h2 className="section-title">What's Happening Around Campus?</h2>
          <p className="section-subtitle">
            A real-time stream of campus activity across academics, placements, communities and more.
          </p>
        </div>

        <div className={`activity-timeline reveal ${visible ? 'visible' : ''}`}>
          {activities.map((a, i) => {
            const Icon = Icons[a.icon] || Icons.Bell;
            return (
              <div key={i} className="activity-item">
                <div
                  className="activity-icon"
                  style={{ background: `${a.color}15`, color: a.color, borderColor: `${a.color}30` }}
                >
                  <Icon size={20} />
                </div>
                <div className="activity-content">
                  <div className="activity-category" style={{ color: a.color }}>
                    {a.category}
                  </div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
