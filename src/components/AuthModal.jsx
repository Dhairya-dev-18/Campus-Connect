import { useState } from 'react';
import { X, Mail, Lock, User, Hash, GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const branches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EEE'];

export default function AuthModal({ open, onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, rollNumber, branch);
      }
      onClose();
      setEmail('');
      setPassword('');
      setFullName('');
      setRollNumber('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-logo">
            <GraduationCap size={28} />
          </div>
          <h2 className="modal-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="modal-subtitle">
            {mode === 'login'
              ? 'Sign in to access your campus platform.'
              : 'Join the ABES digital campus community.'}
          </p>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === 'signup' && (
            <>
              <div className="modal-input-group">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="modal-input-row">
                <div className="modal-input-group">
                  <Hash size={18} />
                  <input
                    type="text"
                    placeholder="Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                  />
                </div>
                <div className="modal-input-group modal-select-group">
                  <GraduationCap size={18} />
                  <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="modal-input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="modal-input-group">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary modal-submit" disabled={loading}>
            {loading ? (
              <><Loader2 size={18} className="spin" /> Please wait...</>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p className="modal-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="modal-switch-btn"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
