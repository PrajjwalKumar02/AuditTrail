import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import LocationMarkers from "./LocationMarkers";
import "leaflet/dist/leaflet.css";

export default function ShipmentMap({ locations = [] }) {
  if (!locations.length) return <div className="empty-state">No shipment locations available.</div>;
  const center = [locations[0].lat, locations[0].lng];
  const route = locations.map((location) => [location.lat, location.lng]);
  return (
    <div className="shipment-map">
      <h2>Shipment Map</h2>
      <MapContainer center={center} zoom={4} style={{ height: "400px", width: "100%" }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarkers locations={locations} />
        <Polyline positions={route} />
      </MapContainer>
    </div>
  );
}
