import { useEffect } from 'react';
import CommunityChat from '../components/CommunityChat';
import CTA from '../components/CTA';

export default function ChatPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <CommunityChat />
      <CTA />
    </div>
  );
}
