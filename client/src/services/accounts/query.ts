import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "./api";

export function useGetAllAccounts(userId: string | null) {
  return useQuery({
    queryKey: ["getAllAccounts", userId],
    queryFn: () => getAllAccounts(userId as string),
    enabled: !!userId, // Ensure the query runs only if userId is not null
  });
}
