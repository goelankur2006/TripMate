import React, { useEffect, useState } from "react";
import axios from "axios";

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const token = localStorage.getItem("token");

  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trips");
      setTrips(res.data.trips);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/sent",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSentRequests(res.data.requests);
    } catch (error) {
      console.log(error);
    }
  };

  const sendRequest = async (tripId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/requests/send/${tripId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);
      fetchSentRequests();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchSentRequests();
  }, []);

  const myUserId = JSON.parse(atob(token.split(".")[1])).id;

  return (
    <div>
      <h2>Available Trips</h2>

      {trips.map((trip) => {
        const isOwnTrip = trip.userId._id === myUserId;

        const alreadyRequested = sentRequests.find(
          (req) => req.tripId._id === trip._id
        );

        return (
          <div
            key={trip._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px",
            }}
          >
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Budget:</strong> ₹{trip.budget}</p>
            <p><strong>Seats:</strong> {trip.seatsAvailable}</p>
            <p><strong>Posted by:</strong> {trip.userId.name}</p>

            {isOwnTrip && (
              <p style={{ color: "blue" }}>This is your trip</p>
            )}

            {!isOwnTrip && trip.status === "open" && !alreadyRequested && (
              <button onClick={() => sendRequest(trip._id)}>
                Send Request
              </button>
            )}

            {alreadyRequested && (
              <p>
                Request Status: <strong>{alreadyRequested.status}</strong>
              </p>
            )}

            {trip.status === "closed" && (
              <p style={{ color: "red" }}>Trip Closed</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TripList;