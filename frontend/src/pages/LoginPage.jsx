import { useState } from "react";

function LoginPage({ onLogin }) {

  const [mode, setMode] = useState("signin");

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = (e) => {

    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email and password.");
      return;
    }

    /*
      Frontend authentication for now.
      Backend API can be connected later.
    */

    onLogin();
  };


  return (

    <div className="login-page">

      {/* BACKGROUND EFFECTS */}

      <div className="login-orb orb-one"></div>
      <div className="login-orb orb-two"></div>
      <div className="login-orb orb-three"></div>


      {/* GRID */}

      <div className="login-grid"></div>


      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-intro">

          <div className="login-logo">
            AT
          </div>

          <p className="login-eyebrow">
            AUDITTRAIL SYSTEM
          </p>

          <h1>
            Secure your
            <br />
            <span>digital ledger.</span>
          </h1>

          <p className="login-description">
            A forensic audit platform designed to
            track, verify and protect every event
            across your supply chain.
          </p>


          <div className="security-features">

            <div className="security-feature">

              <div className="feature-icon">
                ◈
              </div>

              <div>
                <strong>Immutable Records</strong>
                <span>
                  Every event is permanently traceable.
                </span>
              </div>

            </div>


            <div className="security-feature">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>Verified Integrity</strong>
                <span>
                  Protect your audit history.
                </span>
              </div>

            </div>


            <div className="security-feature">

              <div className="feature-icon">
                ⚡
              </div>

              <div>
                <strong>Real-time Monitoring</strong>
                <span>
                  Track operations as they happen.
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* LOGIN CARD */}

        <div className="login-card">

          <div className="login-card-top">

            <div>

              <p className="card-eyebrow">
                {mode === "signin"
                  ? "WELCOME BACK"
                  : "GET STARTED"}
              </p>

              <h2>
                {mode === "signin"
                  ? "Sign in"
                  : "Create account"}
              </h2>

              <p>
                {mode === "signin"
                  ? "Access your AuditTrail workspace."
                  : "Create your secure AuditTrail account."}
              </p>

            </div>

            <div className="secure-badge">
              🔒 Secure
            </div>

          </div>


          {/* SWITCH */}

          <div className="login-switch">

            <button
              className={mode === "signin" ? "selected" : ""}
              onClick={() => setMode("signin")}
              type="button"
            >
              Sign In
            </button>

            <button
              className={mode === "signup" ? "selected" : ""}
              onClick={() => setMode("signup")}
              type="button"
            >
              Create Account
            </button>

          </div>


          <form onSubmit={handleSubmit}>

            {mode === "signup" && (

              <div className="input-group">

                <label>FULL NAME</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>

            )}


            <div className="input-group">

              <label>EMAIL ADDRESS</label>

              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
              />

            </div>


            <div className="input-group">

              <label>PASSWORD</label>

              <div className="password-input">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>


            {mode === "signin" && (

              <div className="login-options">

                <label className="remember">

                  <input type="checkbox" />

                  <span>
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>

              </div>

            )}


            <button
              className="login-submit"
              type="submit"
            >

              <span>
                {mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
              </span>

              <span>→</span>

            </button>

          </form>


          <div className="login-footer">

            <span className="footer-line"></span>

            <span>
              Protected by AuditTrail Security
            </span>

            <span className="footer-line"></span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;