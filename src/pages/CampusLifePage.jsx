import { useEffect } from 'react';
import FeatureGrid from '../components/FeatureGrid';
import ActivityFeed from '../components/ActivityFeed';
import WhyAbes from '../components/WhyAbes';
import CTA from '../components/CTA';

export default function CampusLifePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <FeatureGrid />
      <ActivityFeed />
      <WhyAbes />
      <CTA />
    </div>
  );
}
