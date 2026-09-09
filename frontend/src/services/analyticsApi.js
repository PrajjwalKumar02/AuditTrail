const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

export async function getTemperatureData(containerId) {
  return request(`/containers/${containerId}/temperature`);
}

export async function getEventHistory(containerId) {
  return request(`/containers/${containerId}/events`);
}

export async function getHistoricalState(containerId, timestamp) {
  return request(
    `/containers/${containerId}/state-at?timestamp=${encodeURIComponent(timestamp)}`
  );
}

export async function getShipmentLocations(containerId) {
  return request(`/containers/${containerId}/locations`);
}

export async function getAuditStatus(containerId) {
  return request(`/containers/${containerId}/audit/integrity`);
}

export function getAuditExportUrl(containerId, format) {
  return `${API_BASE_URL}/containers/${containerId}/audit/export?format=${format}`;
}