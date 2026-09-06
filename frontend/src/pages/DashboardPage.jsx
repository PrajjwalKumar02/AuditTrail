function DashboardPage({ onNavigate, onLogout }) {

  return (

    <div className="audit-app">

      {/* SIDEBAR */}

      <aside className="audit-sidebar">

        <div className="audit-brand">

          <div className="audit-brand-logo">
            AT
          </div>

          <div>
            <h2>AuditTrail</h2>
            <span>FORENSIC LEDGER</span>
          </div>

        </div>


        <div className="sidebar-label">
          WORKSPACE
        </div>


        <nav className="audit-nav">

          <button
            className="nav-link active"
            onClick={() => onNavigate("dashboard")}
          >
            <span>◇</span>
            Dashboard
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("containers")}
          >
            <span>▣</span>
            Containers
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("timeline")}
          >
            <span>◷</span>
            Event Timeline
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("locations")}
          >
            <span>⚑</span>
            Locations
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("analytics")}
          >
            <span>▥</span>
            Analytics
          </button>


          <div className="sidebar-label security-label">
            SECURITY
          </div>


          <button
            className="nav-link"
            onClick={() => onNavigate("audit")}
          >
            <span>◇</span>
            Audit Integrity
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("alerts")}
          >
            <span>!</span>
            Alerts
          </button>

        </nav>


        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot"></span>

            <div>
              <strong>
                System Operational
              </strong>

              <small>
                All services running
              </small>
            </div>

          </div>


          <div className="sidebar-user">

            <div className="user-avatar">
              A
            </div>

            <div className="user-info">

              <strong>
                Admin
              </strong>

              <span>
                Administrator
              </span>

            </div>


            <button
              className="logout-button"
              onClick={onLogout}
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="audit-main">

        <div className="audit-content">

          <div className="page-heading">

            <div>

              <p className="eyebrow">
                AUDITTRAIL
              </p>

              <h1>
                Dashboard
              </h1>

              <p>
                Monitor your supply chain and audit activity.
              </p>

            </div>


            <div className="dashboard-live">

              <span></span>

              LIVE SYSTEM

            </div>

          </div>


          {/* STAT CARDS */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-top">
                <span>ACTIVE CONTAINERS</span>
                <b>▣</b>
              </div>

              <strong>1,284</strong>

              <small>
                ↑ 12.4% from last month
              </small>

            </div>


            <div className="stat-card">

              <div className="stat-top">
                <span>TOTAL EVENTS</span>
                <b>◷</b>
              </div>

              <strong>48,921</strong>

              <small>
                ↑ 8.7% this week
              </small>

            </div>


            <div className="stat-card">

              <div className="stat-top">
                <span>LOCATIONS</span>
                <b>⚑</b>
              </div>

              <strong>37</strong>

              <small>
                Across 12 countries
              </small>

            </div>


            <div className="stat-card">

              <div className="stat-top">
                <span>ALERTS</span>
                <b>!</b>
              </div>

              <strong>06</strong>

              <small>
                Requires attention
              </small>

            </div>

          </div>


          {/* CONTENT GRID */}

          <div className="dashboard-grid">

            <div className="panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Recent Activity
                  </h2>

                  <p>
                    Latest events recorded in the ledger.
                  </p>

                </div>

                <button
                  className="panel-action"
                  onClick={() => onNavigate("timeline")}
                >
                  View all →
                </button>

              </div>


              <div className="activity-list">

                <div className="activity-item">

                  <div className="activity-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Container ATL-4821 arrived
                    </strong>

                    <span>
                      Port of Singapore · 4 min ago
                    </span>
                  </div>

                  <small>
                    VERIFIED
                  </small>

                </div>


                <div className="activity-item">

                  <div className="activity-icon">
                    ↗
                  </div>

                  <div>
                    <strong>
                      Container MSC-2917 moved
                    </strong>

                    <span>
                      Mumbai Warehouse · 18 min ago
                    </span>
                  </div>

                  <small>
                    RECORDED
                  </small>

                </div>


                <div className="activity-item">

                  <div className="activity-icon warning">
                    !
                  </div>

                  <div>
                    <strong>
                      Temperature spike detected
                    </strong>

                    <span>
                      Container CMA-7732 · 32 min ago
                    </span>
                  </div>

                  <small className="warning-text">
                    WARNING
                  </small>

                </div>

              </div>

            </div>


            <div className="panel">

              <div className="panel-header">

                <div>

                  <h2>
                    System Integrity
                  </h2>

                  <p>
                    Current ledger verification status.
                  </p>

                </div>

              </div>


              <div className="integrity-content">

                <div className="integrity-circle">
                  <span>✓</span>
                </div>

                <h3>
                  Ledger Verified
                </h3>

                <p>
                  All recent events have passed
                  integrity verification.
                </p>

                <div className="integrity-row">

                  <span>
                    Last verification
                  </span>

                  <strong>
                    2 minutes ago
                  </strong>

                </div>

                <div className="integrity-row">

                  <span>
                    Events checked
                  </span>

                  <strong>
                    48,921
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="panel quick-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Quick Access
                </h2>

                <p>
                  Navigate to frequently used modules.
                </p>

              </div>

            </div>


            <div className="quick-actions">

              <button
                onClick={() => onNavigate("containers")}
              >
                <span>▣</span>
                <div>
                  <strong>Containers</strong>
                  <small>
                    Track shipments
                  </small>
                </div>
                →
              </button>


              <button
                onClick={() => onNavigate("timeline")}
              >
                <span>◷</span>
                <div>
                  <strong>Event Timeline</strong>
                  <small>
                    View event history
                  </small>
                </div>
                →
              </button>


              <button
                onClick={() => onNavigate("analytics")}
              >
                <span>▥</span>
                <div>
                  <strong>Analytics</strong>
                  <small>
                    View performance
                  </small>
                </div>
                →
              </button>


              <button
                onClick={() => onNavigate("alerts")}
              >
                <span>!</span>
                <div>
                  <strong>Alerts</strong>
                  <small>
                    Review warnings
                  </small>
                </div>
                →
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default DashboardPage;