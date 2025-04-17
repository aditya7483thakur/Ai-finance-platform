import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  deleteBulkTransactions,
  deleteTransaction,
  editTransaction,
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

    onError: (data: any) => {
      toast.error(data?.response?.data?.error);
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

    onError: (data: any) => {
      toast.error(data?.response?.data?.error);
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

    onError: (data: any) => {
      toast.error(data?.response?.data?.error);
    },
  });
};

export const useEditTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => editTransaction(data),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (data: any) => {
      toast.error(data?.response?.data?.error);
    },
  });
};

export const useScanReceipt = () => {
  return useMutation({
    mutationFn: (file: File) => scanReceipt(file),
    onError: (data: any) => {
      if (data?.response?.status === 429) {
        toast.error(data?.response?.data?.error);
      } else {
        toast.error("Receipt scan failed");
        console.error(data);
      }
    },
  });
};
