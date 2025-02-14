import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Context from "../context/store";
import axios from "axios";

const Dashboard = () => {
  const { token, isLoggedIn, isPremium, SetisPremium } = useContext(Context);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("all"); // Default to all expenses
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4000/get-expenses",
          {},
          {
            headers: { Authorization: token },
          }
        );
        setExpenses(res.data.Expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    const getPremiumState = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4000/Getpremium_state",
          {},
          {
            headers: { Authorization: token },
          }
        );
        SetisPremium(res.data.isPremium);
      } catch (error) {
        console.error("Error fetching premium state:", error);
      }
    };

    fetchExpenses();
    getPremiumState();
  }, [isLoggedIn]);

  const filterExpenses = () => {
    const today = new Date();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.createdAt);
      const diffDays = (today - expenseDate) / (1000 * 60 * 60 * 24);

      if (filter === "daily") return diffDays < 1;
      if (filter === "weekly") return diffDays < 7;
      if (filter === "monthly") return diffDays < 30;
      return true;
    });
  };

  const deleteExpense = async (expense) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/delete-expense",
        expense,
        {
          headers: { Authorization: token },
        }
      );
      if (res.status === 200) {
        setExpenses((prev) => prev.filter((ex) => ex.id !== expense.id));
        alert("Expense deleted successfully");
      } else {
        alert("Failed to delete expense");
      }
    } catch (error) {
      alert(error);
    }
  };

  const [currentpage, setcurrentpage] = useState(1);
  const expenseperpage = 8;
  const totalPages = Math.ceil(filterExpenses().length / expenseperpage);
  const indexOfLastExpense = currentpage * expenseperpage;
  const indexOfFirstExpense = indexOfLastExpense - expenseperpage;
  const currentExpenses = expenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  const NextPage = () => {
    if (currentpage < totalPages) {
      setcurrentpage(currentpage + 1);
    }
  };

  const PreviousPage = () => {
    if (currentpage > 1) {
      setcurrentpage(currentpage - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Expense Tracker</h2>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <button
            onClick={() => navigate("/add-expense")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            + Add Expense
          </button>
          {isPremium && (
            <button
              onClick={() => navigate("/leaderboard")}
              className="gradient-button2 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              Leaderboard
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-4 mb-6">
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-gray-800 bg-gray-100 focus:outline-none"
        >
          <option value="all">All Expenses</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="bg-white min-h-96 shadow-md rounded-lg p-6">
        {currentExpenses.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {currentExpenses.map((expense, index) => (
              <li
                key={index}
                className="border-b flex flex-col md:flex-row justify-between items-center mx-4 border-gray-300 py-2"
              >
                <p>
                  <strong>Amount:</strong> ₹{expense.amount}
                </p>
                <p>
                  <strong>Description:</strong> {expense.description}
                </p>
                <p>
                  <strong>Category:</strong> {expense.category}
                </p>
                <p>
                  <strong>Date:</strong> {expense.createdAt.split("T")[0]}
                </p>

                <button
                  onClick={() => deleteExpense(expense)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No expenses found.</p>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center gap-2 items-center mt-4">
        <button
          onClick={PreviousPage}
          disabled={currentpage === 1}
          className={`px-4 py-2 rounded-lg transition ${
            currentpage === 1
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>

        <span className="text-gray-700">
          Page {currentpage} of {totalPages}
        </span>

        <button
          onClick={NextPage}
          disabled={currentpage === totalPages}
          className={`px-4 py-2 rounded-lg transition ${
            currentpage === totalPages
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
