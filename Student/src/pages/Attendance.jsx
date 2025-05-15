import React, { useState, useEffect } from "react";
import "../style/att.css";

function Attendance({ user }) {
  const [attendanceData, setAttendanceData] = useState({});
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterName, setFilterName] = useState("");
  
  useEffect(() => {
    document.body.classList.add("attendance-page");
    return () => {
      document.body.classList.remove("attendance-page");
    };
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:4000/student")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load students");
          return res.json();
        })
        .then((data) => {
          setAllStudents(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return <h2>Please login</h2>;

  const handleAttendanceChange = (studentName, field, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentName]: {
        ...prev[studentName],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (studentName) => {
    const { date, status } = attendanceData[studentName] || {};
    if (!date || !status) {
      alert("Please select both date and attendance status");
      return;
    }

    if (status === "present") {
      try {
        const response = await fetch("http://localhost:4000/student/mark-attendance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentName, date }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error marking attendance");

        alert(`Marked present for ${studentName} on ${date}`);

        // ✅ Update attendance in state
        setAllStudents((prev) =>
          prev.map((s) =>
            s.name === studentName ? { ...s, attendance: result.attendance } : s
          )
        );
      } catch (error) {
        console.error("Error:", error.message);
        alert("Failed to mark attendance");
      }
    }

    setAttendanceData((prev) => ({
      ...prev,
      [studentName]: {
        date: "",
        status: "",
      },
    }));
  };

  const generateDaysOfMonth = () => {
    const days = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {
      const dateString = new Date(year, month, day).toISOString().split("T")[0];
      days.push(dateString);
    }
    return days;
  };

  const daysOfMonth = generateDaysOfMonth();

  const downloadCSV = () => {
    let csv = "Name,Date,Status\n";
    allStudents.forEach((student) => {
      daysOfMonth.forEach((date) => {
        const status = student.attendance.includes(date) ? "Present" : "Absent";
        csv += `${student.name},${date},${status}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance_report.csv";
    link.click();
  };

  const filteredStudents = allStudents.filter((student) =>
    student.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="attendance-container">
      <h2>Attendance</h2>

      {user.role === "admin" && (
        <div className="admin-attendance-list">
          <h3>Mark Attendance</h3>
          <input
            type="text"
            placeholder="Filter by student name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <button onClick={downloadCSV}>Download Attendance CSV</button>
          {loading ? (
            <p>Loading students...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredStudents.length === 0 ? (
            <p>No students found.</p>
          ) : (
            filteredStudents.map((student) => (
              <div className="admin-attendance-row" key={student.name}>
                <span className="student-name">{student.name}</span>
                <input
                  type="date"
                  value={attendanceData[student.name]?.date || ""}
                  onChange={(e) =>
                    handleAttendanceChange(student.name, "date", e.target.value)
                  }
                />
                <label>
                  <input
                    type="radio"
                    name={`status-${student.name}`}
                    value="present"
                    checked={attendanceData[student.name]?.status === "present"}
                    onChange={(e) =>
                      handleAttendanceChange(student.name, "status", e.target.value)
                    }
                  />
                  Present
                </label>
                <label>
                  <input
                    type="radio"
                    name={`status-${student.name}`}
                    value="absent"
                    checked={attendanceData[student.name]?.status === "absent"}
                    onChange={(e) =>
                      handleAttendanceChange(student.name, "status", e.target.value)
                    }
                  />
                  Absent
                </label>
                <button onClick={() => handleSubmit(student.name)}>Submit</button>
              </div>
            ))
          )}
          <div className="attendance-summary">
            <h3>Attendance Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Present Days</th>
                  <th>Absent Days</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => {
                  const monthly = s.attendance?.filter((d) => {
                    const dt = new Date(d);
                    const now = new Date();
                    return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
                  });
                  const totalDays = new Date().getDate(); // till today
                  const present = monthly?.length || 0;
                  return (
                    <tr key={s.name}>
                      <td>{s.name}</td>
                      <td>{present}</td>
                      <td>{totalDays - present}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {user.role === "student" && (
        <div className="student-attendance-container">
          <h3>Your Attendance for this Month</h3>
          <table className="student-attendance">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {daysOfMonth.map((date, index) => {
                const isPresent = user.attendance?.includes(date);
                return (
                  <tr key={index}>
                    <td>{date}</td>
                    <td>
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </td>
                    <td className={isPresent ? "present" : "absent"}>
                      {isPresent ? "Present" : "Absent"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Attendance;
