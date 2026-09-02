export default function SensorStats({ data = [] }) {
  if (!data.length) return <div className="empty-state">No sensor statistics available.</div>;
  const temperatures = data.map((item) => Number(item.temperature));
  const current = temperatures.at(-1);
  return (
    <div className="sensor-stats">
      <h2>Sensor Statistics</h2>
      <div className="stats-grid">
        {[
          ["Current", `${current.toFixed(1)}°C`],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></div>
        ))}
      </div>
    </div>
  );
}
