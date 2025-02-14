import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Context from "../context/store";
import axios from "axios";

const Dashboard = () => {
  const { token, expenses, isLoggedIn, isPremium, SetisPremium } =
    useContext(Context);

  const [Expenses, setExpenses] = useState(expenses);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4000/get-expenses",
          {},
          {
            headers: {
              Authorization: token, // Fixed typo in "Authorization"
            },
          }
        );

        setExpenses(res.data.Expenses); // Assuming `expenses` is the array from `res.data`
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    const GetPremiumState = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4000/Getpremium_state",
          {},
          {
            headers: {
              Authorization: token, // Fixed typo in "Authorization"
            },
          }
        );

        SetisPremium(res.data.isPremium); // Assuming `expenses` is the array from `res.data`
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
    GetPremiumState();
  }, [isLoggedIn]);

  const DeleteExpense = async (expense) => {
    console.log(expense);
    try {
      const res = await axios.post(
        "http://localhost:4000/delete-expense",
        expense,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        setExpenses((prev) => {
          const exp = prev.filter((ex) => ex.id != expense.id);
          return exp;
        });
        alert("Expense delete Success");
      } else alert("Failed to delete expense");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="flex items-start mb-8 lg:px-10 sm:px-4 px-2 pt-4">
        <h2 className="text-xl w-full font-bold mb-4">Expenses</h2>
        <div className="flex justify-end text-center w-full gap-2">
          {" "}
          <div className="h-fit flex justify-end">
            <button
              onClick={() => navigate("/add-expense")}
              className="text-green-500 text-xs py-3 sm:py-4 px-2 h-1/2 md:h-full md:text-base md:py-2 md:px-4 font-semibold transform transition-transform duration-300 hover:scale-105"
            >
              Add Expense
            </button>
          </div>
          {isPremium && (
            <div className="h-fit flex justify-end">
              <button
                onClick={() => navigate("/leaderboard")}
                className="gradient-button2 text-xs py-3 sm:py-4 px-2 h-1/2 md:h-full md:text-base md:py-2 md:px-4 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
              >
                Leaderboard
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded p-4">
        {Expenses.length > 0 ? (
          <ul>
            {Expenses.map((expense, index) => (
              <li
                key={index}
                className="border-b flex flex-col md:flex-row justify-between items-center mx-4 border-gray-300 py-2"
              >
                <p>
                  <strong>Amount:</strong> ${expense.amount}
                </p>
                <p>
                  <strong>Description:</strong> {expense.description}
                </p>
                <p>
                  <strong>Category:</strong> {expense.category}
                </p>
                <p>
                  <strong>Total Expenses:</strong> {expense.createdAt.split("T")[0]}
                </p>
                <button
                  className="bg-red-600 p-2 rounded-lg text-white "
                  onClick={() => DeleteExpense(expense)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No expenses added yet.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
