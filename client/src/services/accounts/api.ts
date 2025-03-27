import backend from "@/axios-instance";

export const getAllAccounts = async (userId: string) => {
  const res = await backend.get(`/accounts/get-all-accounts/${userId}`);
  return res.data;
};

export const getSingleAccount = async (accountId: string) => {
  const res = await backend.get(`/accounts/get-account/${accountId}`);
  return res.data;
};
