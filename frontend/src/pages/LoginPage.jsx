import { useState } from "react";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (
      email === "admin@audittrail.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("audittrail_logged_in", "true");
      onLogin();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT BRAND PANEL */}
      <div className="login-brand">

        <div className="brand-logo">
          AT
        </div>

        <h1>AuditTrail</h1>

        <p className="brand-tagline">
          Forensic Ledger & Logistics Intelligence
        </p>

        <div className="brand-visual">
          <div className="visual-card">
            <span className="visual-icon">📦</span>
            <div>
              <strong>CONT-001</strong>
              <small>Shipment verified</small>
            </div>
            <span className="verified">✓</span>
          </div>

          <div className="visual-line"></div>

          <div className="visual-card">
            <span className="visual-icon">📍</span>
            <div>
              <strong>Mumbai Port</strong>
              <small>Current location</small>
            </div>
            <span className="live">LIVE</span>
          </div>

          <div className="visual-line"></div>

          <div className="visual-card">
            <span className="visual-icon">🔐</span>
            <div>
              <strong>Audit Integrity</strong>
              <small>Blockchain verified</small>
            </div>
            <span className="verified">✓</span>
          </div>
        </div>

        <div className="brand-footer">
          Secure • Traceable • Verifiable
        </div>

      </div>


      {/* RIGHT LOGIN PANEL */}
      <div className="login-form-area">

        <div className="login-card">

          <div className="mobile-logo">
            AT
          </div>

          <div className="login-heading">
            <h2>Welcome back 👋</h2>
            <p>
              Sign in to your AuditTrail dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <span>✉</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>


            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span>🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>


            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <div className="login-options">
              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  alert("Password recovery will be connected to backend.")
                }
              >
                Forgot password?
              </button>
            </div>


            <button
              type="submit"
              className="signin-button"
            >
              Sign in
              <span>→</span>
            </button>

          </form>


          <div className="demo-login">
            <div className="demo-title">
              Demo account
            </div>

            <div>
              <span>Email</span>
              <strong>admin@audittrail.com</strong>
            </div>

            <div>
              <span>Password</span>
              <strong>admin123</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;