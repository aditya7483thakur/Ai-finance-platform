import backend from "@/axios-instance";

export const getUserId = async (clerkUserId: string) => {
  const res = await backend.get(`/users/get-user-id/${clerkUserId}`);
  return res.data;
};
