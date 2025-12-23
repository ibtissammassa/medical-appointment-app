const API_URL = "http://localhost:8000/api";

export async function fetchAvailability(doctorId, date) {
  const res = await fetch(
    `${API_URL}/doctors/${doctorId}/availability?date=${date}`
  );
  return res.json();
}
