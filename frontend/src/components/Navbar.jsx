import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "10px", background: "#ddd" }}>
      <span style={{ marginRight: "20px" }}>
        Welcome, {localStorage.getItem("name")}
      </span>

      <button onClick={() => navigate("/")}>Trips</button>

      <button onClick={() => navigate("/dashboard")} style={{ marginLeft: "10px" }}>
        Dashboard
      </button>

      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;