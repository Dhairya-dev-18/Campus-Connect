import { useEffect, useState } from 'react';
import LostFound from '../components/LostFound';
import CTA from '../components/CTA';
import AuthModal from '../components/AuthModal';

export default function LostFoundPage() {
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <LostFound onLoginClick={() => setAuthOpen(true)} />
      <CTA />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
