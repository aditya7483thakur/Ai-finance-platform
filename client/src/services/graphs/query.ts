import { useQuery } from "@tanstack/react-query";
import { fetchTransactionGraph } from "./api";

export const useFetchTransactionGraph = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ["transactionGraph", filters],
    queryFn: () => fetchTransactionGraph(filters),
  });
};
