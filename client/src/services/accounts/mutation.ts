import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { createAccount } from "./api";
import { CreateAccountData } from "@/types";

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountData) => createAccount(data),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["getAllAccounts"] });
    },
  });
};
