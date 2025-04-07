import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  deleteBulkTransactions,
  deleteTransaction,
  scanReceipt,
} from "./api";
import { toast } from "sonner";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useDeleteBulkTransactions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: string[]) => deleteBulkTransactions(data),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createTransaction(data),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useScanReceipt = () => {
  return useMutation({
    mutationFn: (file: File) => scanReceipt(file),
    onError: (err) => {
      console.error("Receipt scan failed", err);
    },
  });
};
