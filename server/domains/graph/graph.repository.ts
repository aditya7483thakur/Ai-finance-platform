import prisma from "../../config/prisma.js";

export const getGroupedTransactions = async (whereClause: any) => {
  return prisma.transaction.groupBy({
    by: ["date", "type"],
    _sum: { amount: true },
    where: whereClause,
    orderBy: { date: "asc" },
  });
};
