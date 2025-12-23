const API_URL = "http://localhost:8000/api";

export async function createAppointment(data) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw response;
  }

  return response.json();
}
