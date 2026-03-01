import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* ================= FETCH MY TRIPS ================= */
  const fetchMyTrips = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/trips/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyTrips(res.data.trips);
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= FETCH INCOMING REQUESTS ================= */
  const fetchIncoming = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/incoming",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIncomingRequests(res.data.requests);
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= FETCH SENT REQUESTS ================= */
  const fetchSent = async () => {
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

  /* ================= ACCEPT REQUEST ================= */
  const handleAccept = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/accept/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchIncoming();
      fetchMyTrips();
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= REJECT REQUEST ================= */
  const handleReject = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/reject/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchIncoming();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyTrips();
    fetchIncoming();
    fetchSent();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {/* ================= MY TRIPS ================= */}
      <h3>My Trips</h3>
      {myTrips.map((trip) => (
        <div
          key={trip._id}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <p><strong>Destination:</strong> {trip.destination}</p>
          <p><strong>Seats Available:</strong> {trip.seatsAvailable}</p>
          <p><strong>Status:</strong> {trip.status}</p>
        </div>
      ))}

      {/* ================= INCOMING REQUESTS ================= */}
      <h3>Incoming Requests</h3>
      {incomingRequests.map((req) => (
        <div
          key={req._id}
          style={{ border: "1px solid blue", margin: "10px", padding: "10px" }}
        >
          <p><strong>Trip:</strong> {req.tripId.destination}</p>
          <p><strong>From:</strong> {req.senderId.name}</p>
          <p><strong>Status:</strong> {req.status}</p>

          {req.status === "pending" && (
            <>
              <button onClick={() => handleAccept(req._id)}>
                Accept
              </button>
              <button onClick={() => handleReject(req._id)}>
                Reject
              </button>
            </>
          )}

          {req.status === "accepted" && (
            <button
              onClick={() => navigate(`/chat/${req.tripId._id}`)}
            >
              Open Chat
            </button>
          )}
        </div>
      ))}

      {/* ================= SENT REQUESTS ================= */}
      <h3>Sent Requests</h3>
      {sentRequests.map((req) => (
        <div
          key={req._id}
          style={{ border: "1px solid green", margin: "10px", padding: "10px" }}
        >
          <p><strong>Trip:</strong> {req.tripId.destination}</p>
          <p><strong>Status:</strong> {req.status}</p>

          {req.status === "accepted" && (
            <button
              onClick={() => navigate(`/chat/${req.tripId._id}`)}
            >
              Open Chat
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;