import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, User, Menu, LogOut } from 'lucide-react';
import { navItems } from '../data/collegeData';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileMenu(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    setProfileMenu(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `navbar-link ${isActive ? 'navbar-link-active' : ''}`;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <NavLink to="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <GraduationCap size={22} />
            </div>
            ABES EC
          </NavLink>

          <ul className="navbar-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={navLinkClass}
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            {user ? (
              <div className="navbar-user-wrapper">
                <div
                  className="navbar-profile"
                  onClick={() => setProfileMenu(!profileMenu)}
                  title={profile?.full_name || 'Account'}
                  style={profile?.avatar_color ? { background: profile.avatar_color } : {}}
                >
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : <User size={18} />}
                </div>
                {profileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-dropdown-name">{profile?.full_name || 'Student'}</div>
                      <div className="profile-dropdown-email">{user.email}</div>
                      {profile?.roll_number && (
                        <div className="profile-dropdown-meta">
                          {profile.roll_number} • {profile.branch || 'N/A'}
                        </div>
                      )}
                    </div>
                    <button className="profile-dropdown-item" onClick={handleSignOut}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="navbar-login" onClick={() => navigate('/login')}>
                Student Login
              </button>
            )}
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
          <NavLink
            key={item.path}
            to={item.path}
            className={navLinkClass}
            end={item.path === '/'}
            style={{ display: 'block', padding: '14px 16px' }}
          >
            {item.label}
          </NavLink>
        ))}
        {user ? (
          <button
            className="btn btn-primary"
            style={{ marginTop: 12, width: 'fit-content' }}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="btn btn-primary"
            style={{ marginTop: 12, width: 'fit-content' }}
            onClick={() => { setMenuOpen(false); navigate('/login'); }}
          >
            Student Login
          </button>
        )}
      </div>
    </>
  );
}
