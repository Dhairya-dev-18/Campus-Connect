import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, User, Menu, LogOut, Shield, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const publicNav = [
  { path: '/', label: 'Home' },
  { path: '/academics', label: 'Academics' },
  { path: '/placements', label: 'Placements' },
  { path: '/campus-life', label: 'Campus Life' },
];

const studentNav = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/communities', label: 'Communities' },
  { path: '/chat', label: 'Chat' },
  { path: '/lost-found', label: 'Lost & Found' },
  { path: '/academics', label: 'Academics' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, isAdmin } = useAuth();

  const navItems = user ? studentNav : publicNav;

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
            {isAdmin && (
              <li>
                <NavLink to="/admin" className={navLinkClass}>
                  <Shield size={14} style={{ display: 'inline', marginRight: 4 }} />
                  Admin
                </NavLink>
              </li>
            )}
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
                      {isAdmin && (
                        <div className="profile-dropdown-admin-tag">
                          <Shield size={12} /> Administrator
                        </div>
                      )}
                    </div>
                    <button className="profile-dropdown-item" onClick={() => { setProfileMenu(false); navigate('/profile'); }}>
                      <User size={16} /> My Profile
                    </button>
                    {isAdmin && (
                      <button className="profile-dropdown-item" onClick={() => { setProfileMenu(false); navigate('/admin'); }}>
                        <Shield size={16} /> Admin Dashboard
                      </button>
                    )}
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
        {isAdmin && (
          <NavLink to="/admin" className={navLinkClass} style={{ display: 'block', padding: '14px 16px' }}>
            <Shield size={14} style={{ display: 'inline', marginRight: 4 }} />
            Admin Dashboard
          </NavLink>
        )}
        {user ? (
          <>
            <NavLink to="/profile" className={navLinkClass} style={{ display: 'block', padding: '14px 16px' }}>
              My Profile
            </NavLink>
            <button
              className="btn btn-primary"
              style={{ marginTop: 12, width: 'fit-content' }}
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </>
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
