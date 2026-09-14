import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

function createMarkerIcon(status, selected) {
  let className = "audit-map-marker";

  if (status === "Alert") {
    className += " marker-alert";
  } else if (status === "Delivered") {
    className += " marker-delivered";
  } else if (status === "At Warehouse") {
    className += " marker-warehouse";
  } else {
    className += " marker-transit";
  }

  if (selected) {
    className += " marker-selected";
  }

  return L.divIcon({
    className: "",
    html: `
      <div class="${className}">
        <span class="marker-pulse"></span>
        <span class="marker-core"></span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function LocationMarker({
  location,
  selected,
  onSelect,
}) {
  const icon = createMarkerIcon(
    location.status,
    selected
  );

  return (
    <Marker
      position={[
        location.latitude,
        location.longitude,
      ]}
      icon={icon}
      eventHandlers={{
        click: onSelect,
      }}
    >
      <Popup>
        <div className="audit-map-popup">

          <div className="popup-top">
            <span>{location.id}</span>

            <b>{location.status}</b>
          </div>

          <h3>
            {location.location}
          </h3>

          <p>
            {location.country}
          </p>

          <div className="popup-grid">

            <div>
              <span>Temperature</span>

              <strong>
                {location.temperature}
              </strong>
            </div>

            <div>
              <span>Updated</span>

              <strong>
                {location.updated}
              </strong>
            </div>

          </div>

          <div className="popup-route">

            <span>ROUTE</span>

            <strong>
              {location.route}
            </strong>

          </div>

          <div className="popup-verified">
            ✓ Location verified
          </div>

        </div>
      </Popup>
    </Marker>
  );
}

export default LocationMarker;