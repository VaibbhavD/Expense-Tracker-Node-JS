import React, { useContext } from "react";
import Context from "../context/store";
import { useNavigate } from "react-router";

const Header = () => {
  const { token, settoken, setIsLoggedIn, isPremium, SetisPremium } =
    useContext(Context);
  const navigate = useNavigate();

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
    <div className="flex justify-between items-center bg-green-500  p-4">
      <h1 className="md:text-3xl text-lg text-white font-bold">Expense Tracker</h1>
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
  );
};

export default Header;
