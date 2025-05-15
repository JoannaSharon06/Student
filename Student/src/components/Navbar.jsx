import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css"; // Ensure you have CSS for styling

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/signup"); 
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/dashboard">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/fees">Fees</Link>
        <Link to="/library">Library</Link>
        <Link to="/attendance">Attendance</Link>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
