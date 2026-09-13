import backend from "@/axios-instance";

export const getUserId = async (userId: string) => {
  const res = await backend.get(`/users/get-user-id/${userId}`);
  return res.data;
};
