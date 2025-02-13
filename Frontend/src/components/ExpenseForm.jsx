import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "../context/store";
import { useNavigate } from "react-router";
import LeaderBoard from "./LeaderBoard";

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
  });
  const {
    token,
    expenses,
    settoken,
    setIsLoggedIn,
    isLoggedIn,
    isPremium,
    SetisPremium,
  } = useContext(Context);
  const [Expenses, setExpenses] = useState(expenses);
  const [Leardboard, SetLeardboard] = useState(false);
  const [showform, setshowform] = useState(false);

  const navigate = useNavigate();

  const ShowLeaderBoard = () => {
    SetLeardboard((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:4000/add-expense",
      formData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (res.status === 200) {
      alert("Expense Added");
      setExpenses([...Expenses, res.data.expense]);
      console.log("Expense data submitted:", res.data.expense);
      // Add logic to send form data to your backend or state management
      setFormData({ amount: "", description: "", category: "" });
    } else {
      alert("Something Went Wrong");
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    settoken(null);
    setIsLoggedIn(false);
    alert("Logged out successfully");
    navigate("/login");
  };

  const handleBuyPremium = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/buypremium",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const options = {
        key: res.data.key_id,
        order_id: res.data.order.id, // Access the order ID correctly
        handler: async function (response) {
          try {
            await axios.post(
              "http://localhost:4000/buypremium/updatestatus",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            alert("Payment Done. Now You are a Premium User");
            SetisPremium(true);
          } catch (error) {
            console.error("Error updating payment status:", error);
            alert(
              "Payment was successful, but there was an issue updating your status."
            );
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in handleBuyPremium:", error);
      alert("Failed to initiate payment. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 mb-4 p-4">
        <h1 className="md:text-3xl text-lg font-bold">Expense Tracker</h1>
        <div className="flex gap-4">
          <button
            className="gradient-button text-xs py-3 sm:py-4 px-2 h-1/2 md:h-full md:text-base md:py-2 md:px-4 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            onClick={handleBuyPremium}
            disabled={isPremium}
          >
            {!isPremium ? "Buy Premium" : "Elite Member"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-3 px-2 h-1/2 md:h-full md:text-base md:py-2 md:px-4  rounded"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Form */}
      {!Leardboard && (
        <>
          <div className="flex flex-col justify-center items-start mb-8 px-4">
            <div className="flex justify-end text-center w-full gap-2">
              {" "}
              <div className="h-fit flex justify-end">
                <button
                  onClick={() => setshowform(true)}
                  className="bg-green-500 text-xs py-3 sm:py-4 px-2 h-1/2 md:h-full md:text-base md:py-2 md:px-4 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                >
                  Add Expense
                </button>
              </div>
              {isPremium && (
                <div className="h-fit flex justify-end">
                  <button
                    onClick={ShowLeaderBoard}
                    className="gradient-button2 text-xs py-3 sm:py-4 px-2 h-1/2 md:h-full md:text-base md:py-2 md:px-4 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                  >
                    Leaderboard
                  </button>
                </div>
              )}
            </div>
           {showform && <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md mx-auto rounded md:px-14 px-6 pt-6 pb-10 w-full max-w-xl"
            >
              <div className="w-full flex justify-end cursor-pointer font-bold text-gray-500" onClick={()=>setshowform(false)}>X</div>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Add Expense
              </h2>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="mb-8">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Expense
              </button>
            </form>}
          </div>
          {/* expenses */}
          <div className="max-w-7xl mx-auto bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-bold mb-4">Expense List</h2>
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
      )}
      {Leardboard && <LeaderBoard ShowLeaderBoard={ShowLeaderBoard} />}
    </div>
  );
};

export default ExpenseForm;
