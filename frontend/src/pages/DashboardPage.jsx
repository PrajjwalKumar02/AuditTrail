import { useState } from "react";
import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import SearchBar from "../components/dashboard/SearchBar";
import ContainerCard from "../components/dashboard/ContainerCard";
import StatusCard from "../components/dashboard/StatusCard";
import LocationCard from "../components/dashboard/LocationCard";
import EventTimeline from "../components/timeline/EventTimeline";

function DashboardPage() {
  const [selectedContainer, setSelectedContainer] = useState("CONT-001");

  const container = {
    id: selectedContainer,
    status: "In Transit",
    location: "Mumbai Port",
    temperature: "8.4°C",
    shipment: "MSC-001",
    lastUpdated: "2 minutes ago",
  };

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="dashboard">
          <div className="dashboard-header">
            <div>
              <h1>Forensic Dashboard</h1>
              <p>Audit and monitor your logistics events</p>
            </div>

            <div className="integrity-badge">
              ✓ Audit Integrity Verified
            </div>
          </div>

          <SearchBar
            value={selectedContainer}
            onChange={setSelectedContainer}
          />

          <div className="cards-grid">
            <ContainerCard container={container} />
            <StatusCard status={container.status} />
            <LocationCard location={container.location} />
          </div>

          <section className="timeline-section">
            <div className="section-title">
              <div>
                <h2>Event Timeline</h2>
                <p>Chronological history of container events</p>
              </div>
            </div>

            <EventTimeline />
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;