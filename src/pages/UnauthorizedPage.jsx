import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          <ShieldAlert size={48} />
        </div>
        <h1 className="unauthorized-title">Access Denied</h1>
        <p className="unauthorized-desc">
          You don't have permission to access this page. This area is restricted to administrators.
        </p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
