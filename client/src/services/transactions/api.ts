import backend from "@/axios-instance";

export const fetchFilteredTransactions = async (
  filters: Record<string, any>
) => {
  const { data } = await backend.get("/transactions/filter", {
    params: filters,
  });
  return data;
};

export const deleteTransaction = async (transactionId: string) => {
  const res = await backend.delete(
    `/transactions/delete-transaction/${transactionId}`
  );
  return res.data;
};

export const deleteBulkTransactions = async (data: string[]) => {
  console.log("data", data);
  const res = await backend.delete("/transactions/delete-transactions", {
    data: { transactionIds: data },
  });
  return res.data;
};
