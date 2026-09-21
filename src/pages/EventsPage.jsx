import { useEffect, useState } from 'react';
import Events from '../components/Events';
import ActivityFeed from '../components/ActivityFeed';
import CTA from '../components/CTA';
import AuthModal from '../components/AuthModal';

export default function EventsPage() {
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <Events onLoginClick={() => setAuthOpen(true)} />
      <ActivityFeed />
      <CTA />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
