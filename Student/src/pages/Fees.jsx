import React, { useEffect, useState } from "react";
import "../style/fee.css";

function Fees({ user, setUser }) {
  const [amount, setAmount] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    document.body.classList.add("fees-page");
    return () => {
      document.body.classList.remove("fees-page");
    };
  }, []);

  if (!user) return <h2>Please login</h2>;

  const updateUserFees = async (name, amount, type) => {
    try {
      const res = await fetch("http://localhost:4000/student/add-fees", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount, type }),
      });

      const data = await res.json();
      console.log("Fee update response:", data);

      if (data.user && user.name === name) {
        setUser(data.user); // ✅ Update user state
      }
    } catch (error) {
      console.error("Failed to update fees", error);
    }
  };

  const handleAddFees = () => {
    if (amount.trim() && selectedStudent.trim()) {
      updateUserFees(selectedStudent, parseFloat(amount), "add");
      setAmount("");
      setSelectedStudent("");
    } else {
      alert("Please enter student and amount.");
    }
  };

  const handlePayNow = () => {
    const pending = Number(user.totalFees || 0) - Number(user.paidFees || 0);
    setPaymentAmount(pending.toFixed(2));
    setIsModalOpen(true);
  };

  const handlePayment = () => {
    const amountToPay = parseFloat(paymentAmount);
    const pending = Number(user.totalFees || 0) - Number(user.paidFees || 0);

    if (isNaN(amountToPay) || amountToPay <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    if (amountToPay > pending) {
      alert("You cannot pay more than the pending amount.");
      return;
    }

    updateUserFees(user.name, amountToPay, "pay");
    setIsModalOpen(false);
  };

  const total = Number(user.totalFees) || 0;
  const paid = Number(user.paidFees) || 0;
  const pending = total - paid;

  return (
    <div className="fees-container">
      <h2>Fees Management</h2>

      {user.role === "admin" ? (
        <>
          <h3>Add Fees for Student</h3>
          <input
            type="text"
            placeholder="Enter Student Name"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleAddFees}>Add Fees</button>
        </>
      ) : (
        <>
          <table className="fees-table">
            <thead>
              <tr>
                <th>Total Fees</th>
                <th>Paid</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>₹{total.toFixed(2)}</td>
                <td>₹{paid.toFixed(2)}</td>
                <td>
                  ₹{pending.toFixed(2)}{" "}
                  <button className="pay-btn" onClick={handlePayNow}>
                    Pay Now
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="payment-modal">
          <div className="modal-content">
            <h3>Make a Payment</h3>
            <input
              type="number"
              step="0.01"
              placeholder="Enter Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <button onClick={handlePayment}>Confirm Payment</button>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fees;
