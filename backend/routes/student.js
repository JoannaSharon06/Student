const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    console.log("Fetching students...");
    const students = await User.find({ role: "student" });
    console.log("Students found:", students.length);
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/addCourse", async (req, res) => {
  const { studentName, courseName, marks } = req.body;

  if (!studentName || !courseName || !marks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ name: studentName, role: "student" });
    if (!user) return res.status(404).json({ message: "Student not found" });

    if (!user.courses) user.courses = [];

    user.courses.push({ name: courseName, marks });
    await user.save();

    res.status(200).json({ message: "Course added successfully", user });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/add-fees", async (req, res) => {
  const { name, amount, type } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "Student not found" });

    user.totalFees = user.totalFees || 0;
    user.paidFees = user.paidFees || 0;

    if (type === "add") {
      user.totalFees += amount;
    } else if (type === "pay") {
      const pending = user.totalFees - user.paidFees;

      if (amount > pending) {
        return res.status(400).json({ message: "Payment exceeds pending amount" });
      }

      user.paidFees += amount;
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    await user.save();
    res.status(200).json({ message: "Fees updated successfully", user });
  } catch (err) {
    console.error("Error updating fees:", err);
    res.status(500).json({ message: "Error updating fees", error: err.message });
  }
});


// 3️⃣ PUT Add or Remove Book from Library
router.put("/update-library", async (req, res) => {
  const { studentName, book, action } = req.body;

  if (!studentName || !book || !action) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ name: studentName, role: "student" });
    if (!user) return res.status(404).json({ message: "Student not found" });

    if (action === "add") {
      if (!user.library.includes(book)) user.library.push(book);
    } else if (action === "remove") {
      user.library = user.library.filter(b => b !== book);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.status(200).json({ message: "Library updated", user });
  } catch (err) {
    console.error("Error updating library:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/attendance-summary", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const summary = students.map((s) => {
      const monthlyAttendance = s.attendance.filter((dateStr) => {
        const d = new Date(dateStr);
        return d.getMonth() === month && d.getFullYear() === year;
      });

      const totalDays = new Date(year, month + 1, 0).getDate();

      return {
        name: s.name,
        presentDays: monthlyAttendance.length,
        absentDays: totalDays - monthlyAttendance.length,
      };
    });

    res.json(summary);
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/get-user/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const user = await User.findOne({ name, role: "student" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/mark-attendance", async (req, res) => {
  const { studentName, date } = req.body;

  if (!studentName || !date) {
    return res.status(400).json({ message: "Student name and date are required" });
  }

  try {
    const user = await User.findOne({ name: studentName, role: "student" });
    if (!user) return res.status(404).json({ message: "Student not found" });

    if (!user.attendance.includes(date)) {
      user.attendance.push(date);
      await user.save();
    }

    res.status(200).json({ message: "Attendance marked", attendance: user.attendance });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
