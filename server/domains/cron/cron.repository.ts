import prisma from "../../config/prisma.js";

export const getUsersForMonthlySummary = async () => {
  return prisma.user.findMany({ include: { accounts: true } });
};
