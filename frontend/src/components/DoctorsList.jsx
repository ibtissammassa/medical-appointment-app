import { useEffect, useState } from "react";
import { fetchDoctors } from "../api/doctors";

export default function DoctorsList({ onSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  return (
    <div>
      <h3>Select a doctor</h3>

      <div className="list">
        {doctors.map((doc) => (
          <div key={doc.id} className="card">
            <div>
              <strong>{doc.name}</strong>
              <div style={{ color: "#6b7280" }}>{doc.specialization}</div>
            </div>

            <button onClick={() => onSelect(doc)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
