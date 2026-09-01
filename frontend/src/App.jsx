import "./App.css";

const events = [
  {
    version: "v4",
    type: "ARRIVED_AT_PORT",
    location: "Mumbai Port",
    time: "Today, 10:42 AM",
    severity: "Normal",
  },
  {
    version: "v3",
    type: "TEMPERATURE_SPIKE",
    location: "Arabian Sea",
    time: "Today, 08:16 AM",
    severity: "Critical",
  },
  {
    version: "v2",
    type: "LOADED_ON_SHIP",
    location: "Warehouse A",
    time: "Yesterday, 06:30 PM",
    severity: "Normal",
  },
  {
    version: "v1",
    type: "CONTAINER_CREATED",
    location: "Warehouse A",
    time: "Yesterday, 04:12 PM",
    severity: "Normal",
  },
];

function App() {
  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div>
            <h2>AuditTrail</h2>
            <span>Forensic Ledger</span>
          </div>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">MAIN</div>

          <div className="nav-item active">
            <span>⌂</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>▣</span>
            Containers
          </div>

          <div className="nav-item">
            <span>◷</span>
            Event Timeline
          </div>

          <div className="nav-item">
            <span>⌖</span>
            Locations
          </div>

          <div className="nav-section">MONITORING</div>

          <div className="nav-item">
            <span>◉</span>
            Alerts
            <b className="notification">3</b>
          </div>

          <div className="nav-item">
            <span>▤</span>
            Analytics
          </div>

          <div className="nav-item">
            <span>✓</span>
            Audit Integrity
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            <div>
              <strong>System Online</strong>
              <small>All services operational</small>
            </div>
          </div>

          <div className="user-box">
            <div className="avatar">AK</div>
            <div>
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>
            <span>⋮</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">
          <div>
            <div className="breadcrumb">Dashboard / Overview</div>
            <h1>Forensic Dashboard</h1>
          </div>

          <div className="top-actions">
            <button className="icon-button">⌕</button>
            <button className="icon-button">🔔</button>
            <div className="top-avatar">AK</div>
          </div>
        </header>

        {/* SEARCH */}
        <section className="search-section">
          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search container ID, event type or location..."
            />
            <button>Search</button>
          </div>
        </section>

        {/* WELCOME */}
        <section className="welcome">
          <div>
            <h2>Good evening, Akansha 👋</h2>
            <p>
              Monitor your logistics ledger and investigate container activity.
            </p>
          </div>

          <button className="filter-button">
            ⚙ Filters
          </button>
        </section>

        {/* STATS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Containers</span>
              <div className="stat-icon blue">▣</div>
            </div>
            <h3>248</h3>
            <p className="positive">↑ 12.5% <span>vs last week</span></p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Active Shipments</span>
              <div className="stat-icon purple">↗</div>
            </div>
            <h3>86</h3>
            <p className="positive">↑ 8.2% <span>vs last week</span></p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Active Alerts</span>
              <div className="stat-icon red">!</div>
            </div>
            <h3>3</h3>
            <p className="negative">↑ 2 new <span>requires attention</span></p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Audit Integrity</span>
              <div className="stat-icon green">✓</div>
            </div>
            <h3>100%</h3>
            <p className="positive">✓ Verified <span>hash chain valid</span></p>
          </div>

        </section>

        {/* CONTENT GRID */}
        <section className="dashboard-grid">

          {/* CONTAINER */}
          <div className="panel container-panel">
            <div className="panel-header">
              <div>
                <h3>Container Overview</h3>
                <p>Current reconstructed state</p>
              </div>

              <span className="verified-badge">
                ✓ VERIFIED
              </span>
            </div>

            <div className="container-id">
              <div className="container-symbol">▣</div>
              <div>
                <strong>MSCU-2026-00124</strong>
                <span>Refrigerated Container</span>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail">
                <span>Current Status</span>
                <strong className="status-active">
                  ● In Transit
                </strong>
              </div>

              <div className="detail">
                <span>Location</span>
                <strong>Mumbai Port</strong>
              </div>

              <div className="detail">
                <span>Temperature</span>
                <strong>4.2°C</strong>
              </div>

              <div className="detail">
                <span>Version</span>
                <strong>v4</strong>
              </div>
            </div>

            <div className="progress-area">
              <div className="progress-header">
                <span>Shipment Progress</span>
                <strong>78%</strong>
              </div>

              <div className="progress">
                <div className="progress-fill"></div>
              </div>

              <div className="route">
                <span>Warehouse A</span>
                <span>Mumbai Port</span>
              </div>
            </div>
          </div>

          {/* INTEGRITY */}
          <div className="panel integrity-panel">
            <div className="panel-header">
              <div>
                <h3>Audit Integrity</h3>
                <p>Cryptographic verification</p>
              </div>
              <span className="shield">✓</span>
            </div>

            <div className="integrity-score">
              <div className="score-circle">
                <strong>100%</strong>
                <span>Valid</span>
              </div>
            </div>

            <div className="integrity-row">
              <span>Hash Chain</span>
              <strong>✓ Valid</strong>
            </div>

            <div className="integrity-row">
              <span>Events Verified</span>
              <strong>1,284</strong>
            </div>

            <div className="integrity-row">
              <span>Tampering Detected</span>
              <strong>0</strong>
            </div>
          </div>

        </section>

        {/* TIMELINE */}
        <section className="panel timeline-panel">

          <div className="panel-header">
            <div>
              <h3>Forensic Event Timeline</h3>
              <p>Immutable chronological event history</p>
            </div>

            <button className="view-button">
              View all events →
            </button>
          </div>

          <div className="timeline">

            {events.map((event, index) => (
              <div className="timeline-item" key={event.version}>

                <div className="timeline-line">
                  <div
                    className={`timeline-dot ${
                      event.severity === "Critical"
                        ? "critical"
                        : ""
                    }`}
                  ></div>

                  {index !== events.length - 1 && (
                    <div className="line"></div>
                  )}
                </div>

                <div className="event-content">
                  <div className="event-main">
                    <div>
                      <span className="version">
                        {event.version}
                      </span>

                      <strong>{event.type}</strong>
                    </div>

                    {event.severity === "Critical" ? (
                      <span className="critical-badge">
                        CRITICAL
                      </span>
                    ) : (
                      <span className="normal-badge">
                        NORMAL
                      </span>
                    )}
                  </div>

                  <div className="event-meta">
                    <span>⌖ {event.location}</span>
                    <span>◷ {event.time}</span>
                  </div>
                </div>

              </div>
            ))}

          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <span>AuditTrail v1.0</span>
          <span>Last synchronized: Just now</span>
          <span>Event Store ● Connected</span>
        </footer>

      </main>
    </div>
  );
}

export default App;