import { useQuery } from "@tanstack/react-query";
import { fetchFilteredTransactions } from "./api";

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
