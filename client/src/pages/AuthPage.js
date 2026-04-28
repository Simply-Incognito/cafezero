import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // login, signup, forgot
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login, signup } = useAuth();
  
  // Form States
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  // Check for Google Login redirect flags
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "success") {
      showToast("Google login successful! Welcome back.");
      navigate("/", { replace: true });
    } else if (params.get("error")) {
      showToast("Google authentication failed. Please try again.", "error");
      navigate("/auth", { replace: true });
    }
  }, [location, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await login(email, password);
        showToast(data.message || "Login successful!");
        setTimeout(() => navigate("/"), 1500);
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          showToast("Passwords do not match!", "error");
          setLoading(false);
          return;
        }
        const data = await signup({ firstname, lastname, email, password, confirmPassword });
        showToast(data.message || "Account created successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else if (mode === "forgot") {
        const res = await api.post("/auth/forgot-password", { email });
        showToast(res.data.message || "Reset link sent to your email!");
        setMode("login");
      }
    } catch (err) {
      showToast(err || "Authentication failed.", "error");
    }
    setLoading(false);
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:8080/api/v1/auth/google";
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create an Account" : "Reset Password"}
        </h2>
        <p className="auth-subtitle">
          {mode === "login" 
            ? "Enter your credentials to access your account." 
            : mode === "signup" 
            ? "Sign up to start ordering your favorite coffee."
            : "Enter your email to receive a password reset link."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          
          {mode === "signup" && (
            <div className="input-group-row">
              <div className="input-wrapper">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="input-wrapper">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-wrapper">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== "forgot" && (
            <div className="input-wrapper">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {mode === "login" && (
            <div className="form-helper">
              <span className="forgot-password-link" onClick={() => setMode("forgot")}>
                Forgot password?
              </span>
            </div>
          )}

          {mode === "signup" && (
            <div className="input-wrapper">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Processing..." : mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"}
          </button>
        </form>

        {mode !== "forgot" && (
          <>
            <div className="divider">
              <span>OR</span>
            </div>

            <button type="button" className="google-btn" onClick={handleGoogleAuth}>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <p className="toggle-text">
          {mode === "login" ? "Don't have an account? " : mode === "signup" ? "Already have an account? " : "Remember your password? "}
          <span className="toggle-link" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Sign Up" : mode === "signup" ? "Log In" : "Back to Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
