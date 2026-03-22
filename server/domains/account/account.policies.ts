export const canDeleteAccount = (transactionCount: number) => {
  return transactionCount === 0;
};
