import prisma, { type DbClient } from "../../config/prisma.js";
import type { UserRepository } from "./user.port.js";

export const userPrismaRepository: UserRepository = {
  findUserByEmail: async (email: string, db: DbClient = prisma) => {
    return db.user.findUnique({ where: { email } });
  },
  findUserById: async (userId: string, db: DbClient = prisma) => {
    return db.user.findUnique({ where: { id: userId } });
  },
  createUser: async (data, db: DbClient = prisma) => {
    return db.user.create({
      data: {
        ...(data.id ? { id: data.id } : {}),
        email: data.email,
        name: data.name,
        imageUrl: data.imageUrl,
        password: data.password,
      },
    });
  },
  updateUserById: async (userId, data, db: DbClient = prisma) => {
    return db.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        name: data.name,
        imageUrl: data.imageUrl,
      },
    });
  },
  deleteUserById: async (userId, db: DbClient = prisma) => {
    return db.user.delete({ where: { id: userId } });
  },
  findUsersForMonthlySummary: async (db: DbClient = prisma) => {
    return db.user.findMany({
      include: {
        accounts: true,
      },
    });
  },
};
