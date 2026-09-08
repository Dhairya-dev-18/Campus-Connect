import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import FeatureGrid from './components/FeatureGrid';
import AcademicsPreview from './components/AcademicsPreview';
import PlacementSection from './components/PlacementSection';
import PlacementHighlights from './components/PlacementHighlights';
import LostFound from './components/LostFound';
import CommunityHub from './components/CommunityHub';
import CommunityChat from './components/CommunityChat';
import Events from './components/Events';
import ActivityFeed from './components/ActivityFeed';
import WhyAbes from './components/WhyAbes';
import CTA from './components/CTA';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <FeatureGrid />
        <AcademicsPreview />
        <PlacementSection />
        <PlacementHighlights />
        <LostFound />
        <CommunityHub />
        <CommunityChat />
        <Events />
        <ActivityFeed />
        <WhyAbes />
        <CTA />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default App;
