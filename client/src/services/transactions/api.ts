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
  const res = await backend.delete("/transactions/delete-transactions", {
    data: { transactionIds: data },
  });
  return res.data;
};

export const createTransaction = async (data: any) => {
  const res = await backend.post("/transactions/create-transaction", data);
  return res.data;
};

export const editTransaction = async (data: any) => {
  const res = await backend.patch(
    `/transactions/update-transaction/${data.transactionId}`,
    data
  );
  return res.data;
};

export const scanReceipt = async (file: File) => {
  const formData = new FormData();
  formData.append("receipt", file);

  const res = await backend.post("/transactions/ai-receipt", formData);
  return res.data;
};
