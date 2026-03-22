import prisma from "../../utils/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "./user.types.js";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByClerkId = async (clerkUserId: string) => {
  return prisma.user.findUnique({ where: { id: clerkUserId } });
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

export const updateUserByClerkId = async (
  clerkUserId: string,
  data: UpdateUserInput,
) => {
  return prisma.user.update({
    where: { id: clerkUserId },
    data: {
      email: data.email,
      name: data.name,
      imageUrl: data.imageUrl,
    },
  });
};

export const deleteUserByClerkId = async (clerkUserId: string) => {
  return prisma.user.delete({ where: { id: clerkUserId } });
};
