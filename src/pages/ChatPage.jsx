import { useEffect, useState } from 'react';
import CommunityChat from '../components/CommunityChat';
import CTA from '../components/CTA';
import AuthModal from '../components/AuthModal';

export default function ChatPage() {
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <CommunityChat onLoginClick={() => setAuthOpen(true)} />
      <CTA />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
