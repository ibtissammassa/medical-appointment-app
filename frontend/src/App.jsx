import { useState } from "react";
import DoctorsList from "./components/DoctorsList";
import BookingForm from "./components/BookingForm";

function App() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="container">
      <h1>Doctor Appointment Booking</h1>

      <DoctorsList onSelect={setSelectedDoctor} />

      {selectedDoctor && <BookingForm doctor={selectedDoctor} />}
    </div>
  );
}

export default App;
