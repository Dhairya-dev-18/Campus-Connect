import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AcademicsPage from './pages/AcademicsPage';
import PlacementsPage from './pages/PlacementsPage';
import CampusLifePage from './pages/CampusLifePage';
import LostFoundPage from './pages/LostFoundPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ChatPage from './pages/ChatPage';
import EventsPage from './pages/EventsPage';
import NotFoundPage from './pages/NotFoundPage';

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
          <Route
            path="/lost-found"
            element={<ProtectedRoute><LostFoundPage /></ProtectedRoute>}
          />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route
            path="/chat"
            element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
          />
          <Route
            path="/events"
            element={<ProtectedRoute><EventsPage /></ProtectedRoute>}
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
