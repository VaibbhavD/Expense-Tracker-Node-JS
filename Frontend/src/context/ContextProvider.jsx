import React, { useState } from "react";
import Context from "./store";

const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, settoken] = useState();
  const [expenses, setexpenses] = useState([]);

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <Context.Provider
      value={{
        login,
        isLoggedIn,
        setIsLoggedIn,
        token,
        settoken,
        expenses,
        setexpenses,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
