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
        const response = await fetch(path);

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const result = await response.json();
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
