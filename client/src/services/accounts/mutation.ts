import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { createAccount, updateAccount } from "./api";
import { CreateAccountData, updateAccountData } from "@/types";

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountData) => createAccount(data),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getAllAccounts", data.data.userId],
      });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: updateAccountData) => updateAccount(data),
    onSuccess: (data) => {
      console.log(data, "new invalidated");
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getAllAccounts", data.updatedAccount.userId],
      });
    },
  });
};
