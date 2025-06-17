import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SearchProvider } from "@/context/SearchProvider";
import { ErrorProvider } from "@/context/ErrorContext";
import { AuthProvider } from "@/context/AuthContext";
import { AlertDialogProvider } from "@/context/AlertDialogProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 0,
      // cacheTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AlertDialogProvider>
        <SearchProvider>
          <ErrorProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ErrorProvider>
        </SearchProvider>
      </AlertDialogProvider>
    </QueryClientProvider>
  </StrictMode>
);
