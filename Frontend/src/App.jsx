import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ExpenseForm from "./components/ExpenseForm";
import "./App.css";
import Context from "./context/store";
import ResetPassword from "./components/ResetPassword";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import LeaderBoard from "./components/LeaderBoard";

function App() {
  const { isLoggedIn, setIsLoggedIn, settoken,isPremium } = useContext(Context);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      settoken(token);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
         {isLoggedIn && <Header />}
      <Routes>
        {!isLoggedIn && <Route path="/signup" element={<SignUp />} />}
        {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
        {isLoggedIn && <Route path="/add-expense" element={<ExpenseForm />} />}
        {isLoggedIn && isPremium && <Route path="/leaderboard" element={<LeaderBoard />} />}
        {isLoggedIn && <Route path="*" element={<Dashboard />} />}
        {!isLoggedIn && <Route path="/*" element={<LoginPage />} />}
        <Route path="/password/resetpassword/:id" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
