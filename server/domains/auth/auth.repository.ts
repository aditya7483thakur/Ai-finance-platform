import prisma from "../../config/prisma.js";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return prisma.user.create({ data });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};
