import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { placementStats, recruiters } from '../data/collegeData';

export default function PlacementSection() {
  const { ref, visible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="section placement-section" id="placements" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Placements</div>
          <h2 className="section-title">From Campus to Career</h2>
          <p className="section-subtitle">
            Discover opportunities and prepare for your next career milestone.
          </p>
        </div>

        <div className={`placement-stats reveal ${visible ? 'visible' : ''}`}>
          {placementStats.map((s, i) => (
            <div key={i} className="placement-stat-card">
              <div className="placement-stat-value">{s.value}</div>
              <div className="placement-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className={`recruiter-marquee reveal ${visible ? 'visible' : ''}`}>
          <div className="recruiter-marquee-track">
            {[...recruiters, ...recruiters].map((r, i) => (
              <div key={i} className="recruiter-logo">{r}</div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/placements')}>
            Explore Placement Hub <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
