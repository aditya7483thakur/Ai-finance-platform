import backend from "@/axios-instance";

export const fetchTransactionGraph = async (filters: Record<string, any>) => {
  const { data } = await backend.get("/graphs/transaction-summary", {
    // The server buckets transactions into this browser's calendar days.
    params: { ...filters, tzOffset: new Date().getTimezoneOffset() },
  });
  return data;
};

export const fetchExpenseBreakdown = async () => {
  const { data } = await backend.get("/graphs/expense-summary");
  return data;
};
