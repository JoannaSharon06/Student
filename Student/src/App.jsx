import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Fees from "./pages/Fees";
import Library from "./pages/Library";
import Attendance from "./pages/Attendance";
import SignUp from "./pages/SignUp";
import Admin from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import api from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [allStudents, setAllStudents] = useState([]);

  // Fetch all students for admin pages
  useEffect(() => {
    if (user?.role === "admin") {
      api.get("/")
        .then((res) => {
          const students = res.data.filter((u) => u.role === "student");
          setAllStudents(students.map((s) => s.name));
        })
        .catch((err) => console.error("Failed to load students", err));
    }
  }, [user]);

  // === Backend Update Functions ===
  const updateUserAttendance = (name, date) => {
    api.post("/attendance", { name, date });
  };

  const updateUserCourses = (name, course, marks) => {
    api.post("/courses", { name, course, marks });
  };

  const updateUserFees = (name, amount) => {
    api.post("/fees", { name, amount });
  };

  const updateUserLibrary = (name, book, action) => {
    api.post("/library", { name, book, action });
  };

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/courses" element={
          <Courses
            user={user}
            updateUserCourses={updateUserCourses}
          />
        } />
        <Route path="/fees" element={
          <Fees
            user={user}
            updateUserFees={updateUserFees}
          />
        } />
        <Route path="/library" element={
          <Library
            user={user}
            updateUserLibrary={updateUserLibrary}
          />
        } />
        <Route path="/attendance" element={
          <Attendance
            user={user}
            allStudents={allStudents}
            updateUserAttendance={updateUserAttendance}
          />
        } />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
