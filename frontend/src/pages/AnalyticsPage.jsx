import { useEffect, useMemo, useState } from "react";
import TemperatureChart from "../components/charts/TemperatureChart";
import SensorStats from "../components/charts/SensorStats";
import EventMarkers from "../components/charts/EventMarkers";
import ChartFilters from "../components/charts/ChartFilters";
import AlertComponent from "../components/charts/AlertComponent";
import TimeTravelSlider from "../components/timetravel/TimeTravelSlider";
import HistoricalState from "../components/timetravel/HistoricalState";
import StateComparison from "../components/timetravel/StateComparison";
import ShipmentMap from "../components/map/ShipmentMap";
import { getTemperatureData, getEventHistory, getShipmentLocations, getAuditStatus } from "../services/analyticsApi";

export default function AnalyticsPage() {
  const containerId = "CONTAINER-001";
  const [temperatureData, setTemperatureData] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [historicalState, setHistoricalState] = useState(null);
  const [beforeState, setBeforeState] = useState(null);
  const [afterState, setAfterState] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("ALL");
  const [replayIndex, setReplayIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    Promise.all([
      getTemperatureData(containerId),
      getEventHistory(containerId),
      getShipmentLocations(containerId),
      getAuditStatus(containerId),
    ]).then(([temperature, history, shipmentLocations, auditStatus]) => {
      setTemperatureData(temperature); setEvents(history); setLocations(shipmentLocations); setAudit(auditStatus);
      if (history.length) setHistoricalState(history.at(-1));
    }).catch(console.error);
  }, []);

  const filteredEvents = useMemo(() => selectedEvent === "ALL" ? events : events.filter((event) => event.eventType === selectedEvent), [events, selectedEvent]);
  const currentTemperature = temperatureData.at(-1)?.temperature ?? 0;

  useEffect(() => {
    if (!playing || !events.length || replayIndex >= events.length - 1) {
      if (replayIndex >= events.length - 1) setPlaying(false);
      return;
    }
    const interval = setInterval(() => setReplayIndex((current) => current + 1), 1000 / speed);
    return () => clearInterval(interval);
  }, [playing, replayIndex, speed, events.length]);

  useEffect(() => { if (events[replayIndex]) setHistoricalState(events[replayIndex]); }, [replayIndex, events]);

  const handleHistoricalState = (state) => {
    setHistoricalState(state);
    const index = events.findIndex((event) => event.timestamp === state?.timestamp);
    if (index > 0) { setBeforeState(events[index - 1]); setAfterState(events[index]); }
  };

  return (
    <main className="analytics-page">
      <header><h1>AuditTrail Analytics</h1><p>Container: {containerId}</p></header>
      <section><AlertComponent temperature={currentTemperature} /></section>
      <section>
        <ChartFilters selectedEvent={selectedEvent} onEventChange={setSelectedEvent} />
        <TemperatureChart data={temperatureData} eventMarkers={filteredEvents} />
        <SensorStats data={temperatureData} />
        <EventMarkers events={filteredEvents} />
      </section>
      <section>
        <TimeTravelSlider containerId={containerId} events={events} onStateChange={handleHistoricalState} />
        <HistoricalState state={historicalState} />
        <StateComparison before={beforeState} after={afterState} />
      </section>
      <section><ShipmentMap locations={locations} /></section>
    </main>
  );
}