import { useEffect, useState } from 'react';
import { GraduationCap, User, Menu } from 'lucide-react';
import { navItems } from '../data/collegeData';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <div className="navbar-logo" onClick={() => scrollTo('home')}>
            <div className="navbar-logo-icon">
              <GraduationCap size={22} />
            </div>
            ABES EC
          </div>

          <ul className="navbar-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <span className="navbar-link" onClick={() => scrollTo(item.id)}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <button className="navbar-login" onClick={() => scrollTo('home')}>
              Student Login
            </button>
            <div className="navbar-profile">
              <User size={18} />
            </div>
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <span
            key={item.id}
            className="mobile-menu-item"
            onClick={() => scrollTo(item.id)}
          >
            {item.label}
          </span>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 12, width: 'fit-content' }}>
          Student Login
        </button>
      </div>
    </>
  );
}
