import { useQuery } from "@tanstack/react-query";
import { fetchFilteredTransactions } from "./api";

export const useFilteredTransactions = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchFilteredTransactions(filters),

    enabled: !!filters.accountId,
  });
};
