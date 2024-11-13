import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
