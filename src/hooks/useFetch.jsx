import { useQuery } from "@tanstack/react-query";

const useFetch = (queryKey, endpoint, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`);
      if (!response.ok) throw new Error(`ارور: ${response.status}`);
      return response.json();
    },
    ...options,
  });
};

export default useFetch;
