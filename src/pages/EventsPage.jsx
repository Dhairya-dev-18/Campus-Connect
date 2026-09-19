import { useEffect } from 'react';
import Events from '../components/Events';
import ActivityFeed from '../components/ActivityFeed';
import CTA from '../components/CTA';

export default function EventsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <Events />
      <ActivityFeed />
      <CTA />
    </div>
  );
}
