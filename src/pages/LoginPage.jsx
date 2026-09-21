import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Hash, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const branches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EEE'];

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password, fullName, rollNumber, branch);
        setSuccess('Account created! Please check your email to verify, then sign in.');
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-decoration">
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />
      </div>

      <Link to="/" className="login-back">
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <div className="login-card">
        <div className="login-card-left">
          <div className="login-brand">
            <div className="login-brand-icon">
              <GraduationCap size={32} />
            </div>
            <div>
              <div className="login-brand-name">ABES EC</div>
              <div className="login-brand-sub">Digital Campus</div>
            </div>
          </div>

          <h1 className="login-hero-title">
            {mode === 'login' ? 'Welcome back to your campus.' : 'Join the ABES digital campus.'}
          </h1>
          <p className="login-hero-desc">
            {mode === 'login'
              ? 'Sign in to chat with students, join communities, register for events, report lost items, and access everything ABES.'
              : 'Create your account to connect with 8,000+ students, join communities, and access campus resources.'}
          </p>

          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-dot" />
              Real-time community chat with fellow students
            </div>
            <div className="login-feature">
              <div className="login-feature-dot" />
              Join communities and register for campus events
            </div>
            <div className="login-feature">
              <div className="login-feature-dot" />
              Report and track lost & found items
            </div>
          </div>
        </div>

        <div className="login-card-right">
          <div className="login-form-header">
            <h2 className="login-form-title">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="login-form-subtitle">
              {mode === 'login'
                ? 'Enter your credentials to continue.'
                : 'Fill in your details to get started.'}
            </p>
          </div>

          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {mode === 'signup' && (
              <>
                <div className="login-field">
                  <label className="login-label">Full Name</label>
                  <div className="login-input-wrap">
                    <User size={18} />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="login-field-row">
                  <div className="login-field">
                    <label className="login-label">Roll Number</label>
                    <div className="login-input-wrap">
                      <Hash size={18} />
                      <input
                        type="text"
                        placeholder="2100xx0001"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="login-field">
                    <label className="login-label">Branch</label>
                    <div className="login-input-wrap">
                      <GraduationCap size={18} />
                      <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                        {branches.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="you@abes.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
              {loading ? (
                <><Loader2 size={18} className="spin" /> Please wait...</>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="login-switch">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="login-switch-btn"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
                setSuccess('');
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
