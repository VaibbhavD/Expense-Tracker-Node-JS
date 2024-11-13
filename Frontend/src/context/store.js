import React, { createContext } from "react";

const Context = createContext({
  isLoggedIn: false,
  login: () => {},
});

export default Context;
