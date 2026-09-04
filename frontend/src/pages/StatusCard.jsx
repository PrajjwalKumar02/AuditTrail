function StatusCard({ container }) {
  return (
    <div className="card">
      <div className="card-icon">🚚</div>

      <div>
        <p className="card-label">Status</p>
        <h3>{container.status}</h3>
        <p>Container: {container.id}</p>
      </div>
    </div>
  );
}

export default StatusCard;