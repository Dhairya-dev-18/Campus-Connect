import { useEffect, useState } from 'react';
import CommunityHub from '../components/CommunityHub';
import CTA from '../components/CTA';
import AuthModal from '../components/AuthModal';

export default function CommunitiesPage() {
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <CommunityHub onLoginClick={() => setAuthOpen(true)} />
      <CTA />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
