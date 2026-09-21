import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, UsersRound,
  Package, BookOpen, MessageSquare, LogOut, Menu, X, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/students', label: 'Students', icon: Users },
  { path: '/admin/events', label: 'Events', icon: Calendar },
  { path: '/admin/communities', label: 'Communities', icon: UsersRound },
  { path: '/admin/lost-found', label: 'Lost & Found', icon: Package },
  { path: '/admin/resources', label: 'Academic Resources', icon: BookOpen },
  { path: '/admin/chat', label: 'Chat Moderation', icon: MessageSquare },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`;

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="admin-sidebar-title">ABES Admin</div>
            <div className="admin-sidebar-sub">Campus Connect</div>
          </div>
        </div>

        <nav className="admin-nav">
          {adminNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-user-name">{profile?.full_name || 'Admin'}</div>
            <div className="admin-sidebar-user-email">{profile?.role || 'admin'}</div>
          </div>
          <button className="admin-sidebar-logout" onClick={handleSignOut}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="admin-topbar-title">Admin Dashboard</div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>

      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
