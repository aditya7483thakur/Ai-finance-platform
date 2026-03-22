import prisma from "../../config/prisma.js";

export const getTransactionById = async (id: string) => {
  return prisma.transaction.findUnique({ where: { id } });
};
