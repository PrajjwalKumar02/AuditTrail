export default function SensorStats({ data = [] }) {
  if (!data.length) return <div className="empty-state">No sensor statistics available.</div>;
  const temperatures = data.map((item) => Number(item.temperature));
  const current = temperatures.at(-1);
  const minimum = Math.min(...temperatures);
  const maximum = Math.max(...temperatures);
  const average = temperatures.reduce((sum, value) => sum + value, 0) / temperatures.length;
  const anomalies = temperatures.filter((temperature) => temperature > 10).length;
  
  return (
    <div className="sensor-stats">
      <h2>Sensor Statistics</h2>
      <div className="stats-grid">
        {[
          ["Current", `${current.toFixed(1)}°C`],
          ["Minimum", `${minimum.toFixed(1)}°C`],
          ["Maximum", `${maximum.toFixed(1)}°C`],
          ["Average", `${average.toFixed(1)}°C`],
          ["Anomalies", anomalies],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></div>
        ))}
      </div>
    </div>
  );
}
