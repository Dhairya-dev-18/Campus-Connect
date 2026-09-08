import * as Icons from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { communities } from '../data/communities';

const avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export default function CommunityHub() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section" id="communities" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Communities</div>
          <h2 className="section-title">Find Your People</h2>
          <p className="section-subtitle">
            Join communities, discover student clubs and connect with people who share your interests.
          </p>
        </div>

        <div className={`communities-grid reveal ${visible ? 'visible' : ''}`}>
          {communities.map((c, i) => {
            const Icon = Icons[c.icon] || Icons.Users;
            return (
              <div key={i} className="community-card">
                <div className="community-card-header">
                  <div
                    className="community-icon"
                    style={{ background: `${c.color}15`, color: c.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="community-name">{c.name}</div>
                    <div className="community-members">{c.members} members</div>
                  </div>
                </div>
                <div className="community-footer">
                  <div className="avatar-stack">
                    {avatarColors.slice(0, 3).map((color, ai) => (
                      <div
                        key={ai}
                        className="avatar"
                        style={{ background: color }}
                      >
                        {String.fromCharCode(65 + ai)}
                      </div>
                    ))}
                    <div
                      className="avatar"
                      style={{ background: 'var(--navy-600)', fontSize: '0.7rem' }}
                    >
                      +{c.members - 3}
                    </div>
                  </div>
                  <button className="join-btn">Join</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
