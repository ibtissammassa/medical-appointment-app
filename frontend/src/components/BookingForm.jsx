import { useEffect, useState } from "react";
import { fetchAvailability } from "../api/availability";
import { createAppointment } from "../api/appointments";

export default function BookingForm({ doctor }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!date) return;

    setLoadingSlots(true);
    fetchAvailability(doctor.id, date)
      .then((data) => {
        setSlots(data);
        setSelectedSlot("");
      })
      .finally(() => setLoadingSlots(false));
  }, [date, doctor.id]);

  async function book() {
    setMessage("");
    setBooking(true);

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
    } finally {
      setBooking(false);
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
      {loadingSlots && <p>Loading available slots...</p>}

      {!loadingSlots && slots.length > 0 && (
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

      {!loadingSlots && date && slots.length === 0 && (
        <p>No available slots for this date.</p>
      )}

      {/* Book */}
      {selectedSlot && (
        <div style={{ marginTop: 15 }}>
          <button onClick={book} disabled={booking}>
            {booking ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}
