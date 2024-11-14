import React, { useState } from "react";
import Context from "./store";

const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    localStorage.setItem("token", "wiudhw");
    setIsLoggedIn(true);
  };

  return (
    <Context.Provider value={{ login, isLoggedIn, setIsLoggedIn }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
