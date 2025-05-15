import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/dash.css";
import BackgroundImage from "../assets/bg.jpeg";

function Dashboard({ user }) {
  const navigate = useNavigate();

  if (!user) return <h2>Please login</h2>;

  return (
    <div className="dashboard">
      <img src={BackgroundImage} alt="Background" id="backgroundimage" />
      <h2>Welcome, {user.role === "admin" ? "Admin" : user.name}</h2>

      {user.role === "admin" && (
        <button className="admin-btn" onClick={() => navigate("/admin")}>
          Go to Admin Dashboard
        </button>
      )}
    </div>
  );
}

export default Dashboard;
