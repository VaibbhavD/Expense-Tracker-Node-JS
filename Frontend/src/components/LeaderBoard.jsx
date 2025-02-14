import React, { useContext, useEffect, useState } from "react";
import Context from "../context/store";
import axios from "axios";
import { useNavigate } from "react-router";

export default function LeaderBoard({ ShowLeaderBoard }) {
  const { token, expenses, isLoggedIn } = useContext(Context);

  const [sortedUsers, setSortedUsers] = useState([]);
  const navigate = useNavigate();

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
    <div className="w-full flex justify-center gap-4">
      {/* Sorted Expenses Section */}
      <div className="md:w-1/2 w-full px-4 bg-white shadow-md rounded mt-6 p-4">
        <button onClick={()=>navigate(-1)} className=" text-gray-500 font-bold w-fit hover:text-blue-500">
         {"<"} Back
        </button>
        <h2 className="text-xl font-bold m-4">All Users - Total Expenses</h2>
        {sortedUsers.length > 0 ? (
          <ul>
            {sortedUsers.map((user, index) => (
              <li
                key={index}
                className="border-b border-gray-300 p-4 flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Total Expenses:</strong> ${user.totalexpense}
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
