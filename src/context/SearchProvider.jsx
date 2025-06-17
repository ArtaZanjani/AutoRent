import { createContext, useEffect, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [BookingData, setBookingData] = useState(null);

  return <SearchContext.Provider value={{ BookingData, setBookingData }}>{children}</SearchContext.Provider>;
};
