import { Marker, Popup } from "react-leaflet";
export default function LocationMarkers({ locations = [] }) {
  return <>
    {locations.map((location, index) => (
      <Marker key={`${location.name}-${index}`} position={[location.lat, location.lng]}>
        <Popup><strong>{location.name}</strong><br />{new Date(location.timestamp).toLocaleString()}</Popup>
      </Marker>
    ))}
  </>;
}
