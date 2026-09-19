import { useEffect } from 'react';
import PlacementSection from '../components/PlacementSection';
import PlacementHighlights from '../components/PlacementHighlights';
import CTA from '../components/CTA';

export default function PlacementsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <PlacementSection />
      <PlacementHighlights />
      <CTA />
    </div>
  );
}
