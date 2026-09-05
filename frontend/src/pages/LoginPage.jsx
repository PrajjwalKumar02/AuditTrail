import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    /*
      Temporary frontend authentication.
      Replace this with backend authentication when API is connected.
    */

    localStorage.setItem("audittrail_logged_in", "true");

    if (remember) {
      localStorage.setItem("audittrail_remember", "true");
    }

    onLogin();
  };

  return (
    <div className="auth-page">

      {/* BACKGROUND */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>
      <div className="auth-grid"></div>

      {/* TOP BRAND */}
      <header className="auth-topbar">

        <div className="auth-brand">
          <div className="auth-brand-icon">
            A
          </div>

          <div>
            <strong>AuditTrail</strong>
            <span>Forensic Ledger</span>
          </div>
        </div>

        <div className="auth-secure">
          <span></span>
          Secure Environment
        </div>

      </header>

      {/* MAIN */}
      <main className="auth-main">

        {/* LEFT */}
        <section className="auth-intro">

          <div className="auth-eyebrow">
            <span></span>
            FORENSIC AUDIT PLATFORM
          </div>

          <h1>
            Track every event.
            <br />
            <span>Trust every record.</span>
          </h1>

          <p>
            Monitor container activity, trace shipment events,
            and verify the integrity of your forensic ledger
            from one secure dashboard.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <div>✓</div>
              <span>
                Immutable audit records
              </span>
            </div>

            <div className="auth-feature">
              <div>⌖</div>
              <span>
                Real-time container tracking
              </span>
            </div>

            <div className="auth-feature">
              <div>◈</div>
              <span>
                Cryptographic integrity verification
              </span>
            </div>

          </div>

        </section>

        {/* LOGIN CARD */}
        <section className="auth-card">

          <div className="auth-card-header">

            <div className="auth-card-icon">
              {mode === "login" ? "↗" : "+"}
            </div>

            <h2>
              {mode === "login"
                ? "Welcome back"
                : "Create account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to your AuditTrail workspace"
                : "Create your secure AuditTrail account"}
            </p>

          </div>

          {/* SWITCH */}
          <div className="auth-switch">

            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Sign In
            </button>

            <button
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              Create Account
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            {mode === "signup" && (
              <div className="auth-field">

                <label>Full Name</label>

                <div className="auth-input-wrap">
                  <span>◉</span>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />
                </div>

              </div>
            )}

            <div className="auth-field">

              <label>Email Address</label>

              <div className="auth-input-wrap">
                <span>@</span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

            </div>

            <div className="auth-field">

              <div className="auth-label-row">
                <label>Password</label>

                {mode === "login" && (
                  <button
                    type="button"
                    className="auth-forgot"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="auth-input-wrap">

                <span>◆</span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="auth-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "◉" : "◎"}
                </button>

              </div>

            </div>

            {mode === "login" && (
              <label className="auth-remember">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(e.target.checked)
                  }
                />

                <span>Remember me</span>

              </label>
            )}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
            >
              {mode === "login"
                ? "Sign In"
                : "Create Account"}

              <span>→</span>
            </button>

          </form>

          <div className="auth-security">

            <span>◈</span>

            <div>
              <strong>Protected workspace</strong>
              <small>
                Your audit data is secured with
                integrity verification.
              </small>
            </div>

          </div>

        </section>

      </main>

      <footer className="auth-footer">
        <span>© 2026 AuditTrail</span>
        <span>Secure Forensic Ledger Platform</span>
      </footer>

    </div>
  );
}