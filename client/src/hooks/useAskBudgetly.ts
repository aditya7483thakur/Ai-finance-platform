import { useAgent } from "@/contexts/agentContext";
import { useNavigate } from "react-router-dom";

export const useAskBudgetly = () => {
  const { openAgent } = useAgent();
  const navigate = useNavigate();

  return (prompt?: string) => {
    openAgent(prompt);
    navigate("/dashboard/ask", { state: { prompt: prompt ?? "" } });
  };
};
