import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/admin.css";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/student/");
 
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h2>Admin Dashboard - Student Details</h2>
      <input
        type="text"
        placeholder="Search Student..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Courses & Marks</th>
              <th>Attendance</th>
              <th>Library Books</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    {student.courses && student.courses.length > 0 ? (
                      student.courses.map((course, index) => (
                        <div key={index}>
                          {course.name}: {course.marks}%
                        </div>
                      ))
                    ) : (
                      <div>No courses</div>
                    )}
                  </td>
                  <td>
                    {Array.isArray(student.attendance)
                      ? `${student.attendance.length} days`
                      : "N/A"}
                  </td>
                  <td>
                    {student.library && student.library.length > 0
                      ? student.library.join(", ")
                      : "No books"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
