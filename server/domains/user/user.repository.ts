import prisma from "../../utils/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "./user.types.js";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
};

export const createUser = async (data: CreateUserInput) => {
  return prisma.user.create({
    data: {
      id: data.id,
      email: data.email,
      name: data.name,
      imageUrl: data.imageUrl,
      password: data.password,
    },
  });
};

export const updateUserById = async (userId: string, data: UpdateUserInput) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      email: data.email,
      name: data.name,
      imageUrl: data.imageUrl,
    },
  });
};

export const deleteUserById = async (userId: string) => {
  return prisma.user.delete({ where: { id: userId } });
};
