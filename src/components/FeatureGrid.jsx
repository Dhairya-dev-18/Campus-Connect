import { ArrowRight, BookOpen, Briefcase, Search, Users, MessageCircle, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { chatMessages } from '../data/chatMessages';
import { communityFeatures } from '../data/communities';

const features = [
  {
    icon: BookOpen,
    title: 'Academics',
    description: 'Access notes, subjects, resources, announcements and academic material.',
    tags: ['Notes', 'Subjects', 'Resources', 'Previous Papers'],
    link: 'Explore Academics',
    color: '#3b82f6',
    path: '/academics',
  },
  {
    icon: Briefcase,
    title: 'Placements',
    description: 'Discover placement drives, internships, recruiters and career opportunities.',
    tags: ['Placement Drives', 'Internships', 'Recruiters', 'Placement Statistics'],
    link: 'Explore Placements',
    color: '#8b5cf6',
    path: '/placements',
  },
  {
    icon: Search,
    title: 'Lost & Found',
    description: 'Find lost belongings or help another student recover theirs.',
    tags: [
      { label: 'FOUND', text: 'College ID Card', cls: 'found' },
      { label: 'LOST', text: 'Black Wallet', cls: 'lost' },
    ],
    link: 'Open Lost & Found',
    color: '#f59e0b',
    path: '/lost-found',
  },
  {
    icon: Users,
    title: 'Communities',
    description: 'Discover student clubs, communities and people with similar interests.',
    tags: communityFeatures,
    link: 'Discover Communities',
    color: '#10b981',
    path: '/communities',
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Never miss hackathons, workshops, fests, club activities and campus events.',
    tags: ['Hackathons', 'Workshops', 'Cultural Events', 'Technical Events'],
    link: 'View Events',
    color: '#ec4899',
    path: '/events',
  },
  {
    icon: Bell,
    title: 'Campus Updates',
    description: 'Stay updated with important announcements and campus news.',
    tags: ['Announcements', 'News', 'Notifications'],
    link: 'View Updates',
    color: '#f97316',
    path: '/campus-life',
  },
];

export default function FeatureGrid() {
  const { ref, visible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="section" id="campus-life" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Core Features</div>
          <h2 className="section-title">Everything Your Campus Needs</h2>
          <p className="section-subtitle">
            One platform for learning, opportunities, communication and campus life.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className={`feature-card reveal reveal-delay-${(i % 3) + 1} ${visible ? 'visible' : ''}`}
              onClick={() => navigate(f.path)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="feature-icon"
                style={{ background: `${f.color}15`, color: f.color }}
              >
                <f.icon size={26} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
              <div className="feature-preview">
                {f.tags.map((tag, ti) => {
                  if (typeof tag === 'string') {
                    return <span key={ti} className="feature-tag">{tag}</span>;
                  }
                  return (
                    <span key={ti} className={`feature-tag ${tag.cls}`}>
                      {tag.label}: {tag.text}
                    </span>
                  );
                })}
              </div>
              <span className="feature-link">
                {f.link} <ArrowRight size={16} />
              </span>
            </div>
          ))}
        </div>

        {/* Community Chat Feature Card */}
        <div
          className={`chat-feature-card reveal reveal-delay-2 ${visible ? 'visible' : ''}`}
          style={{ marginTop: 24, cursor: 'pointer' }}
          onClick={() => navigate('/chat')}
        >
          <div className="chat-feature-content">
            <div
              className="feature-icon"
              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
            >
              <MessageCircle size={26} />
            </div>
            <h3 className="feature-title" style={{ fontSize: '1.8rem', marginBottom: 12 }}>
              Talk. Connect. Collaborate.
            </h3>
            <p className="feature-desc" style={{ fontSize: '1rem', marginBottom: 24 }}>
              A campus-wide chat space where ABES students can interact, ask questions, share knowledge and help each other.
            </p>
            <span className="feature-link" style={{ fontSize: '0.95rem' }}>
              Open Community Chat <ArrowRight size={16} />
            </span>
          </div>
          <div className="chat-mini">
            <div className="chat-mini-header">
              <div className="chat-mini-name">DSA Community</div>
              <div className="chat-mini-online">
                <span className="online-dot" />
                12 students online
              </div>
            </div>
            {chatMessages.slice(0, 3).map((msg, i) => (
              <div key={i} className="chat-mini-msg">
                <span className="chat-mini-msg-user" style={{ color: msg.color }}>
                  {msg.user}:
                </span>
                <span style={{ color: 'var(--gray-300)' }}>{msg.text}</span>
              </div>
            ))}
            <div className="chat-mini-input">
              <span className="chat-mini-input-text">Type a message...</span>
              <MessageCircle size={18} color="#3b82f6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
