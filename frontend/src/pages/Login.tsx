import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [tenantError, setTenantError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
    setSuccess('');
    setEmailError('');
    setPasswordError('');
    setTenantError('');
  }, [isLogin]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateTenantId = (tenantId: string) => {
    if (!isLogin && !tenantId) {
      return 'Tenant ID is required';
    }
    if (!isLogin && tenantId.length < 3) {
      return 'Tenant ID must be at least 3 characters';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleTenantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTenantId(value);
    if (tenantError) {
      setTenantError(validateTenantId(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const tenantErr = !isLogin ? validateTenantId(tenantId) : '';

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setTenantError(tenantErr);

    if (emailErr || passwordErr || tenantErr) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setSuccess('Login successful! Redirecting...');
        setError('');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        await signup(email, password, tenantId);
        setSuccess('Account created successfully! Redirecting...');
        setError('');
        setLoading(false);
        // Wait a bit to show success message, then redirect
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred. Please try again.';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.data?.error || 'Server error occurred';
      } else if (err.request) {
        // Request made but no response received
        errorMessage = 'Cannot connect to server. Please make sure the backend server is running on http://localhost:3000';
      } else {
        // Error in request setup
        errorMessage = err.message || 'An error occurred. Please try again.';
      }
      
      // Check for network errors specifically
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || err.message?.includes('connect')) {
        errorMessage = 'Network Error: Cannot connect to server.\n\nPlease make sure:\n1. Backend server is running on port 3000\n2. Run: cd backend && npm run start:dev\n3. Check browser console (F12) for details';
      }
      
      setError(errorMessage);
      setSuccess('');
      setLoading(false);
      console.error('Auth Error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <div className="image-overlay">
          <h1 className="brand-title">Drizmo</h1>
          <p className="brand-subtitle">Welcome to your workspace</p>
        </div>
        <div className="gradient-overlay"></div>
      </div>
      <div className="login-form-section">
        <div className="form-wrapper">
          <h2 className="form-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="form-subtitle">
            {isLogin
              ? 'Sign in to continue to your account'
              : 'Sign up to get started'}
          </p>

          {error && (
            <div className="error-message">
              <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <svg className="success-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                Email Address
                <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setEmailError(validateEmail(email))}
                  placeholder="name@company.com"
                  className={emailError ? 'input-error' : ''}
                  required
                />
              </div>
              {emailError && <span className="field-error">{emailError}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="tenantId">
                  Tenant ID
                  <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
                  </svg>
                  <input
                    id="tenantId"
                    type="text"
                    value={tenantId}
                    onChange={handleTenantChange}
                    onBlur={() => setTenantError(validateTenantId(tenantId))}
                    placeholder="your-tenant-id"
                    className={tenantError ? 'input-error' : ''}
                    required
                  />
                </div>
                {tenantError && <span className="field-error">{tenantError}</span>}
              </div>
            )}

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">
                  Password
                  <span className="required-star">*</span>
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="forgot-password-button"
                    onClick={() => {
                      alert('Forgot password functionality coming soon!');
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  placeholder={isLogin ? "Enter your password" : "Minimum 6 characters"}
                  className={passwordError ? 'input-error' : ''}
                  required
                  minLength={6}
                />
              </div>
              {passwordError && <span className="field-error">{passwordError}</span>}
              {!isLogin && password && !passwordError && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill ${password.length >= 6 ? 'strength-good' : ''} ${password.length >= 8 ? 'strength-strong' : ''}`}
                      style={{ width: `${Math.min((password.length / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="strength-text">
                    {password.length < 6 ? 'Weak' : password.length < 8 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Loading...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="toggle-button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

