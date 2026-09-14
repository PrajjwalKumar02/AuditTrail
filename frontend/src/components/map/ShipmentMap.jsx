import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";

import LocationMarker from "./LocationMarker";

import "leaflet/dist/leaflet.css";


/* =====================================================
   MAP FOCUS
===================================================== */

function MapFocus({ location }) {

  const map = useMap();

  useEffect(() => {

    if (!location) return;

    map.flyTo(
      [
        location.latitude,
        location.longitude,
      ],
      5,
      {
        duration: 1.2,
      }
    );

  }, [location, map]);

  return null;
}


/* =====================================================
   MAP COMPONENT
===================================================== */

function ShipmentMap({
  locations = [],
  selectedLocation,
  onSelectLocation,
}) {

  return (

    <MapContainer
      center={[20, 75]}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      scrollWheelZoom={true}
      className="audit-leaflet-map"
      worldCopyJump={true}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {/* MAP FOCUS */}

      <MapFocus
        location={selectedLocation}
      />


      {/* LOCATION MARKERS */}

      {locations.map((location) => (

        <LocationMarker
          key={location.id}
          location={location}
          selected={
            selectedLocation?.id ===
            location.id
          }
          onSelect={() =>
            onSelectLocation(location)
          }
        />

      ))}

    </MapContainer>

  );
}

export default ShipmentMap;