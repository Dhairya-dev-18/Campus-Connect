import * as Icons from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { whyAbes } from '../data/collegeData';

const colors = ['#3b82f6', '#8b5cf6', '#10b981'];

export default function WhyAbes() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Why ABES</div>
          <h2 className="section-title">Built Around Learning, Innovation & Opportunity</h2>
        </div>

        <div className={`why-grid reveal ${visible ? 'visible' : ''}`}>
          {whyAbes.map((w, i) => {
            const Icon = Icons[w.icon] || Icons.Star;
            const color = colors[i % colors.length];
            return (
              <div key={i} className="why-card">
                <div
                  className="why-icon"
                  style={{ background: `${color}15`, color }}
                >
                  <Icon size={28} />
                </div>
                <h3 className="why-title">{w.title}</h3>
                <p className="why-desc">{w.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
