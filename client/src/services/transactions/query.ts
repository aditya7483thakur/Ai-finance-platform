import { useQuery } from "@tanstack/react-query";
import { fetchFilteredTransactions, fetchTransactionSummary } from "./api";

export const useFilteredTransactions = (
  filters: Record<string, any>,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchFilteredTransactions(filters),
    enabled: options?.enabled ?? true,
  });
};

export const useTransactionSummary = (
  filters: Record<string, any>,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["transactionSummary", filters],
    queryFn: () => fetchTransactionSummary(filters),
    enabled: options?.enabled ?? true,
  });
};
