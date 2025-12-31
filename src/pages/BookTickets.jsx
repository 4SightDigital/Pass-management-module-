import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import useVenueStore from "../store/useVenueStore";

function BookTickets() {
  const { eventId } = useParams();

  const events = useVenueStore((state) => state.events);
  const venues = useVenueStore((state) => state.venues);

  const event = events.find((e) => e.id === eventId);
  const venue = venues.find((v) => v.id === event?.venueId);

  if (!venue) {
    return <div>Invalid event</div>;
  }

  const [guestName, setGuestName] = useState("");
  const [seatsRequested, setSeatsRequested] = useState(1);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");

  const [refName, setRefName] = useState("");
  const [refAge, setRefAge] = useState("");
  const [refGender, setRefGender] = useState("");
  const [refContact, setRefContact] = useState("");

  const departments = {
    Security: ["Internal", "External"],
    Protocol: ["State", "Central"],
    Management: ["Board", "Executive"],
  };


  const selectedCategory = venue.seating.find(
  (c) => c.id === categoryId
)

  return (
    <div>
      <h2>Book VIP Ticket</h2>

      <p>
        {/* <b>Event:</b> {event.name} */}
      </p>
      <p>
        <b>Venue:</b> {venue.name}
      </p>
      <label>Category</label>
      <br />
      <select
        value={categoryId}
        onChange={(e) => {
          setCategoryId(e.target.value);
          setSubCategoryId(""); // reset sub-category
        }}
      >
        <option value="">Select Category</option>
        {venue.seating.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.categoryName}
          </option>
        ))}
      </select>

      <br />
      <br />

      {/* Form will come here */}
    </div>
  );
}

export default BookTickets;
