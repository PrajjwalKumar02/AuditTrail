const API_BASE_URL = "http://localhost:5000/api";

export async function getContainers() {
  const response = await fetch(`${API_BASE_URL}/queries/containers`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getStats() {
  const response = await fetch(`${API_BASE_URL}/queries/stats`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}