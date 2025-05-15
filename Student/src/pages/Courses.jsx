import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/course.css";

function Courses({ user, setUser }) {
  const [newCourse, setNewCourse] = useState("");
  const [newMarks, setNewMarks] = useState("");
  const [studentNameInput, setStudentNameInput] = useState("");
  const handleAddCourse = () => {
    if (newCourse.trim() && newMarks.trim() && studentNameInput.trim()) {
      axios.post("http://localhost:4000/student/addCourse", {
        studentName: studentNameInput,
        courseName: newCourse,
        marks: newMarks,
      })
      .then(() => {
        alert("Course added successfully!");
        setNewCourse("");
        setNewMarks("");
        setStudentNameInput("");

        if (user.name === studentNameInput) {
          axios
            .get(`http://localhost:4000/student/get-user/${user.name}`)
            .then((res) => setUser(res.data))
            .catch((err) => console.error("Failed to refresh user:", err));
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add course.");
      });
    } else {
      alert("Please fill all fields.");
    }
  };

  if (!user) return <h2>Please login</h2>;

  return (
    <div className="courses-container">
      <h2 className="courses-title">Courses & Marks</h2>

      {user.role === "admin" ? (
        <>
          <h3>Add Course & Marks for Student</h3>

          <input
            type="text"
            placeholder="Student Name"
            value={studentNameInput}
            onChange={(e) => setStudentNameInput(e.target.value)}
          />

          <input
            type="text"
            placeholder="Course Name"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
          />
          <input
            type="number"
            placeholder="Marks"
            value={newMarks}
            onChange={(e) => setNewMarks(e.target.value)}
          />
          <button onClick={handleAddCourse}>Add Course</button>
        </>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {user.courses && user.courses.length > 0 ? (
                  user.courses.map((course, index) => (
                    <tr key={index}>
                      <td>{course.name}</td>
                      <td>{course.marks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                      No courses assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Courses;
