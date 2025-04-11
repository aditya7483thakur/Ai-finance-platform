import { useQuery } from "@tanstack/react-query";
import { getAllAccounts, getSingleAccount } from "./api";

export function useGetAllAccounts(userId: string | null) {
  return useQuery({
    queryKey: ["getAllAccounts", userId],
    queryFn: () => {
      console.log("✅ Fetching accounts for userId:", userId); // Debug log
      return getAllAccounts(userId as string);
    },
    enabled: !!userId, // Ensure the query runs only if userId is not null
  });
}

export function useGetSingleAccount(accountId?: string) {
  return useQuery({
    queryKey: ["getSingleAccount", accountId],
    queryFn: () => getSingleAccount(accountId as string),
    enabled: !!accountId, // Ensure the query runs only if userId is not null
  });
}
