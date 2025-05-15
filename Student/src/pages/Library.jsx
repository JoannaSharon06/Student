import React, { useState } from "react";
import "../style/lib.css";

function Library({ user }) {
  const [selectedStudent, setSelectedStudent] = useState(""); 
  const [newBook, setNewBook] = useState(""); 

  if (!user) return <h2>Please login</h2>;

  const updateUserLibrary = async (studentName, book, action) => {
    try {
      const res = await fetch("http://localhost:4000/student/update-library", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ studentName, book, action })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update library");
      alert(data.message);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleReturnBook = (studentName, book) => {
    updateUserLibrary(studentName, book, "remove");
  };

  const handleAddBook = () => {
    if (newBook.trim() !== "" && selectedStudent.trim() !== "") {
      updateUserLibrary(selectedStudent, newBook, "add");
      setNewBook("");
    } else {
      alert("Please enter a book name and select a student.");
    }
  };

  return (
    <div className="library-container">
      <h2>Library</h2>
      
      {/* Admin View */}
      {user.role === "admin" && (
        <>
          <h3>Manage Student Library</h3>
          <input
            type="text"
            placeholder="Enter Student Name"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Book Name"
            value={newBook}
            onChange={(e) => setNewBook(e.target.value)}
          />
          <button onClick={handleAddBook}>Add Book</button>

          <h3>Mark Book as Returned</h3>
          {user.libraryData && Object.keys(user.libraryData).length > 0 ? (
            Object.keys(user.libraryData).map((student, index) => (
              <div key={index} className="student-books">
                <p><strong>{student}'s Borrowed Books:</strong></p>
                {user.libraryData[student].length > 0 ? (
                  <ul>
                    {user.libraryData[student].map((book, i) => (
                      <li key={i}>
                        {book} <button onClick={() => handleReturnBook(student, book)}>Return</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-books">No books borrowed</p>
                )}
              </div>
            ))
          ) : (
            <p className="no-books">No books borrowed</p>
          )}
        </>
      )}

      {user.role === "student" && (
        <>
          <p>Your Borrowed Books:</p>
          {user.library && user.library.length > 0 ? (
            <ul>
              {user.library.map((book, index) => (
                <li key={index}>{book}</li>
              ))}
            </ul>
          ) : (
            <p className="no-books">No books borrowed</p>
          )}
        </>
      )}
    </div>
  );
}

export default Library;
