import backend from "@/axios-instance";

export const fetchFilteredTransactions = async (
  filters: Record<string, any>
) => {
  const { data } = await backend.get("/api/transactions", { params: filters });
  return data;
};
