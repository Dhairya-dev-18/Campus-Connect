import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal';
import { stats } from '../data/collegeData';

function StatItem({ stat, start }) {
  const display = useCountUp(stat.value, 2000, stat.decimals || 0, start);
  return (
    <div className="stat-card">
      <div className="stat-value">
        {stat.prefix || ''}{display}{stat.suffix || ''}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

export default function Stats() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section" style={{ paddingTop: 60, paddingBottom: 60 }} ref={ref}>
      <div className="container">
        <div className={`stats-grid reveal ${visible ? 'visible' : ''}`}>
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} start={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
