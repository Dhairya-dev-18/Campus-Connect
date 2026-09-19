import { useEffect } from 'react';
import CommunityHub from '../components/CommunityHub';
import CTA from '../components/CTA';

export default function CommunitiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <CommunityHub />
      <CTA />
    </div>
  );
}
