import { Link } from 'react-router-dom';
import { GraduationCap, Globe, Link as LinkIcon, Mail, Share2, Send, MessageCircle } from 'lucide-react';
import { college } from '../data/collegeData';

const platformLinks = [
  { label: 'Academics', path: '/academics' },
  { label: 'Placements', path: '/placements' },
  { label: 'Communities', path: '/communities' },
  { label: 'Community Chat', path: '/chat' },
  { label: 'Events', path: '/events' },
  { label: 'Lost & Found', path: '/lost-found' },
];

const collegeLinks = ['About ABES', 'Departments', 'Campus', 'Contact'];

const socials = [Globe, LinkIcon, Mail, Share2, Send, MessageCircle];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span className="navbar-logo-icon" style={{ width: 32, height: 32 }}>
                  <GraduationCap size={18} />
                </span>
                ABES Engineering College
              </span>
            </div>
            <p className="footer-brand-addr">{college.location}</p>
            <div className="footer-social">
              {socials.map((Icon, i) => (
                <span key={i} className="footer-social-icon">
                  <Icon size={18} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Platform</div>
            {platformLinks.map((l, i) => (
              <Link key={i} to={l.path} className="footer-link">
                {l.label}
              </Link>
            ))}
          </div>

          <div>
            <div className="footer-col-title">College</div>
            {collegeLinks.map((l, i) => (
              <span key={i} className="footer-link">{l}</span>
            ))}
          </div>

          <div>
            <div className="footer-col-title">Connect</div>
            <p className="footer-brand-addr" style={{ marginBottom: 12 }}>
              Established {college.established} • {college.status}
            </p>
            <p className="footer-brand-addr">
              {college.campus} campus with 8,090+ students and 24,000+ alumni.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 ABES Engineering College. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
