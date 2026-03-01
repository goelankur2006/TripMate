import React from "react";
import axios from "axios";

const TripCard = ({ trip }) => {

  const sendRequest = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/requests/send/${trip._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Request Sent Successfully");
    } catch (error) {
      console.error(error);
      alert("Error sending request");
    }
  };

  return (
    <div style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
      <h3>{trip.destination}</h3>
      <p>Date: {new Date(trip.travelDate).toLocaleDateString()}</p>
      <p>Budget: ₹{trip.budget}</p>
      <button onClick={sendRequest}>Send Request</button>
    </div>
  );
};

export default TripCard;