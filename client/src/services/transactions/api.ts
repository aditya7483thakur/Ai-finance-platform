import backend from "@/axios-instance";
export const fetchFilteredTransactions = async (
  filters: Record<string, any>
) => {
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "" || value === "ALL") {
      continue;
    }
    params[key] = value;
  }

  const { data } = await backend.get("/transactions/filter", {
    params,
  });

  return data;
};

export const fetchTransactionSummary = async (
  filters: Record<string, any>,
) => {
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "" || value === "ALL") {
      continue;
    }
    params[key] = value;
  }

  const { data } = await backend.get("/transactions/summary", {
    params,
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
