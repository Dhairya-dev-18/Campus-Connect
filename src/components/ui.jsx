import { Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="loading-state">
      <Loader2 size={24} className="spin" />
      <span style={{ marginLeft: 8 }}>{label}</span>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="error-state">
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={48} color="var(--gray-500)" />}
      <p>{title}</p>
      {subtitle && <p className="empty-state-sub">{subtitle}</p>}
    </div>
  );
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-subtitle" style={{ marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message, type = 'success' }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
}
