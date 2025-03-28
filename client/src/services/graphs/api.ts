import backend from "@/axios-instance";

export const fetchTransactionGraph = async (filters: Record<string, any>) => {
  const { data } = await backend.get("/graphs/transaction-summary", {
    params: filters,
  });
  return data;
};
