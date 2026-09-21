import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import AcademicsPage from './pages/AcademicsPage';
import PlacementsPage from './pages/PlacementsPage';
import CampusLifePage from './pages/CampusLifePage';
import LostFoundPage from './pages/LostFoundPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ChatPage from './pages/ChatPage';
import EventsPage from './pages/EventsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar onLoginClick={() => setAuthModalOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/placements" element={<PlacementsPage />} />
          <Route path="/campus-life" element={<CampusLifePage />} />
          <Route path="/lost-found" element={<LostFoundPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </BrowserRouter>
  );
}

export default App;
