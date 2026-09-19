import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center' }}>
      <div className="container">
        <h1 className="section-title" style={{ fontSize: '3rem' }}>404</h1>
        <p className="section-subtitle" style={{ margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
