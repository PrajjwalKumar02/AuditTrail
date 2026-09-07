import React, { useState } from "react";

function ContainersPage({ onNavigate, onLogout }) {

  const [containers, setContainers] = useState([
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
  ]);

  // Search
  const [search, setSearch] = useState("");

  // Add Container Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // New Container Form
  const [newContainer, setNewContainer] = useState({
    id: "",
    status: "In Transit",
    location: "",
    temperature: ""
  });

  // Filter containers
  const filteredContainers = containers.filter((container) =>
    container.id.toLowerCase().includes(search.toLowerCase()) ||
    container.status.toLowerCase().includes(search.toLowerCase()) ||
    container.location.toLowerCase().includes(search.toLowerCase())
  );

  // Add new container
  const handleAddContainer = () => {

    if (
      !newContainer.id.trim() ||
      !newContainer.location.trim() ||
      !newContainer.temperature.trim()
    ) {
      alert("Please fill all container details.");
      return;
    }

    const alreadyExists = containers.some(
      (container) =>
        container.id.toLowerCase() === newContainer.id.toLowerCase()
    );

    if (alreadyExists) {
      alert("Container ID already exists.");
      return;
    }

    const containerToAdd = {
      id: newContainer.id.toUpperCase(),
      status: newContainer.status,
      location: newContainer.location,
      temperature: newContainer.temperature,
      updated: "Just now"
    };

    setContainers([containerToAdd, ...containers]);

    setNewContainer({
      id: "",
      status: "In Transit",
      location: "",
      temperature: ""
    });

    setShowAddModal(false);
  };

  return (
    <div className="audit-app">

      {/* ================= SIDEBAR ================= */}

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


      {/* ================= MAIN ================= */}

      <main className="audit-main">

        <div className="audit-content">

          {/* PAGE HEADING */}

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


          {/* ================= CONTAINER REGISTRY ================= */}

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


              {/* ADD CONTAINER BUTTON */}

              <button
                className="primary-action"
                onClick={() => setShowAddModal(true)}
              >
                + Add Container
              </button>

            </div>


            {/* ================= SEARCH ================= */}

            <div className="container-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search container ID, location or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>


            {/* ================= TABLE ================= */}

            <div className="container-table">

              <div className="table-header">

                <span>CONTAINER</span>
                <span>STATUS</span>
                <span>LOCATION</span>
                <span>TEMPERATURE</span>
                <span>UPDATED</span>

              </div>


              {filteredContainers.length > 0 ? (

                filteredContainers.map((container) => (

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

                ))

              ) : (

                <div className="empty-container">
                  No containers found.
                </div>

              )}

            </div>

          </div>

        </div>

      </main>


      {/* =====================================================
          ADD CONTAINER MODAL
          ===================================================== */}

      {showAddModal && (

        <div
          className="add-container-overlay"
          onClick={(e) => {

            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }

          }}
        >

          <div className="add-container-modal">


            {/* MODAL HEADER */}

            <div className="add-modal-header">

              <div>

                <p className="modal-eyebrow">
                  AUDITTRAIL
                </p>

                <h2>
                  Add Container
                </h2>

                <p>
                  Register a new shipment container.
                </p>

              </div>


              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="add-container-form">


              {/* CONTAINER ID */}

              <div className="form-field">

                <label>
                  CONTAINER ID
                </label>

                <input
                  type="text"
                  placeholder="e.g. ATL-5821"
                  value={newContainer.id}
                  onChange={(e) =>
                    setNewContainer({
                      ...newContainer,
                      id: e.target.value
                    })
                  }
                />

              </div>


              {/* LOCATION */}

              <div className="form-field">

                <label>
                  LOCATION
                </label>

                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={newContainer.location}
                  onChange={(e) =>
                    setNewContainer({
                      ...newContainer,
                      location: e.target.value
                    })
                  }
                />

              </div>


              {/* TWO COLUMNS */}

              <div className="form-row">


                {/* STATUS */}

                <div className="form-field">

                  <label>
                    STATUS
                  </label>

                  <select
                    value={newContainer.status}
                    onChange={(e) =>
                      setNewContainer({
                        ...newContainer,
                        status: e.target.value
                      })
                    }
                  >

                    <option>
                      In Transit
                    </option>

                    <option>
                      At Warehouse
                    </option>

                    <option>
                      Delivered
                    </option>

                    <option>
                      Alert
                    </option>

                  </select>

                </div>


                {/* TEMPERATURE */}

                <div className="form-field">

                  <label>
                    TEMPERATURE
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. 5.2°C"
                    value={newContainer.temperature}
                    onChange={(e) =>
                      setNewContainer({
                        ...newContainer,
                        temperature: e.target.value
                      })
                    }
                  />

                </div>

              </div>

            </div>


            {/* MODAL BUTTONS */}

            <div className="modal-actions">

              <button
                className="modal-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>


              <button
                className="modal-add"
                onClick={handleAddContainer}
              >
                Add Container
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ContainersPage;