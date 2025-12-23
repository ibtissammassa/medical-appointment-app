const API_URL = "http://localhost:8000/api";

export async function fetchDoctors() {
  const res = await fetch(`${API_URL}/doctors`);
  return res.json();
}
