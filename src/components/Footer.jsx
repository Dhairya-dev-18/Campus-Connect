import { GraduationCap, Globe, Link, Mail, Share2, Send, MessageCircle } from 'lucide-react';
import { college } from '../data/collegeData';

const platformLinks = [
  'Academics', 'Placements', 'Communities', 'Community Chat', 'Events', 'Lost & Found',
];

const collegeLinks = ['About ABES', 'Departments', 'Campus', 'Contact'];

const socials = [Globe, Link, Mail, Share2, Send, MessageCircle];

export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

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
              <span
                key={i}
                className="footer-link"
                onClick={() => {
                  const map = {
                    Academics: 'academics',
                    Placements: 'placements',
                    Communities: 'communities',
                    'Community Chat': 'chat',
                    Events: 'events',
                    'Lost & Found': 'lost-found',
                  };
                  scrollTo(map[l]);
                }}
              >
                {l}
              </span>
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
