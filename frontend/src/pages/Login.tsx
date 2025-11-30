import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import "./Login.css";

interface Tenant {
  id: string;
  name: string;
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(false);

  // Hardcoded tenant options as fallback
  const defaultTenants: Tenant[] = [
    { id: "Tenant A", name: "Tenant A" },
    { id: "Tenant B", name: "Tenant B" },
  ];
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [tenantError, setTenantError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
    setSuccess("");
    setEmailError("");
    setPasswordError("");
    setTenantError("");
  }, [isLogin]);

  useEffect(() => {
    // Fetch tenants when signup form is shown
    if (!isLogin) {
      loadTenants();
    }
  }, [isLogin]);

  const loadTenants = async () => {
    setLoadingTenants(true);
    setError(""); // Clear any previous errors
    try {
      const tenantsData = await authService.getTenants();
      if (tenantsData && Array.isArray(tenantsData) && tenantsData.length > 0) {
        setTenants(tenantsData);
      } else {
        setTenants(defaultTenants);
      }
    } catch (err: any) {
      setTenants(defaultTenants);
    } finally {
      setLoadingTenants(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const validateTenantId = (tenantId: string) => {
    if (!isLogin && !tenantId) {
      return "Please select a tenant";
    }
    return "";
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

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTenantId(value);
    if (tenantError) {
      setTenantError(validateTenantId(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const tenantErr = !isLogin ? validateTenantId(tenantId) : "";

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
        setSuccess("Login successful! Redirecting...");
        setError("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        await signup(email, password, tenantId);
        setSuccess("Account created successfully! Redirecting...");
        setError("");
        setLoading(false);
        // Wait a bit to show success message, then redirect
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1500);
      }
    } catch (err: any) {
      let errorMessage = "An error occurred. Please try again.";

      if (err.response) {
        // Server responded with error
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "Server error occurred";
      } else if (err.request) {
        // Request made but no response received
        errorMessage =
          "Cannot connect to server. Please make sure the backend server is running on http://localhost:3001";
      } else {
        // Error in request setup
        errorMessage = err.message || "An error occurred. Please try again.";
      }

      // Check for network errors specifically
      if (
        err.code === "ERR_NETWORK" ||
        err.message?.includes("Network Error") ||
        err.message?.includes("connect")
      ) {
        errorMessage =
          "Network Error: Cannot connect to server.\n\nPlease make sure:\n1. Backend server is running on port 3000\n2. Run: cd backend && npm run start:dev\n3. Check browser console (F12) for details";
      }

      setError(errorMessage);
      setSuccess("");
      setLoading(false);
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
          <h2 className="form-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="form-subtitle">
            {isLogin
              ? "Sign in to continue to your account"
              : "Sign up to get started"}
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
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
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setEmailError(validateEmail(email))}
                  placeholder="name@company.com"
                  className={emailError ? "input-error" : ""}
                  required
                />
              </div>
              {emailError && <span className="field-error">{emailError}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="tenantId">
                  Select Tenant
                  <span className="required-star">*</span>
                </label>
                <div
                  className={`tenant-select-wrapper ${
                    tenantError ? "select-error" : ""
                  } ${loadingTenants ? "select-loading" : ""}`}
                >
                  <select
                    id="tenantId"
                    value={tenantId}
                    onChange={handleTenantChange}
                    onBlur={() => setTenantError(validateTenantId(tenantId))}
                    className="tenant-select"
                    required
                    disabled={loadingTenants}
                  >
                    <option value="">Choose your organization</option>
                    {(tenants.length > 0 ? tenants : defaultTenants).map(
                      (tenant) => (
                        <option key={tenant.id} value={tenant.name}>
                          {tenant.name}
                        </option>
                      )
                    )}
                  </select>
                  {loadingTenants && (
                    <div className="tenant-loading-spinner">
                      <div className="spinner-small"></div>
                    </div>
                  )}
                </div>
                {loadingTenants && (
                  <span className="field-info">
                    Loading available tenants...
                  </span>
                )}
                {tenantError && (
                  <span className="field-error">{tenantError}</span>
                )}
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
                      alert("Forgot password functionality coming soon!");
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  placeholder={
                    isLogin ? "Enter your password" : "Minimum 6 characters"
                  }
                  className={passwordError ? "input-error" : ""}
                  required
                  minLength={6}
                />
              </div>
              {passwordError && (
                <span className="field-error">{passwordError}</span>
              )}
              {!isLogin && password && !passwordError && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className={`strength-fill ${
                        password.length >= 6 ? "strength-good" : ""
                      } ${password.length >= 8 ? "strength-strong" : ""}`}
                      style={{
                        width: `${Math.min(
                          (password.length / 10) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="strength-text">
                    {password.length < 6
                      ? "Weak"
                      : password.length < 8
                      ? "Good"
                      : "Strong"}
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
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                className="toggle-button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
