// src/hooks/useGetData.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "@/context/ErrorContext";

const useGetData = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { addError, hasRedirected, setHasRedirected } = useError();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok) {
          console.log(result);

          throw new Error(`Error ${response.status}`);
        }

        setData(result);
      } catch (err) {
        addError(err.message || "Unknown error");

        if (!hasRedirected) {
          setHasRedirected(true);
          navigate("/fetcherror");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path, addError, hasRedirected, navigate, setHasRedirected]);

  return { data, isLoading: loading };
};

export default useGetData;
