import { useQuery } from "@tanstack/react-query";
import { fetchExpenseBreakdown, fetchTransactionGraph } from "./api";

export const useFetchTransactionGraph = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ["transactionGraph", filters],
    queryFn: () => fetchTransactionGraph(filters),
  });
};

export const useFetchExpenseBreakdown = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ["fetchExpenseBreakdown", filters],
    queryFn: () => fetchExpenseBreakdown(filters),
  });
};
