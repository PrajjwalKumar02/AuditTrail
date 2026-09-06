function ContainersPage({ onNavigate, onLogout }) {

  const containers = [
    {
      id: "ATL-4821",
      status: "In Transit",
      location: "Singapore",
      temperature: "4.2°C",
      updated: "4 min ago"
    },
    {
      id: "MSC-2917",
      status: "At Warehouse",
      location: "Mumbai",
      temperature: "5.1°C",
      updated: "18 min ago"
    },
    {
      id: "CMA-7732",
      status: "Alert",
      location: "Dubai",
      temperature: "9.8°C",
      updated: "32 min ago"
    },
    {
      id: "MAE-1048",
      status: "Delivered",
      location: "Rotterdam",
      temperature: "3.9°C",
      updated: "1 hr ago"
    }
  ];


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
            className="nav-link"
            onClick={() => onNavigate("dashboard")}
          >
            <span>◇</span>
            Dashboard
          </button>


          <button className="nav-link active">
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
              <strong>Admin</strong>
              <span>Administrator</span>
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
                Containers
              </h1>

              <p>
                Track and monitor all shipment containers.
              </p>

            </div>

          </div>


          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Container Registry
                </h2>

                <p>
                  Live overview of tracked containers.
                </p>

              </div>

              <button className="primary-action">
                + Add Container
              </button>

            </div>


            <div className="container-search">

              <span>⌕</span>

              <input
                placeholder="Search container ID, location or status..."
              />

            </div>


            <div className="container-table">

              <div className="table-header">

                <span>CONTAINER</span>
                <span>STATUS</span>
                <span>LOCATION</span>
                <span>TEMPERATURE</span>
                <span>UPDATED</span>

              </div>


              {containers.map((container) => (

                <div
                  className="container-row"
                  key={container.id}
                >

                  <strong>
                    {container.id}
                  </strong>


                  <span
                    className={`container-status ${
                      container.status === "Alert"
                        ? "alert-status"
                        : container.status === "Delivered"
                        ? "delivered-status"
                        : ""
                    }`}
                  >
                    <i></i>
                    {container.status}
                  </span>


                  <span>
                    {container.location}
                  </span>


                  <span>
                    {container.temperature}
                  </span>


                  <span>
                    {container.updated}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ContainersPage;