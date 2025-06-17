export const GetData = async (setData, setIsLoading, setError, path) => {
  try {
    setIsLoading(true);

    const response = await fetch(path);

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
