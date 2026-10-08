import { useEffect } from "react";

// Applies the dark palette to <html> so portalled UI (dialogs, selects,
// toasts) picks up the same tokens as the page while it is mounted.
export function useDarkRoot() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    return () => {
      root.classList.remove("dark");
    };
  }, []);
}
