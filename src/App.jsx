import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AcademicsPage from './pages/AcademicsPage';
import PlacementsPage from './pages/PlacementsPage';
import CampusLifePage from './pages/CampusLifePage';
import LostFoundPage from './pages/LostFoundPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ChatPage from './pages/ChatPage';
import EventsPage from './pages/EventsPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminCommunitiesPage from './pages/admin/AdminCommunitiesPage';
import AdminLostFoundPage from './pages/admin/AdminLostFoundPage';
import AdminResourcesPage from './pages/admin/AdminResourcesPage';
import AdminChatPage from './pages/admin/AdminChatPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/placements" element={<PlacementsPage />} />
          <Route path="/campus-life" element={<CampusLifePage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route
            path="/lost-found"
            element={<ProtectedRoute><LostFoundPage /></ProtectedRoute>}
          />
          <Route
            path="/chat"
            element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
          />
          <Route
            path="/events"
            element={<ProtectedRoute><EventsPage /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboardPage /></AdminRoute>}
          />
          <Route
            path="/admin/students"
            element={<AdminRoute><AdminStudentsPage /></AdminRoute>}
          />
          <Route
            path="/admin/events"
            element={<AdminRoute><AdminEventsPage /></AdminRoute>}
          />
          <Route
            path="/admin/communities"
            element={<AdminRoute><AdminCommunitiesPage /></AdminRoute>}
          />
          <Route
            path="/admin/lost-found"
            element={<AdminRoute><AdminLostFoundPage /></AdminRoute>}
          />
          <Route
            path="/admin/resources"
            element={<AdminRoute><AdminResourcesPage /></AdminRoute>}
          />
          <Route
            path="/admin/chat"
            element={<AdminRoute><AdminChatPage /></AdminRoute>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
