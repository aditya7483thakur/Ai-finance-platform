import { useQuery } from "@tanstack/react-query";
import { getUserId } from "./api";

export function useGetUserId(clerkUserId: string | null) {
  return useQuery({
    queryKey: ["getUserId", clerkUserId],
    queryFn: () => getUserId(clerkUserId as string),
    enabled: !!clerkUserId,
  });
}
