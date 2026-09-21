import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import FeatureGrid from '../components/FeatureGrid';
import AcademicsPreview from '../components/AcademicsPreview';
import PlacementSection from '../components/PlacementSection';
import PlacementHighlights from '../components/PlacementHighlights';
import LostFound from '../components/LostFound';
import CommunityHub from '../components/CommunityHub';
import CommunityChat from '../components/CommunityChat';
import Events from '../components/Events';
import ActivityFeed from '../components/ActivityFeed';
import WhyAbes from '../components/WhyAbes';
import CTA from '../components/CTA';
import AuthModal from '../components/AuthModal';

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <Stats />
      <FeatureGrid />
      <AcademicsPreview />
      <PlacementSection />
      <PlacementHighlights />
      <LostFound onLoginClick={() => setAuthOpen(true)} />
      <CommunityHub onLoginClick={() => setAuthOpen(true)} />
      <CommunityChat onLoginClick={() => setAuthOpen(true)} />
      <Events onLoginClick={() => setAuthOpen(true)} />
      <ActivityFeed />
      <WhyAbes />
      <CTA />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
