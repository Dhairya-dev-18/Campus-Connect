import { useEffect } from 'react';
import LostFound from '../components/LostFound';
import CTA from '../components/CTA';

export default function LostFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <LostFound />
      <CTA />
    </div>
  );
}
