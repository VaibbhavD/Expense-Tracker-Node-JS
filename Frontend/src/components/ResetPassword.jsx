import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { id } = useParams(); // Get the reset token from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validRequest, setValidRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Verify the reset password link
  useEffect(() => {
    const verifyResetLink = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/resetpassword/verify/${id}`
        );
        if (response.status === 200) {
          setValidRequest(true);
        }
      } catch (err) {
        setValidRequest(false);
        setError("Invalid or expired reset link.");
      } finally {
        setLoading(false);
      }
    };

    verifyResetLink();
  }, [id]);

  // Handle password reset submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/password/resetpassword`,
        {
          id,
          newPassword,
        }
      );
      
        alert(response.data.message); // Display success message
        navigate("/login"); // Redirect to login page
      
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {loading ? (
          <p className="text-center text-gray-600">Checking link validity...</p>
        ) : validRequest ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">
              Reset Password
            </h2>
            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-center text-red-500">Invalid or expired link.</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
