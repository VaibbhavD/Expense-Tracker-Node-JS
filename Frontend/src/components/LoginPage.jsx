import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Context from "../context/store";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [resetPassword, setResetPassword] = useState(false);
  const [Email, setEmail] = useState("");
  const { login, settoken } = useContext(Context);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:4000/login", { formData });
  
      if (res.status === 200) {
        login();
        alert(res.data.message);
        localStorage.setItem("token", res.data.user.token);
        settoken(res.data.user.token);
        navigate("/expense");
      }
    } catch (error) {
      // Handle incorrect password or user not found
      if (error.response) {
        alert(error.response.data.message);
        console.error("Login Error:", error.response.data.message);
      } else {
        alert("An unexpected error occurred. Please try again.");
        console.error("Unexpected Error:", error);
      }
    }
  };
  

  const ShowResetPassword = (e) => {
    setResetPassword((prev) => !prev);
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
  console.log(Email);
  try {
    // Await the axios POST request
    const res = await axios.post("http://localhost:4000/forgotpassword", {
      email: Email, // Pass the email to the API
    });

    // Show success message
    alert(res.data.message);
  } catch (error) {
    // Log the error and show a failure message
    console.error(error);
    alert(error.response.data.message);
  }
};


  return (
    <>
      {!resetPassword && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>
              <div
                className="w-full flex justify-end text-sm text-blue-500 cursor-pointer"
                onClick={ShowResetPassword}
              >
                Forget Password?
              </div>

              {/* Submit Button */}
              <div className="">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </div>
              <div className="mt-1 text-sm text-center text-gray-500">
                <p>
                  New User?{" "}
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Reset Password */}
      {resetPassword && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <div
              className="text-sm text-blue-500 cursor-pointer"
              onClick={ShowResetPassword}
            >
              Back
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
              Login
            </h2>
            <form onSubmit={handleForgetPassword} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Submit Button */}
              <div className="">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
