function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span>AT</span>
        <h2>AuditTrail</h2>
      </div>

      <div className="menu">
        <a className="active">📊 Dashboard</a>
        <a>📋 Timeline</a>
        <a>📦 Containers</a>
        <a>📍 Locations</a>
        <a>🔐 Audit</a>
        <a>⚙️ Settings</a>
      </div>

      <div className="sidebar-footer">
        <small>Event-Sourced Ledger</small>
      </div>
    </aside>
  );
}

export default Sidebar;