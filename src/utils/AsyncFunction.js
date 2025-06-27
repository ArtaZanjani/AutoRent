export const GetData = async (setData, setIsLoading, setError, path) => {
  try {
    setIsLoading(true);

    const response = await fetch(path, {
      headers: {
        apikey: import.meta.env.VITE_API_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setError(response.status);
      return;
    }

    const data = await response.json();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
