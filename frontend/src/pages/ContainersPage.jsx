import React, { useState } from "react";

function ContainersPage({ onNavigate, onLogout }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  const [containers, setContainers] = useState([
    {
      id: "ATL-4821",
      shipment: "SHIP-10482",
      location: "Singapore",
      status: "In Transit",
      temperature: "4.2°C",
      lastUpdated: "4 min ago",
      integrity: "Verified",
    },
    {
      id: "MSC-2917",
      shipment: "SHIP-20891",
      location: "Mumbai",
      status: "At Warehouse",
      temperature: "5.1°C",
      lastUpdated: "18 min ago",
      integrity: "Verified",
    },
    {
      id: "CMA-7732",
      shipment: "SHIP-31942",
      location: "Dubai",
      status: "Alert",
      temperature: "9.8°C",
      lastUpdated: "32 min ago",
      integrity: "Review Required",
    },
    {
      id: "MAE-1048",
      shipment: "SHIP-42107",
      location: "Rotterdam",
      status: "Delivered",
      temperature: "3.9°C",
      lastUpdated: "1 hr ago",
      integrity: "Verified",
    },
  ]);

  const [newContainer, setNewContainer] = useState({
    id: "",
    location: "",
    status: "In Transit",
    temperature: "",
  });

  const filteredContainers = containers.filter((container) =>
    `${container.id} ${container.shipment} ${container.location} ${container.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAddContainer = () => {
    if (
      !newContainer.id ||
      !newContainer.location ||
      !newContainer.temperature
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const exists = containers.some(
      (container) =>
        container.id.toLowerCase() === newContainer.id.toLowerCase()
    );

    if (exists) {
      alert("Container ID already exists.");
      return;
    }

    const container = {
      id: newContainer.id.toUpperCase(),
      shipment: `SHIP-${Math.floor(10000 + Math.random() * 90000)}`,
      location: newContainer.location,
      status: newContainer.status,
      temperature: `${newContainer.temperature}°C`,
      lastUpdated: "Just now",
      integrity: "Verified",
    };

    setContainers([container, ...containers]);

    setNewContainer({
      id: "",
      location: "",
      status: "In Transit",
      temperature: "",
    });

    setShowModal(false);
  };

  const getStatusClass = (status) => {
    if (status === "Alert") return "status-alert";
    if (status === "Delivered") return "status-delivered";
    if (status === "At Warehouse") return "status-warehouse";
    return "status-transit";
  };

  const openDetails = (container) => {
    setSelectedContainer(container);
  };

  const closeDetails = () => {
    setSelectedContainer(null);
  };

  return (
    <div className="audit-app">

      {/* SIDEBAR */}
      <aside className="audit-sidebar">
        <div className="audit-brand">
          <div className="audit-brand-logo">AT</div>

          <div>
            <h2>AuditTrail</h2>
            <span>FORENSIC LEDGER</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

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
              <strong>System Operational</strong>
              <small>All services running</small>
            </div>
          </div>

          <div className="sidebar-user">

            <div className="user-avatar">A</div>

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

          {/* HEADER */}
          <div className="page-heading">

            <div>
              <p className="eyebrow">AUDITTRAIL</p>

              <h1>Containers</h1>

              <p>
                Monitor and manage tracked shipment containers.
              </p>
            </div>

            <button
              className="add-container-button"
              onClick={() => setShowModal(true)}
            >
              + Add Container
            </button>

          </div>

          {/* SEARCH */}
          <div className="container-search-section">

            <div className="container-search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search containers, shipments or locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="container-count">
              {filteredContainers.length} containers
            </div>

          </div>

          {/* TABLE */}
          <div className="panel containers-panel">

            <div className="containers-table-header">

              <span>CONTAINER</span>
              <span>LOCATION</span>
              <span>STATUS</span>
              <span>TEMPERATURE</span>
              <span>UPDATED</span>
              <span></span>

            </div>

            {filteredContainers.length === 0 ? (

              <div className="containers-empty">
                <div>⌕</div>
                <h3>No containers found</h3>
                <p>
                  Try searching with another container ID,
                  shipment or location.
                </p>
              </div>

            ) : (

              filteredContainers.map((container) => (

                <div
                  className="container-row"
                  key={container.id}
                  onClick={() => openDetails(container)}
                >

                  <div className="container-main-info">

                    <div className="container-icon">
                      📦
                    </div>

                    <div>
                      <strong>{container.id}</strong>

                      <small>
                        {container.shipment}
                      </small>
                    </div>

                  </div>

                  <div className="container-location">
                    📍 {container.location}
                  </div>

                  <div>
                    <span
                      className={`container-status ${getStatusClass(
                        container.status
                      )}`}
                    >
                      {container.status}
                    </span>
                  </div>

                  <div className="container-temperature">
                    {container.temperature}
                  </div>

                  <div className="container-updated">
                    {container.lastUpdated}
                  </div>

                  <button
                    className="container-view-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(container);
                    }}
                  >
                    View →
                  </button>

                </div>

              ))

            )}

          </div>

        </div>

      </main>

      {/* ADD CONTAINER MODAL */}
      {showModal && (

        <div
          className="container-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="container-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="container-modal-header">

              <div>
                <span>NEW RECORD</span>
                <h2>Add Container</h2>
                <p>Create a new tracked shipment container.</p>
              </div>

              <button
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>

            <div className="container-form">

              <label>
                Container ID
                <input
                  placeholder="e.g. MSC-4832"
                  value={newContainer.id}
                  onChange={(e) =>
                    setNewContainer({
                      ...newContainer,
                      id: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Location
                <input
                  placeholder="e.g. Mumbai Port"
                  value={newContainer.location}
                  onChange={(e) =>
                    setNewContainer({
                      ...newContainer,
                      location: e.target.value,
                    })
                  }
                />
              </label>

              <div className="container-form-row">

                <label>
                  Status
                  <select
                    value={newContainer.status}
                    onChange={(e) =>
                      setNewContainer({
                        ...newContainer,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>In Transit</option>
                    <option>At Warehouse</option>
                    <option>Delivered</option>
                    <option>Alert</option>
                  </select>
                </label>

                <label>
                  Temperature °C
                  <input
                    type="number"
                    step="0.1"
                    placeholder="5.2"
                    value={newContainer.temperature}
                    onChange={(e) =>
                      setNewContainer({
                        ...newContainer,
                        temperature: e.target.value,
                      })
                    }
                  />
                </label>

              </div>

              <button
                className="container-create-button"
                onClick={handleAddContainer}
              >
                Create Container
              </button>

            </div>

          </div>

        </div>

      )}

      {/* CONTAINER DETAILS MODAL */}
      {selectedContainer && (

        <div
          className="container-details-overlay"
          onClick={closeDetails}
        >

          <div
            className="container-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="container-details-header">

              <div>

                <div className="container-details-id">
                  <span>CONTAINER RECORD</span>

                  <span
                    className={`container-status ${getStatusClass(
                      selectedContainer.status
                    )}`}
                  >
                    {selectedContainer.status}
                  </span>
                </div>

                <h2>{selectedContainer.id}</h2>

                <p>
                  Shipment {selectedContainer.shipment}
                </p>

              </div>

              <button onClick={closeDetails}>
                ×
              </button>

            </div>

            {/* DETAILS GRID */}
            <div className="container-details-grid">

              <div className="container-detail-card">
                <span>LOCATION</span>
                <strong>
                  📍 {selectedContainer.location}
                </strong>
              </div>

              <div className="container-detail-card">
                <span>TEMPERATURE</span>
                <strong>
                  {selectedContainer.temperature}
                </strong>
              </div>

              <div className="container-detail-card">
                <span>LAST UPDATED</span>
                <strong>
                  {selectedContainer.lastUpdated}
                </strong>
              </div>

              <div className="container-detail-card">
                <span>INTEGRITY</span>
                <strong className="integrity-verified">
                  ✓ {selectedContainer.integrity}
                </strong>
              </div>

            </div>

            {/* EVENT HISTORY */}
            <div className="container-event-history">

              <div className="container-section-heading">
                <div>
                  <span>FORENSIC HISTORY</span>
                  <h3>Recent Events</h3>
                </div>

                <span className="history-live">
                  ● LIVE
                </span>
              </div>

              <div className="container-history-item">

                <div className="history-marker"></div>

                <div>
                  <strong>Container location verified</strong>
                  <p>
                    Location integrity check completed
                  </p>
                </div>

                <span>2 min ago</span>

              </div>

              <div className="container-history-item">

                <div className="history-marker"></div>

                <div>
                  <strong>Temperature recorded</strong>
                  <p>
                    Sensor data successfully synchronized
                  </p>
                </div>

                <span>8 min ago</span>

              </div>

              <div className="container-history-item">

                <div className="history-marker"></div>

                <div>
                  <strong>Shipment status updated</strong>
                  <p>
                    Latest shipment state recorded
                  </p>
                </div>

                <span>14 min ago</span>

              </div>

            </div>

            {/* FOOTER */}
            <div className="container-details-footer">

              <div>
                <span>LEDGER STATUS</span>
                <strong>✓ Record verified</strong>
              </div>

              <button onClick={closeDetails}>
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ContainersPage;