import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ExpenseForm from "./components/ExpenseForm";
import "./App.css";
import Context from "./context/store";

function App() {
  const { isLoggedIn } = useContext(Context);

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn && <Route path="/signup" element={<SignUp />} />}
        {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
        {isLoggedIn && <Route path="/expense" element={<ExpenseForm />} />}
        {isLoggedIn && <Route path="*" element={<ExpenseForm />} />}
        {!isLoggedIn && <Route path="/*" element={<LoginPage />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
