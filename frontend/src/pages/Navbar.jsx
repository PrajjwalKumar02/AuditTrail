function Navbar() {
  return (
    <nav className="navbar">
      <div>
        <h2>AuditTrail</h2>
      </div>

      <div className="navbar-right">
        <span>🔔</span>
        <div className="user">
          <div className="avatar">A</div>
          <span>Admin</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;