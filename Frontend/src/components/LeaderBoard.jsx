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
          "http://localhost:4000/getallusers",
          {},
          {
            headers: {
              Authorization: token, // Fixed typo in "Authorization"
            },
          }
        );
        const users = res.data.users; // Assuming the backend returns an array of users with totalexpense
        if (!users || users.length === 0) {
          console.warn("No users data received.");
          return;
        }
  
        // Sort the users by name first and then by totalexpense in descending order
        const sortedUsers = [...users].sort((a, b) => {
          if (a.name !== b.name) return a.name.localeCompare(b.name); // Sort by name alphabetically
          return b.totalexpense - a.totalexpense; // Then by totalexpense in descending order
        });
  
        setSortedUsers(sortedUsers); // Store sorted data in state
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
                  {user.totalexpense}
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
