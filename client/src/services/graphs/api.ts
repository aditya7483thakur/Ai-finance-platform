import backend from "@/axios-instance";

export const fetchTransactionGraph = async (filters: Record<string, any>) => {
  const { data } = await backend.get("/graphs/transaction-summary", {
    params: filters,
  });
  return data;
};

export const fetchExpenseBreakdown = async (filters: Record<string, any>) => {
  const { data } = await backend.get("/graphs/expense-summary", {
    params: filters,
  });
  return data;
};
