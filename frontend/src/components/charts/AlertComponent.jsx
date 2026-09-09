export default function AlertComponent({ temperature }) {
  let severity = "normal";
  let message = "Temperature is within normal range.";
  if (temperature > 10) { severity = "critical"; message = "Critical temperature anomaly detected."; }
  else if (temperature > 8) { severity = "warning"; message = "Temperature is above the warning threshold."; }

  return (
    <div className={`alert alert-${severity}`}>
      <strong>{severity.toUpperCase()}</strong>
      <p>{message}</p>
      <span>Current temperature: {temperature}°C</span>
    </div>
  );
}