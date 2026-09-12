import type { User } from "@prisma/client";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserForMonthlySummary,
} from "./user.types.js";
import type { DbClient } from "../../config/prisma.js";

export type UserRepository = {
  findUserByEmail: (email: string, db?: DbClient) => Promise<User | null>;
  findUserById: (userId: string, db?: DbClient) => Promise<User | null>;
  createUser: (data: CreateUserInput, db?: DbClient) => Promise<User>;
  updateUserById: (
    userId: string,
    data: UpdateUserInput,
    db?: DbClient,
  ) => Promise<User>;
  deleteUserById: (userId: string, db?: DbClient) => Promise<User>;
  findUsersForMonthlySummary: (db?: DbClient) => Promise<UserForMonthlySummary[]>;
};
