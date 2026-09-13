import { useQuery } from "@tanstack/react-query";
import { getUserId } from "./api";

export function useGetUserId(userId: string | null) {
  return useQuery({
    queryKey: ["getUserId", userId],
    queryFn: () => getUserId(userId as string),
    enabled: !!userId,
  });
}
