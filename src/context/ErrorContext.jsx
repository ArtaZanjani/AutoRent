// src/context/ErrorContext.jsx
import React, { createContext, useState, useContext } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [hasRedirected, setHasRedirected] = useState(false);

  const addError = (error) => {
    setErrors((prev) => [...prev, error]);
  };

  const clearErrors = () => {
    setErrors([]);
    setHasRedirected(false);
  };

  return <ErrorContext.Provider value={{ errors, addError, clearErrors, hasRedirected, setHasRedirected }}>{children}</ErrorContext.Provider>;
};

export const useError = () => useContext(ErrorContext);
