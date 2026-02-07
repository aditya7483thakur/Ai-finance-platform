import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/userContext.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <UserProvider>
        <App />
        <Toaster
          richColors
          position="top-right"
          visibleToasts={3}
          duration={2000}
          closeButton
          expand={true}
          theme="light"
        />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
