import React, { useState } from "react";
import Context from "./store";

const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, settoken] = useState();

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <Context.Provider
      value={{ login, isLoggedIn, setIsLoggedIn, token, settoken }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
