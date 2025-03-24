import backend from "@/axios-instance";

export const getAllAccounts = async (userId: string) => {
  const res = await backend.get(`/accounts/get-all-accounts/${userId}`);
  return res.data;
};
