import { ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { heroCards } from '../data/chatMessages';
import * as Icons from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="online-dot" />
              ABES Engineering College • Ghaziabad
            </div>
            <h1 className="hero-title">Your Campus. Connected.</h1>
            <p className="hero-subtitle">
              One digital space for ABES students to learn, discover opportunities, connect with communities, chat with fellow students, and stay updated with campus life.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate('/academics')}>
                Explore Campus <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/communities')}>
                Join the Community <Users size={18} />
              </button>
            </div>
          </div>

          <div className="hero-dashboard">
            <div className="dashboard-center-ring" />
            <div className="dashboard-center-ring dashboard-center-ring-2" />
            <div className="dashboard-center">
              <Icons.GraduationCap size={48} color="#60a5fa" />
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-400)', marginTop: 8 }}>
                Digital Campus
              </div>
            </div>
            {heroCards.map((card, i) => {
              const Icon = Icons[card.icon] || Icons.Bell;
              return (
                <div
                  key={i}
                  className="floating-card"
                  style={{ animationDelay: `${card.delay}s` }}
                >
                  <div
                    className="floating-card-icon"
                    style={{ background: `${card.color}15`, color: card.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="floating-card-type" style={{ color: card.color }}>
                    {card.type}
                  </div>
                  <div className="floating-card-title">{card.title}</div>
                  <div className="floating-card-body">{card.body}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
