import { ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function CTA() {
  const { ref, visible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="cta-section" ref={ref}>
      <div className="container">
        <div className={`cta-content reveal ${visible ? 'visible' : ''}`}>
          <h2 className="cta-title">Your ABES Journey. One Platform.</h2>
          <p className="cta-subtitle">
            Learn. Connect. Collaborate. Discover opportunities. Build your future.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/academics')}>
              Explore Campus <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/communities')}>
              Join Community <Users size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
