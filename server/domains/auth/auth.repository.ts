import prisma from "../../config/prisma.js";
import type { User } from "@prisma/client";
import type { CreateAuthUserInput } from "./auth.types.js";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: CreateAuthUserInput): Promise<User> => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};
