import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "../context/store";
import { useNavigate } from "react-router";

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
  });
  const { token, expenses } = useContext(Context);
  const [Expenses, setExpenses] = useState(expenses);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  return (
    <div className="min-h-screen bg-gray-100 pt-4 ">
      {/* Form */}
      <div className="flex flex-col justify-center items-start mb-8 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md mx-auto rounded md:px-14 px-6 pt-6 pb-10 w-full max-w-xl"
        >
          <div
            className=" w-fit cursor-pointer font-bold text-gray-400 hover:text-blue-400"
            onClick={() => navigate(-1)}
          >
            {"<"} Back
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Add Expense</h2>

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
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
