function ContainerCard({ container }) {
  return (
    <div className="card">
      <div className="card-icon">📦</div>

      <div>
        <p className="card-label">Container</p>
        <h3>{container.id}</h3>
        <p>Shipment: {container.shipment}</p>
      </div>
    </div>
  );
}

export default ContainerCard;