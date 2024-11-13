import React, { useState } from "react";
import Context from "./store";

const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <Context.Provider value={{ login, isLoggedIn }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
