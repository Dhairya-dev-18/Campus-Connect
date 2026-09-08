import { useScrollReveal } from '../hooks/useScrollReveal';
import { placementHighlights } from '../data/collegeData';

export default function PlacementHighlights() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section" style={{ paddingTop: 0 }} ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Historical Placement Highlights</div>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>
            Top Packages Over the Years
          </h2>
        </div>

        <div className={`highlights-grid reveal ${visible ? 'visible' : ''}`}>
          {placementHighlights.map((h, i) => (
            <div key={i} className="highlight-card">
              <div className="highlight-package">{h.package}</div>
              <div className="highlight-company">{h.company}</div>
              <div className="highlight-year">{h.year}</div>
            </div>
          ))}
        </div>

        <p className="highlights-disclaimer">
          Placement figures represent historical highlights published by ABES Engineering College.
        </p>
      </div>
    </section>
  );
}
