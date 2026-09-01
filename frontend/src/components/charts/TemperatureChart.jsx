import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from "recharts";

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function TemperatureChart({ data = [], eventMarkers = [] }) {
  if (!data.length) return <div className="empty-state">No temperature data available.</div>;
  return (
    <div className="chart-container">
      <h2>Temperature Analytics</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={formatTime} />
          <YAxis label={{ value: "Temperature °C", angle: -90, position: "insideLeft" }} />
          <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} formatter={(value) => [`${value} °C`, "Temperature"]} />
          <Line type="monotone" dataKey="temperature" strokeWidth={3} dot activeDot={{ r: 7 }} />
          {eventMarkers.map((event) => {
            const point = data.find((item) => item.timestamp === event.timestamp);
            if (!point) return null;
            return <ReferenceDot key={event.version} x={event.timestamp} y={point.temperature} r={7} label={event.eventType} />;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
