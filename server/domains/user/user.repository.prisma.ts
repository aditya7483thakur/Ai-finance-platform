import type { User as PrismaUser } from "@prisma/client";
import prisma, { type DbClient } from "../../config/prisma.js";
import type { PersistenceContext } from "../../shared/types/persistence.js";
import type { UserRepository } from "./user.port.js";
import type { User } from "./user.types.js";

const dbOf = (ctx?: PersistenceContext): DbClient => {
  return (ctx as DbClient | undefined) ?? prisma;
};

const toUser = (row: PrismaUser): User => ({
  id: row.id,
  email: row.email,
  password: row.password,
  name: row.name,
  imageUrl: row.imageUrl,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const userPrismaRepository: UserRepository = {
  findUserByEmail: async (email, ctx) => {
    const row = await dbOf(ctx).user.findUnique({ where: { email } });
    return row ? toUser(row) : null;
  },
  findUserById: async (userId, ctx) => {
    const row = await dbOf(ctx).user.findUnique({ where: { id: userId } });
    return row ? toUser(row) : null;
  },
  createUser: async (data, ctx) => {
    const row = await dbOf(ctx).user.create({
      data: {
        email: data.email,
        name: data.name,
        imageUrl: data.imageUrl,
        password: data.password,
      },
    });
    return toUser(row);
  },
  findUsersForMonthlySummary: async (ctx) => {
    const rows = await dbOf(ctx).user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    return rows;
  },
};
