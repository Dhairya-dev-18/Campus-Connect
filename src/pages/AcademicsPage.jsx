import { useEffect } from 'react';
import AcademicsPreview from '../components/AcademicsPreview';
import CTA from '../components/CTA';

export default function AcademicsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      <AcademicsPreview />
      <CTA />
    </div>
  );
}
