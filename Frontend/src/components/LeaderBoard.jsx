import React, { useContext, useEffect, useState } from "react";
import Context from "../context/store";
import axios from "axios";

export default function LeaderBoard({ ShowLeaderBoard }) {
  const { token, expenses, isLoggedIn } = useContext(Context);

  const [sortedUsers, setSortedUsers] = useState([]);

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

        const allExpenses = res.data.allExpenses; // Assuming `allExpenses` is returned
        const userTotals = {};

        // Calculate total expenses for each user
        allExpenses.forEach((expense) => {
          const { user_id, user, amount } = expense;
          if (!userTotals[user_id]) {
            userTotals[user_id] = {
              name: user.name,
              userId: user_id,
              totalAmount: 0,
            };
          }
          userTotals[user_id].totalAmount += amount;
        });

        // Convert the object to an array and sort it
        const sortedExpenses = Object.values(userTotals).sort((a, b) => {
          if (a.name !== b.name) return a.name.localeCompare(b.name); // Sort by name
          if (a.userId !== b.userId) return a.userId - b.userId; // Then by userId
          return b.totalAmount - a.totalAmount; // Finally by total amount
        });

        setSortedUsers(sortedExpenses); // Store sorted data in state
        setExpenses(res.data.expenses); // Set individual expenses for the logged-in user
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [isLoggedIn]);

  return (
    <div className="w-full flex flex-col">
      <button onClick={ShowLeaderBoard} className=" px-4 bg-gray-400 w-fit">
        back
      </button>
      {/* Sorted Expenses Section */}
      <div className="max-w-xl mx-auto bg-white shadow-md rounded p-4 mt-6">
        <h2 className="text-xl font-bold mb-4">All Users - Total Expenses</h2>
        {sortedUsers.length > 0 ? (
          <ul>
            {sortedUsers.map((user, index) => (
              <li
                key={index}
                className="border-b border-gray-300 py-2 flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>User ID:</strong> {user.userId}
                </p>
                <p>
                  <strong>Total Expenses:</strong> $
                  {user.totalAmount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No user expenses available.</p>
        )}
      </div>
    </div>
  );
}
