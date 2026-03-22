import prisma from "../../config/prisma.js";

export const getAccountById = async (id: string) => {
  return prisma.account.findUnique({ where: { id } });
};
