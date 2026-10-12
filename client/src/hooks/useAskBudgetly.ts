import { useNavigate } from "react-router-dom";

// Opens Ask Budgetly, optionally prefilling the message box with a prompt.
export const useAskBudgetly = () => {
  const navigate = useNavigate();

  return (prompt?: string) => {
    navigate("/dashboard/ask", { state: { prompt: prompt ?? "" } });
  };
};
