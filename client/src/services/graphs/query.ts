import { useQuery } from "@tanstack/react-query";
import { fetchExpenseBreakdown, fetchTransactionGraph } from "./api";

export const useFetchTransactionGraph = (
  filters: Record<string, any>,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["transactionGraph", filters],
    queryFn: () => fetchTransactionGraph(filters),
    enabled: options?.enabled ?? Boolean(filters.accountId && filters.filter),
  });
};

export const useFetchExpenseBreakdown = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ["fetchExpenseBreakdown", filters],
    queryFn: () => fetchExpenseBreakdown(filters),
  });
};
