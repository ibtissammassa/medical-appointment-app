import { useEffect, useState } from "react";
import { fetchAvailability } from "../api/availability";
import { createAppointment } from "../api/appointments";

export default function BookingForm({ doctor }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!date) return;

    fetchAvailability(doctor.id, date).then((data) => {
      setSlots(data);
      setSelectedSlot("");
    });
  }, [date, doctor.id]);

  async function book() {
    setMessage("");

    try {
      await createAppointment({
        doctor_id: doctor.id,
        start_time: `${date} ${selectedSlot}`,
      });

      setMessage("✅ Appointment booked successfully");
    } catch (err) {
      if (err.status === 409) {
        setMessage("❌ Slot already booked");
      } else {
        setMessage("❌ Something went wrong");
      }
    }
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Book with {doctor.name}</h3>

      {/* Date selection */}
      <div style={{ marginBottom: 15 }}>
        <label>Select date</label>
        <br />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Slots */}
      {slots.length > 0 && (
        <div>
          <h4>Available slots</h4>
          <div className="list">
            {slots.map((slot) => (
              <button
                key={slot}
                className={slot === selectedSlot ? "" : "secondary"}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Book */}
      {selectedSlot && (
        <div style={{ marginTop: 15 }}>
          <button onClick={book}>Confirm booking</button>
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}
