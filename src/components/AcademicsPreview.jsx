import { BarChart3, FileText, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { subjects, recentResources } from '../data/activities';

export default function AcademicsPreview() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section" id="academics" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Academics</div>
          <h2 className="section-title">Your Academic Command Center</h2>
          <p className="section-subtitle">
            Everything you need for your semester, organized in one place.
          </p>
        </div>

        <div className={`academics-dashboard reveal ${visible ? 'visible' : ''}`}>
          <div className="academics-card">
            <div className="academics-card-title">
              <BarChart3 size={20} color="#3b82f6" /> My Subjects
            </div>
            {subjects.map((s, i) => (
              <div key={i} className="subject-row">
                <div className="subject-header">
                  <span className="subject-name">{s.name}</span>
                  <span className="subject-pct">{s.progress}%</span>
                </div>
                <div className="subject-bar">
                  <div
                    className="subject-bar-fill"
                    style={{
                      width: visible ? `${s.progress}%` : '0%',
                      background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="academics-card">
            <div className="academics-card-title">
              <FileText size={20} color="#8b5cf6" /> Recent Resources
            </div>
            {recentResources.map((r, i) => (
              <div key={i} className="resource-item">
                <div className="resource-icon">
                  <FileText size={18} />
                </div>
                <span className="resource-name">{r}</span>
              </div>
            ))}
            <span className="feature-link" style={{ marginTop: 20, display: 'inline-flex' }}>
              Explore Academic Hub <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
